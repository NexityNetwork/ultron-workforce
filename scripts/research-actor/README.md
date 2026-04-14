# Ultron 11-Layer Research Actor

Apify actor that performs deep business research on a target company across 11 dimensions:

1. **Identity** — legal name, industry, business model, revenue stage, founding year, decision maker
2. **Website Intelligence** — funnel, CTAs, forms, pricing, social proof, content hub, schema
3. **SEO + AEO** — indexed pages, branded visibility, category rankings, AI citation proxy, backlinks
4. **Social Media** — platforms present, LinkedIn Voyager data, founder personal brand, community signals
5. **Paid Acquisition** — Meta Ad Library, Google Ads Transparency, LinkedIn Ads, tracking pixels
6. **Reputation** — G2, Trustpilot, Capterra, Glassdoor, Reddit sentiment, X mentions
7. **Customer Acquisition** — outbound evidence (SDR hiring, Outreach/Salesloft), partnerships, email capture, sales process
8. **Retention + Support** — support tools, onboarding, community, subscription signals, churn signals
9. **Operations + Tech Stack** — detected tools by category + operational maturity score + gap analysis
10. **Team + Hiring** — LinkedIn jobs, Greenhouse/Lever/Ashby postings, pain signals from open roles
11. **Competitive Landscape** — top 3 competitors found via "X vs Y" / "alternatives" searches + abbreviated audit on each

## Input

| Field                 | Required | Notes                                          |
| --------------------- | -------- | ---------------------------------------------- |
| `company_url`         | yes      | Target website URL                             |
| `company_name`        | no       | Auto-extracted from site if omitted            |
| `linkedin_url`        | no       | Auto-discovered via Brave if omitted           |
| `brave_api_key`       | yes*     | Required for layers 3, 4, 5, 6, 7, 8, 10, 11   |
| `li_at`               | no       | LinkedIn cookie for Voyager company data       |
| `browserbase_api_key` | no       | Reserved for future JS-rendered crawling       |
| `include_competitors` | no       | Default `true`                                 |
| `max_pages_crawl`     | no       | Default `15`                                   |

## Deploy

```bash
export APIFY_TOKEN=...
export APIFY_ACTOR_ID=...       # create empty actor in Apify console, paste id here
export BRAVE_API_KEY=...
export LI_AT=...                # optional
export TARGET_URL=https://example.com   # optional, for test run
python3 deploy.py
```

## Architecture

- `src/__main__.py` — orchestrator, runs all 11 layers with per-layer error isolation
- `src/utils.py` — shared HTTP, Brave Search, parsing helpers
- `src/signatures.py` — tech-stack detection signatures (replaces BuiltWith)
- `src/layers/*.py` — one module per layer, each exposing a `run()` function
- Output: single JSON document per company, pushed to dataset

The orchestrator aggregates pain signals across layers into `pain_signals_summary` for downstream offer synthesis.
