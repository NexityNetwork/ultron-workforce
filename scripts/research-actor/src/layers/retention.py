"""Layer 8: Retention + Support infrastructure.

Support tools, onboarding signals, community, subscription model, churn signals.
"""

import re
from src.utils import extract_text, brave_search


def detect_support_infra(home_html: str, tech_stack: dict, all_links: list) -> dict:
    """Detect support tooling + visible support channels."""
    tools = tech_stack.get('tools', [])
    support_tools = [t for t in tools if t in [
        'Intercom', 'Zendesk', 'Freshdesk', 'Crisp', 'Drift',
        'Tawk.to', 'LiveChat', 'Help Scout',
    ]]
    l = [link.lower() for link in all_links]
    has_help_center = any(
        re.search(r'/help|/support|/kb|knowledge-?base', x) for x in l
    )
    has_live_chat = len(support_tools) > 0 or bool(
        re.search(r'live\s+chat|chat\s+with\s+us', home_html, re.IGNORECASE)
    )
    has_ticketing = any(t in ['Zendesk', 'Freshdesk', 'Intercom', 'Help Scout']
                       for t in tools)
    return {
        'support_tools': support_tools,
        'has_help_center': has_help_center,
        'has_live_chat': has_live_chat,
        'has_ticketing': has_ticketing,
    }


def detect_onboarding(home_html: str, all_links: list) -> dict:
    """Detect onboarding content — tutorials, guides, videos."""
    l = [link.lower() for link in all_links]
    text = extract_text(home_html).lower()
    has_tutorials = any(
        re.search(r'/tutorial|/getting-started|/quickstart|/guides', x) for x in l
    )
    has_onboarding_video = bool(re.search(
        r'onboarding\s+video|getting\s+started\s+video|'
        r'watch\s+the\s+demo|product\s+tour',
        text,
    ))
    has_templates = any(
        re.search(r'/templates|/examples|/sample', x) for x in l
    )
    return {
        'has_tutorials': has_tutorials,
        'has_onboarding_video': has_onboarding_video,
        'has_templates_or_examples': has_templates,
    }


def detect_community(home_html: str, all_links: list, tech_stack: dict) -> dict:
    """Detect user community (Slack/Discord for customers, forum, etc.)."""
    tools = tech_stack.get('tools', [])
    text = extract_text(home_html).lower()
    l = [link.lower() for link in all_links]
    return {
        'has_discord': 'discord' in tools or bool(
            re.search(r'discord\.gg|discord\.com/invite', home_html)
        ),
        'has_slack_community': bool(
            re.search(r'slack.*?community|join.*?slack', text)
        ),
        'has_circle_community': 'Circle' in tools,
        'has_forum_page': any('/forum' in x or '/community' in x for x in l),
    }


def detect_subscription_signals(home_html: str, tech_stack: dict) -> dict:
    """Detect recurring revenue model signals."""
    tools = tech_stack.get('tools', [])
    has_subscription_tool = any(
        t in tools for t in ['Chargebee', 'Recurly', 'Stripe', 'Paddle']
    )
    text = extract_text(home_html).lower()
    mentions_subscription = bool(re.search(
        r'monthly\s+plan|annual\s+plan|subscription|per\s+(?:user|month|year)',
        text,
    ))
    has_cancel_anytime = 'cancel anytime' in text or 'no long-term contract' in text
    return {
        'has_subscription_billing_tool': has_subscription_tool,
        'mentions_subscription': mentions_subscription,
        'signals_easy_cancel': has_cancel_anytime,
    }


def check_churn_signals(company_name: str, brave_key: str) -> dict:
    """Search for churn/cancel discussions in reviews and forums."""
    if not brave_key or not company_name:
        return {}

    # Search for negative signals
    cancel_results = brave_search(
        f'"{company_name}" ("cancel my subscription" OR "switched from" OR "churned")',
        brave_key, count=5,
    )
    return {
        'negative_signal_count': len(cancel_results),
        'sample_signals': [
            {'url': r['url'], 'title': r.get('title', '')[:100]}
            for r in cancel_results[:3]
        ],
    }


def run(
    home_html: str, all_links: list, tech_stack: dict,
    company_name: str, brave_key: str,
) -> dict:
    """Run Layer 8: Retention + Support audit."""
    return {
        'support_infrastructure': detect_support_infra(
            home_html, tech_stack, all_links,
        ),
        'onboarding': detect_onboarding(home_html, all_links),
        'community': detect_community(home_html, all_links, tech_stack),
        'subscription_model': detect_subscription_signals(home_html, tech_stack),
        'churn_signals': check_churn_signals(company_name, brave_key),
    }
