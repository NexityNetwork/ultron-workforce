// Brand name → logo URL mapping
// Uses Hunter.io Logo API (16M+ companies, no API key) as primary source.
// Falls back to local PNGs for custom integrations.

// ── Brand name → domain mapping ─────────────────────────────────────────────
// Hunter.io uses domains, so we map brand names to their domains.

const BRAND_DOMAINS: Record<string, string> = {
  // CRM & Sales
  hubspot: "hubspot.com",
  salesforce: "salesforce.com",
  pipedrive: "pipedrive.com",
  zoho: "zoho.com",
  freshdesk: "freshdesk.com",
  // Collaboration & PM
  slack: "slack.com",
  notion: "notion.so",
  airtable: "airtable.com",
  clickup: "clickup.com",
  trello: "trello.com",
  asana: "asana.com",
  jira: "atlassian.com",
  confluence: "atlassian.com",
  "monday.com": "monday.com",
  basecamp: "basecamp.com",
  miro: "miro.com",
  loom: "loom.com",
  // Dev tools
  github: "github.com",
  figma: "figma.com",
  vercel: "vercel.com",
  netlify: "netlify.com",
  supabase: "supabase.com",
  webflow: "webflow.com",
  docker: "docker.com",
  kubernetes: "kubernetes.io",
  // Databases
  mongodb: "mongodb.com",
  postgresql: "postgresql.org",
  redis: "redis.io",
  snowflake: "snowflake.com",
  databricks: "databricks.com",
  // Marketing & Analytics
  mailchimp: "mailchimp.com",
  mixpanel: "mixpanel.com",
  amplitude: "amplitude.com",
  segment: "segment.com",
  intercom: "intercom.com",
  // E-commerce & Payments
  stripe: "stripe.com",
  shopify: "shopify.com",
  // Communication
  twilio: "twilio.com",
  sendgrid: "sendgrid.com",
  discord: "discord.com",
  whatsapp: "whatsapp.com",
  // Social
  linkedin: "linkedin.com",
  twitter: "x.com",
  facebook: "facebook.com",
  youtube: "youtube.com",
  instagram: "instagram.com",
  telegram: "telegram.org",
  // Big tech
  google: "google.com",
  microsoft: "microsoft.com",
  apple: "apple.com",
  amazon: "amazon.com",
  // Automation
  zapier: "zapier.com",
  n8n: "n8n.io",
  gumloop: "gumloop.com",
  apify: "apify.com",
  // Productivity
  canva: "canva.com",
  dropbox: "dropbox.com",
  calendly: "calendly.com",
  // Other
  zendesk: "zendesk.com",
  "power bi": "powerbi.com",
  "microsoft teams": "teams.microsoft.com",
  "google sheets": "google.com",
  "google drive": "google.com",
  "google cloud": "cloud.google.com",
  "google ads": "ads.google.com",
  "google analytics": "analytics.google.com",
  "google maps": "maps.google.com",
  "google meet": "meet.google.com",
  aws: "aws.amazon.com",
  "amazon web services": "aws.amazon.com",
  "vs code": "code.visualstudio.com",
  "visual studio code": "code.visualstudio.com",
  "power automate": "powerautomate.microsoft.com",
  gmail: "gmail.com",
  apollo: "apollo.io",
  brave: "brave.com",
};

// ── Local PNGs — override for brands where we have custom assets ────────────

const LOCAL_OVERRIDES: Record<string, string> = {
  // Only use local PNGs where we specifically want a custom version
  // Hunter.io handles everything else
};

// ── Build lookup map ────────────────────────────────────────────────────────

function buildBrandMap(): Map<string, string> {
  const entries: [string, string][] = [];

  for (const [name, domain] of Object.entries(BRAND_DOMAINS)) {
    // Check for local override first
    if (LOCAL_OVERRIDES[name]) {
      entries.push([name, LOCAL_OVERRIDES[name]]);
    } else {
      // Use Hunter.io Logo API — free, no API key, 16M+ companies
      entries.push([name, `https://logos.hunter.io/${domain}`]);
    }
  }

  return new Map(entries);
}

export const BRAND_MAP = buildBrandMap();

// Sorted brand names by length (longest first) for greedy matching
export const BRAND_NAMES = Array.from(BRAND_MAP.keys()).sort((a, b) => b.length - a.length);

// Build regex pattern that matches any brand name (word boundary, case-insensitive)
const escaped = BRAND_NAMES.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
export const BRAND_REGEX = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

export function getBrandLogo(name: string): string | null {
  return BRAND_MAP.get(name.toLowerCase()) || null;
}

// Dynamic lookup — for brands not in the static map, try Hunter.io by guessing the domain
export function getBrandLogoByDomain(domain: string): string {
  return `https://logos.hunter.io/${domain}`;
}
