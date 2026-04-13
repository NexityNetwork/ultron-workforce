"""Merge leads from all sources into campaign-ready CSVs.

Outputs:
- all_leads_merged.csv: Full lead database
- campaign_ready.csv: Only leads with emails (for Mailmeteor)
- twitter_dm_targets.csv: High-score Twitter profiles for DM outreach
"""

import json
import csv
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


def load_json(path):
    try:
        with open(path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Warning: {path} not found, skipping")
        return []


def main():
    # Load all sources
    li_leads = load_json(os.path.join(SCRIPT_DIR, "linkedin_enriched.json"))
    tw_leads = load_json(os.path.join(SCRIPT_DIR, "twitter_angels_latest.json"))

    if not li_leads and not tw_leads:
        # Try /tmp fallback
        li_leads = load_json("/tmp/enriched_leads_clean.json")
        tw_leads = load_json("/tmp/twitter_angels_v6.json")

    print(f"LinkedIn enriched: {len(li_leads)}")
    print(f"Twitter angels: {len(tw_leads)}")

    all_leads = []

    # LinkedIn leads (have verified emails)
    for lead in li_leads:
        if not lead.get("found") or not lead.get("email"):
            continue
        all_leads.append({
            "name": lead.get("name", ""),
            "email": lead.get("email", ""),
            "company": lead.get("company", ""),
            "source": "linkedin",
            "linkedin_url": lead.get("linkedin_url", ""),
            "twitter_handle": "",
            "twitter_url": "",
            "website": "",
            "location": "",
            "bio": "",
            "followers": "",
            "angel_score": "",
            "confidence": lead.get("confidence", 0),
        })

    # Twitter leads
    for lead in tw_leads:
        all_leads.append({
            "name": lead.get("name", ""),
            "email": lead.get("email_from_bio", ""),
            "company": "",
            "source": "twitter",
            "linkedin_url": lead.get("linkedin_url", ""),
            "twitter_handle": f"@{lead.get('handle', '')}",
            "twitter_url": lead.get("profile_url", ""),
            "website": lead.get("website", ""),
            "location": lead.get("location", ""),
            "bio": (lead.get("bio", "") or "")[:200],
            "followers": lead.get("followers", 0),
            "angel_score": f"{lead.get('angel_score', 0):.2f}",
            "confidence": "",
        })

    # Deduplicate by LinkedIn URL
    seen_li = set()
    deduped = []
    for lead in all_leads:
        li = lead.get("linkedin_url", "")
        if li and li in seen_li:
            continue
        if li:
            seen_li.add(li)
        deduped.append(lead)

    print(f"\nTotal unified leads: {len(deduped)}")

    # Full merged CSV
    out_path = os.path.join(SCRIPT_DIR, "all_leads_merged.csv")
    with open(out_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Name", "Email", "Company", "Source", "LinkedIn", "Twitter Handle",
                         "Twitter URL", "Website", "Location", "Bio", "Followers", "Angel Score",
                         "Email Confidence"])
        for lead in deduped:
            writer.writerow([lead[k] for k in ["name", "email", "company", "source", "linkedin_url",
                            "twitter_handle", "twitter_url", "website", "location", "bio",
                            "followers", "angel_score", "confidence"]])
    print(f"Saved {len(deduped)} to {out_path}")

    # Campaign-ready (emails only)
    emailable = [l for l in deduped if l.get("email")]
    emailable.sort(key=lambda x: (0 if x["source"] == "linkedin" else 1, -float(x.get("angel_score") or 0)))

    out_path = os.path.join(SCRIPT_DIR, "campaign_ready.csv")
    with open(out_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Name", "Email", "Company", "Source", "LinkedIn", "Twitter", "Website", "Location", "Bio"])
        for lead in emailable:
            twitter = lead.get("twitter_handle", "") or lead.get("twitter_url", "")
            writer.writerow([lead["name"], lead["email"], lead["company"], lead["source"],
                           lead["linkedin_url"], twitter, lead["website"], lead["location"],
                           lead["bio"][:150]])
    print(f"Campaign-ready (with emails): {len(emailable)} -> {out_path}")

    # Twitter DM targets
    high_tw = [l for l in deduped if l["source"] == "twitter" and float(l.get("angel_score") or 0) >= 0.3]
    high_tw.sort(key=lambda x: -float(x.get("angel_score") or 0))

    out_path = os.path.join(SCRIPT_DIR, "twitter_dm_targets.csv")
    with open(out_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Name", "Twitter Handle", "Twitter URL", "Followers", "Angel Score",
                         "Email", "LinkedIn", "Website", "Location", "Bio"])
        for lead in high_tw:
            writer.writerow([lead["name"], lead["twitter_handle"], lead["twitter_url"],
                           lead["followers"], lead["angel_score"], lead["email"],
                           lead["linkedin_url"], lead["website"], lead["location"],
                           lead["bio"][:150]])
    print(f"Twitter DM targets (score >= 0.3): {len(high_tw)} -> {out_path}")

    # Save JSON
    with open(os.path.join(SCRIPT_DIR, "all_leads_merged.json"), "w") as f:
        json.dump(deduped, f, indent=2)


if __name__ == "__main__":
    main()
