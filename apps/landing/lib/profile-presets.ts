// ── Ultron Profile Presets ──────────────────────────────────────────────────
// Compact structures designed for low token consumption when injected into prompts.
// Each preset has: id, label, and a short description (sub) for UI display.
// ICP presets also carry buyer titles + pain for richer context.

export type Preset = { id: string; label: string; sub: string };
export type IcpPreset = Preset & { buyers: string; pain: string };

// ── Industries (12) ────────────────────────────────────────────────────────

export const INDUSTRIES: Preset[] = [
  { id: "saas-software",       label: "SaaS / Software",              sub: "Cloud products, dev tools, platforms" },
  { id: "enterprise-it",       label: "Enterprise IT / Cyber / Data",  sub: "Infrastructure, security, data platforms" },
  { id: "finance",             label: "Financial Services / FinTech",  sub: "Banking, payments, insurance tech" },
  { id: "healthcare",          label: "Healthcare / HealthTech",       sub: "Digital health, medtech, pharma" },
  { id: "professional-svcs",   label: "Professional Services",         sub: "Law, accounting, tax, advisory" },
  { id: "agency-consulting",   label: "Agencies / Consulting",         sub: "Marketing, creative, strategy firms" },
  { id: "ecommerce",           label: "E-commerce / Retail",           sub: "DTC brands, marketplaces, retail" },
  { id: "manufacturing",       label: "Manufacturing / Industrial",    sub: "B2B suppliers, ops, industrial tech" },
  { id: "real-estate",         label: "Real Estate / PropTech",        sub: "Brokerages, CRE, property tech" },
  { id: "education",           label: "Education / EdTech",            sub: "Platforms, training, course businesses" },
  { id: "logistics",           label: "Logistics / Supply Chain",      sub: "Freight, warehouse, procurement, ops" },
  { id: "hr-recruiting",       label: "HR / Recruiting / People Ops",  sub: "ATS vendors, staffing, HR workflow" },
];

// ── ICP Templates (12) ────────────────────────────────────────────────────

export const ICPS: IcpPreset[] = [
  {
    id: "founder-saas",
    label: "Founder-Led B2B SaaS",
    sub: "Early-stage SaaS, founder still drives GTM",
    buyers: "Founder, CEO, Head of Growth",
    pain: "Inconsistent pipeline, founder is content bottleneck",
  },
  {
    id: "growth-saas",
    label: "Growth-Stage SaaS GTM",
    sub: "Structured sales + marketing team scaling channels",
    buyers: "VP Marketing, RevOps, Sales Director",
    pain: "Fragmented content engine, low content-to-pipeline efficiency",
  },
  {
    id: "enterprise-abm",
    label: "Enterprise / ABM Team",
    sub: "Mid-market or enterprise software with ABM motion",
    buyers: "ABM Lead, Content Lead, Sales Enablement",
    pain: "Generic content, slow campaigns, poor personalization at scale",
  },
  {
    id: "cyber-infra",
    label: "Cyber / Data / Infra Vendor",
    sub: "Complex technical products with long sales cycles",
    buyers: "Founder, VP Marketing, Product Marketing",
    pain: "Hard-to-explain product, skeptical buyers, trust deficit",
  },
  {
    id: "healthtech",
    label: "HealthTech Operator",
    sub: "Digital health, care ops, medtech software",
    buyers: "Founder, Head of Growth, Product Marketing",
    pain: "Trust barrier, regulated messaging, credibility need",
  },
  {
    id: "fintech",
    label: "FinTech / Finance Buyer",
    sub: "Payments, banking software, finance ops tooling",
    buyers: "Founder, Growth Lead, Partnerships",
    pain: "High skepticism, compliance sensitivity, zero tolerance for fluff",
  },
  {
    id: "agency",
    label: "Agency Owner",
    sub: "Marketing, outbound, paid media, or AI agencies",
    buyers: "Founder, Agency Owner, Growth Partner",
    pain: "Feast-or-famine pipeline, weak authority positioning",
  },
  {
    id: "consulting",
    label: "Consulting / Advisory",
    sub: "Strategy, ops, RevOps, digital transformation",
    buyers: "Founder, Managing Partner, Principal",
    pain: "Expertise poorly packaged, referral-dependent pipeline",
  },
  {
    id: "prof-services",
    label: "Professional Services",
    sub: "Law, accounting, recruiting, compliance, advisory",
    buyers: "Partner, Managing Director, Growth Lead",
    pain: "Trust-heavy buying, low differentiation, slow lead flow",
  },
  {
    id: "ecom-dtc",
    label: "E-commerce / DTC Brand",
    sub: "Consumer brands with lifecycle marketing and paid acquisition",
    buyers: "Founder, CMO, Retention Lead",
    pain: "Content churn, weak email strategy, channel fragmentation",
  },
  {
    id: "manufacturing",
    label: "Manufacturing / Industrial",
    sub: "B2B suppliers, logistics tech, operational services",
    buyers: "Sales Director, Marketing Lead, GM",
    pain: "Outdated messaging, long cycles, low content maturity",
  },
  {
    id: "recruiting-hr",
    label: "Recruiting / HR Tech",
    sub: "Recruiting firms, ATS vendors, HR workflow tools",
    buyers: "Founder, BD Lead, Marketing Lead",
    pain: "Outreach fatigue, low response rates, generic positioning",
  },
];

// ── Tones (8) ──────────────────────────────────────────────────────────────

export const TONES: Preset[] = [
  { id: "thought-leader", label: "Thought Leader",  sub: "Authoritative, insight-led, data-backed" },
  { id: "no-bs",          label: "No-BS",           sub: "Direct, compressed, high signal" },
  { id: "challenger",     label: "Challenger",       sub: "Contrarian, provocative, anti-consensus" },
  { id: "operator",       label: "Operator",         sub: "Practical, execution-first, systems-minded" },
  { id: "educator",       label: "Educator",         sub: "Clear, structured, trust-building" },
  { id: "enterprise",     label: "Enterprise",       sub: "Polished, credible, low-risk" },
  { id: "conversational", label: "Conversational",   sub: "Simple, human, natural" },
  { id: "visionary",      label: "Visionary",        sub: "Future-facing, movement-driven" },
];

// ── Strategies (6) ─────────────────────────────────────────────────────────

export const STRATEGIES: Preset[] = [
  { id: "linkedin-authority",  label: "LinkedIn Authority Engine",     sub: "Thought leadership + paradigm-shift posts + DM CTA" },
  { id: "multi-channel",       label: "Multi-Channel Demand Engine",   sub: "One core idea adapted across LinkedIn, X, email, carousels" },
  { id: "outbound-pipeline",   label: "Outbound Pipeline Engine",      sub: "Cold email + follow-ups + account research + personalization" },
  { id: "category-education",  label: "Category Education Engine",     sub: "Teach the market, name the pain, bridge to solution" },
  { id: "founder-brand",       label: "Founder Brand Engine",          sub: "Personal authority as demand generation" },
  { id: "seo-evergreen",       label: "SEO / Evergreen Authority",     sub: "Long-form compounding content + search intent coverage" },
];

// ── Company Size / Stage options ───────────────────────────────────────────

export const COMPANY_SIZES = [
  { id: "1-10",    label: "1–10" },
  { id: "11-50",   label: "11–50" },
  { id: "51-200",  label: "51–200" },
  { id: "201-500", label: "201–500" },
  { id: "500+",    label: "500+" },
];

export const COMPANY_STAGES = [
  { id: "pre-seed",    label: "Pre-seed" },
  { id: "seed",        label: "Seed" },
  { id: "series-a",    label: "Series A" },
  { id: "series-b",    label: "Series B" },
  { id: "series-c",    label: "Series C+" },
  { id: "bootstrapped", label: "Bootstrapped" },
  { id: "established", label: "Established" },
];

// ── Platform options ───────────────────────────────────────────────────────

export const PLATFORMS = ["LinkedIn", "Twitter", "Instagram", "Email", "Substack", "Blog"];

// ── Completeness calculator ────────────────────────────────────────────────
// Weights sum to 100. Each field contributes its weight when non-empty.

const COMPLETENESS_FIELDS: { key: string; weight: number }[] = [
  { key: "business_name",         weight: 10 },
  { key: "business_description",  weight: 10 },
  { key: "platforms",             weight: 10 },
  { key: "company_size",          weight: 5 },
  { key: "company_stage",         weight: 5 },
  { key: "icp_template",          weight: 15 },
  { key: "icp_description",       weight: 5 },
  { key: "voice_tone",            weight: 10 },
  { key: "industry",              weight: 10 },
  { key: "strategy",              weight: 10 },
  { key: "competitors",           weight: 10 },
];

export function calcCompleteness(profile: Record<string, unknown>): number {
  let score = 0;
  for (const { key, weight } of COMPLETENESS_FIELDS) {
    const v = profile[key];
    if (v == null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    score += weight;
  }
  return score;
}

// ── Compact prompt serializer ──────────────────────────────────────────────
// Produces a minimal text block for injection into LLM system prompts.
// Keeps token count low by only including set fields.

export function profileToPromptContext(profile: Record<string, unknown>): string {
  const lines: string[] = ["[BUSINESS PROFILE]"];

  const str = (k: string) => {
    const v = profile[k];
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };

  if (str("business_name")) lines.push(`Company: ${str("business_name")}`);
  if (str("business_description")) lines.push(`Description: ${str("business_description")}`);
  if (str("company_size")) lines.push(`Size: ${COMPANY_SIZES.find(s => s.id === str("company_size"))?.label || str("company_size")} employees`);
  if (str("company_stage")) lines.push(`Stage: ${COMPANY_STAGES.find(s => s.id === str("company_stage"))?.label || str("company_stage")}`);

  const industry = INDUSTRIES.find(i => i.id === str("industry"));
  if (industry) lines.push(`Industry: ${industry.label}`);

  const icp = ICPS.find(i => i.id === str("icp_template"));
  if (icp) {
    lines.push(`ICP: ${icp.label} — ${icp.sub}`);
    lines.push(`Buyers: ${icp.buyers}`);
    lines.push(`Pain: ${icp.pain}`);
  }
  if (str("icp_description")) lines.push(`ICP Notes: ${str("icp_description")}`);

  const tone = TONES.find(t => t.id === str("voice_tone"));
  if (tone) lines.push(`Tone: ${tone.label} — ${tone.sub}`);

  const strat = STRATEGIES.find(s => s.id === str("strategy"));
  if (strat) lines.push(`Strategy: ${strat.label} — ${strat.sub}`);

  const platforms = profile.platforms;
  if (Array.isArray(platforms) && platforms.length > 0) lines.push(`Platforms: ${platforms.join(", ")}`);

  const competitors = profile.competitors;
  if (Array.isArray(competitors) && competitors.length > 0) lines.push(`Competitors: ${competitors.join(", ")}`);

  return lines.length > 1 ? lines.join("\n") : "";
}
