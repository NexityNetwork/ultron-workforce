/**
 * Canvas Design Tokens
 *
 * Shared constants for all canvas block components.
 * Three-tier border/surface system + standardized status colors.
 *
 * COLOR PHILOSOPHY:
 *   Brand accent (#DA4E24) is the single primary color.
 *   Status colors (emerald/amber/red) appear ONLY for semantic meaning.
 *   Everything else is white at varying opacities.
 *   No decorative colors — premium means restraint.
 */

// ─── BRAND ──────────────────────────────────────────────────
export const brand = {
  hex: "#DA4E24",
  text: "text-[#DA4E24]",
  bg: "bg-[#DA4E24]/[0.06]",
  bgSolid: "bg-[#DA4E24]",
  border: "border-[#DA4E24]/[0.14]",
  borderSolid: "border-[#DA4E24]",
  dot: "bg-[#DA4E24]",
  line: "bg-[#DA4E24]/40",
  /** For icon containers in summary headers */
  iconBox: "bg-[#DA4E24]/[0.08] border border-[#DA4E24]/[0.14]",
} as const;

// ─── BORDER + SURFACE TIERS ────────────────────────────────
// Use these instead of ad-hoc opacity values.

export const surface = {
  /** Barely visible — nested cards, inner items */
  subtle: {
    border: "border-white/[0.07]",
    bg: "bg-white/[0.025]",
  },
  /** Default — cards, rows, cells */
  normal: {
    border: "border-white/[0.10]",
    bg: "bg-white/[0.035]",
  },
  /** Highlighted — hover states, active items, emphasis */
  emphasis: {
    border: "border-white/[0.14]",
    bg: "bg-white/[0.06]",
  },
} as const;

// ─── HOVER ─────────────────────────────────────────────────
// Standard hover class string to append on interactive cards.

export const hoverCard =
  "transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.05]";

// ─── STATUS COLORS ─────────────────────────────────────────
// These are the ONLY colors besides brand. Use ONLY for semantic status.

export const status = {
  good: {
    text: "text-emerald-400",
    bg: "bg-emerald-400/[0.06]",
    border: "border-emerald-400/[0.10]",
    dot: "bg-emerald-400",
    fill: "#34d399",
  },
  warning: {
    text: "text-amber-400",
    bg: "bg-amber-400/[0.06]",
    border: "border-amber-400/[0.10]",
    dot: "bg-amber-400",
    fill: "#fbbf24",
  },
  critical: {
    text: "text-red-400",
    bg: "bg-red-400/[0.06]",
    border: "border-red-400/[0.10]",
    dot: "bg-red-400",
    fill: "#f87171",
  },
  neutral: {
    text: "text-white/40",
    bg: "bg-white/[0.03]",
    border: "border-white/[0.06]",
    dot: "bg-white/30",
    fill: "rgba(255,255,255,0.3)",
  },
} as const;

// ─── SCORE COLOR ───────────────────────────────────────────
// Returns a status key based on a 0-100 score.

export function scoreStatus(score: number): keyof typeof status {
  if (score >= 75) return "good";
  if (score >= 50) return "warning";
  return "critical";
}

// ─── PLATFORM COLORS ──────────────────────────────────────
// Only for platform-branded icons. These are not "our" colors.
export const platform = {
  linkedin: "#0A66C2",
  twitter: "#1DA1F2",
  instagram: "#E4405F",
  blog: "#DA4E24",
} as const;

// ─── TYPOGRAPHY ─────────────────────────────────────────────
// Reusable class strings matching the platform ChatInterface patterns.
// font-heading = Outfit, font-body = IBM Plex Sans.

export const text = {
  /** Canvas block title */
  title: "text-sm font-semibold font-heading text-white",
  /** Larger title for docs / infographics */
  titleLg: "text-lg font-semibold font-heading text-white",
  /** Section label */
  sectionLabel: "text-xs font-semibold font-heading uppercase tracking-wider text-white/70",
  /** Column / table headers */
  columnHeader: "text-[10px] font-bold font-heading uppercase tracking-wider text-white/60",
  /** Primary body text */
  body: "text-[12px] font-body leading-relaxed text-white/90",
  /** Secondary body - list items, cell values */
  bodySecondary: "text-[12px] font-body text-white/85",
  /** Detail / meta text - dates, attributions, footnotes */
  detail: "text-[11px] font-body text-white/70",
  /** Faint annotation - sources, footnotes */
  faint: "text-[10px] font-body text-white/60",
  /** Micro label - badge text, tiny uppercase labels */
  micro: "text-[10px] font-bold font-heading uppercase tracking-wider",
  /** Tabular number values - KPI values, table numbers */
  value: "text-2xl font-bold font-heading tabular-nums text-white",
  /** Smaller value - inline stats */
  valueSm: "text-sm font-semibold font-heading tabular-nums text-white",
  /** Large stat value - infographic hero numbers */
  valueLg: "text-3xl font-bold font-heading tabular-nums text-white",
} as const;

// ─── COMPONENT TEMPLATES ────────────────────────────────────
// Reusable class string combos for common patterns.
// Import and use with cn() to compose.

export const tpl = {
  /** Standard card — border + bg + rounded + subtle inner shadow */
  card: `rounded-xl border ${surface.normal.border} ${surface.normal.bg} shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]`,
  /** Card with hover interaction */
  cardHover: `rounded-xl border ${surface.normal.border} ${surface.normal.bg} shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${hoverCard}`,
  /** Subtle inner card (nested inside another card) */
  cardSubtle: `rounded-lg border ${surface.subtle.border} ${surface.subtle.bg}`,
  /** Emphasis card — highlighted, active */
  cardEmphasis: `rounded-xl border ${surface.emphasis.border} ${surface.emphasis.bg} shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`,
  /** Brand callout — left accent border with faint brand background */
  callout: `rounded-lg border-l-2 ${brand.border} ${brand.bg} p-4`,
  /** Section divider line */
  divider: `h-px bg-white/[0.07]`,
  /** Icon box — brand-colored container for header icons */
  iconBox: `w-8 h-8 rounded-lg flex items-center justify-center ${brand.iconBox}`,
  /** Brand accent bar — thin vertical bar before headings */
  accentBar: `h-4 w-0.5 rounded-full ${brand.dot}`,
  /** Badge / tag — small rounded label */
  badge: `inline-block rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider border ${surface.subtle.border} ${surface.subtle.bg} text-white/60`,
  /** Metadata pill — key:value pairs */
  metaPill: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] ${surface.subtle.border} ${surface.subtle.bg}`,
  /** Table row border */
  rowBorder: `border-b ${surface.subtle.border}`,
  /** Table header row border */
  headerBorder: `border-b ${surface.normal.border}`,
} as const;

// ─── RECHARTS THEME ─────────────────────────────────────────
// Shared styles for recharts components.

export const chartTheme = {
  grid: "rgba(255,255,255,0.06)",
  tick: { fontSize: 10, fill: "rgba(255,255,255,0.7)" },
  tooltip: {
    background: "rgba(0,0,0,0.9)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    fontSize: 11,
    color: "rgba(255,255,255,0.95)",
  },
} as const;
