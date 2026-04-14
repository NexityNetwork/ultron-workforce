"""Layer 3: SEO + AEO (Answer Engine Optimization).

Domain authority signals, indexed pages, ranking keywords, AI citation presence.
"""

from src.utils import brave_search, normalize_domain


def count_indexed_pages(domain: str, brave_key: str) -> int:
    """Use Brave site: query to estimate indexed page count."""
    if not brave_key:
        return 0
    results = brave_search(f'site:{domain}', brave_key, count=20)
    # Brave doesn't return total counts easily; use result length as rough signal
    return len(results)


def check_brand_visibility(company_name: str, domain: str, brave_key: str) -> dict:
    """Is the brand visible in branded search?"""
    if not brave_key:
        return {}
    results = brave_search(f'"{company_name}"', brave_key, count=10)
    first_result_is_theirs = bool(
        results and domain in results[0].get('url', '').lower()
    )
    own_results = sum(1 for r in results if domain in r.get('url', '').lower())
    return {
        'branded_serp_first': first_result_is_theirs,
        'own_serp_count': own_results,
        'total_serp_results': len(results),
    }


def check_category_rankings(
    company_name: str, industry: str, domain: str, brave_key: str,
) -> dict:
    """Check if they rank for their category keywords."""
    if not brave_key or not industry or industry == 'unknown':
        return {'queries_checked': 0, 'ranked_count': 0}

    # Industry → category queries
    category_queries = {
        'saas': ['best b2b saas', 'saas platform', 'business software'],
        'ai_ml': ['best ai tools', 'ai platform', 'ai software'],
        'fintech': ['best fintech', 'payment platform', 'fintech solution'],
        'ecommerce': ['best ecommerce', 'online store platform'],
        'healthtech': ['healthcare software', 'healthtech platform'],
        'martech': ['marketing automation', 'crm software', 'email platform'],
        'devtools': ['developer tools', 'api platform'],
        'edtech': ['online learning platform', 'edtech'],
        'agency': ['digital marketing agency', 'consulting agency'],
    }
    queries = category_queries.get(industry, [industry])
    ranked = 0
    ranked_queries = []
    for q in queries[:3]:
        results = brave_search(q, brave_key, count=10)
        for i, r in enumerate(results):
            if domain in r.get('url', '').lower():
                ranked += 1
                ranked_queries.append({'query': q, 'position': i + 1})
                break
    return {
        'queries_checked': len(queries[:3]),
        'ranked_count': ranked,
        'ranked_queries': ranked_queries,
    }


def check_aeo_presence(company_name: str, brave_key: str) -> dict:
    """Are they cited in answer engines?

    Proxy signal: Do Quora, Reddit, HackerNews discuss them?
    Those are primary sources that LLMs cite.
    """
    if not brave_key:
        return {}
    # Check if reddit/quora mention them
    reddit_results = brave_search(f'"{company_name}" site:reddit.com', brave_key, count=5)
    quora_results = brave_search(f'"{company_name}" site:quora.com', brave_key, count=3)
    hn_results = brave_search(
        f'"{company_name}" site:news.ycombinator.com', brave_key, count=3,
    )
    return {
        'reddit_mentions': len(reddit_results),
        'quora_mentions': len(quora_results),
        'hackernews_mentions': len(hn_results),
        'reddit_urls': [r['url'] for r in reddit_results[:3]],
    }


def check_backlink_signals(domain: str, brave_key: str) -> dict:
    """Proxy backlink quality via media mentions."""
    if not brave_key:
        return {}
    media_results = brave_search(
        f'"{domain}" (site:techcrunch.com OR site:forbes.com OR site:theverge.com '
        f'OR site:venturebeat.com OR site:fastcompany.com)',
        brave_key, count=10,
    )
    return {
        'media_mentions': len(media_results),
        'media_urls': [r['url'] for r in media_results[:5]],
    }


def run(company_name: str, domain: str, industry: str, brave_key: str) -> dict:
    """Run Layer 3: SEO + AEO analysis."""
    if not brave_key:
        return {'error': 'no_brave_key'}

    return {
        'indexed_pages_estimate': count_indexed_pages(domain, brave_key),
        'brand_visibility': check_brand_visibility(company_name, domain, brave_key),
        'category_rankings': check_category_rankings(
            company_name, industry, domain, brave_key,
        ),
        'aeo_presence': check_aeo_presence(company_name, brave_key),
        'backlink_signals': check_backlink_signals(domain, brave_key),
    }
