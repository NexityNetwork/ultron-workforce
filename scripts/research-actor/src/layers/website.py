"""Layer 2: Website Intelligence.

Funnel structure, CTAs, forms, pricing, social proof, content hub.
"""

import re
from src.utils import fetch_url, extract_links, extract_text, extract_meta


def count_ctas(html: str) -> dict:
    """Count call-to-action elements."""
    # Button text patterns
    cta_patterns = {
        'demo': r'(?:book|schedule|request|get)\s+(?:a\s+)?demo',
        'trial': r'(?:start|try|free)\s+trial',
        'signup': r'sign\s*up|create\s+account|get\s+started',
        'contact': r'contact\s+(?:us|sales)|talk\s+to\s+(?:us|sales)',
        'pricing': r'see\s+pricing|view\s+pricing',
        'download': r'download\s+(?:now|free)',
    }
    counts = {}
    text = extract_text(html, max_len=200000)
    for name, pattern in cta_patterns.items():
        counts[name] = len(re.findall(pattern, text, re.IGNORECASE))
    return counts


def detect_forms(html: str) -> dict:
    """Detect lead capture forms."""
    form_count = len(re.findall(r'<form[^>]*>', html, re.IGNORECASE))
    email_inputs = len(re.findall(r'<input[^>]*type=["\']email["\']', html, re.IGNORECASE))
    # Newsletter vs contact vs demo form heuristic
    has_newsletter = bool(re.search(r'newsletter|subscribe|weekly', html, re.IGNORECASE))
    has_demo_form = bool(re.search(r'demo.*?form|request.*?demo', html, re.IGNORECASE | re.DOTALL))
    return {
        'form_count': form_count,
        'email_inputs': email_inputs,
        'has_newsletter_form': has_newsletter,
        'has_demo_form': has_demo_form,
    }


def detect_pricing_page(links: list, all_pages_html: dict) -> dict:
    """Check if pricing page exists, analyze structure."""
    pricing_urls = [l for l in links if re.search(r'/pricing|/plans|/price', l, re.IGNORECASE)]
    if not pricing_urls:
        return {'exists': False, 'url': '', 'tiers': 0, 'transparent': False}

    url = pricing_urls[0]
    html = all_pages_html.get(url, '')
    if not html:
        return {'exists': True, 'url': url, 'tiers': 0, 'transparent': False}

    # Count pricing tiers (look for $ amounts + "per month")
    tier_matches = re.findall(r'\$\d+(?:[.,]\d{2})?\s*(?:\/\s*(?:mo|month|user))', html, re.IGNORECASE)
    has_contact_sales = bool(re.search(r'contact\s+sales|custom\s+pricing|enterprise', html, re.IGNORECASE))
    return {
        'exists': True,
        'url': url,
        'tiers': min(len(tier_matches), 10),
        'transparent': len(tier_matches) >= 2,
        'has_enterprise_tier': has_contact_sales,
    }


def detect_social_proof(html: str, text: str) -> dict:
    """Detect testimonials, case studies, logo walls, reviews."""
    t = text.lower()
    return {
        'has_testimonials': bool(re.search(
            r'testimonial|what.*?say|hear.*?customers|loved by',
            html, re.IGNORECASE,
        )),
        'has_case_studies': bool(re.search(
            r'case\s+stud|customer\s+stor|success\s+stor',
            t, re.IGNORECASE,
        )),
        'has_logo_wall': bool(re.search(
            r'trusted\s+by|used\s+by|our\s+customers|as\s+seen\s+(?:in|on)|featured\s+in',
            t, re.IGNORECASE,
        )),
        'has_review_embed': bool(re.search(
            r'g2\.com|trustpilot\.com|capterra\.com', html, re.IGNORECASE,
        )),
        'review_count_mentions': len(re.findall(
            r'(\d{1,3}(?:,\d{3})*\+?)\s*(?:reviews|customers|users)',
            text, re.IGNORECASE,
        )),
    }


def detect_content_hub(links: list) -> dict:
    """Detect blog, resources, docs."""
    l = [link.lower() for link in links]
    blog_links = [x for x in l if re.search(r'/blog|/articles|/insights|/resources', x)]
    docs_links = [x for x in l if re.search(r'/docs|/documentation|/api|/developer', x)]
    return {
        'has_blog': any(re.search(r'/blog|/articles|/insights', x) for x in l),
        'blog_post_count_estimate': len(blog_links),
        'has_docs': any('/docs' in x or '/api' in x for x in l),
        'has_resources': any(re.search(r'/resources|/guides|/ebook|/whitepaper', x) for x in l),
        'has_case_studies_page': any('/case-stud' in x or '/customers' in x for x in l),
    }


def detect_funnel(links: list, html: str) -> dict:
    """Identify funnel structure."""
    l = [link.lower() for link in links]
    return {
        'has_homepage_cta': bool(re.search(r'<button|<a[^>]+(?:btn|cta|button)', html, re.IGNORECASE)),
        'has_demo_page': any('/demo' in x or '/book' in x for x in l),
        'has_pricing_page': any('/pricing' in x or '/plans' in x for x in l),
        'has_trial_signup': any('/signup' in x or '/get-started' in x or '/trial' in x for x in l),
        'has_login': any('/login' in x or '/signin' in x for x in l),
        'has_contact_page': any('/contact' in x for x in l),
    }


def check_schema_markup(html: str) -> dict:
    """Detect structured data / schema markup."""
    has_json_ld = '"@type"' in html or 'application/ld+json' in html
    schema_types = re.findall(r'"@type"\s*:\s*"([^"]+)"', html)
    return {
        'has_json_ld': has_json_ld,
        'schema_types': list(set(schema_types))[:15],
    }


def crawl_site(base_url: str, max_pages: int = 15) -> dict:
    """Crawl the site, collecting pages with priority ordering."""
    # Priority pages to look for
    priority_patterns = [
        r'/pricing', r'/plans', r'/demo', r'/contact', r'/about',
        r'/customers', r'/case', r'/testimonial', r'/blog',
        r'/features', r'/product', r'/solutions', r'/integrations',
        r'/careers', r'/jobs', r'/team',
    ]

    pages = {}
    # Fetch homepage
    home = fetch_url(base_url)
    if not home['success']:
        return {'pages_fetched': 0, 'pages': {}}
    pages[base_url] = home['html']

    # Extract links, prioritize
    links = extract_links(home['html'], base_url)

    def priority(link: str) -> int:
        for i, p in enumerate(priority_patterns):
            if re.search(p, link, re.IGNORECASE):
                return i
        return 999

    links = sorted(set(links), key=priority)

    for link in links[:max_pages - 1]:
        result = fetch_url(link, timeout=12)
        if result['success']:
            pages[link] = result['html']

    return {'pages_fetched': len(pages), 'pages': pages, 'all_links': links}


def run(company_url: str, home_html: str, max_pages: int = 15) -> dict:
    """Run Layer 2: Website Intelligence."""
    crawl = crawl_site(company_url, max_pages=max_pages)
    pages = crawl['pages']
    all_links = crawl['all_links']
    text = extract_text(home_html)

    return {
        'pages_crawled': crawl['pages_fetched'],
        'total_internal_links': len(all_links),
        'ctas': count_ctas(home_html),
        'forms': detect_forms(home_html),
        'pricing': detect_pricing_page(all_links, pages),
        'social_proof': detect_social_proof(home_html, text),
        'content_hub': detect_content_hub(all_links),
        'funnel': detect_funnel(all_links, home_html),
        'schema_markup': check_schema_markup(home_html),
        'crawled_pages': list(pages.keys()),
    }
