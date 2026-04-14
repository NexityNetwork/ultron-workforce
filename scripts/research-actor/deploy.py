"""Deploy the Ultron 11-Layer Research Actor to Apify.

Required env vars:
    APIFY_TOKEN         - Apify API token
    APIFY_ACTOR_ID      - Existing actor ID (create an empty actor in Apify console first)
    BRAVE_API_KEY       - Brave Search API key (for test run)
    LI_AT               - LinkedIn li_at cookie (optional, for test run)
    TARGET_URL          - URL to research (for test run; if unset, only deploys)

Usage:
    python3 deploy.py
"""

import json
import os
import sys
import time
import urllib.error
import urllib.request

API_TOKEN = os.environ.get('APIFY_TOKEN', '')
ACTOR_ID = os.environ.get('APIFY_ACTOR_ID', '')
BRAVE_KEY = os.environ.get('BRAVE_API_KEY', '')
LI_AT = os.environ.get('LI_AT', '')
TARGET_URL = os.environ.get('TARGET_URL', '')

if not API_TOKEN or not ACTOR_ID:
    print('Missing required env: APIFY_TOKEN, APIFY_ACTOR_ID')
    sys.exit(1)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


def read(path):
    with open(path) as f:
        return f.read()


def api_call(method, url, data=None):
    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'Content-Type': 'application/json',
    }
    body = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(req, timeout=120)
        raw = resp.read().decode('utf-8')
        try:
            return resp.status, json.loads(raw)
        except Exception:
            return resp.status, raw
    except urllib.error.HTTPError as e:
        raw = e.read().decode('utf-8')
        print(f'HTTP {e.code}: {raw[:500]}')
        return e.code, raw


BASE = f'https://api.apify.com/v2/acts/{ACTOR_ID}'

# Collect all source files
SOURCE_FILES = [
    ('Dockerfile', 'Dockerfile'),
    ('requirements.txt', 'requirements.txt'),
    ('.actor/actor.json', '.actor/actor.json'),
    ('src/__init__.py', 'src/__init__.py'),
    ('src/__main__.py', 'src/__main__.py'),
    ('src/utils.py', 'src/utils.py'),
    ('src/signatures.py', 'src/signatures.py'),
    ('src/layers/__init__.py', 'src/layers/__init__.py'),
    ('src/layers/identity.py', 'src/layers/identity.py'),
    ('src/layers/website.py', 'src/layers/website.py'),
    ('src/layers/seo.py', 'src/layers/seo.py'),
    ('src/layers/social.py', 'src/layers/social.py'),
    ('src/layers/ads.py', 'src/layers/ads.py'),
    ('src/layers/reputation.py', 'src/layers/reputation.py'),
    ('src/layers/acquisition.py', 'src/layers/acquisition.py'),
    ('src/layers/retention.py', 'src/layers/retention.py'),
    ('src/layers/tech_stack.py', 'src/layers/tech_stack.py'),
    ('src/layers/team.py', 'src/layers/team.py'),
    ('src/layers/competitors.py', 'src/layers/competitors.py'),
]

source_files = [
    {
        'name': remote,
        'format': 'TEXT',
        'content': read(os.path.join(SCRIPT_DIR, local)),
    }
    for remote, local in SOURCE_FILES
]

print(f'=== UPLOADING {len(source_files)} files ===')
status, resp = api_call(
    'PUT',
    f'{BASE}/versions/1.0?token={API_TOKEN}',
    {'sourceType': 'SOURCE_FILES', 'sourceFiles': source_files, 'buildTag': 'latest'},
)
print(f'Upload: {status}')
if status != 200:
    sys.exit(1)

print('\n=== BUILDING ===')
status, resp = api_call('POST', f'{BASE}/builds?token={API_TOKEN}&version=1.0')
if status not in (200, 201):
    sys.exit(1)
build_id = resp.get('data', {}).get('id', '')
print(f'Build: {build_id}')

for i in range(60):
    time.sleep(5)
    status, resp = api_call(
        'GET',
        f'https://api.apify.com/v2/actor-builds/{build_id}?token={API_TOKEN}',
    )
    bs = resp.get('data', {}).get('status', '') if isinstance(resp, dict) else '?'
    print(f'  [{(i+1)*5}s] {bs}')
    if bs == 'SUCCEEDED':
        break
    if bs in ('FAILED', 'ABORTED'):
        print('Build failed — fetching log…')
        log_url = f'https://api.apify.com/v2/actor-builds/{build_id}/log?token={API_TOKEN}'
        _, log = api_call('GET', log_url)
        print(log[-3000:] if isinstance(log, str) else log)
        sys.exit(1)

if not TARGET_URL:
    print('\n=== DEPLOYED (no TARGET_URL — skipping test run) ===')
    sys.exit(0)

print(f'\n=== RUNNING on {TARGET_URL} ===')
status, resp = api_call(
    'POST',
    f'{BASE}/runs?token={API_TOKEN}&timeout=1800',
    {
        'company_url': TARGET_URL,
        'brave_api_key': BRAVE_KEY,
        'li_at': LI_AT,
        'include_competitors': True,
        'max_pages_crawl': 15,
    },
)
if status not in (200, 201):
    sys.exit(1)
run_id = resp.get('data', {}).get('id', '')
print(f'Run ID: {run_id}')

for i in range(180):
    time.sleep(10)
    status, resp = api_call(
        'GET',
        f'https://api.apify.com/v2/actor-runs/{run_id}?token={API_TOKEN}',
    )
    d = resp.get('data', {}) if isinstance(resp, dict) else {}
    rs = d.get('status', '?')
    usage = d.get('usageTotalUsd', 0)
    ds_id = d.get('defaultDatasetId', '')
    print(f'  [{(i+1)*10}s] {rs} (${usage:.4f})')

    if rs == 'SUCCEEDED':
        items_url = (
            f'https://api.apify.com/v2/datasets/{ds_id}/items'
            f'?token={API_TOKEN}&limit=10'
        )
        _, items = api_call('GET', items_url)
        out_path = os.path.join(SCRIPT_DIR, 'latest_report.json')
        with open(out_path, 'w') as f:
            json.dump(items, f, indent=2)
        print(f'\nSaved report → {out_path}')
        break

    if rs in ('FAILED', 'ABORTED', 'TIMED-OUT'):
        print(f'Run ended: {rs}')
        break

print('\n=== DONE ===')
