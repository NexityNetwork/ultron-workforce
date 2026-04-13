"""Ultron Twitter Angel Scraper — Official API v6 (Broad Queries).

Uses Twitter API v2 search/recent with Bearer Token.
Broader queries to maximize profile discovery in 7-day window.
"""

import asyncio
import json
import re
import urllib.request
import urllib.error
import urllib.parse
import base64
import time

from apify import Actor

# Broad queries — designed to match more tweets in a 7-day window
ANGEL_QUERIES = [
    # High-volume angel/investor queries
    'angel investor',
    'angel investing',
    'angel investor AI',
    'angel investor SaaS',
    'angel investor startup',
    'seed investor',
    'pre-seed investor',
    'writing checks startup',
    'angel portfolio',
    'invest in founders',
    'backing founders',
    'angel round',
    'angel deal',
    'first check investor',
    'micro VC',
    'solo GP',
    'emerging fund manager',
    'syndicate lead',
    # Indie hacker / operator angel queries
    'indie hacker investor',
    'bootstrapped founder angel',
    'operator investor',
    'founder angel',
    'angel check size',
    # Activity signals
    'just invested seed',
    'excited to announce investment',
    'proud to invest',
    'joined cap table',
    'new angel investment',
    'backed my first startup',
    'led the round',
    'participated in round',
    # Community / network signals
    'angel group',
    'angel network',
    'angel syndicate',
    'scout program',
    'venture scout',
    # AI-specific
    'invest AI startup',
    'AI seed funding',
    'AI pre-seed',
    'funding AI companies',
    'AI angel',
]

ANGEL_BIO_KEYWORDS = {
    'angel', 'investor', 'writing checks', 'backing founders',
    'angel portfolio', 'seed investor', 'pre-seed', 'invest in founders',
    'angel investing', 'check writer', 'startup investor', 'scout',
    'micro fund', 'indie', 'bootstrapped', 'founder', 'operator',
    'venture', 'vc', 'fund', 'portfolio', 'syndicate', 'gp',
    'capital', 'invest', 'backed', 'seed', 'series a',
}

EXCLUDE_BIO_KEYWORDS = {
    'venture capital firm', 'institutional investor', 'fund of funds',
    'crypto scam', 'dm for promo', 'nft giveaway', 'airdrop',
}


def get_bearer(consumer_key: str, consumer_secret: str) -> str:
    """Generate Bearer Token from consumer credentials."""
    creds = base64.b64encode(f'{consumer_key}:{consumer_secret}'.encode()).decode()
    req = urllib.request.Request(
        'https://api.x.com/oauth2/token',
        data=b'grant_type=client_credentials',
        headers={
            'Authorization': f'Basic {creds}',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
    )
    resp = urllib.request.urlopen(req, timeout=15)
    data = json.loads(resp.read().decode('utf-8'))
    return data.get('access_token', '')


def search_tweets(bearer: str, query: str, next_token: str = None) -> dict:
    """Search recent tweets via v2 API."""
    params = {
        'query': f'{query} -is:retweet lang:en',
        'max_results': '100',
        'tweet.fields': 'author_id,created_at,public_metrics',
        'expansions': 'author_id',
        'user.fields': 'name,username,description,public_metrics,location,url,entities,profile_image_url,created_at,verified',
    }
    if next_token:
        params['next_token'] = next_token

    url = f'https://api.x.com/2/tweets/search/recent?{urllib.parse.urlencode(params)}'
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {bearer}'})

    try:
        resp = urllib.request.urlopen(req, timeout=20)
        return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        if e.code == 429:
            reset = e.headers.get('x-rate-limit-reset', '')
            wait = max(int(reset) - int(time.time()), 5) if reset else 60
            return {'rate_limited': True, 'wait': min(wait, 120)}
        elif e.code == 402:
            return {'credits_depleted': True, 'error': body[:200]}
        return {'error': f'HTTP {e.code}: {body[:200]}'}
    except Exception as e:
        return {'error': str(e)}


def parse_user(user: dict) -> dict:
    """Parse v2 user object into our format."""
    pm = user.get('public_metrics', {})
    profile = {
        'id': user.get('id', ''),
        'name': user.get('name', ''),
        'handle': user.get('username', ''),
        'bio': user.get('description', ''),
        'followers': pm.get('followers_count', 0),
        'following': pm.get('following_count', 0),
        'tweets_count': pm.get('tweet_count', 0),
        'location': user.get('location', ''),
        'website': '',
        'verified': user.get('verified', False),
        'created_at': user.get('created_at', ''),
        'profile_url': f"https://x.com/{user.get('username', '')}",
        'profile_image': user.get('profile_image_url', '').replace('_normal', ''),
    }

    # Extract website from entities
    entities = user.get('entities', {})
    url_entity = entities.get('url', {})
    urls = url_entity.get('urls', [])
    if urls:
        profile['website'] = urls[0].get('expanded_url', urls[0].get('url', ''))

    # Bio URLs
    desc_entity = entities.get('description', {})
    desc_urls = desc_entity.get('urls', [])
    profile['bio_urls'] = [u.get('expanded_url', u.get('url', '')) for u in desc_urls]

    # Email from bio
    email_match = re.search(
        r'[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
        profile['bio']
    )
    if email_match:
        profile['email_from_bio'] = email_match.group(0)

    # LinkedIn URL
    all_urls = [profile['website']] + profile.get('bio_urls', [])
    for url in all_urls:
        if url and 'linkedin.com' in url:
            profile['linkedin_url'] = url
            break

    return profile


def score_angel(user: dict) -> float:
    """Score angel investor likelihood."""
    bio = (user.get('bio', '') or '').lower()
    score = 0.0
    
    # Bio keyword matching (weighted)
    high_value = ['angel investor', 'angel investing', 'writing checks', 'seed investor',
                  'pre-seed', 'check writer', 'angel portfolio', 'backing founders']
    medium_value = ['investor', 'invest', 'venture', 'fund', 'capital', 'portfolio',
                    'seed', 'founder', 'operator', 'syndicate', 'gp']
    low_value = ['startup', 'indie', 'bootstrapped', 'saas', 'ai', 'tech']
    
    for kw in high_value:
        if kw in bio:
            score += 0.15
    for kw in medium_value:
        if kw in bio:
            score += 0.08
    for kw in low_value:
        if kw in bio:
            score += 0.03
    
    if user.get('website'):
        score += 0.08
    f = user.get('followers', 0)
    if 1000 <= f <= 100000:
        score += 0.12
    elif 500 <= f <= 1000:
        score += 0.05
    elif f > 100000:
        score += 0.03
    if user.get('linkedin_url'):
        score += 0.1
    if user.get('email_from_bio'):
        score += 0.15
    return min(score, 1.0)


async def main() -> None:
    async with Actor:
        Actor.log.info('=== ULTRON TWITTER ANGEL SCRAPER v6.0 (Broad Queries) ===')

        actor_input = await Actor.get_input() or {}
        consumer_key = actor_input.get('consumer_key', '')
        consumer_secret = actor_input.get('consumer_secret', '')
        min_followers = actor_input.get('min_followers') or 100
        max_followers = actor_input.get('max_followers') or 1000000
        max_pages = actor_input.get('max_pages') or 3
        custom_queries = actor_input.get('queries', [])

        if not consumer_key or not consumer_secret:
            Actor.log.error('consumer_key and consumer_secret are required!')
            return

        # Generate Bearer Token
        Actor.log.info('Generating Bearer Token...')
        try:
            bearer = get_bearer(consumer_key, consumer_secret)
            Actor.log.info(f'Bearer OK: {bearer[:20]}...')
        except Exception as e:
            Actor.log.error(f'Failed to get Bearer Token: {e}')
            return

        queries = custom_queries if custom_queries else ANGEL_QUERIES
        Actor.log.info(f'Queries: {len(queries)} | Followers: {min_followers}-{max_followers} | Pages/query: {max_pages}')

        seen_ids = set()
        total_found = 0
        total_tweets_read = 0
        credits_depleted = False
        rate_limit_count = 0

        for qi, query in enumerate(queries):
            if credits_depleted:
                break
            if rate_limit_count >= 3:
                Actor.log.warning('Too many rate limits, stopping to conserve credits')
                break

            Actor.log.info(f'\n[{qi+1}/{len(queries)}] Query: {query}')
            next_token = None

            for page in range(max_pages):
                result = search_tweets(bearer, query, next_token)

                # Handle rate limiting with retry
                if result.get('rate_limited'):
                    wait = result['wait']
                    Actor.log.warning(f'  Rate limited, waiting {wait}s...')
                    rate_limit_count += 1
                    await asyncio.sleep(wait)
                    result = search_tweets(bearer, query, next_token)
                    if result.get('rate_limited'):
                        Actor.log.warning('  Still rate limited, skipping query')
                        break

                if result.get('credits_depleted'):
                    Actor.log.warning(f'  CREDITS DEPLETED! Total tweets read: {total_tweets_read}')
                    credits_depleted = True
                    break

                if result.get('error'):
                    Actor.log.error(f'  Error: {result["error"]}')
                    break

                tweets = result.get('data', [])
                users_data = result.get('includes', {}).get('users', [])
                total_tweets_read += len(tweets)

                Actor.log.info(f'  Page {page+1}: {len(tweets)} tweets, {len(users_data)} users (total read: {total_tweets_read})')

                new_count = 0
                for user_data in users_data:
                    user = parse_user(user_data)
                    uid = user['id']

                    if uid in seen_ids:
                        continue
                    seen_ids.add(uid)

                    if user['followers'] < min_followers or user['followers'] > max_followers:
                        continue

                    bio_lower = (user.get('bio', '') or '').lower()
                    if any(kw in bio_lower for kw in EXCLUDE_BIO_KEYWORDS):
                        continue

                    user['angel_score'] = score_angel(user)
                    user['source_query'] = query

                    await Actor.push_data(user)
                    new_count += 1
                    total_found += 1
                    
                    if user['angel_score'] >= 0.3:
                        Actor.log.info(f'    ★ {user["name"]} (@{user["handle"]}) | {user["followers"]} followers | score: {user["angel_score"]:.2f}')
                    elif new_count <= 5:
                        Actor.log.info(f'    + {user["name"]} (@{user["handle"]}) | {user["followers"]} followers | score: {user["angel_score"]:.2f}')

                if new_count > 5:
                    Actor.log.info(f'    ... and {new_count - 5} more')

                # Pagination
                meta = result.get('meta', {})
                next_token = meta.get('next_token')
                if not next_token:
                    break

                await asyncio.sleep(1)

            # Brief pause between queries
            await asyncio.sleep(1)

        Actor.log.info(f'\n=== DONE ===')
        Actor.log.info(f'Total unique profiles: {total_found}')
        Actor.log.info(f'Total tweets scanned: {total_tweets_read}')
        Actor.log.info(f'Unique users seen: {len(seen_ids)}')
        if credits_depleted:
            Actor.log.warning('Stopped early due to credits depletion')


asyncio.run(main())
