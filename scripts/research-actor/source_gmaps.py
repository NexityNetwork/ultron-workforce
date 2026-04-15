"""Source traditional SMBs via Google Maps (Apify public actor).

Perfect for the ICP: local recruitment agencies, real estate brokerages,
insurance brokers, marketing agencies — physical businesses with websites,
decision-makers findable, SMB-sized by definition.

Queries: (industry × city) for target geos. Output: data/gmaps_targets.json.
"""

import json
import os
import time
import urllib.parse
import urllib.request

APIFY_TOKEN = os.environ.get('APIFY_TOKEN', '')
if not APIFY_TOKEN:
    raise SystemExit('Set APIFY_TOKEN')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, 'data')
os.makedirs(DATA_DIR, exist_ok=True)

# Google Maps scraper — public Apify actor
GMAPS_ACTOR = 'compass~crawler-google-places'

# (industry, search_term) — the search_term is how Google Maps categorizes it
QUERIES = [
    ('recruitment_staffing', 'recruitment agency'),
    ('recruitment_staffing', 'staffing agency'),
    ('real_estate', 'real estate brokerage'),
    ('real_estate', 'mortgage broker'),
    ('marketing_agency', 'digital marketing agency'),
    ('marketing_agency', 'seo agency'),
    ('b2b_services', 'IT consulting firm'),
    ('b2b_services', 'bookkeeping service'),
    ('insurance_finance', 'insurance broker'),
    ('insurance_finance', 'financial advisor'),
]

LOCATIONS = [
    # US — biggest markets
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Austin, TX',
    'Miami, FL',
    'Boston, MA',
    'Denver, CO',
    'Atlanta, GA',
    # UK
    'London, UK',
    'Manchester, UK',
    # CA
    'Toronto, ON',
    'Vancouver, BC',
    # AU
    'Sydney, Australia',
    'Melbourne, Australia',
    # UAE
    'Dubai, UAE',
]


def api_call(method, url, data=None, timeout=120):
    headers = {
        'Authorization': f'Bearer {APIFY_TOKEN}',
        'Content-Type': 'application/json',
    }
    body = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    resp = urllib.request.urlopen(req, timeout=timeout)
    raw = resp.read().decode('utf-8')
    try:
        return resp.status, json.loads(raw)
    except Exception:
        return resp.status, raw


def run_gmaps(search_term: str, location: str, max_results: int = 25) -> list:
    """Trigger a Google Maps run and return results."""
    print(f'  → {search_term} @ {location}…', end=' ', flush=True)
    status, resp = api_call(
        'POST',
        f'https://api.apify.com/v2/acts/{GMAPS_ACTOR}/run-sync-get-dataset-items'
        f'?token={APIFY_TOKEN}&timeout=120',
        {
            'searchStringsArray': [search_term],
            'locationQuery': location,
            'maxCrawledPlacesPerSearch': max_results,
            'language': 'en',
            'skipClosedPlaces': True,
            'scrapeContacts': False,
        },
    )
    if status != 201 and status != 200:
        print(f'err {status}')
        return []
    if not isinstance(resp, list):
        print('no results')
        return []
    print(f'{len(resp)} places')
    return resp


def main():
    all_companies = {}

    for industry, search_term in QUERIES:
        for location in LOCATIONS:
            results = run_gmaps(search_term, location, max_results=20)
            for place in results:
                website = place.get('website', '')
                if not website:
                    continue
                from urllib.parse import urlparse
                domain = urlparse(website).netloc.lower().replace('www.', '')
                if not domain:
                    continue

                # Dedupe by domain
                if domain in all_companies:
                    all_companies[domain]['industries'].add(industry)
                    all_companies[domain]['locations'].add(location)
                    continue

                all_companies[domain] = {
                    'domain': domain,
                    'website': website,
                    'company_name': place.get('title', ''),
                    'industries': {industry},
                    'locations': {location},
                    'gmaps_category': place.get('categoryName', ''),
                    'phone': place.get('phone', ''),
                    'address': place.get('address', ''),
                    'reviews_count': place.get('reviewsCount', 0),
                    'rating': place.get('totalScore', 0),
                    'gmaps_url': place.get('url', ''),
                }
            time.sleep(0.3)

    # Convert sets
    out = []
    for c in all_companies.values():
        c['industries'] = sorted(c['industries'])
        c['locations'] = sorted(c['locations'])
        out.append(c)

    print(f'\nTotal unique SMBs: {len(out)}')
    out_path = os.path.join(DATA_DIR, 'gmaps_targets.json')
    with open(out_path, 'w') as f:
        json.dump(out, f, indent=2)
    print(f'Saved → {out_path}')

    # Summary
    from collections import Counter
    by_ind = Counter(i for c in out for i in c['industries'])
    by_loc = Counter(l for c in out for l in c['locations'])
    print('\nBy industry:', dict(by_ind))
    print('By location (top 10):', dict(by_loc.most_common(10)))


if __name__ == '__main__':
    main()
