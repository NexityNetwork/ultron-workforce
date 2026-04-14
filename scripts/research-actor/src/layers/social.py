"""Layer 4: Social Media audit.

Platforms present, followers, engagement, founder personal brand, community.
"""

import re
from src.utils import (
    fetch_url, extract_social_links, extract_text, brave_search,
    normalize_domain,
)


def extract_number(text: str) -> int:
    """Parse follower-style number: '12.3K' → 12300, '1.5M' → 1500000."""
    if not text:
        return 0
    match = re.search(r'([\d,]+(?:\.\d+)?)\s*([KkMmBb])?', text)
    if not match:
        return 0
    num = float(match.group(1).replace(',', ''))
    suffix = match.group(2)
    if suffix:
        multiplier = {'k': 1_000, 'm': 1_000_000, 'b': 1_000_000_000}[suffix.lower()]
        num *= multiplier
    return int(num)


def fetch_twitter_profile(handle: str) -> dict:
    """Try to fetch Twitter profile via unauth web (limited but works sometimes)."""
    if not handle:
        return {}
    # X.com blocks unauthenticated scraping aggressively now.
    # We rely on what we can get from the company's own site (social links) +
    # meta tags rather than trying to scrape X directly.
    return {'handle': handle, 'url': f'https://x.com/{handle}', 'followers_estimate': 0}


def fetch_linkedin_company(url: str, li_at: str) -> dict:
    """Fetch LinkedIn company page via Voyager API using li_at cookie."""
    if not li_at or not url:
        return {}

    # Extract vanity name from URL
    m = re.search(r'linkedin\.com/company/([^/\?]+)', url, re.IGNORECASE)
    if not m:
        return {}
    vanity = m.group(1)

    # Voyager API endpoint
    csrf_token = li_at.split('-')[-1] if '-' in li_at else 'ajax:0000000000000000000'
    api_url = f'https://www.linkedin.com/voyager/api/organization/companies?decoration=(%2A%2Celements%2A(%2A%2Cschool~(%2A%2CschoolV2~(%2A))))&q=universalName&universalName={vanity}'

    from src.utils import http_get
    status, body, _ = http_get(api_url, {
        'Cookie': f'li_at={li_at}; JSESSIONID="{csrf_token}"',
        'csrf-token': csrf_token,
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'x-restli-protocol-version': '2.0.0',
    }, timeout=15)

    if status != 200:
        return {'vanity': vanity, 'error': f'HTTP {status}', 'url': url}

    try:
        import json
        data = json.loads(body)
        els = data.get('elements', [])
        if not els:
            return {'vanity': vanity, 'url': url}
        c = els[0]
        staff_count = c.get('staffCount', 0)
        staff_range = c.get('staffCountRange', {})
        return {
            'vanity': vanity,
            'url': url,
            'name': c.get('name', ''),
            'description': c.get('description', '')[:500],
            'staff_count': staff_count,
            'staff_count_range': f"{staff_range.get('start', 0)}-{staff_range.get('end', 0)}",
            'industries': c.get('industries', []),
            'headquarter': c.get('headquarter', {}),
            'founded_year': c.get('foundedOn', {}).get('year', 0),
            'specialties': c.get('specialties', [])[:10],
            'follower_count': c.get('followingInfo', {}).get('followerCount', 0),
        }
    except Exception as e:
        return {'vanity': vanity, 'url': url, 'parse_error': str(e)}


def find_founder_socials(company_name: str, brave_key: str) -> dict:
    """Search for founder/CEO social profiles."""
    if not brave_key or not company_name:
        return {}
    results = brave_search(
        f'"{company_name}" CEO OR founder (site:x.com OR site:twitter.com)',
        brave_key, count=5,
    )
    founders = []
    for r in results:
        url = r.get('url', '')
        m = re.search(r'(?:twitter|x)\.com/([A-Za-z0-9_]{1,20})', url)
        if m:
            handle = m.group(1)
            if handle.lower() not in {'share', 'home', 'i', 'intent'}:
                founders.append({
                    'handle': handle,
                    'url': f'https://x.com/{handle}',
                    'title': r.get('title', '')[:100],
                })
    return {'founder_twitter_candidates': founders[:3]}


def run(
    company_url: str, company_name: str, home_html: str,
    linkedin_url: str, brave_key: str, li_at: str,
) -> dict:
    """Run Layer 4: Social Media audit."""
    # Extract social links from homepage
    socials = extract_social_links(home_html)

    # Enrich each with basic metadata
    enriched = {'platforms_detected': list(socials.keys())}

    if 'twitter' in socials:
        enriched['twitter'] = fetch_twitter_profile(socials['twitter'])

    # LinkedIn company page — prefer explicit input, fall back to scraped
    li_url = linkedin_url or socials.get('linkedin')
    if li_url and 'company' in (li_url or ''):
        enriched['linkedin_company'] = fetch_linkedin_company(li_url, li_at)

    # Other platforms: just record presence
    for plat in ['youtube', 'instagram', 'facebook', 'tiktok', 'github', 'discord']:
        if plat in socials:
            enriched[plat] = {'handle_or_path': socials[plat]}

    # Founder personal brand
    enriched['founder_brand'] = find_founder_socials(company_name, brave_key)

    # Community presence signals
    text = extract_text(home_html).lower()
    enriched['community_signals'] = {
        'mentions_discord': 'discord' in text,
        'mentions_slack_community': bool(re.search(r'slack.*?community|community.*?slack', text)),
        'mentions_forum': 'forum' in text or 'community forum' in text,
    }

    return enriched
