"""Source ICP-matched companies by searching for active job postings.

ICP: non-AI-native business operators, 5-50 employees, $500K-$5M rev,
hiring SDR/content/research/ops roles, in target industries (recruitment,
real estate, marketing agencies, b2b services, mid-ecom, insurance/finance),
located in US/UK/CA/AU/UAE.

Strategy:
1. Query Brave across Greenhouse/Lever/Ashby/Workable for role×geo combos.
2. For each ATS hit, fetch the ATS page and extract the *real* company name
   and their own domain from the page (usually in the header or "About Us"
   section). This avoids zoominfo/leadiq noise.
3. Classify by scanning both job posting text + company site text for
   industry keywords. Drop non-matches.
4. Output data/icp_targets.json.
"""

import json
import os
import re
import time
import urllib.parse
import urllib.request
from urllib.parse import urlparse

BRAVE_KEY = os.environ.get('BRAVE_API_KEY', '')
if not BRAVE_KEY:
    raise SystemExit('Set BRAVE_API_KEY env var')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, 'data')
os.makedirs(DATA_DIR, exist_ok=True)

UA = (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
    'AppleWebKit/537.36 (KHTML, like Gecko) '
    'Chrome/131.0.0.0 Safari/537.36'
)


INDUSTRY_KWS = {
    'recruitment_staffing': [
        'recruitment agency', 'staffing agency', 'executive search',
        'headhunting', 'talent agency', 'recruiting firm',
        'recruitment firm', 'staffing firm', 'search firm',
    ],
    'real_estate': [
        'real estate brokerage', 'realty group', 'realty inc',
        'real estate agency', 'real estate firm', 'realtors',
        'property management company', 'commercial real estate',
        'residential real estate', 'mortgage broker',
    ],
    'marketing_agency': [
        'digital marketing agency', 'marketing agency', 'digital agency',
        'growth agency', 'seo agency', 'content marketing agency',
        'ad agency', 'creative agency', 'performance marketing agency',
        'advertising agency', 'branding agency',
    ],
    'b2b_services': [
        'consulting firm', 'consultancy', 'advisory firm',
        'managed service provider', 'it services firm', 'msp ',
        'bookkeeping firm', 'accounting firm', 'professional services firm',
    ],
    'ecommerce': [
        'dtc brand', 'shopify brand', 'consumer brand',
        'direct to consumer', 'e-commerce retailer',
    ],
    'insurance_finance': [
        'insurance broker', 'insurance brokerage', 'insurance agency',
        'financial advisor', 'financial advisory', 'wealth management',
        'registered investment advisor', 'independent broker',
    ],
}

ROLE_QUERIES = {
    'sdr': ['SDR', 'BDR', 'sales development representative'],
    'content': ['content manager', 'content writer', 'content coordinator'],
    'research': ['research analyst', 'market researcher'],
    'ops': ['operations coordinator', 'operations manager', 'revops'],
}

GEO_QUERIES = {
    'US': ['United States'],
    'UK': ['United Kingdom'],
    'CA': ['Canada'],
    'AU': ['Australia'],
    'UAE': ['Dubai UAE'],
}


ATS_SITES = [
    'boards.greenhouse.io',
    'jobs.lever.co',
    'jobs.ashbyhq.com',
    'apply.workable.com',
]

# Direct industry queries — returns more traditional SMBs since they post
# on LinkedIn/Indeed rather than Greenhouse.
DIRECT_INDUSTRY_QUERIES = {
    'recruitment_staffing': [
        'recruitment agency hiring sales development',
        'staffing agency hiring business development',
        'executive search firm hiring operations coordinator',
        'talent agency hiring content manager',
    ],
    'real_estate': [
        'real estate brokerage hiring SDR',
        'real estate agency hiring content manager',
        'realty group hiring operations coordinator',
        'property management company hiring business development',
    ],
    'marketing_agency': [
        'digital marketing agency hiring SDR',
        'growth agency hiring content manager',
        'seo agency hiring operations coordinator',
        'creative agency hiring business development',
    ],
    'b2b_services': [
        'b2b consulting firm hiring SDR',
        'MSP hiring business development',
        'IT services company hiring operations coordinator',
        'bookkeeping firm hiring sales',
    ],
    'ecommerce': [
        'shopify brand hiring content manager',
        'ecommerce brand hiring operations coordinator',
    ],
    'insurance_finance': [
        'insurance broker hiring sales development',
        'financial advisor firm hiring operations coordinator',
        'wealth management firm hiring content manager',
    ],
}


EXCLUDE_COMPANY_SLUGS = {
    'google', 'microsoft', 'amazon', 'meta', 'apple', 'salesforce', 'oracle',
    'ibm', 'sap', 'adobe', 'intel', 'nvidia', 'cisco', 'servicenow',
    'workday', 'atlassian', 'zoom', 'stripe', 'shopify', 'snowflake',
    'databricks', 'figma', 'canva', 'notion', 'airtable', 'hubspot',
    'linear', 'monday', 'clickup', 'asana', 'slack', 'dropbox', 'zendesk',
    'intercom', 'twilio', 'segment', 'mixpanel', 'amplitude', 'posthog',
    'anthropic', 'openai', 'huggingface', 'mistral', 'perplexity',
    'gumloop', 'n8n', 'zapier', 'make', '360learning', 'kpmg', 'deloitte',
    'ey', 'pwc', 'accenture', 'mckinsey', 'bcg', 'bain', 'lalamove',
    'careem', 'd2l', 'fiscalnote', 'dozee', 'wrapbook', 'loopreturns',
}


BAD_DOMAINS = {
    'linkedin.com', 'indeed.com', 'glassdoor.com', 'zoominfo.com',
    'leadiq.com', 'rocketreach.co', 'crunchbase.com', 'builtin.com',
    'wellfound.com', 'medium.com', 'substack.com', 'instagram.com',
    'facebook.com', 'twitter.com', 'x.com', 'youtube.com', 'github.com',
    'wikipedia.org', 'pitchbook.com', 'apollo.io',
}


def brave_search(query: str, count: int = 20) -> list:
    url = (
        f'https://api.search.brave.com/res/v1/web/search'
        f'?q={urllib.parse.quote(query)}&count={count}'
    )
    req = urllib.request.Request(url, headers={
        'X-Subscription-Token': BRAVE_KEY,
        'Accept': 'application/json',
    })
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        data = json.loads(resp.read().decode('utf-8'))
        return data.get('web', {}).get('results', [])
    except Exception as e:
        print(f'  brave err: {e}')
        return []


def fetch(url: str, timeout: int = 20) -> str:
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': UA,
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9',
        })
        resp = urllib.request.urlopen(req, timeout=timeout)
        return resp.read().decode('utf-8', errors='ignore')
    except Exception:
        return ''


def extract_text(html: str, limit: int = 30000) -> str:
    if not html:
        return ''
    t = re.sub(r'<script[^>]*>.*?</script>', ' ', html,
               flags=re.DOTALL | re.IGNORECASE)
    t = re.sub(r'<style[^>]*>.*?</style>', ' ', t,
               flags=re.DOTALL | re.IGNORECASE)
    t = re.sub(r'<[^>]+>', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t[:limit]


def extract_slug(url: str) -> tuple:
    """Return (ats, slug) or ('', '')."""
    for pat, ats in [
        (r'boards\.greenhouse\.io/([^/\?]+)', 'greenhouse'),
        (r'greenhouse\.io/embed/job_board\?for=([^&]+)', 'greenhouse'),
        (r'jobs\.lever\.co/([^/\?]+)', 'lever'),
        (r'jobs\.ashbyhq\.com/([^/\?]+)', 'ashby'),
        (r'apply\.workable\.com/([^/\?]+)', 'workable'),
    ]:
        m = re.search(pat, url)
        if m:
            return ats, m.group(1).lower()
    return '', ''


def resolve_company_from_ats(ats_url: str, slug: str, ats: str) -> dict:
    """Fetch the ATS index page for this company and extract name + website."""
    index_url = {
        'greenhouse': f'https://boards.greenhouse.io/{slug}',
        'lever': f'https://jobs.lever.co/{slug}',
        'ashby': f'https://jobs.ashbyhq.com/{slug}',
        'workable': f'https://apply.workable.com/{slug}',
    }.get(ats, ats_url)

    html = fetch(index_url)
    if not html:
        return {}

    # Extract title — usually company name
    title_m = re.search(r'<title[^>]*>([^<]+)</title>', html, re.IGNORECASE)
    title = title_m.group(1).strip() if title_m else slug
    # Remove trailing noise
    title = re.sub(
        r'\s*[\|\-–—]\s*(jobs|careers|hiring|greenhouse|lever|ashby|workable).*',
        '', title, flags=re.IGNORECASE,
    ).strip()

    # Extract outgoing links — look for the company's own website
    candidates = []
    for m in re.finditer(r'href=["\'](https?://[^"\']+)["\']', html,
                         re.IGNORECASE):
        link = m.group(1)
        domain = urlparse(link).netloc.lower().replace('www.', '')
        if not domain:
            continue
        # Skip ATS/social/noise domains
        if any(bad in domain for bad in BAD_DOMAINS):
            continue
        if any(ats_d in domain for ats_d in [
            'greenhouse.io', 'lever.co', 'ashbyhq.com', 'workable.com',
            'recruitee.com', 'bamboohr.com', 'smartrecruiters.com',
        ]):
            continue
        candidates.append(domain)

    # Most-linked domain wins
    if not candidates:
        return {'name': title, 'website': ''}
    from collections import Counter
    top_domain = Counter(candidates).most_common(1)[0][0]

    # Also extract "about" text if present for industry classification
    about_text = extract_text(html, limit=8000)

    return {
        'name': title,
        'website': f'https://{top_domain}',
        'domain': top_domain,
        'ats_page_text': about_text,
    }


def classify_industry(*texts) -> list:
    """Return list of matching industries (from INDUSTRY_KWS)."""
    combined = ' '.join(t.lower() for t in texts if t)
    matches = []
    for ind, kws in INDUSTRY_KWS.items():
        if any(kw in combined for kw in kws):
            matches.append(ind)
    return matches


def source_candidates() -> dict:
    """Run role × geo × ATS queries + direct industry queries.

    Returns dict keyed by slug.
    """
    all_hits = {}

    # Pass 1: ATS-restricted queries (good for tech-ish SMBs)
    for role_key, role_terms in ROLE_QUERIES.items():
        for geo_key, geo_terms in GEO_QUERIES.items():
            for ats_site in ATS_SITES:
                role_term = role_terms[0]
                geo_term = geo_terms[0]
                query = f'"{role_term}" "{geo_term}" site:{ats_site}'
                print(f'  [ats: {role_key}/{geo_key}/{ats_site}]')
                results = brave_search(query, count=15)

                for r in results:
                    url = r.get('url', '')
                    title = r.get('title', '')
                    desc = r.get('description', '')

                    ats, slug = extract_slug(url)
                    if not slug or slug in EXCLUDE_COMPANY_SLUGS:
                        continue

                    if slug in all_hits:
                        all_hits[slug]['hiring_roles'].add(role_key)
                        all_hits[slug]['geos'].add(geo_key)
                        all_hits[slug]['job_urls'].add(url)
                        continue

                    all_hits[slug] = {
                        'slug': slug,
                        'ats': ats,
                        'hiring_roles': {role_key},
                        'geos': {geo_key},
                        'job_urls': {url},
                        'job_title': title[:160],
                        'job_desc': desc[:280],
                        'presumed_industries': set(),
                    }
                time.sleep(0.35)

    # Pass 2: Direct industry queries on LinkedIn Jobs + Indeed
    # (broader coverage of traditional SMBs that don't use modern ATS)
    for ind_key, queries in DIRECT_INDUSTRY_QUERIES.items():
        for query_text in queries:
            for geo_key, geo_terms in GEO_QUERIES.items():
                geo_term = geo_terms[0]
                query = (
                    f'"{query_text}" "{geo_term}" '
                    f'(site:linkedin.com/jobs OR site:indeed.com)'
                )
                print(f'  [direct: {ind_key}/{geo_key}]')
                results = brave_search(query, count=10)

                for r in results:
                    url = r.get('url', '')
                    title = r.get('title', '')
                    desc = r.get('description', '')

                    # Skip if snippet doesn't contain the exact industry phrase
                    combined = (title + ' ' + desc).lower()
                    if query_text.split(' hiring ')[0].lower() not in combined:
                        continue

                    # Extract company name from LinkedIn/Indeed URL/title
                    company_hint = None
                    # LinkedIn job title format: "Role - Company - Location"
                    m = re.search(r' - ([^-\|]+?)\s*[-\|]\s*', title)
                    if m:
                        company_hint = m.group(1).strip()
                    # Indeed URL: /cmp/{Company-Name}
                    m2 = re.search(r'indeed\.com/cmp/([^/\?]+)', url)
                    if m2:
                        company_hint = m2.group(1).replace('-', ' ').replace('+', ' ')

                    if not company_hint or len(company_hint) < 3:
                        continue

                    slug = re.sub(r'[^a-z0-9]+', '', company_hint.lower())[:40]
                    if not slug or slug in EXCLUDE_COMPANY_SLUGS:
                        continue

                    if slug in all_hits:
                        all_hits[slug]['geos'].add(geo_key)
                        all_hits[slug]['presumed_industries'].add(ind_key)
                        all_hits[slug]['job_urls'].add(url)
                        continue

                    all_hits[slug] = {
                        'slug': slug,
                        'ats': 'direct',
                        'company_hint': company_hint,
                        'hiring_roles': set(),
                        'geos': {geo_key},
                        'job_urls': {url},
                        'job_title': title[:160],
                        'job_desc': desc[:280],
                        'presumed_industries': {ind_key},
                    }
                time.sleep(0.35)

    return all_hits


def main():
    print('=== SOURCING (role × geo × ATS) ===')
    hits = source_candidates()
    print(f'\nRaw company slugs: {len(hits)}')

    print('\n=== RESOLVING COMPANY IDENTITY ===')
    enriched = []
    for i, (slug, c) in enumerate(hits.items()):
        print(f'  [{i+1}/{len(hits)}] {slug}…', end=' ', flush=True)

        if c['ats'] == 'direct':
            # For direct hits, we only have a company hint — search for site
            hint = c.get('company_hint', slug)
            brave = brave_search(
                f'"{hint}" official site -site:linkedin.com -site:indeed.com',
                count=5,
            )
            domain, name = '', hint
            for r in brave:
                d = urlparse(r.get('url', '')).netloc.lower().replace('www.', '')
                if not d or any(bad in d for bad in BAD_DOMAINS):
                    continue
                if any(ats_d in d for ats_d in [
                    'greenhouse.io', 'lever.co', 'ashbyhq.com', 'workable.com',
                ]):
                    continue
                domain = d
                break
            if not domain:
                print('no website')
                continue
            resolved = {
                'name': name, 'website': f'https://{domain}', 'domain': domain,
                'ats_page_text': '',
            }
        else:
            first_url = next(iter(c['job_urls']))
            resolved = resolve_company_from_ats(first_url, slug, c['ats'])
            if not resolved.get('website'):
                print('no website')
                continue

        domain = resolved['domain']
        if any(bad in domain for bad in BAD_DOMAINS):
            print(f'bad domain: {domain}')
            continue

        # Classify by ATS page text + job title/desc + presumed industries.
        # Don't drop unmatched — keep for actor-side research classification.
        industries = classify_industry(
            resolved.get('ats_page_text', ''),
            c['job_title'], c['job_desc'],
        )
        industries = sorted(set(industries) | set(c.get('presumed_industries', [])))

        record = {
            'slug': slug,
            'company_name': resolved['name'],
            'website': resolved['website'],
            'domain': domain,
            'presumed_industries': industries,
            'hiring_roles': sorted(c['hiring_roles']),
            'geos': sorted(c['geos']),
            'job_urls': sorted(c['job_urls'])[:5],
            'job_title_sample': c['job_title'],
        }
        enriched.append(record)
        tag = f'[{",".join(industries)}]' if industries else '[unclassified]'
        print(f'✓ {domain} {tag}')
        time.sleep(0.2)

    print(f'\nICP-matched: {len(enriched)}')

    out = os.path.join(DATA_DIR, 'icp_targets.json')
    with open(out, 'w') as f:
        json.dump(enriched, f, indent=2)
    print(f'Saved → {out}')

    # Summary by industry
    from collections import Counter
    by_ind = Counter(i for c in enriched for i in c['industries'])
    by_role = Counter(r for c in enriched for r in c['hiring_roles'])
    by_geo = Counter(g for c in enriched for g in c['geos'])
    print('\nBy industry:', dict(by_ind))
    print('By role:', dict(by_role))
    print('By geo:', dict(by_geo))


if __name__ == '__main__':
    main()
