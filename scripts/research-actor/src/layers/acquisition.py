"""Layer 7: Customer Acquisition Infrastructure.

Outbound evidence, partnership signals, referral programs, email capture,
sales process infrastructure.
"""

import re
from src.utils import extract_text, extract_links, brave_search


def detect_outbound_evidence(
    home_html: str, all_links: list, tech_stack: dict,
    company_name: str, brave_key: str,
) -> dict:
    """Detect outbound sales infrastructure."""
    tools = tech_stack.get('tools', [])
    has_outreach_tool = any(
        t in tools for t in ['Outreach.io', 'Salesloft']
    )
    has_sdr_job = False
    if brave_key and company_name:
        sdr_results = brave_search(
            f'"{company_name}" (SDR OR BDR OR "sales development") '
            f'(site:linkedin.com/jobs OR site:greenhouse.io OR site:lever.co)',
            brave_key, count=5,
        )
        has_sdr_job = len(sdr_results) > 0

    return {
        'has_outreach_tool': has_outreach_tool,
        'outreach_tools': [t for t in tools if t in ['Outreach.io', 'Salesloft']],
        'hiring_sdr_or_bdr': has_sdr_job,
    }


def detect_partnerships(home_html: str, all_links: list) -> dict:
    """Detect affiliate, partner, co-marketing programs."""
    l = [link.lower() for link in all_links]
    has_affiliate_page = any(
        re.search(r'/affiliate|/partners|/partnership', x) for x in l
    )
    has_referral_page = any(
        re.search(r'/referral|/refer-a-friend', x) for x in l
    )
    has_integrations_page = any(
        re.search(r'/integrations|/app-store|/marketplace', x) for x in l
    )
    text = extract_text(home_html).lower()
    mentions_partner = bool(re.search(
        r'partner\s+program|become\s+a\s+partner|affiliate\s+program',
        text,
    ))
    return {
        'has_affiliate_page': has_affiliate_page,
        'has_referral_page': has_referral_page,
        'has_integrations_page': has_integrations_page,
        'mentions_partner_program': mentions_partner,
    }


def detect_email_capture(home_html: str, tech_stack: dict) -> dict:
    """Detect email capture and nurture infrastructure."""
    tools = tech_stack.get('tools', [])
    email_automation_tools = [t for t in tools if t in [
        'HubSpot', 'Marketo', 'Mailchimp', 'Klaviyo', 'ActiveCampaign',
        'ConvertKit', 'Drip',
    ]]
    has_exit_intent = bool(re.search(r'exit.?intent|exitintent', home_html, re.IGNORECASE))
    has_popup = bool(re.search(
        r'popup|modal.*?email|overlay.*?signup',
        home_html, re.IGNORECASE,
    ))
    has_lead_magnet = bool(re.search(
        r'free\s+(?:ebook|guide|template|download)|'
        r'download\s+(?:the|our)\s+(?:free|guide|ebook|template)',
        home_html, re.IGNORECASE,
    ))
    return {
        'email_automation_tools': email_automation_tools,
        'has_exit_intent': has_exit_intent,
        'has_popup': has_popup,
        'has_lead_magnet': has_lead_magnet,
    }


def detect_sales_process(home_html: str, all_links: list, tech_stack: dict) -> dict:
    """Detect booking tools, demo pages, proposal infrastructure."""
    tools = tech_stack.get('tools', [])
    booking_tools = [t for t in tools if t in [
        'Calendly', 'Chili Piper', 'Cal.com',
    ]]
    l = [link.lower() for link in all_links]
    has_demo_page = any('/demo' in x or '/book-a-demo' in x for x in l)
    has_contact_sales = any(
        '/contact-sales' in x or '/talk-to-sales' in x for x in l
    )
    has_calendly_embed = 'calendly.com/' in home_html.lower()
    return {
        'booking_tools': booking_tools,
        'has_demo_page': has_demo_page,
        'has_contact_sales_page': has_contact_sales,
        'has_embedded_scheduler': has_calendly_embed or len(booking_tools) > 0,
    }


def run(
    home_html: str, all_links: list, tech_stack: dict,
    company_name: str, brave_key: str,
) -> dict:
    """Run Layer 7: Customer Acquisition Infrastructure."""
    return {
        'outbound': detect_outbound_evidence(
            home_html, all_links, tech_stack, company_name, brave_key,
        ),
        'partnerships': detect_partnerships(home_html, all_links),
        'email_capture': detect_email_capture(home_html, tech_stack),
        'sales_process': detect_sales_process(home_html, all_links, tech_stack),
    }
