"""Filter sourced candidates, then batch-run the research actor on top picks.

Steps:
1. Merge all source files in data/
2. Drop directory/article noise (title patterns, domain patterns)
3. Drop obvious big-cos (pre-existing exclusion list)
4. Dedupe & quota per (industry, geo) — keep top N per slice
5. Batch-fire the Apify research actor on survivors
6. Wait for runs, collect results, write to data/research_results.jsonl
"""

import json
import os
import re
import time
import urllib.parse
import urllib.request
from collections import defaultdict

APIFY_TOKEN = os.environ['APIFY_TOKEN']
APIFY_ACTOR_ID = os.environ.get('APIFY_ACTOR_ID', '83bQbfH0Je1rEdG1h')
BRAVE_KEY = os.environ['BRAVE_API_KEY']
LI_AT = os.environ.get('LI_AT', '')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, 'data')

MAX_PER_SLICE = int(os.environ.get('MAX_PER_SLICE', '4'))
MAX_CONCURRENT_RUNS = int(os.environ.get('MAX_CONCURRENT_RUNS', '8'))
MAX_TOTAL = int(os.environ.get('MAX_TOTAL', '80'))


ARTICLE_TITLE_PATTERNS = [
    r'^\s*(top|best|list|a guide|how to|why|what|10|15|20|25|50)\b',
    r'\bdirectory\b', r'\bassociation\b', r'\bfederation\b',
]

BAD_DOMAIN_TOKENS = [
    'association', 'directory', 'list', 'federation', 'council',
    'society', 'chamber', 'institute',
]

EXCLUDE_DOMAINS_BIG = {
    # Big-cap that slipped through
    'michaelpage.com', 'michaelpage.co.uk', 'michaelpage.ca',
    'hays.com', 'hays.co.uk', 'hays.com.au', 'hays.ca',
    'roberthalf.com', 'roberthalf.co.uk', 'roberthalf.ca',
    'randstad.com', 'randstad.co.uk', 'randstad.ca', 'randstad.com.au',
    'adecco.com', 'adecco.co.uk', 'adecco.ca', 'adecco.com.au',
    'kellyservices.com', 'manpower.com', 'manpowergroup.com',
    'korn-ferry.com', 'kornferry.com', 'heidrick.com', 'russellreynolds.com',
    'spencerstuart.com', 'egonzehnder.com',
    'sothebysrealty.com', 'christiesrealestate.com', 'engelvoelkers.com',
    'douglaselliman.com', 'compass.com', 'corcoran.com',
    'marshmma.com', 'aon.com', 'willistowerswatson.com',
    'gallagher.com', 'aig.com', 'statefarm.com', 'allstate.com',
    'geico.com', 'progressive.com', 'libertymutual.com', 'nationwide.com',
    'ogilvy.com', 'wpp.com', 'publicis.com', 'dentsu.com',
    'deloitte.com', 'ey.com', 'kpmg.com', 'pwc.com', 'accenture.com',
    'capgemini.com', 'infosys.com', 'tcs.com', 'wipro.com',
    'shopify.com', 'amazon.com', 'walmart.com', 'target.com',
    'napfa.org', 'napfa.com', 'iab.com', 'aima.org', 'asam.com',
}


def load_all() -> list:
    """Load + merge all source files."""
    merged = {}
    for name in ['brave_direct_targets.json', 'icp_targets.json']:
        p = os.path.join(DATA_DIR, name)
        if not os.path.exists(p):
            continue
        with open(p) as f:
            for c in json.load(f):
                d = c.get('domain', '')
                if not d:
                    continue
                if d in merged:
                    # Merge industry/geo
                    existing = merged[d]
                    existing['industries'] = sorted(
                        set(existing.get('industries', [])) | set(c.get('industries', []))
                    )
                    existing['geos'] = sorted(
                        set(existing.get('geos', [])) | set(c.get('geos', []))
                    )
                    if c.get('hiring_roles'):
                        existing['hiring_roles'] = sorted(
                            set(existing.get('hiring_roles', [])) | set(c['hiring_roles'])
                        )
                else:
                    merged[d] = {
                        'domain': d,
                        'website': c.get('website') or f'https://{d}',
                        'company_name': c.get('company_name', d),
                        'industries': c.get('industries') or c.get('presumed_industries', []),
                        'geos': c.get('geos', []),
                        'hiring_roles': c.get('hiring_roles', []),
                        'title_sample': c.get('title_sample', ''),
                    }
    return list(merged.values())


def is_directory_like(c: dict) -> bool:
    title = (c.get('title_sample', '') or c.get('company_name', '')).lower()
    domain = c.get('domain', '')
    for pat in ARTICLE_TITLE_PATTERNS:
        if re.search(pat, title, re.IGNORECASE):
            return True
    for tok in BAD_DOMAIN_TOKENS:
        if tok in domain:
            return True
    return False


def rank_candidate(c: dict) -> float:
    """Higher score = more promising ICP fit."""
    score = 0
    # Multi-industry/geo hits = likely non-SMB
    if len(c.get('industries', [])) == 1:
        score += 2
    if len(c.get('geos', [])) == 1:
        score += 2
    # Hiring signal from ATS data
    if c.get('hiring_roles'):
        score += 3
    # Shorter domain = more likely a real single company
    domain = c.get('domain', '')
    if len(domain) < 20:
        score += 1
    if domain.count('.') == 1:  # no subdomain
        score += 1
    # Title doesn't look like a review/article
    title = (c.get('title_sample', '') or c.get('company_name', '')).lower()
    if 'review' not in title and 'article' not in title:
        score += 1
    return score


def filter_and_prioritize(candidates: list) -> list:
    filtered = []
    for c in candidates:
        domain = c.get('domain', '')
        if domain in EXCLUDE_DOMAINS_BIG:
            continue
        if is_directory_like(c):
            continue
        if not c.get('industries'):
            continue
        filtered.append(c)

    # Bucket by (industry_primary, geo_primary) and take top N each
    buckets = defaultdict(list)
    for c in filtered:
        key = (c['industries'][0], c['geos'][0] if c['geos'] else 'XX')
        c['_rank'] = rank_candidate(c)
        buckets[key].append(c)

    out = []
    for key, items in buckets.items():
        items.sort(key=lambda x: -x['_rank'])
        out.extend(items[:MAX_PER_SLICE])

    # Global cap
    out.sort(key=lambda x: -x['_rank'])
    return out[:MAX_TOTAL]


def start_run(target: dict) -> str:
    """Start an actor run for a target. Returns run_id."""
    url = (
        f'https://api.apify.com/v2/acts/{APIFY_ACTOR_ID}/runs'
        f'?token={APIFY_TOKEN}&timeout=600'
    )
    body = json.dumps({
        'company_url': target['website'],
        'company_name': target['company_name'],
        'brave_api_key': BRAVE_KEY,
        'li_at': LI_AT,
        'include_competitors': False,  # Skip competitors for speed + cost
        'max_pages_crawl': 6,
    }).encode('utf-8')
    req = urllib.request.Request(
        url, data=body, method='POST',
        headers={
            'Authorization': f'Bearer {APIFY_TOKEN}',
            'Content-Type': 'application/json',
        },
    )
    try:
        resp = urllib.request.urlopen(req, timeout=60)
        d = json.loads(resp.read().decode('utf-8'))
        return d['data']['id']
    except Exception as e:
        print(f'    start err {target["domain"]}: {e}')
        return ''


def poll_run(run_id: str) -> dict:
    url = f'https://api.apify.com/v2/actor-runs/{run_id}?token={APIFY_TOKEN}'
    req = urllib.request.Request(url)
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        return json.loads(resp.read().decode('utf-8'))['data']
    except Exception:
        return {}


def fetch_dataset(ds_id: str) -> list:
    url = f'https://api.apify.com/v2/datasets/{ds_id}/items?token={APIFY_TOKEN}&limit=1'
    try:
        resp = urllib.request.urlopen(url, timeout=30)
        return json.loads(resp.read().decode('utf-8'))
    except Exception:
        return []


def main():
    raw = load_all()
    print(f'Loaded: {len(raw)} raw candidates')

    picks = filter_and_prioritize(raw)
    print(f'After filter + bucket: {len(picks)}')
    from collections import Counter
    print('By industry:', dict(Counter(c['industries'][0] for c in picks)))
    print('By geo:', dict(Counter(c['geos'][0] if c['geos'] else '?' for c in picks)))

    # Save final pick list for audit
    picks_path = os.path.join(DATA_DIR, 'picks.json')
    with open(picks_path, 'w') as f:
        json.dump(picks, f, indent=2)
    print(f'Saved picks → {picks_path}')

    # Batch-run actor with bounded concurrency
    print(f'\n=== RUNNING ACTOR ({len(picks)} targets, max {MAX_CONCURRENT_RUNS} concurrent) ===')
    in_flight = {}  # run_id -> target
    done = []
    errors = []
    queue = list(picks)

    out_path = os.path.join(DATA_DIR, 'research_results.jsonl')
    out_f = open(out_path, 'w')

    try:
        while queue or in_flight:
            # Fill capacity
            while queue and len(in_flight) < MAX_CONCURRENT_RUNS:
                t = queue.pop(0)
                run_id = start_run(t)
                if run_id:
                    in_flight[run_id] = t
                    print(f'  [queued {len(in_flight)}/{MAX_CONCURRENT_RUNS}] {t["domain"]} → {run_id}')
                else:
                    errors.append(t['domain'])

            # Poll
            time.sleep(8)
            finished = []
            for rid, t in in_flight.items():
                d = poll_run(rid)
                status = d.get('status', '')
                if status == 'SUCCEEDED':
                    items = fetch_dataset(d.get('defaultDatasetId', ''))
                    if items:
                        report = items[0]
                        report['_target'] = t
                        out_f.write(json.dumps(report) + '\n')
                        out_f.flush()
                        done.append(t['domain'])
                    finished.append(rid)
                elif status in ('FAILED', 'ABORTED', 'TIMED-OUT'):
                    errors.append(t['domain'])
                    finished.append(rid)
            for rid in finished:
                del in_flight[rid]

            print(f'  progress: done={len(done)} errors={len(errors)} '
                  f'inflight={len(in_flight)} queued={len(queue)}')
    finally:
        out_f.close()

    print(f'\n=== DONE === success={len(done)} errors={len(errors)}')
    print(f'Results → {out_path}')


if __name__ == '__main__':
    main()
