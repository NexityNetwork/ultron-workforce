"""Layer 6: Reputation + Sentiment.

G2, Trustpilot, Google Reviews, Glassdoor, Reddit, Twitter brand mentions.
"""

import re
from src.utils import fetch_url, brave_search, extract_text


def find_review_profiles(company_name: str, domain: str, brave_key: str) -> dict:
    """Find review profile URLs on major platforms."""
    if not brave_key or not company_name:
        return {}

    profiles = {}
    for platform in ['g2.com', 'trustpilot.com', 'capterra.com',
                     'softwareadvice.com', 'getapp.com', 'glassdoor.com']:
        results = brave_search(
            f'"{company_name}" site:{platform}', brave_key, count=3,
        )
        if results:
            # Find the product/company page (not reviews of reviews)
            for r in results:
                url = r.get('url', '')
                if any(pat in url.lower() for pat in [
                    '/products/', '/review/', '/company/', '/reviews/',
                ]):
                    profiles[platform.split('.')[0]] = {
                        'url': url,
                        'title': r.get('title', '')[:100],
                    }
                    break
            if platform.split('.')[0] not in profiles and results:
                profiles[platform.split('.')[0]] = {
                    'url': results[0]['url'],
                    'title': results[0].get('title', '')[:100],
                }
    return profiles


def fetch_g2_summary(g2_url: str) -> dict:
    """Extract star rating + review count from G2 page."""
    if not g2_url:
        return {}
    result = fetch_url(g2_url, timeout=15)
    html = result.get('html', '')
    if not html:
        return {}
    text = extract_text(html)

    # G2 pattern: "4.5 out of 5 stars" and "(123 reviews)"
    rating_m = re.search(r'(\d\.\d)\s*out\s+of\s+5', text, re.IGNORECASE)
    count_m = re.search(
        r'\(\s*([\d,]+)\s+(?:reviews|ratings)\s*\)|'
        r'based\s+on\s+([\d,]+)\s+reviews',
        text, re.IGNORECASE,
    )
    return {
        'rating': float(rating_m.group(1)) if rating_m else 0,
        'review_count': int((count_m.group(1) or count_m.group(2)).replace(',', ''))
        if count_m else 0,
    }


def fetch_trustpilot_summary(tp_url: str) -> dict:
    """Extract TrustScore + review count from Trustpilot."""
    if not tp_url:
        return {}
    result = fetch_url(tp_url, timeout=15)
    html = result.get('html', '')
    if not html:
        return {}

    rating_m = re.search(r'TrustScore[^<]*(\d\.\d)', html, re.IGNORECASE)
    if not rating_m:
        rating_m = re.search(r'"ratingValue"\s*:\s*"?(\d\.\d+)"?', html)
    count_m = re.search(r'"reviewCount"\s*:\s*"?(\d+)"?', html)
    return {
        'rating': float(rating_m.group(1)) if rating_m else 0,
        'review_count': int(count_m.group(1)) if count_m else 0,
    }


def reddit_sentiment(company_name: str, brave_key: str) -> dict:
    """Find Reddit threads, estimate sentiment volume."""
    if not brave_key:
        return {}
    results = brave_search(
        f'"{company_name}" site:reddit.com', brave_key, count=10,
    )
    threads = []
    comparison_threads = 0
    for r in results:
        url = r.get('url', '')
        desc = r.get('description', '').lower()
        title = r.get('title', '').lower()
        # Comparison signal
        is_comparison = bool(
            re.search(r'\bvs\.?\b|alternative|compared?\s+to|instead\s+of',
                      title + ' ' + desc)
        )
        if is_comparison:
            comparison_threads += 1
        threads.append({
            'url': url,
            'title': r.get('title', '')[:150],
            'is_comparison': is_comparison,
        })
    return {
        'thread_count': len(threads),
        'comparison_threads': comparison_threads,
        'threads': threads[:10],
    }


def twitter_sentiment(company_name: str, brave_key: str) -> dict:
    """Brand mentions on X via Brave search."""
    if not brave_key:
        return {}
    results = brave_search(
        f'"{company_name}" (site:x.com OR site:twitter.com)',
        brave_key, count=10,
    )
    return {
        'mention_count': len(results),
        'urls': [r['url'] for r in results[:5]],
    }


def glassdoor_summary(profiles: dict) -> dict:
    """Fetch Glassdoor rating if available."""
    gd = profiles.get('glassdoor', {})
    if not gd:
        return {}
    result = fetch_url(gd.get('url', ''), timeout=15)
    html = result.get('html', '')
    if not html:
        return {'url': gd.get('url', '')}
    rating_m = re.search(r'"overallRating"\s*:\s*(\d\.\d+)', html)
    count_m = re.search(r'"ratingsCount"\s*:\s*(\d+)', html)
    return {
        'url': gd.get('url', ''),
        'rating': float(rating_m.group(1)) if rating_m else 0,
        'review_count': int(count_m.group(1)) if count_m else 0,
    }


def run(company_name: str, domain: str, brave_key: str) -> dict:
    """Run Layer 6: Reputation + Sentiment."""
    if not brave_key:
        return {'error': 'no_brave_key'}

    profiles = find_review_profiles(company_name, domain, brave_key)

    return {
        'profiles_found': profiles,
        'g2': fetch_g2_summary(profiles.get('g2', {}).get('url', '')),
        'trustpilot': fetch_trustpilot_summary(
            profiles.get('trustpilot', {}).get('url', '')),
        'glassdoor': glassdoor_summary(profiles),
        'reddit': reddit_sentiment(company_name, brave_key),
        'twitter_mentions': twitter_sentiment(company_name, brave_key),
    }
