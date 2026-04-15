"""Source traditional SMBs via direct Brave web search.

For each industry × city combo, search Brave and extract unique company
domains from results. Filter out directories (yelp, yellowpages, linkedin),
aggregators (clutch, g2), and known big-cos.

Output: data/brave_direct_targets.json
"""

import json
import os
import re
import time
import urllib.parse
import urllib.request
from collections import defaultdict
from urllib.parse import urlparse

BRAVE_KEY = os.environ.get('BRAVE_API_KEY', '')
if not BRAVE_KEY:
    raise SystemExit('Set BRAVE_API_KEY')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, 'data')
os.makedirs(DATA_DIR, exist_ok=True)

INDUSTRIES_QUERIES = {
    'recruitment_staffing': [
        'boutique recruitment agency',
        'independent staffing agency',
        'executive search firm',
    ],
    'real_estate': [
        'independent real estate brokerage',
        'boutique real estate agency',
        'residential mortgage broker',
    ],
    'marketing_agency': [
        'boutique digital marketing agency',
        'independent seo agency',
        'b2b content marketing agency',
    ],
    'b2b_services': [
        'boutique IT consulting firm',
        'small business bookkeeping firm',
        'managed service provider small business',
    ],
    'insurance_finance': [
        'independent insurance broker',
        'independent financial advisor firm',
    ],
    'ecommerce': [
        'shopify brand $1M revenue',
    ],
}

CITIES = {
    'US': ['New York', 'Chicago', 'Austin', 'Miami', 'Denver', 'Atlanta',
           'Boston', 'Seattle', 'Dallas', 'Phoenix'],
    'UK': ['London', 'Manchester', 'Edinburgh', 'Birmingham'],
    'CA': ['Toronto', 'Vancouver', 'Montreal'],
    'AU': ['Sydney', 'Melbourne', 'Brisbane'],
    'UAE': ['Dubai'],
}

# Domains to skip entirely
BLOCK_DOMAINS = {
    # Directories / review sites
    'yelp.com', 'yellowpages.com', 'linkedin.com', 'glassdoor.com',
    'indeed.com', 'zoominfo.com', 'leadiq.com', 'rocketreach.co',
    'clutch.co', 'g2.com', 'trustpilot.com', 'capterra.com',
    'crunchbase.com', 'builtin.com', 'wellfound.com', 'angel.co',
    # News / publishers
    'forbes.com', 'inc.com', 'bloomberg.com', 'reuters.com',
    'techcrunch.com', 'businessinsider.com', 'wsj.com', 'nytimes.com',
    'medium.com', 'substack.com', 'ft.com', 'theguardian.com',
    'independent.co.uk', 'telegraph.co.uk', 'bbc.co.uk', 'bbc.com',
    # Social
    'facebook.com', 'twitter.com', 'x.com', 'instagram.com',
    'youtube.com', 'tiktok.com',
    # Other noise
    'wikipedia.org', 'github.com', 'pinterest.com', 'reddit.com',
    'quora.com', 'youtube.com', 'maps.google.com', 'google.com',
    'bing.com', 'duckduckgo.com', 'baidu.com',
    'craigslist.org', 'realtor.com', 'zillow.com', 'redfin.com',
    'trulia.com', 'realestate.com.au', 'rightmove.co.uk', 'zoopla.co.uk',
    # Large-cap exclusions
    'jll.com', 'cbre.com', 'cushmanwakefield.com', 'savills.com',
    'kwcommercial.com', 'century21.com', 'coldwellbanker.com',
    'remax.com', 'kellerwilliams.com', 'exprealty.com',
    'adp.com', 'paylocity.com', 'paychex.com',
    'kpmg.com', 'deloitte.com', 'ey.com', 'pwc.com', 'accenture.com',
    'mckinsey.com', 'bcg.com', 'bain.com',
    'hubspot.com', 'salesforce.com', 'marketo.com',
    'indeed.co.uk', 'prospects.ac.uk', 'totaljobs.com', 'reed.co.uk',
    'seek.com.au', 'timeout.com',
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
        print(f'  err: {e}')
        return []


def is_good_domain(domain: str) -> bool:
    if not domain:
        return False
    if any(block == domain or domain.endswith('.' + block)
           for block in BLOCK_DOMAINS):
        return False
    # Skip obvious subdomains of ATS/blog platforms
    if any(sub in domain for sub in [
        '.greenhouse.io', '.ashbyhq.com', '.lever.co', '.workable.com',
        '.medium.com', '.blogspot.com', '.wordpress.com', '.squarespace.com',
        '.wixsite.com', 'sites.google.com',
    ]):
        return False
    return True


def main():
    by_domain = {}

    for industry, queries in INDUSTRIES_QUERIES.items():
        for q_base in queries:
            for geo, cities in CITIES.items():
                for city in cities:
                    q = f'{q_base} "{city}"'
                    print(f'  [{industry}/{city}] {q_base}')
                    results = brave_search(q, count=15)

                    for r in results:
                        url = r.get('url', '')
                        title = r.get('title', '')
                        desc = r.get('description', '')
                        domain = urlparse(url).netloc.lower().replace('www.', '')
                        if not is_good_domain(domain):
                            continue
                        # Get TLD + base domain
                        if domain in by_domain:
                            by_domain[domain]['industries'].add(industry)
                            by_domain[domain]['cities'].add(city)
                            by_domain[domain]['geos'].add(geo)
                            continue

                        # Extract likely company name from title
                        # Common patterns: "Company Name | ...", "Company - City",
                        # "... - Company", "About Us - Company"
                        name = re.split(r'\s*[\|]\s*|\s+[–—-]\s+', title)[0].strip()
                        name = re.sub(
                            r'^(about us|services|contact)\s*[:\-]\s*',
                            '', name, flags=re.IGNORECASE,
                        )
                        if not name or len(name) > 80:
                            name = domain

                        by_domain[domain] = {
                            'domain': domain,
                            'website': f'https://{domain}',
                            'company_name': name,
                            'industries': {industry},
                            'cities': {city},
                            'geos': {geo},
                            'title_sample': title[:140],
                            'desc_sample': desc[:200],
                        }
                    time.sleep(0.35)

    # Convert sets
    out = []
    for d in by_domain.values():
        d['industries'] = sorted(d['industries'])
        d['cities'] = sorted(d['cities'])
        d['geos'] = sorted(d['geos'])
        out.append(d)

    out_path = os.path.join(DATA_DIR, 'brave_direct_targets.json')
    with open(out_path, 'w') as f:
        json.dump(out, f, indent=2)

    print(f'\nTotal unique domains: {len(out)}')
    print(f'Saved → {out_path}')

    from collections import Counter
    by_ind = Counter(i for c in out for i in c['industries'])
    by_geo = Counter(g for c in out for g in c['geos'])
    print('\nBy industry:', dict(by_ind))
    print('By geo:', dict(by_geo))


if __name__ == '__main__':
    main()
