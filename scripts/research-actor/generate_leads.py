"""Generate ranked leads.csv from research_results.jsonl.

Scoring = ICP fit (size, industry, hiring) + pain signal density.
Outputs: data/leads.csv sorted by score, best first.
"""

import csv
import json
import os
import re


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, 'data')

IN_PATH = os.path.join(DATA_DIR, 'research_results.jsonl')
OUT_PATH = os.path.join(DATA_DIR, 'leads.csv')


# US SDR fully-loaded cost (salary + commission + benefits + overhead + tools)
ROLE_COST_USD = {
    'sdr': 85_000,
    'content': 75_000,
    'research': 70_000,
    'ops': 95_000,
}


ICP_INDUSTRY_MAP = {
    # Map our presumed industries to target fit score
    'recruitment_staffing': 5,
    'real_estate': 4,
    'marketing_agency': 5,
    'b2b_services': 4,
    'insurance_finance': 4,
    'ecommerce': 3,
}

# Industry code (from our research actor's detect_industry) → keep/drop
# Actor returns: saas, ai_ml, fintech, ecommerce, healthtech, martech,
# devtools, edtech, agency, media, unknown.
DROP_ACTOR_INDUSTRIES = {
    # AI-native = they build their own
    'ai_ml', 'devtools',
}


def infer_size_bucket(report: dict) -> str:
    """Best-effort size inference from layer 4 LinkedIn + layer 10 team."""
    li = report.get('layer_4_social', {}).get('linkedin_company', {})
    staff = li.get('staff_count') or 0
    if isinstance(staff, int) and staff > 0:
        if staff <= 10:
            return '1-10'
        if staff <= 50:
            return '11-50'
        if staff <= 200:
            return '51-200'
        if staff <= 1000:
            return '201-1000'
        return '1000+'
    # Fall back to team/hiring signals
    team = report.get('layer_10_team', {})
    total_open = team.get('hiring_analysis', {}).get('total_open_roles', 0)
    if total_open > 30:
        return '201-1000'
    if total_open > 10:
        return '51-200'
    return 'unknown'


def score_lead(report: dict, target: dict) -> tuple:
    """Return (score, reasons_list)."""
    reasons = []
    score = 0

    # ICP industry fit
    for ind in target.get('industries', []):
        score += ICP_INDUSTRY_MAP.get(ind, 0)

    # Hiring signal (known from source)
    roles = target.get('hiring_roles', [])
    if roles:
        score += len(roles) * 2
        reasons.append(f'Hiring: {",".join(roles)}')

    # Pain signals from research
    pain = report.get('pain_signals_summary', [])
    score += min(len(pain), 10)  # cap

    # Penalize too-big
    size = infer_size_bucket(report)
    if size in ('1000+',):
        score -= 20
        reasons.append(f'⚠ {size} employees — too big')
    elif size in ('201-1000',):
        score -= 8
    elif size in ('11-50', '51-200'):
        score += 3
        reasons.append(f'✓ {size} employees — ICP fit')
    elif size == '1-10':
        score += 1

    # Drop AI-native
    actor_industry = report.get('layer_1_identity', {}).get('industry', '')
    if actor_industry in DROP_ACTOR_INDUSTRIES:
        score -= 30
        reasons.append(f'⚠ Actor industry: {actor_industry} (AI-native — skip)')

    # Revenue stage
    stage = report.get('layer_1_identity', {}).get('revenue_stage', '')
    if stage in ('scale',):
        score -= 5
    elif stage in ('early', 'growth'):
        score += 2

    # Decision maker found
    dm = report.get('layer_1_identity', {}).get('decision_maker', {})
    if dm.get('name'):
        score += 2
        reasons.append(f'DM: {dm["name"]}')

    return score, reasons, size


def pick_hiring_role_and_cost(roles: list, hiring_pain_signals: list) -> tuple:
    """Return (role_to_replace, annual_cost_usd)."""
    # Prefer source-known hiring role
    if roles:
        role = roles[0]
        return role, ROLE_COST_USD.get(role, 75_000)
    # Infer from actor pain signals
    joined = ' '.join(hiring_pain_signals).lower()
    if 'sdr' in joined or 'sales' in joined:
        return 'sdr', ROLE_COST_USD['sdr']
    if 'ops' in joined or 'revops' in joined:
        return 'ops', ROLE_COST_USD['ops']
    if 'cs' in joined or 'customer success' in joined:
        return 'cs', 70_000
    return '', 0


def build_offer_line(role: str, cost: int) -> str:
    if not role or not cost:
        return ''
    # Offer: $7,500 upfront + monthly. Undercut annual role cost.
    return (
        f'Replace your {role.upper()} ({cost//1000}K/yr fully-loaded) with '
        f'Ultron: $7,500 upfront + monthly ongoing'
    )


def main():
    leads = []
    with open(IN_PATH) as f:
        for line in f:
            try:
                r = json.loads(line)
            except Exception:
                continue

            target = r.get('_target', {})
            meta = r.get('meta', {})
            id_ = r.get('layer_1_identity', {})

            score, reasons, size = score_lead(r, target)

            pain_signals = r.get('pain_signals_summary', [])

            role_to_replace, role_cost = pick_hiring_role_and_cost(
                target.get('hiring_roles', []),
                r.get('layer_10_team', {}).get(
                    'hiring_analysis', {},
                ).get('pain_signals', []),
            )
            offer = build_offer_line(role_to_replace, role_cost)

            dm = id_.get('decision_maker', {}) or {}
            li = r.get('layer_4_social', {}).get('linkedin_company', {})

            leads.append({
                'score': score,
                'domain': meta.get('domain', ''),
                'company_name': target.get('company_name') or id_.get('name', ''),
                'website': meta.get('company_url', ''),
                'industries': ','.join(target.get('industries', [])),
                'actor_industry': id_.get('industry', ''),
                'business_model': id_.get('business_model', ''),
                'revenue_stage': id_.get('revenue_stage', ''),
                'size_bucket': size,
                'founding_year': id_.get('founding_year', 0) or '',
                'geo': ','.join(target.get('geos', [])),
                'locations': ','.join(id_.get('locations', [])),
                'decision_maker_name': dm.get('name', ''),
                'decision_maker_linkedin': dm.get('linkedin', ''),
                'linkedin_url': meta.get('linkedin_url', ''),
                'hiring_roles_known': ','.join(target.get('hiring_roles', [])),
                'role_to_replace': role_to_replace,
                'role_annual_cost_usd': role_cost,
                'offer_line': offer,
                'top_pain_signals': ' | '.join(pain_signals[:5]),
                'all_pain_signals': ' | '.join(pain_signals),
                'emails_found': ','.join(id_.get('emails_found', [])[:3]),
                'reasons': ' | '.join(reasons),
            })

    # Sort best first
    leads.sort(key=lambda x: -x['score'])

    # Write CSV
    if not leads:
        print('No leads!')
        return

    fieldnames = list(leads[0].keys())
    with open(OUT_PATH, 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(leads)

    print(f'Wrote {len(leads)} leads → {OUT_PATH}')
    print('\n=== TOP 15 ===')
    for lead in leads[:15]:
        print(
            f'  [{lead["score"]:>3}] {lead["company_name"][:30]:30s} | '
            f'{lead["domain"][:30]:30s} | '
            f'{lead["size_bucket"]:12s} | '
            f'{lead["industries"][:20]:20s} | '
            f'{lead["decision_maker_name"][:20]:20s}'
        )


if __name__ == '__main__':
    main()
