"""Layer 10: Team + Hiring signals.

Open roles are strong pain signals:
- Hiring SDR/BDR = weak outbound motion
- Hiring CS = churn pain
- Hiring Ops = process breakdown
- Hiring many engineers = scaling/roadmap behind
- Hiring Content/SEO = growth pain
"""

import re
from src.utils import brave_search, fetch_url, extract_text


ROLE_CATEGORIES = {
    'sales': [
        'sdr', 'bdr', 'sales development', 'account executive', 'ae',
        'sales rep', 'inside sales', 'business development',
    ],
    'customer_success': [
        'customer success', 'csm', 'account manager', 'customer support',
        'implementation', 'onboarding specialist', 'customer experience',
    ],
    'marketing': [
        'marketing manager', 'growth', 'content marketer', 'seo',
        'demand generation', 'performance marketing', 'paid media',
        'product marketing',
    ],
    'operations': [
        'operations', 'revops', 'ops manager', 'business operations',
        'bizops', 'sales ops',
    ],
    'engineering': [
        'software engineer', 'frontend', 'backend', 'full stack',
        'devops', 'sre', 'platform engineer',
    ],
    'ai_ml': [
        'machine learning', 'ml engineer', 'data scientist',
        'ai engineer', 'applied ai',
    ],
    'leadership': [
        'vp of', 'head of', 'director of', 'chief ',
    ],
}


def categorize_role(title: str) -> str:
    """Map role title to category."""
    t = title.lower()
    for cat, kws in ROLE_CATEGORIES.items():
        if any(kw in t for kw in kws):
            return cat
    return 'other'


def search_linkedin_jobs(company_name: str, brave_key: str) -> list:
    """Find LinkedIn job postings via Brave."""
    if not brave_key or not company_name:
        return []
    results = brave_search(
        f'"{company_name}" site:linkedin.com/jobs',
        brave_key, count=10,
    )
    return results


def search_greenhouse_lever(company_name: str, brave_key: str) -> list:
    """Find Greenhouse / Lever job postings."""
    if not brave_key or not company_name:
        return []
    results = brave_search(
        f'"{company_name}" (site:greenhouse.io OR site:lever.co OR site:ashbyhq.com)',
        brave_key, count=10,
    )
    return results


def analyze_job_postings(postings: list) -> dict:
    """Categorize postings and derive pain signals."""
    categories = {}
    roles = []
    for p in postings:
        title = p.get('title', '')
        cat = categorize_role(title)
        categories[cat] = categories.get(cat, 0) + 1
        roles.append({
            'title': title[:120],
            'url': p.get('url', ''),
            'category': cat,
        })

    pain_signals = []
    if categories.get('sales', 0) >= 2:
        pain_signals.append('Hiring multiple sales reps — weak outbound motion or scaling pain')
    if categories.get('customer_success', 0) >= 2:
        pain_signals.append('Hiring multiple CS roles — potential retention/churn pain')
    if categories.get('operations', 0) >= 1:
        pain_signals.append('Hiring ops/RevOps — process breakdown or scaling automation needs')
    if categories.get('marketing', 0) >= 2:
        pain_signals.append('Hiring multiple marketers — growth/pipeline pain')
    if categories.get('engineering', 0) >= 3:
        pain_signals.append('Hiring 3+ engineers — roadmap behind or platform rebuild')
    if categories.get('ai_ml', 0) >= 1:
        pain_signals.append('Hiring AI/ML — likely building AI features internally')

    return {
        'total_open_roles': len(roles),
        'by_category': categories,
        'roles': roles[:20],
        'pain_signals': pain_signals,
    }


def find_careers_page(home_html: str, all_links: list) -> str:
    """Find company's careers/jobs page."""
    for link in all_links:
        if re.search(r'/careers|/jobs|/join-us|/work-with-us|/open-roles',
                     link.lower()):
            return link
    return ''


def scrape_careers_page(careers_url: str) -> dict:
    """Scrape the company's own careers page for role count."""
    if not careers_url:
        return {}
    result = fetch_url(careers_url, timeout=15)
    html = result.get('html', '')
    if not html:
        return {}
    text = extract_text(html)

    # Count role-like patterns
    role_patterns = [
        r'(engineer|developer|designer|manager|lead|analyst|specialist|'
        r'coordinator|director|representative|executive|marketer|writer)',
    ]
    matches = re.findall(role_patterns[0], text, re.IGNORECASE)
    return {
        'careers_url': careers_url,
        'role_mentions': len(matches),
        'page_length': len(text),
    }


def run(
    company_name: str, home_html: str, all_links: list, brave_key: str,
) -> dict:
    """Run Layer 10: Team + Hiring signals."""
    linkedin_jobs = search_linkedin_jobs(company_name, brave_key)
    ats_jobs = search_greenhouse_lever(company_name, brave_key)

    all_postings = linkedin_jobs + ats_jobs
    analysis = analyze_job_postings(all_postings)

    careers_url = find_careers_page(home_html, all_links)
    careers_scan = scrape_careers_page(careers_url) if careers_url else {}

    return {
        'linkedin_jobs_found': len(linkedin_jobs),
        'ats_jobs_found': len(ats_jobs),
        'hiring_analysis': analysis,
        'careers_page': careers_scan,
    }
