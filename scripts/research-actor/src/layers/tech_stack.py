"""Layer 9: Operations + Tech Stack.

Thin wrapper around signatures.detect_stack() that categorizes tools into
operational groups: CRM, marketing automation, analytics, support, payment,
project management, etc. Also scores operational maturity.
"""

from src.signatures import detect_stack


CATEGORY_WEIGHTS = {
    'crm': 3,
    'marketing_automation': 3,
    'analytics': 2,
    'support': 2,
    'sales': 3,
    'payment': 2,
    'forms': 1,
    'cms': 1,
    'ai': 2,
    'ads': 2,
    'cro': 2,
    'reviews_widget': 1,
    'community': 1,
    'affiliate': 1,
    'search': 1,
    'video': 1,
    'platform': 1,
    'framework': 1,
    'hosting': 1,
}


def score_operational_maturity(by_category: dict) -> dict:
    """Score operational maturity based on category coverage."""
    present = {c: len(tools) for c, tools in by_category.items() if tools}
    weighted = sum(
        CATEGORY_WEIGHTS.get(c, 0) for c, tools in by_category.items() if tools
    )
    max_weight = sum(CATEGORY_WEIGHTS.values())
    return {
        'categories_present': list(present.keys()),
        'category_count': len(present),
        'weighted_score': weighted,
        'max_possible': max_weight,
        'maturity_pct': round(100 * weighted / max_weight, 1) if max_weight else 0,
    }


def identify_gaps(by_category: dict) -> list:
    """Identify likely operational gaps (missing categories that high-ops companies have)."""
    gaps = []
    critical = {
        'crm': 'No CRM detected — likely using spreadsheets or email for customer tracking',
        'marketing_automation': 'No email marketing/nurture tool — manual outreach only',
        'analytics': 'No analytics detected — operating without data visibility',
        'support': 'No support tool — support via email/inbox only',
    }
    for cat, gap_msg in critical.items():
        if not by_category.get(cat):
            gaps.append({'category': cat, 'gap': gap_msg})
    return gaps


def run(home_html: str, response_headers: dict, cookies: list) -> dict:
    """Run Layer 9: Operations + Tech Stack audit."""
    stack = detect_stack(home_html, response_headers or {}, cookies or [])
    maturity = score_operational_maturity(stack.get('by_category', {}))
    gaps = identify_gaps(stack.get('by_category', {}))
    return {
        'tools_detected': stack.get('tools', []),
        'tool_count': stack.get('count', 0),
        'by_category': stack.get('by_category', {}),
        'operational_maturity': maturity,
        'likely_gaps': gaps,
    }
