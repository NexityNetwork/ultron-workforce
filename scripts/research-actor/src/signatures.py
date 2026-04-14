"""Tech stack detection signatures.

Detects tools/platforms from HTML, headers, cookies, and script URLs.
Replaces BuiltWith API - pure pattern matching on scraped page source.
"""

SIGNATURES = {
    # === CRM ===
    'HubSpot': {
        'category': 'crm',
        'html': ['js.hs-scripts.com', 'hs-analytics.net', 'hubspot.com/cms/', '_hsq', 'hs-banner.com'],
        'cookie': ['hubspotutk', '__hssc', '__hstc'],
    },
    'Salesforce Pardot': {
        'category': 'crm',
        'html': ['pi.pardot.com', 'pardot.com/analytics'],
    },
    'Salesforce': {
        'category': 'crm',
        'html': ['salesforceliveagent', 'salesforce.com/embeddedservice'],
    },
    'Pipedrive': {
        'category': 'crm',
        'html': ['pipedrive.com/chatbot', 'pipedriveassets.com'],
    },
    # === MARKETING AUTOMATION ===
    'Marketo': {
        'category': 'marketing_automation',
        'html': ['munchkin.js', 'mktoresp.com'],
    },
    'Mailchimp': {
        'category': 'marketing_automation',
        'html': ['list-manage.com', 'chimpstatic.com', 'mailchimp.com/embed'],
    },
    'Klaviyo': {
        'category': 'marketing_automation',
        'html': ['klaviyo.com/onsite', 'static.klaviyo.com', '_learnq'],
        'cookie': ['__kla_id'],
    },
    'ActiveCampaign': {
        'category': 'marketing_automation',
        'html': ['trackcmp.net', 'activecampaign.com/site'],
    },
    'ConvertKit': {
        'category': 'marketing_automation',
        'html': ['convertkit.com/forms', 'f.convertkit.com'],
    },
    'Drip': {
        'category': 'marketing_automation',
        'html': ['getdrip.com/tags.js', 'tag.getdrip.com'],
    },
    # === ANALYTICS ===
    'Google Analytics (GA4)': {
        'category': 'analytics',
        'html': ['googletagmanager.com/gtag/js', 'G-[A-Z0-9]{6,}', 'gtag(\'config\''],
    },
    'Google Tag Manager': {
        'category': 'analytics',
        'html': ['googletagmanager.com/gtm.js', 'GTM-[A-Z0-9]+'],
    },
    'Segment': {
        'category': 'analytics',
        'html': ['cdn.segment.com', 'analytics.segment'],
    },
    'Mixpanel': {
        'category': 'analytics',
        'html': ['cdn.mxpnl.com', 'mixpanel.com/lib'],
    },
    'Heap': {
        'category': 'analytics',
        'html': ['cdn.heapanalytics.com', 'heap.io/api'],
    },
    'Amplitude': {
        'category': 'analytics',
        'html': ['amplitude.com/libs', 'cdn.amplitude.com'],
    },
    'PostHog': {
        'category': 'analytics',
        'html': ['posthog.com/static/', 'ph_', 'posthog.init'],
    },
    'Plausible': {
        'category': 'analytics',
        'html': ['plausible.io/js', 'plausible.js'],
    },
    'Fathom Analytics': {
        'category': 'analytics',
        'html': ['usefathom.com/script'],
    },
    # === SUPPORT / CHAT ===
    'Intercom': {
        'category': 'support',
        'html': ['widget.intercom.io', 'intercom.io/static', 'intercomSettings'],
    },
    'Zendesk': {
        'category': 'support',
        'html': ['zdassets.com', 'zendesk.com/embeddable'],
    },
    'Freshdesk': {
        'category': 'support',
        'html': ['freshdesk.com/widget', 'freshchat.com'],
    },
    'Crisp': {
        'category': 'support',
        'html': ['client.crisp.chat', 'crisp.chat/l.js'],
    },
    'Drift': {
        'category': 'support',
        'html': ['js.driftt.com', 'drift.com/widget'],
    },
    'Tawk.to': {
        'category': 'support',
        'html': ['embed.tawk.to'],
    },
    'LiveChat': {
        'category': 'support',
        'html': ['cdn.livechatinc.com'],
    },
    'Help Scout': {
        'category': 'support',
        'html': ['beacon-v2.helpscout.net'],
    },
    # === SALES TOOLS ===
    'Outreach.io': {
        'category': 'sales',
        'html': ['api.outreach.io'],
    },
    'Salesloft': {
        'category': 'sales',
        'html': ['salesloft.com'],
    },
    'Calendly': {
        'category': 'sales',
        'html': ['calendly.com/assets', 'assets.calendly.com'],
    },
    'Chili Piper': {
        'category': 'sales',
        'html': ['chilipiper.com/concierge'],
    },
    'Cal.com': {
        'category': 'sales',
        'html': ['cal.com/embed'],
    },
    # === PAYMENT ===
    'Stripe': {
        'category': 'payment',
        'html': ['js.stripe.com', 'checkout.stripe.com', 'stripe.com/v3'],
    },
    'Paddle': {
        'category': 'payment',
        'html': ['cdn.paddle.com/paddle', 'paddle.js'],
    },
    'Chargebee': {
        'category': 'payment',
        'html': ['chargebee.com/static', 'js.chargebee.com'],
    },
    'Recurly': {
        'category': 'payment',
        'html': ['js.recurly.com'],
    },
    'Braintree': {
        'category': 'payment',
        'html': ['js.braintreegateway.com'],
    },
    'PayPal': {
        'category': 'payment',
        'html': ['paypal.com/sdk/js', 'paypalobjects.com'],
    },
    # === PLATFORMS / HOSTING ===
    'Shopify': {
        'category': 'platform',
        'html': ['cdn.shopify.com', 'shopify.com/s/files', 'Shopify.shop'],
    },
    'Webflow': {
        'category': 'platform',
        'html': ['webflow.com', 'webflow.io/js'],
    },
    'WordPress': {
        'category': 'platform',
        'html': ['/wp-content/', '/wp-includes/', 'wp-json'],
    },
    'Squarespace': {
        'category': 'platform',
        'html': ['squarespace.com', 'static1.squarespace.com'],
    },
    'Wix': {
        'category': 'platform',
        'html': ['static.wixstatic.com', 'parastorage.com'],
    },
    'Framer': {
        'category': 'platform',
        'html': ['framerusercontent.com', 'framer.website'],
    },
    'Next.js': {
        'category': 'framework',
        'html': ['_next/static/', '__NEXT_DATA__'],
    },
    'React': {
        'category': 'framework',
        'html': ['react-dom', 'react.production.min'],
    },
    'Vercel': {
        'category': 'hosting',
        'html': ['vercel.app'],
        'header': ['x-vercel', 'server: vercel'],
    },
    'Cloudflare': {
        'category': 'hosting',
        'html': ['cloudflareinsights.com'],
        'header': ['cf-ray', 'server: cloudflare'],
    },
    # === COMMUNITY / COMMS ===
    'Discord': {
        'category': 'community',
        'html': ['discord.gg/', 'discord.com/invite'],
    },
    'Slack': {
        'category': 'community',
        'html': ['slack.com/join', 'slack-edge.com'],
    },
    'Circle': {
        'category': 'community',
        'html': ['circle.so/'],
    },
    # === AI / LLM ===
    'OpenAI': {
        'category': 'ai',
        'html': ['api.openai.com', 'openai.com/v1'],
    },
    'Anthropic': {
        'category': 'ai',
        'html': ['api.anthropic.com'],
    },
    'ChatBase': {
        'category': 'ai',
        'html': ['chatbase.co/embed'],
    },
    # === ADS / TRACKING ===
    'Meta Pixel': {
        'category': 'ads',
        'html': ['connect.facebook.net/en_US/fbevents.js', 'fbq(\'init\''],
    },
    'Google Ads': {
        'category': 'ads',
        'html': ['googleadservices.com/pagead/conversion', 'AW-[0-9]+'],
    },
    'LinkedIn Insight': {
        'category': 'ads',
        'html': ['snap.licdn.com/li.lms-analytics', '_linkedin_partner_id'],
    },
    'TikTok Pixel': {
        'category': 'ads',
        'html': ['analytics.tiktok.com/i18n/pixel'],
    },
    # === A/B TESTING / CRO ===
    'Hotjar': {
        'category': 'cro',
        'html': ['static.hotjar.com', 'hotjar.com/c/hotjar'],
    },
    'FullStory': {
        'category': 'cro',
        'html': ['fullstory.com/s/fs.js'],
    },
    'Optimizely': {
        'category': 'cro',
        'html': ['cdn.optimizely.com'],
    },
    'VWO': {
        'category': 'cro',
        'html': ['dev.visualwebsiteoptimizer.com'],
    },
    # === CONTENT / CMS ===
    'Contentful': {
        'category': 'cms',
        'html': ['ctfassets.net', 'contentful.com'],
    },
    'Sanity': {
        'category': 'cms',
        'html': ['cdn.sanity.io'],
    },
    'Prismic': {
        'category': 'cms',
        'html': ['prismic.io'],
    },
    'Ghost': {
        'category': 'cms',
        'html': ['ghost.io', 'ghost.org'],
    },
    # === FORMS ===
    'Typeform': {
        'category': 'forms',
        'html': ['embed.typeform.com', 'typeform.com/widget'],
    },
    'Tally': {
        'category': 'forms',
        'html': ['tally.so/widgets'],
    },
    'Google Forms': {
        'category': 'forms',
        'html': ['docs.google.com/forms'],
    },
    # === SEARCH ===
    'Algolia': {
        'category': 'search',
        'html': ['algolia.net', 'algoliasearch'],
    },
    # === VIDEO ===
    'Vimeo': {
        'category': 'video',
        'html': ['vimeo.com/video', 'player.vimeo.com'],
    },
    'Wistia': {
        'category': 'video',
        'html': ['fast.wistia.com', 'wistia.net'],
    },
    'Loom': {
        'category': 'video',
        'html': ['loom.com/embed'],
    },
    'YouTube Embed': {
        'category': 'video',
        'html': ['youtube.com/embed', 'youtube-nocookie.com'],
    },
    # === REVIEWS ===
    'Trustpilot Widget': {
        'category': 'reviews_widget',
        'html': ['widget.trustpilot.com'],
    },
    'G2 Widget': {
        'category': 'reviews_widget',
        'html': ['g2.com/widget'],
    },
    'Capterra Widget': {
        'category': 'reviews_widget',
        'html': ['capterra.com/p/'],
    },
    # === AFFILIATE / PARTNERSHIPS ===
    'PartnerStack': {
        'category': 'affiliate',
        'html': ['partnerstack.com/embed'],
    },
    'Rewardful': {
        'category': 'affiliate',
        'html': ['r.wdfl.co', 'rewardful.js'],
    },
    'FirstPromoter': {
        'category': 'affiliate',
        'html': ['firstpromoter.com/fprom'],
    },
    'Impact': {
        'category': 'affiliate',
        'html': ['impact.com/campaign'],
    },
}


def detect_stack(html: str, headers: dict = None, cookies: list = None) -> dict:
    """Detect tech stack from HTML, headers, and cookies.

    Returns dict mapping category → list of detected tools.
    """
    import re

    detected = []
    html_lower = html.lower() if html else ''
    header_str = ' '.join(f'{k}: {v}' for k, v in (headers or {}).items()).lower()
    cookie_names = [c.lower() for c in (cookies or [])]

    for tool, sig in SIGNATURES.items():
        matched = False
        for pattern in sig.get('html', []):
            # Support regex patterns (detect via brackets/quantifiers)
            if any(c in pattern for c in ['[', '(', '+', '\\']):
                try:
                    if re.search(pattern, html, re.IGNORECASE):
                        matched = True
                        break
                except re.error:
                    if pattern.lower() in html_lower:
                        matched = True
                        break
            elif pattern.lower() in html_lower:
                matched = True
                break
        if not matched:
            for pattern in sig.get('header', []):
                if pattern.lower() in header_str:
                    matched = True
                    break
        if not matched:
            for pattern in sig.get('cookie', []):
                if any(pattern.lower() in c for c in cookie_names):
                    matched = True
                    break
        if matched:
            detected.append({'tool': tool, 'category': sig['category']})

    # Group by category
    by_category = {}
    for d in detected:
        by_category.setdefault(d['category'], []).append(d['tool'])

    return {
        'tools': [d['tool'] for d in detected],
        'by_category': by_category,
        'count': len(detected),
    }
