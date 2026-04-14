"""Layer 1: Identity.

Extract: legal name, founding year, industry, location, team size signals,
business model, revenue stage signals, key decision maker.
"""

import re
from src.utils import (
    fetch_url, brave_search, extract_meta, extract_text,
    normalize_domain, extract_emails,
)


def detect_business_model(html: str, text: str) -> str:
    """Detect SaaS vs service vs physical vs hybrid."""
    t = text.lower()
    saas_signals = ['free trial', 'sign up', 'subscription', 'pricing', 'per month',
                    'per user', 'api', 'integration', 'dashboard', 'platform']
    service_signals = ['book a call', 'get a quote', 'our services', 'consultation',
                       'agency', 'we help', 'partner with us']
    physical_signals = ['shipping', 'add to cart', 'warehouse', 'store locator',
                        'buy now', 'in stock']

    scores = {
        'saas': sum(1 for s in saas_signals if s in t),
        'service': sum(1 for s in service_signals if s in t),
        'physical': sum(1 for s in physical_signals if s in t),
    }
    top = max(scores.items(), key=lambda x: x[1])
    if top[1] == 0:
        return 'unknown'
    # Hybrid if two categories have similar strong signal
    sorted_scores = sorted(scores.values(), reverse=True)
    if sorted_scores[0] >= 3 and sorted_scores[1] >= sorted_scores[0] * 0.6:
        return 'hybrid'
    return top[0]


def detect_revenue_stage(html: str, text: str) -> str:
    """Estimate revenue stage from pricing, funding, team signals."""
    t = text.lower()
    # Enterprise signals
    if any(s in t for s in ['fortune 500', 'enterprise', 'fortune 100', 'global customers']):
        return 'scale'
    # Funding signals
    if re.search(r'series\s+[a-e]|raised\s+\$\d+[mM]|backed by', text, re.IGNORECASE):
        if re.search(r'series\s+[c-e]', text, re.IGNORECASE):
            return 'scale'
        return 'growth'
    # Pricing signals
    if re.search(r'\$\d{3,}[^\d]*\/\s*month|enterprise pricing|contact sales', text, re.IGNORECASE):
        return 'growth'
    if re.search(r'\$\d{1,2}[^\d]*\/\s*month', text, re.IGNORECASE):
        return 'early'
    if 'free' in t and 'trial' in t:
        return 'early'
    return 'unknown'


def extract_founding_year(text: str) -> int:
    """Look for founding year."""
    patterns = [
        r'(?:founded|established|since|est\.?)\s+(?:in\s+)?(\d{4})',
        r'©\s*(\d{4})',
        r'copyright\s+(?:©\s*)?(\d{4})',
    ]
    years = []
    for p in patterns:
        for m in re.finditer(p, text, re.IGNORECASE):
            y = int(m.group(1))
            if 1980 <= y <= 2026:
                years.append(y)
    if not years:
        return 0
    # Founded = oldest year, copyright = most recent. Prefer oldest for founding.
    return min(years)


def detect_industry(text: str, meta: dict) -> str:
    """Infer industry from text + meta keywords."""
    description = (meta.get('description', '') + ' ' + meta.get('og:description', '')).lower()
    keywords = meta.get('keywords', '').lower()
    combined = (description + ' ' + keywords + ' ' + text[:2000]).lower()

    industry_map = {
        'saas': ['software as a service', 'saas', 'b2b software', 'platform for'],
        'ai_ml': ['artificial intelligence', 'machine learning', 'llm', 'ai-powered', 'ai agent'],
        'fintech': ['fintech', 'payment', 'banking', 'lending', 'invoicing', 'accounting'],
        'ecommerce': ['ecommerce', 'online store', 'shopify', 'dropshipping', 'marketplace'],
        'healthtech': ['healthcare', 'medical', 'patient', 'hipaa', 'clinical'],
        'martech': ['marketing automation', 'crm', 'email marketing', 'advertising platform'],
        'devtools': ['developer tools', 'api platform', 'sdk', 'devops', 'ci/cd'],
        'edtech': ['online learning', 'courses', 'edtech', 'education platform'],
        'agency': ['agency', 'consulting', 'we work with', 'our clients'],
        'media': ['media company', 'publisher', 'newsletter', 'podcast network'],
    }
    scores = {ind: sum(1 for kw in kws if kw in combined)
              for ind, kws in industry_map.items()}
    top = max(scores.items(), key=lambda x: x[1])
    return top[0] if top[1] > 0 else 'unknown'


def extract_locations(text: str, html: str) -> list:
    """Extract city/country mentions."""
    # Look for addresses
    locations = []
    # US states
    us_states = r'\b(?:NY|CA|TX|FL|WA|MA|IL|GA|CO|OR|VA|OH|NC|AZ|PA|MI|NJ|MN|WI)\b'
    for m in re.finditer(rf'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*({us_states})', text):
        locations.append(f'{m.group(1)}, {m.group(2)}')
    # Country mentions in footer/contact
    countries = ['USA', 'United States', 'Canada', 'United Kingdom', 'UK', 'Germany',
                 'France', 'Spain', 'Netherlands', 'Sweden', 'Israel', 'India',
                 'Australia', 'Singapore', 'Ireland']
    tail = text[-3000:]  # Footer typically has contact info
    for country in countries:
        if re.search(rf'\b{country}\b', tail):
            locations.append(country)
    return list(dict.fromkeys(locations))[:5]


def find_decision_maker(company_name: str, brave_key: str) -> dict:
    """Search for CEO/founder via Brave."""
    if not brave_key or not company_name:
        return {}
    query = f'"{company_name}" CEO OR founder site:linkedin.com/in'
    results = brave_search(query, brave_key, count=3)
    for r in results:
        url = r.get('url', '')
        title = r.get('title', '')
        if 'linkedin.com/in/' in url.lower():
            # Extract name from title
            name = title.split(' - ')[0].strip() if ' - ' in title else title.strip()
            return {
                'name': name[:80],
                'title': title[:150],
                'linkedin': url,
            }
    return {}


def run(company_url: str, home_html: str, home_meta: dict, brave_key: str) -> dict:
    """Run Layer 1: Identity extraction."""
    text = extract_text(home_html)
    domain = normalize_domain(company_url)

    # Company name
    name = home_meta.get('og:site_name') or home_meta.get('application-name') \
        or (home_meta.get('title', '').split(' | ')[0].split(' - ')[0].strip() if home_meta.get('title') else '') \
        or domain.split('.')[0].title()

    result = {
        'name': name,
        'website': company_url,
        'domain': domain,
        'industry': detect_industry(text, home_meta),
        'business_model': detect_business_model(home_html, text),
        'revenue_stage': detect_revenue_stage(home_html, text),
        'founding_year': extract_founding_year(text),
        'locations': extract_locations(text, home_html),
        'description': home_meta.get('description', '') or home_meta.get('og:description', ''),
        'decision_maker': find_decision_maker(name, brave_key),
        'emails_found': extract_emails(home_html)[:10],
    }
    return result
