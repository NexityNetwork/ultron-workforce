"""Deploy and run the Twitter Angel Scraper on Apify.

Usage:
    Set env vars APIFY_TOKEN, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET
    then run: python3 deploy-twitter.py
"""

import json
import os
import sys
import urllib.request
import urllib.error
import time

API_TOKEN = os.environ.get("APIFY_TOKEN", "")
ACTOR_ID = os.environ.get("APIFY_ACTOR_ID", "")
CONSUMER_KEY = os.environ.get("TWITTER_CONSUMER_KEY", "")
CONSUMER_SECRET = os.environ.get("TWITTER_CONSUMER_SECRET", "")

if not all([API_TOKEN, ACTOR_ID, CONSUMER_KEY, CONSUMER_SECRET]):
    print("Missing env vars: APIFY_TOKEN, APIFY_ACTOR_ID, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET")
    sys.exit(1)


def read_file(path):
    with open(path, "r") as f:
        return f.read()


def api_call(method, url, data=None):
    headers = {"Authorization": f"Bearer {API_TOKEN}", "Content-Type": "application/json"}
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(req, timeout=120)
        raw = resp.read().decode("utf-8")
        try:
            return resp.status, json.loads(raw)
        except Exception:
            return resp.status, raw
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8")
        print(f"HTTP {e.code}: {raw[:500]}")
        return e.code, raw


BASE = f"https://api.apify.com/v2/acts/{ACTOR_ID}"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ANGELS_DIR = os.path.join(SCRIPT_DIR, "twitter-angels")

# Upload source
print("=== UPLOADING ===")
source_files = [
    {"name": "src/__init__.py", "format": "TEXT", "content": read_file(os.path.join(ANGELS_DIR, "__init__.py"))},
    {"name": "src/__main__.py", "format": "TEXT", "content": read_file(os.path.join(ANGELS_DIR, "__main__.py"))},
    {"name": "requirements.txt", "format": "TEXT", "content": read_file(os.path.join(ANGELS_DIR, "requirements.txt"))},
    {"name": "Dockerfile", "format": "TEXT", "content": read_file(os.path.join(ANGELS_DIR, "Dockerfile"))},
    {"name": ".actor/actor.json", "format": "TEXT", "content": read_file(os.path.join(ANGELS_DIR, "actor.json"))},
]
status, resp = api_call("PUT", f"{BASE}/versions/1.0?token={API_TOKEN}", {
    "sourceType": "SOURCE_FILES", "sourceFiles": source_files, "buildTag": "latest"
})
print(f"Upload: {status}")
if status != 200:
    sys.exit(1)

# Build
print("\n=== BUILDING ===")
status, resp = api_call("POST", f"{BASE}/builds?token={API_TOKEN}&version=1.0")
if status not in (200, 201):
    sys.exit(1)
build_id = resp.get("data", {}).get("id", "")
print(f"Build: {build_id}")

for i in range(40):
    time.sleep(5)
    status, resp = api_call("GET", f"https://api.apify.com/v2/actor-builds/{build_id}?token={API_TOKEN}")
    bs = resp.get("data", {}).get("status", "") if isinstance(resp, dict) else "?"
    print(f"  [{(i+1)*5}s] {bs}")
    if bs == "SUCCEEDED":
        break
    if bs in ("FAILED", "ABORTED"):
        sys.exit(1)

# Run
print("\n=== RUNNING ===")
status, resp = api_call("POST", f"{BASE}/runs?token={API_TOKEN}&timeout=1800", {
    "consumer_key": CONSUMER_KEY,
    "consumer_secret": CONSUMER_SECRET,
    "min_followers": 100,
    "max_followers": 1000000,
    "max_pages": 3,
})
if status not in (200, 201):
    print(f"Run failed: {status} {resp}")
    sys.exit(1)
run_id = resp.get("data", {}).get("id", "")
print(f"Run ID: {run_id}")

# Monitor
def api_get(url):
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {API_TOKEN}"})
    try:
        resp = urllib.request.urlopen(req, timeout=60)
        return json.loads(resp.read().decode("utf-8"))
    except Exception:
        return None


for i in range(180):
    time.sleep(10)
    try:
        status, resp = api_call("GET", f"https://api.apify.com/v2/actor-runs/{run_id}?token={API_TOKEN}")
        rs = resp.get("data", {}).get("status", "") if isinstance(resp, dict) else "?"
        usage = resp.get("data", {}).get("usageTotalUsd", 0) if isinstance(resp, dict) else 0
        ds_id = resp.get("data", {}).get("defaultDatasetId", "") if isinstance(resp, dict) else ""
    except Exception:
        rs = "?"
        usage = 0
        ds_id = ""

    count = 0
    if ds_id:
        ds_info = api_get(f"https://api.apify.com/v2/datasets/{ds_id}?token={API_TOKEN}")
        count = ds_info.get("data", {}).get("itemCount", 0) if ds_info else 0

    print(f"  [{(i+1)*10}s] {rs} - {count} profiles (${usage:.4f})")

    if rs == "SUCCEEDED":
        items = []
        offset = 0
        while True:
            chunk = api_get(f"https://api.apify.com/v2/datasets/{ds_id}/items?token={API_TOKEN}&limit=100&offset={offset}")
            if not chunk or not isinstance(chunk, list) or len(chunk) == 0:
                break
            items.extend(chunk)
            offset += 100

        items.sort(key=lambda x: x.get("angel_score", 0), reverse=True)
        print(f"\n=== RESULTS: {len(items)} profiles ===")

        with open(os.path.join(SCRIPT_DIR, "twitter_angels_latest.json"), "w") as f:
            json.dump(items, f, indent=2)
        print(f"Saved to twitter_angels_latest.json")
        break

    if rs in ("FAILED", "ABORTED", "TIMED-OUT"):
        print(f"\nRun ended: {rs}")
        break

print("\n=== DONE ===")
