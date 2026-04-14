"""Shared utilities: HTTP, Brave Search, Browserbase, parsing helpers."""

import json
import re
import urllib.parse
import urllib.request
import urllib.error
from urllib.parse import urlparse, urljoin


def http_get(url: str, headers: dict = None, timeout: int = 20) -> tuple:
    """GET request. Returns (status, body, response_headers)."""
    req = urllib.request.Request(url, headers=headers or {})
    try:
        resp = urllib.request.urlopen(req, timeout=timeout)
        body = resp.read().decode('utf-8', errors='ignore')
        return resp.status, body, dict(resp.headers)
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode('utf-8', errors='ignore')
        except Exception:
            body = ''
        return e.code, body, dict(e.headers) if e.headers else {}
    except Exception as e:
        return 0, str(e), {}


def http_post(url: str, data: dict = None, headers: dict = None, timeout: int = 30) -> tuple:
    """POST request with JSON body. Returns (status, body, response_headers)."""
    body = json.dumps(data).encode('utf-8') if data else None
    hdrs = {'Content-Type': 'application/json', **(headers or {})}
    req = urllib.request.Request(url, data=body, headers=hdrs, method='POST')
    try:
        resp = urllib.request.urlopen(req, timeout=timeout)
        return resp.status, resp.read().decode('utf-8', errors='ignore'), dict(resp.headers)
    except urllib.error.HTTPError as e:
        try:
            return e.code, e.read().decode('utf-8', errors='ignore'), dict(e.headers) if e.headers else {}
        except Exception:
            return e.code, '', {}
    except Exception as e:
        return 0, str(e), {}


USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'


def fetch_url(url: str, timeout: int = 20) -> dict:
    """Fetch URL with browser-like headers, return structured result."""
    status, body, headers = http_get(url, {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
    }, timeout=timeout)
    return {
        'url': url,
        'status': status,
        'html': body if 200 <= status < 400 else '',
        'headers': headers,
        'success': 200 <= status < 400,
    }


def brave_search(query: str, api_key: str, count: int = 10) -> list:
    """Brave Search API. Returns list of {title, url, description}."""
    if not api_key:
        return []
    url = f'https://api.search.brave.com/res/v1/web/search?q={urllib.parse.quote(query)}&count={count}'
    status, body, _ = http_get(url, {
        'X-Subscription-Token': api_key,
        'Accept': 'application/json',
    })
    if status != 200:
        return []
    try:
        data = json.loads(body)
        results = data.get('web', {}).get('results', [])
        return [{'title': r.get('title', ''), 'url': r.get('url', ''),
                 'description': r.get('description', '')} for r in results]
    except Exception:
        return []


def normalize_domain(url: str) -> str:
    """Extract clean domain from URL."""
    try:
        parsed = urlparse(url if url.startswith('http') else f'https://{url}')
        return parsed.netloc.lower().replace('www.', '')
    except Exception:
        return url


def extract_links(html: str, base_url: str) -> list:
    """Extract all unique hrefs from HTML."""
    links = set()
    base_domain = normalize_domain(base_url)
    for match in re.finditer(r'href=["\']([^"\']+)["\']', html, re.IGNORECASE):
        href = match.group(1).strip()
        if href.startswith(('mailto:', 'tel:', 'javascript:', '#')):
            continue
        try:
            absolute = urljoin(base_url, href)
            # Only same-domain
            if normalize_domain(absolute) == base_domain:
                links.add(absolute.split('#')[0].rstrip('/'))
        except Exception:
            continue
    return sorted(links)


def extract_text(html: str, max_len: int = 50000) -> str:
    """Strip HTML tags, return plain text."""
    if not html:
        return ''
    text = re.sub(r'<script[^>]*>.*?</script>', ' ', html, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<style[^>]*>.*?</style>', ' ', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:max_len]


def extract_meta(html: str) -> dict:
    """Extract meta tags, title, OG data."""
    meta = {}
    m = re.search(r'<title[^>]*>([^<]+)</title>', html, re.IGNORECASE | re.DOTALL)
    if m:
        meta['title'] = m.group(1).strip()

    for tag_match in re.finditer(
        r'<meta\s+([^>]+)>', html, re.IGNORECASE
    ):
        attrs = tag_match.group(1)
        name_m = re.search(r'(?:name|property)=["\']([^"\']+)["\']', attrs, re.IGNORECASE)
        content_m = re.search(r'content=["\']([^"\']*)["\']', attrs, re.IGNORECASE)
        if name_m and content_m:
            meta[name_m.group(1).lower()] = content_m.group(1).strip()
    return meta


def extract_emails(html: str) -> list:
    """Extract email addresses from HTML."""
    emails = set(re.findall(
        r'[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
        html,
    ))
    # Filter obvious noise
    return [e for e in emails if not any(
        bad in e.lower() for bad in ['@example.', '@domain.', '@sentry.', '@wix.com', '@placeholder']
    )]


def extract_social_links(html: str) -> dict:
    """Extract social profile URLs from HTML."""
    socials = {}
    patterns = {
        'twitter': r'https?://(?:www\.)?(?:twitter|x)\.com/([A-Za-z0-9_]{1,20})(?:/|\?|$)',
        'linkedin': r'https?://(?:www\.)?linkedin\.com/(?:company|in|school)/([^/\?"\'\s]+)',
        'youtube': r'https?://(?:www\.)?youtube\.com/(?:@|c/|channel/|user/)([^/\?"\'\s]+)',
        'instagram': r'https?://(?:www\.)?instagram\.com/([A-Za-z0-9_.]{1,30})',
        'facebook': r'https?://(?:www\.)?facebook\.com/([^/\?"\'\s]+)',
        'tiktok': r'https?://(?:www\.)?tiktok\.com/@([A-Za-z0-9_.]{1,24})',
        'github': r'https?://(?:www\.)?github\.com/([A-Za-z0-9-]+)',
        'discord': r'https?://(?:www\.)?discord\.(?:gg|com/invite)/([A-Za-z0-9]+)',
        'crunchbase': r'https?://(?:www\.)?crunchbase\.com/organization/([^/\?"\'\s]+)',
    }
    for platform, pattern in patterns.items():
        matches = re.findall(pattern, html, re.IGNORECASE)
        if matches:
            # Take first unique match, skip common false positives
            skip = {'share', 'sharer', 'intent', 'home', 'watch', 'playlist', 'embed'}
            for m in matches:
                if m.lower() not in skip:
                    socials[platform] = m
                    break
    return socials


def run_browserbase(url: str, api_key: str, wait_ms: int = 2000) -> dict:
    """Fetch page via Browserbase for JS-heavy sites.

    Browserbase doesn't have a simple HTML-get API — it uses full Playwright sessions.
    We skip it for now and fall back to plain HTTP fetch.
    This can be upgraded later via the @browserbasehq/sdk.
    """
    # Placeholder: use plain fetch. Browserbase integration = future work.
    return fetch_url(url)
