"""Layer 5: Paid Acquisition detection.

Meta Ad Library, Google Ads transparency, LinkedIn Ads signals.
"""

import re
import urllib.parse
from src.utils import fetch_url, http_get, brave_search


def check_meta_ad_library(company_name: str) -> dict:
    """Query Meta Ad Library for active ads.

    Meta's public endpoint: https://www.facebook.com/ads/library/?q={name}&active_status=active
    """
    if not company_name:
        return {}
    query = urllib.parse.quote(company_name)
    url = (
        f'https://www.facebook.com/ads/library/?active_status=all'
        f'&ad_type=all&country=US&q={query}'
    )
    result = fetch_url(url, timeout=15)
    html = result.get('html', '')
    # Facebook's JS-rendered page — can't get ads counts without a browser.
    # But we can at least check if the query returned the page and sometimes
    # indirect signals come through.
    has_ads_marker = bool(
        re.search(r'active\s+ads|ads\s+about\s+social\s+issues', html, re.IGNORECASE)
    )
    return {
        'meta_ad_library_url': url,
        'page_reachable': result.get('success', False),
        'has_ads_marker': has_ads_marker,
        'note': 'Meta Ad Library is JS-rendered; visit URL in browser to confirm ads',
    }


def check_google_ads_transparency(domain: str) -> dict:
    """Check Google Ads Transparency Center for advertiser."""
    if not domain:
        return {}
    url = (
        f'https://adstransparency.google.com/advertiser?'
        f'region=anywhere&query={urllib.parse.quote(domain)}'
    )
    return {
        'transparency_url': url,
        'note': 'Google Ads Transparency is JS-rendered; visit URL to confirm',
    }


def check_linkedin_ads(company_name: str, brave_key: str) -> dict:
    """Search for LinkedIn ads library."""
    if not brave_key or not company_name:
        return {}
    # LinkedIn Ad Library URL pattern
    results = brave_search(
        f'"{company_name}" site:linkedin.com/ads',
        brave_key, count=5,
    )
    return {
        'linkedin_ad_mentions': len(results),
        'urls': [r['url'] for r in results[:3]],
    }


def detect_utm_signals_in_html(home_html: str) -> dict:
    """Look for UTM parameters suggesting active paid campaigns."""
    utm_sources = re.findall(
        r'utm_source=([\w\-\.]+)', home_html, re.IGNORECASE,
    )
    utm_mediums = re.findall(
        r'utm_medium=([\w\-\.]+)', home_html, re.IGNORECASE,
    )
    # Pixels detected in page are a weak signal for ad running
    has_meta_pixel = bool(
        re.search(r'fbq\(\s*[\'"]init', home_html, re.IGNORECASE)
    )
    has_google_conversion = bool(
        re.search(r'gtag\(\s*[\'"]event[\'"]\s*,\s*[\'"]conversion', home_html, re.IGNORECASE)
    )
    has_linkedin_insight = bool(
        re.search(r'_linkedin_partner_id|snap\.licdn\.com', home_html, re.IGNORECASE)
    )
    return {
        'utm_sources': list(set(utm_sources))[:10],
        'utm_mediums': list(set(utm_mediums))[:10],
        'has_meta_pixel': has_meta_pixel,
        'has_google_conversion_tracking': has_google_conversion,
        'has_linkedin_insight_tag': has_linkedin_insight,
        'likely_running_paid_ads': sum([
            has_meta_pixel, has_google_conversion, has_linkedin_insight,
        ]) >= 1,
    }


def run(company_name: str, domain: str, home_html: str, brave_key: str) -> dict:
    """Run Layer 5: Paid Acquisition audit."""
    return {
        'meta_ads': check_meta_ad_library(company_name),
        'google_ads': check_google_ads_transparency(domain),
        'linkedin_ads': check_linkedin_ads(company_name, brave_key),
        'tracking_pixels': detect_utm_signals_in_html(home_html),
    }
