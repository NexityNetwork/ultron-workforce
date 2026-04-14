"""Ultron 11-Layer Business Research Actor — orchestrator.

Pulls input, runs all 11 layers sequentially, writes a structured JSON report
to the Apify dataset.
"""

import asyncio
from apify import Actor

from src.utils import (
    fetch_url, extract_meta, extract_links, normalize_domain, brave_search,
)
from src.layers import (
    identity, website, seo, social, ads, reputation,
    acquisition, retention, tech_stack, team, competitors,
)


async def main():
    async with Actor:
        Actor.log.info('Ultron Research starting…')
        inp = await Actor.get_input() or {}

        company_url = inp.get('company_url', '').strip()
        if not company_url:
            await Actor.fail(status_message='company_url is required')
            return
        if not company_url.startswith('http'):
            company_url = f'https://{company_url}'

        company_name = inp.get('company_name', '').strip()
        linkedin_url = inp.get('linkedin_url', '').strip()
        brave_key = inp.get('brave_api_key', '').strip()
        li_at = inp.get('li_at', '').strip()
        include_competitors = inp.get('include_competitors', True)
        max_pages = inp.get('max_pages_crawl', 15)

        domain = normalize_domain(company_url)
        Actor.log.info(f'Target: {domain}')

        # Fetch homepage once — feeds most layers
        Actor.log.info('Fetching homepage…')
        home = fetch_url(company_url, timeout=25)
        home_html = home.get('html', '')
        home_headers = home.get('headers', {})

        if not home_html:
            await Actor.fail(
                status_message=f'Could not fetch homepage: {company_url}',
            )
            return

        home_meta = extract_meta(home_html)
        all_links = extract_links(home_html, company_url)

        # Auto-discover company_name if missing
        if not company_name:
            company_name = (
                home_meta.get('og:site_name')
                or home_meta.get('application-name')
                or (home_meta.get('title', '').split(' | ')[0]
                    .split(' - ')[0].strip()
                    if home_meta.get('title') else '')
                or domain.split('.')[0].title()
            )
        Actor.log.info(f'Company: {company_name}')

        # Auto-discover LinkedIn URL if missing
        if not linkedin_url and brave_key:
            li_results = brave_search(
                f'"{company_name}" site:linkedin.com/company',
                brave_key, count=3,
            )
            if li_results:
                linkedin_url = li_results[0].get('url', '')
                Actor.log.info(f'Found LinkedIn: {linkedin_url}')

        report = {
            'meta': {
                'company_url': company_url,
                'domain': domain,
                'company_name': company_name,
                'linkedin_url': linkedin_url,
            },
        }

        # Layer 1: Identity
        try:
            Actor.log.info('Layer 1: Identity…')
            report['layer_1_identity'] = identity.run(
                company_url, home_html, home_meta, brave_key,
            )
        except Exception as e:
            Actor.log.warning(f'Layer 1 failed: {e}')
            report['layer_1_identity'] = {'error': str(e)}

        industry = report.get('layer_1_identity', {}).get('industry', 'unknown')

        # Layer 2: Website Intelligence
        try:
            Actor.log.info('Layer 2: Website Intelligence…')
            report['layer_2_website'] = website.run(
                company_url, home_html, max_pages=max_pages,
            )
        except Exception as e:
            Actor.log.warning(f'Layer 2 failed: {e}')
            report['layer_2_website'] = {'error': str(e)}

        # Update all_links with crawled pages' links if available
        crawled_links = report.get('layer_2_website', {}).get(
            'crawled_pages', [],
        )
        if crawled_links:
            all_links = list(set(all_links + crawled_links))

        # Layer 3: SEO + AEO
        try:
            Actor.log.info('Layer 3: SEO + AEO…')
            report['layer_3_seo'] = seo.run(
                company_name, domain, industry, brave_key,
            )
        except Exception as e:
            Actor.log.warning(f'Layer 3 failed: {e}')
            report['layer_3_seo'] = {'error': str(e)}

        # Layer 4: Social Media
        try:
            Actor.log.info('Layer 4: Social Media…')
            report['layer_4_social'] = social.run(
                company_url, company_name, home_html,
                linkedin_url, brave_key, li_at,
            )
        except Exception as e:
            Actor.log.warning(f'Layer 4 failed: {e}')
            report['layer_4_social'] = {'error': str(e)}

        # Layer 5: Paid Ads
        try:
            Actor.log.info('Layer 5: Paid Ads…')
            report['layer_5_ads'] = ads.run(
                company_name, domain, home_html, brave_key,
            )
        except Exception as e:
            Actor.log.warning(f'Layer 5 failed: {e}')
            report['layer_5_ads'] = {'error': str(e)}

        # Layer 6: Reputation
        try:
            Actor.log.info('Layer 6: Reputation…')
            report['layer_6_reputation'] = reputation.run(
                company_name, domain, brave_key,
            )
        except Exception as e:
            Actor.log.warning(f'Layer 6 failed: {e}')
            report['layer_6_reputation'] = {'error': str(e)}

        # Layer 9: Tech Stack (run before 7/8 — those use tech_stack output)
        try:
            Actor.log.info('Layer 9: Tech Stack…')
            report['layer_9_tech_stack'] = tech_stack.run(
                home_html, home_headers, [],
            )
        except Exception as e:
            Actor.log.warning(f'Layer 9 failed: {e}')
            report['layer_9_tech_stack'] = {'error': str(e)}

        stack_for_layers = {
            'tools': report.get('layer_9_tech_stack', {}).get(
                'tools_detected', []
            ),
        }

        # Layer 7: Acquisition Infrastructure
        try:
            Actor.log.info('Layer 7: Acquisition…')
            report['layer_7_acquisition'] = acquisition.run(
                home_html, all_links, stack_for_layers,
                company_name, brave_key,
            )
        except Exception as e:
            Actor.log.warning(f'Layer 7 failed: {e}')
            report['layer_7_acquisition'] = {'error': str(e)}

        # Layer 8: Retention + Support
        try:
            Actor.log.info('Layer 8: Retention…')
            report['layer_8_retention'] = retention.run(
                home_html, all_links, stack_for_layers,
                company_name, brave_key,
            )
        except Exception as e:
            Actor.log.warning(f'Layer 8 failed: {e}')
            report['layer_8_retention'] = {'error': str(e)}

        # Layer 10: Team + Hiring
        try:
            Actor.log.info('Layer 10: Team + Hiring…')
            report['layer_10_team'] = team.run(
                company_name, home_html, all_links, brave_key,
            )
        except Exception as e:
            Actor.log.warning(f'Layer 10 failed: {e}')
            report['layer_10_team'] = {'error': str(e)}

        # Layer 11: Competitors (optional)
        if include_competitors:
            try:
                Actor.log.info('Layer 11: Competitors…')
                report['layer_11_competitors'] = competitors.run(
                    company_name, brave_key,
                )
            except Exception as e:
                Actor.log.warning(f'Layer 11 failed: {e}')
                report['layer_11_competitors'] = {'error': str(e)}
        else:
            report['layer_11_competitors'] = {'skipped': True}

        # Top-level pain signal aggregation (quick summary)
        report['pain_signals_summary'] = aggregate_pain_signals(report)

        Actor.log.info('Writing report to dataset…')
        await Actor.push_data(report)
        Actor.log.info('Done.')


def aggregate_pain_signals(report: dict) -> list:
    """Aggregate top-level pain signals across layers."""
    signals = []

    # From website
    w = report.get('layer_2_website', {})
    if not w.get('pricing', {}).get('has_pricing_page'):
        signals.append('No public pricing page — likely all sales-led, slow')

    # From SEO
    s = report.get('layer_3_seo', {})
    if s.get('indexed_pages', 0) < 10:
        signals.append('Very thin SEO footprint — not invested in organic')

    # From ads
    a = report.get('layer_5_ads', {})
    if a.get('tracking_pixels', {}).get('likely_running_paid_ads'):
        signals.append('Running paid ads — CAC-dependent, needs CRO help')

    # From reputation
    r = report.get('layer_6_reputation', {})
    reddit = r.get('reddit', {})
    if reddit.get('comparison_threads', 0) >= 3:
        signals.append('Heavy comparison threads on Reddit — competitive pressure')

    # From acquisition
    ac = report.get('layer_7_acquisition', {})
    if not ac.get('email_capture', {}).get('email_automation_tools'):
        signals.append('No email automation detected — missing nurture funnel')

    # From retention
    rt = report.get('layer_8_retention', {})
    if not rt.get('support_infrastructure', {}).get('support_tools'):
        signals.append('No support tool — support via email, hard to scale')
    if not rt.get('onboarding', {}).get('has_tutorials'):
        signals.append('No tutorials/onboarding content — activation risk')

    # From team
    t = report.get('layer_10_team', {})
    signals.extend(t.get('hiring_analysis', {}).get('pain_signals', []))

    # From tech stack gaps
    ts = report.get('layer_9_tech_stack', {})
    for gap in ts.get('likely_gaps', []):
        signals.append(gap.get('gap', ''))

    return signals


if __name__ == '__main__':
    asyncio.run(main())
