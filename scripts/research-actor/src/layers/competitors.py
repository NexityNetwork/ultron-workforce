"""Layer 11: Competitive Landscape.

Identify top 3 competitors via comparison searches, then run an abbreviated
audit on each to benchmark against the target.
"""

import re
from src.utils import brave_search, fetch_url, extract_text, normalize_domain


def find_competitors_via_comparison(
    company_name: str, brave_key: str,
) -> list:
    """Find competitors via 'X vs Y' and 'alternatives to X' searches."""
    if not brave_key or not company_name:
        return []

    candidates = {}
    queries = [
        f'"{company_name}" alternatives',
        f'"{company_name}" vs',
        f'best alternatives to "{company_name}"',
        f'"{company_name}" competitors',
    ]
    for q in queries:
        results = brave_search(q, brave_key, count=5)
        for r in results:
            title = r.get('title', '')
            desc = r.get('description', '')
            combined = title + ' ' + desc

            # Pattern: "X vs Y" — extract Y
            for m in re.finditer(
                r'(?:vs\.?|versus|alternative to|compared to)\s+'
                r'([A-Z][A-Za-z0-9]+(?:\s[A-Z][A-Za-z0-9]+)?)',
                combined,
            ):
                name = m.group(1).strip()
                if (name.lower() != company_name.lower()
                        and len(name) > 2 and len(name) < 30):
                    candidates[name] = candidates.get(name, 0) + 1

    # Sort by mention count
    ranked = sorted(candidates.items(), key=lambda x: -x[1])
    return [name for name, _ in ranked[:10]]


def find_competitor_domain(competitor_name: str, brave_key: str) -> str:
    """Find the official website domain for a competitor name."""
    if not brave_key:
        return ''
    results = brave_search(
        f'"{competitor_name}" official site', brave_key, count=3,
    )
    for r in results:
        url = r.get('url', '')
        domain = normalize_domain(url)
        # Skip review sites
        if any(skip in domain for skip in [
            'g2.com', 'capterra.com', 'trustpilot.com', 'linkedin.com',
            'wikipedia.org', 'youtube.com', 'crunchbase.com',
        ]):
            continue
        return domain
    return ''


def abbreviated_audit(competitor_name: str, brave_key: str) -> dict:
    """Run a lightweight audit on a competitor for benchmarking."""
    domain = find_competitor_domain(competitor_name, brave_key)
    if not domain:
        return {'name': competitor_name, 'domain': '', 'note': 'no domain found'}

    home_url = f'https://{domain}'
    result = fetch_url(home_url, timeout=15)
    html = result.get('html', '')

    audit = {
        'name': competitor_name,
        'domain': domain,
        'url': home_url,
        'reachable': result.get('success', False),
    }

    if not html:
        return audit

    text = extract_text(html).lower()

    # Quick signals
    audit['has_pricing_mention'] = bool(
        re.search(r'/pricing|pricing\s*</a>', html, re.IGNORECASE)
    )
    audit['has_demo_mention'] = bool(
        re.search(r'book.*?demo|request.*?demo|schedule.*?demo', text)
    )
    audit['has_free_trial'] = 'free trial' in text or 'start free' in text
    audit['has_ai_messaging'] = bool(
        re.search(r'\bai\b|artificial intelligence|automation', text)
    )

    # G2 rating lookup
    if brave_key:
        g2_results = brave_search(
            f'"{competitor_name}" site:g2.com', brave_key, count=2,
        )
        if g2_results:
            audit['g2_url'] = g2_results[0].get('url', '')

    return audit


def run(company_name: str, brave_key: str) -> dict:
    """Run Layer 11: Competitive Landscape."""
    if not brave_key:
        return {'error': 'no_brave_key'}

    competitor_names = find_competitors_via_comparison(company_name, brave_key)
    top_3 = competitor_names[:3]

    audits = [abbreviated_audit(name, brave_key) for name in top_3]

    return {
        'competitor_candidates': competitor_names,
        'top_3_analyzed': top_3,
        'competitor_audits': audits,
    }
