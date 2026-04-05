"use client";

import { memo, useMemo, useState, useCallback, ReactNode } from "react";
import ReactMarkdown, { Components } from "react-markdown";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cn } from "@/lib/utils";
import { BRAND_REGEX, getBrandLogo } from "@/lib/brand-logos";
import {
  X, AlertTriangle, Check, Circle, Zap, Star, ArrowRight, Info, Flame,
  Target, Shield, Rocket, TrendingUp, Clock, Eye, Square, User, Users,
  FileText, Clipboard, BarChart3, Lightbulb, Heart, ThumbsUp, ThumbsDown,
  MessageCircle, Mail, Phone, Globe, Lock, Unlock, Key, Search, Settings,
  Home, Bookmark, Tag, Hash, MapPin, Calendar, Gift, Award, Trophy,
  Flag, Bell, Volume2, Music, Camera, Image, Film, Monitor, Smartphone,
  Wifi, Cloud, Database, Code, Terminal, Package, Wrench, Hammer,
  Briefcase, DollarSign, CreditCard, ShoppingCart, Truck, Building2,
  Plane, Car, Bike, Anchor, Compass, Mountain, TreePine, Flower2, Sun,
  Moon, CloudRain, Snowflake, Wind, Droplets, Sparkles, Gem, Crown,
  Swords, HandMetal, Brain, Puzzle, Dice1, Gamepad2, Palette, Pencil,
  BookOpen, GraduationCap, Microscope, Stethoscope, Pill, Siren,
  AlertCircle, Ban, CircleDot, ArrowUp, ArrowDown, RefreshCw, Link,
  Paperclip, Scissors, Copy, Save, Trash2, FolderOpen, Upload, Download,
  MoreHorizontal, ChevronRight, Play, Pause, SkipForward,
  Power, Battery, Cpu, HardDrive, Radio, Tv,
} from "lucide-react";

// Inject brand logo <img> elements into a plain text string, returning React nodes
function renderTextWithLogos(text: string): ReactNode {
  BRAND_REGEX.lastIndex = 0;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = BRAND_REGEX.exec(text)) !== null) {
    const brandName = match[0];
    const logo = getBrandLogo(brandName);
    if (!logo) continue;

    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index);
      parts.push(before);
      // Add space before logo if preceding text doesn't end with whitespace/punctuation
      if (before.length > 0 && !/[\s([\-—/]$/.test(before)) {
        parts.push(" ");
      }
    }

    parts.push(
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={`logo-${key++}`}
        src={logo}
        alt=""
        width={13}
        height={13}
        className="inline-block mx-[3px] rounded-sm"
        style={{ width: 13, height: 13, verticalAlign: "-1px" }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
    parts.push(brandName);
    lastIndex = match.index + brandName.length;

    // Add space after brand name if next char isn't whitespace/punctuation
    if (lastIndex < text.length && !/[\s.,;:!?)}\]—\-/]/.test(text[lastIndex])) {
      parts.push(" ");
    }
  }

  if (parts.length === 0) return text;
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts}</>;
}

// All icons render in white
const W = "rgba(255,255,255,0.7)";

// Comprehensive emoji → white Lucide icon mapping
const EMOJI_ICON_MAP: Record<string, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }> = {
  // Status & indicators
  "❌": { icon: X, color: W },
  "✅": { icon: Check, color: W },
  "✓": { icon: Check, color: W },
  "⬜": { icon: Square, color: W },
  "⚠️": { icon: AlertTriangle, color: W },
  "‼️": { icon: AlertCircle, color: W },
  "❗": { icon: AlertCircle, color: W },
  "❓": { icon: Info, color: W },
  "❔": { icon: Info, color: W },
  "🚫": { icon: Ban, color: W },
  "⛔": { icon: Ban, color: W },
  // Circles
  "🔴": { icon: Circle, color: W },
  "🟡": { icon: Circle, color: W },
  "🟢": { icon: Circle, color: W },
  "🔵": { icon: Circle, color: W },
  "⚪": { icon: Circle, color: W },
  "⚫": { icon: Circle, color: W },
  "🟣": { icon: Circle, color: W },
  "🟤": { icon: Circle, color: W },
  "🟠": { icon: Circle, color: W },
  "⭕": { icon: CircleDot, color: W },
  // Arrows
  "➡️": { icon: ArrowRight, color: W },
  "→": { icon: ArrowRight, color: W },
  "⬆️": { icon: ArrowUp, color: W },
  "⬇️": { icon: ArrowDown, color: W },
  "↗️": { icon: ArrowRight, color: W },
  "↘️": { icon: ArrowRight, color: W },
  "🔄": { icon: RefreshCw, color: W },
  "▶️": { icon: Play, color: W },
  "⏸️": { icon: Pause, color: W },
  "⏭️": { icon: SkipForward, color: W },
  // Energy & nature
  "⚡": { icon: Zap, color: W },
  "🔥": { icon: Flame, color: W },
  "💡": { icon: Lightbulb, color: W },
  "⭐": { icon: Star, color: W },
  "🌟": { icon: Star, color: W },
  "✨": { icon: Sparkles, color: W },
  "💎": { icon: Gem, color: W },
  "👑": { icon: Crown, color: W },
  "🏆": { icon: Trophy, color: W },
  "🏅": { icon: Award, color: W },
  "🥇": { icon: Award, color: W },
  "🥈": { icon: Award, color: W },
  "🥉": { icon: Award, color: W },
  "🎖️": { icon: Award, color: W },
  // People & body
  "👤": { icon: User, color: W },
  "👥": { icon: Users, color: W },
  "🧑": { icon: User, color: W },
  "👨": { icon: User, color: W },
  "👩": { icon: User, color: W },
  "🙂": { icon: User, color: W },
  "😀": { icon: User, color: W },
  "😊": { icon: User, color: W },
  "🤝": { icon: HandMetal, color: W },
  "👋": { icon: HandMetal, color: W },
  "✋": { icon: HandMetal, color: W },
  "👍": { icon: ThumbsUp, color: W },
  "👎": { icon: ThumbsDown, color: W },
  "👁": { icon: Eye, color: W },
  "👁️": { icon: Eye, color: W },
  "👀": { icon: Eye, color: W },
  "🧠": { icon: Brain, color: W },
  "❤️": { icon: Heart, color: W },
  "💖": { icon: Heart, color: W },
  "💙": { icon: Heart, color: W },
  "💚": { icon: Heart, color: W },
  "💛": { icon: Heart, color: W },
  "🖤": { icon: Heart, color: W },
  "💜": { icon: Heart, color: W },
  // Objects & tools
  "📋": { icon: Clipboard, color: W },
  "📄": { icon: FileText, color: W },
  "📝": { icon: Pencil, color: W },
  "✏️": { icon: Pencil, color: W },
  "📎": { icon: Paperclip, color: W },
  "🔗": { icon: Link, color: W },
  "✂️": { icon: Scissors, color: W },
  "📌": { icon: MapPin, color: W },
  "📍": { icon: MapPin, color: W },
  "🏷️": { icon: Tag, color: W },
  "#️⃣": { icon: Hash, color: W },
  "📊": { icon: BarChart3, color: W },
  "📈": { icon: TrendingUp, color: W },
  "📉": { icon: TrendingUp, color: W },
  "📁": { icon: FolderOpen, color: W },
  "📂": { icon: FolderOpen, color: W },
  "📦": { icon: Package, color: W },
  "📖": { icon: BookOpen, color: W },
  "📚": { icon: BookOpen, color: W },
  "📕": { icon: BookOpen, color: W },
  "📗": { icon: BookOpen, color: W },
  "📘": { icon: BookOpen, color: W },
  "📙": { icon: BookOpen, color: W },
  "🔧": { icon: Wrench, color: W },
  "🔨": { icon: Hammer, color: W },
  "🛠️": { icon: Wrench, color: W },
  "⚙️": { icon: Settings, color: W },
  "🔑": { icon: Key, color: W },
  "🗝️": { icon: Key, color: W },
  "🔒": { icon: Lock, color: W },
  "🔓": { icon: Unlock, color: W },
  "🔍": { icon: Search, color: W },
  "🔎": { icon: Search, color: W },
  "🎯": { icon: Target, color: W },
  "🛡️": { icon: Shield, color: W },
  "🛡": { icon: Shield, color: W },
  "⚔️": { icon: Swords, color: W },
  "🧩": { icon: Puzzle, color: W },
  "🎲": { icon: Dice1, color: W },
  "🎮": { icon: Gamepad2, color: W },
  "🎨": { icon: Palette, color: W },
  "🖼️": { icon: Image, color: W },
  // Communication
  "💬": { icon: MessageCircle, color: W },
  "💭": { icon: MessageCircle, color: W },
  "🗣️": { icon: MessageCircle, color: W },
  "📧": { icon: Mail, color: W },
  "✉️": { icon: Mail, color: W },
  "📩": { icon: Mail, color: W },
  "📨": { icon: Mail, color: W },
  "📮": { icon: Mail, color: W },
  "📤": { icon: Upload, color: W },
  "📥": { icon: Download, color: W },
  "📞": { icon: Phone, color: W },
  "📱": { icon: Smartphone, color: W },
  "📲": { icon: Smartphone, color: W },
  "🔔": { icon: Bell, color: W },
  "🔕": { icon: Bell, color: W },
  "📢": { icon: Volume2, color: W },
  "📣": { icon: Volume2, color: W },
  "🔊": { icon: Volume2, color: W },
  // Tech
  "💻": { icon: Monitor, color: W },
  "🖥️": { icon: Monitor, color: W },
  "🖱️": { icon: Monitor, color: W },
  "⌨️": { icon: Terminal, color: W },
  "🌐": { icon: Globe, color: W },
  "📡": { icon: Wifi, color: W },
  "☁️": { icon: Cloud, color: W },
  "🗄️": { icon: Database, color: W },
  "💾": { icon: Save, color: W },
  "💿": { icon: HardDrive, color: W },
  "🔌": { icon: Power, color: W },
  "🔋": { icon: Battery, color: W },
  "📻": { icon: Radio, color: W },
  "📺": { icon: Tv, color: W },
  "🎬": { icon: Film, color: W },
  "📷": { icon: Camera, color: W },
  "📸": { icon: Camera, color: W },
  "🎵": { icon: Music, color: W },
  "🎶": { icon: Music, color: W },
  // Business & money
  "💼": { icon: Briefcase, color: W },
  "💰": { icon: DollarSign, color: W },
  "💵": { icon: DollarSign, color: W },
  "💲": { icon: DollarSign, color: W },
  "💳": { icon: CreditCard, color: W },
  "🛒": { icon: ShoppingCart, color: W },
  "🏢": { icon: Building2, color: W },
  "🏗️": { icon: Building2, color: W },
  "🏭": { icon: Building2, color: W },
  "🏦": { icon: Building2, color: W },
  // Transport
  "🚀": { icon: Rocket, color: W },
  "✈️": { icon: Plane, color: W },
  "🚗": { icon: Car, color: W },
  "🚙": { icon: Car, color: W },
  "🚕": { icon: Car, color: W },
  "🚚": { icon: Truck, color: W },
  "🚛": { icon: Truck, color: W },
  "🚲": { icon: Bike, color: W },
  "⚓": { icon: Anchor, color: W },
  "🧭": { icon: Compass, color: W },
  // Nature & weather
  "🏔️": { icon: Mountain, color: W },
  "⛰️": { icon: Mountain, color: W },
  "🌲": { icon: TreePine, color: W },
  "🌳": { icon: TreePine, color: W },
  "🌿": { icon: TreePine, color: W },
  "🍀": { icon: TreePine, color: W },
  "🌸": { icon: Flower2, color: W },
  "🌺": { icon: Flower2, color: W },
  "🌻": { icon: Flower2, color: W },
  "🌹": { icon: Flower2, color: W },
  "☀️": { icon: Sun, color: W },
  "🌞": { icon: Sun, color: W },
  "🌙": { icon: Moon, color: W },
  "🌧️": { icon: CloudRain, color: W },
  "❄️": { icon: Snowflake, color: W },
  "💨": { icon: Wind, color: W },
  "💧": { icon: Droplets, color: W },
  // Time & calendar
  "🕐": { icon: Clock, color: W },
  "🕑": { icon: Clock, color: W },
  "🕒": { icon: Clock, color: W },
  "🕓": { icon: Clock, color: W },
  "🕔": { icon: Clock, color: W },
  "🕕": { icon: Clock, color: W },
  "🕖": { icon: Clock, color: W },
  "🕗": { icon: Clock, color: W },
  "🕘": { icon: Clock, color: W },
  "🕙": { icon: Clock, color: W },
  "🕚": { icon: Clock, color: W },
  "🕛": { icon: Clock, color: W },
  "⏰": { icon: Clock, color: W },
  "⏱️": { icon: Clock, color: W },
  "⏲️": { icon: Clock, color: W },
  "📅": { icon: Calendar, color: W },
  "📆": { icon: Calendar, color: W },
  "🗓️": { icon: Calendar, color: W },
  // Misc
  "🎁": { icon: Gift, color: W },
  "🏠": { icon: Home, color: W },
  "🏡": { icon: Home, color: W },
  "🔖": { icon: Bookmark, color: W },
  "🏳️": { icon: Flag, color: W },
  "🏴": { icon: Flag, color: W },
  "🚩": { icon: Flag, color: W },
  "🎓": { icon: GraduationCap, color: W },
  "🔬": { icon: Microscope, color: W },
  "🩺": { icon: Stethoscope, color: W },
  "💊": { icon: Pill, color: W },
  "🚨": { icon: Siren, color: W },
  "🗑️": { icon: Trash2, color: W },
  "⏩": { icon: ChevronRight, color: W },
  "💪": { icon: Zap, color: W },
  "🤔": { icon: Info, color: W },
  "🤖": { icon: Cpu, color: W },
  "📏": { icon: ArrowRight, color: W },
  "ℹ️": { icon: Info, color: W },
  "🔶": { icon: Circle, color: W },
  "🔷": { icon: Circle, color: W },
  "🔸": { icon: Circle, color: W },
  "🔹": { icon: Circle, color: W },
  "▪️": { icon: Square, color: W },
  "▫️": { icon: Square, color: W },
  "◾": { icon: Square, color: W },
  "◽": { icon: Square, color: W },
  "🔲": { icon: Square, color: W },
  "🔳": { icon: Square, color: W },
  "📐": { icon: ArrowRight, color: W },
  "💫": { icon: Sparkles, color: W },
  "🪄": { icon: Sparkles, color: W },
  "⚖️": { icon: MoreHorizontal, color: W },
  "📃": { icon: FileText, color: W },
  "📑": { icon: FileText, color: W },
  "📒": { icon: BookOpen, color: W },
  "📓": { icon: BookOpen, color: W },
  "📔": { icon: BookOpen, color: W },
  "🗂️": { icon: FolderOpen, color: W },
  "🗃️": { icon: Database, color: W },
  "🏁": { icon: Flag, color: W },
  "🎪": { icon: Target, color: W },
  "🔮": { icon: Circle, color: W },
  "💥": { icon: Zap, color: W },
  "💢": { icon: X, color: W },
  "🔆": { icon: Sun, color: W },
  "🔅": { icon: Sun, color: W },
  "💤": { icon: Moon, color: W },
  "📰": { icon: FileText, color: W },
  "🗞️": { icon: FileText, color: W },
  "🎉": { icon: Sparkles, color: W },
  "🎊": { icon: Sparkles, color: W },
  "🎈": { icon: Sparkles, color: W },
  "🎀": { icon: Gift, color: W },
  "🧮": { icon: BarChart3, color: W },
  "🪧": { icon: FileText, color: W },
  "🔐": { icon: Lock, color: W },
  "🗺️": { icon: Compass, color: W },
  "🧲": { icon: Target, color: W },
  "💸": { icon: DollarSign, color: W },
  "🪙": { icon: DollarSign, color: W },
  "📇": { icon: Clipboard, color: W },
  "🧰": { icon: Wrench, color: W },
  "⛏️": { icon: Hammer, color: W },
  "🪝": { icon: Anchor, color: W },
  "🧪": { icon: Microscope, color: W },
  "🧬": { icon: Code, color: W },
  "🏵️": { icon: Award, color: W },
  "🎗️": { icon: Award, color: W },
  "🪪": { icon: CreditCard, color: W },
  "🔩": { icon: Settings, color: W },
  "🧱": { icon: Building2, color: W },
  "🪨": { icon: Mountain, color: W },
  "⏳": { icon: Clock, color: W },
  "⌛": { icon: Clock, color: W },
  "🖨️": { icon: Copy, color: W },
};

// Build regex from known emojis (longer matches first)
const EMOJI_REGEX = new RegExp(
  Object.keys(EMOJI_ICON_MAP)
    .sort((a, b) => b.length - a.length)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "g"
);

// Catch-all regex for any remaining emoji characters — these get silently stripped
// Uses surrogate pairs to match emoji in ES5-compatible way
// eslint-disable-next-line no-misleading-character-class
const CATCHALL_EMOJI_REGEX = /(?:[\u2600-\u27BF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDDFF\uDE00-\uDEFF]|[\uFE00-\uFE0F]|\u200D|\u20E3)+/g;

function renderTextWithIcons(text: string): ReactNode {
  EMOJI_REGEX.lastIndex = 0;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = EMOJI_REGEX.exec(text)) !== null) {
    const emoji = match[0];
    const mapping = EMOJI_ICON_MAP[emoji];
    if (!mapping) continue;

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const IconComp = mapping.icon;
    parts.push(
      <IconComp
        key={`emoji-${key++}`}
        className="inline-block align-middle mx-[1px] -mt-[1px]"
        style={{ width: 14, height: 14, color: mapping.color }}
      />
    );
    lastIndex = match.index + emoji.length;
  }

  if (parts.length === 0) {
    // No known emojis found — strip any remaining unicode emojis
    return text.replace(CATCHALL_EMOJI_REGEX, "").replace(/\s{2,}/g, " ").trim() || text;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  // Strip any remaining emojis from text segments
  return <>{parts.map((part) =>
    typeof part === "string"
      ? part.replace(CATCHALL_EMOJI_REGEX, "").replace(/\s{2,}/g, " ")
      : part
  )}</>;
}

// Recursively walk React children, replacing string nodes with logo-injected versions
function processChildren(children: ReactNode): ReactNode {
  if (typeof children === "string") {
    // First replace emojis with icons, then inject brand logos into remaining text segments
    const withIcons = renderTextWithIcons(children);
    if (typeof withIcons === "string") return renderTextWithLogos(withIcons);
    // If emoji replacement produced React nodes, we need to process text segments for logos
    if (Array.isArray((withIcons as React.ReactElement<{ children?: ReactNode[] }>)?.props?.children)) {
      const processed = ((withIcons as React.ReactElement<{ children?: ReactNode[] }>).props.children as ReactNode[]).map((node: ReactNode, i: number) => {
        if (typeof node === "string") return <span key={`logo-wrap-${i}`}>{renderTextWithLogos(node)}</span>;
        return node;
      });
      return <>{processed}</>;
    }
    return withIcons;
  }
  if (Array.isArray(children)) return children.map((c, i) => <span key={i}>{processChildren(c)}</span>);
  return children;
}

// Wrap a markdown component to inject brand logos into its text children
function withLogos<P extends { children?: ReactNode }>(
  Component: (props: P) => ReactNode
): (props: P) => ReactNode {
  return (props: P) => Component({ ...props, children: processChildren(props.children) });
}

/* ── Code block with copy button ──────────────────────────────────────────── */

function CodeBlockWithCopy({ children, language }: { children: ReactNode; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = extractText(children);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [children]);

  return (
    <div className="relative group/code">
      {language && (
        <span className="absolute top-2 left-3 text-[10px] font-mono text-[rgba(255,255,255,0.3)]">
          {language}
        </span>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 rounded text-[rgba(255,255,255,0.25)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.06)] opacity-0 group-hover/code:opacity-100 transition-all"
        title="Copy code"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
        )}
      </button>
      <code className={`block bg-[rgba(255,255,255,0.04)] rounded-lg ${language ? "pt-7" : "pt-3"} pb-3 px-3 text-xs font-mono text-[rgba(255,255,255,0.88)] overflow-x-auto mb-3 last:mb-0`}>
        {children}
      </code>
    </div>
  );
}

/** Recursively extract plain text from React children (for copy) */
function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) return extractText((node as React.ReactElement<{ children?: ReactNode }>).props.children);
  return "";
}

export const mdComponents: Components = {
  p: withLogos(({ children }) => <p className="mb-3 last:mb-0">{children}</p>),
  strong: withLogos(({ children }) => <span className="text-white">{children}</span>),
  em: withLogos(({ children }) => <em className="text-[rgba(255,255,255,0.8)] italic">{children}</em>),
  ul: ({ children }) => <ul className="mb-3 last:mb-0 space-y-1.5 pl-1">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 last:mb-0 space-y-1.5 pl-1 list-none counter-reset-[li]">{children}</ol>,
  li: withLogos(({ children }) => (
    <li className="flex gap-2 text-sm leading-relaxed text-[rgba(255,255,255,0.92)]">
      <span className="text-[rgba(255,255,255,0.25)] select-none shrink-0 mt-[2px] text-[8px]">●</span>
      <span className="flex-1 min-w-0">{children}</span>
    </li>
  )),
  h1: withLogos(({ children }) => <p className="font-semibold text-white mb-2">{children}</p>),
  h2: withLogos(({ children }) => <p className="font-semibold text-white mb-2">{children}</p>),
  h3: withLogos(({ children }) => <p className="font-medium text-white mb-1.5">{children}</p>),
  h4: withLogos(({ children }) => <p className="font-medium text-[rgba(255,255,255,0.92)] mb-1">{children}</p>),
  h5: withLogos(({ children }) => <p className="font-medium text-[rgba(255,255,255,0.85)] mb-1">{children}</p>),
  h6: withLogos(({ children }) => <p className="font-medium text-[rgba(255,255,255,0.85)] mb-1">{children}</p>),
  hr: () => <div className="my-3 border-t border-[rgba(255,255,255,0.06)]" />,
  blockquote: ({ children }) => <blockquote className="border-l-2 border-[rgba(255,255,255,0.12)] pl-3 text-[rgba(255,255,255,0.75)] mb-3 last:mb-0">{children}</blockquote>,
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      const lang = className?.replace("language-", "") || undefined;
      return <CodeBlockWithCopy language={lang}>{children}</CodeBlockWithCopy>;
    }
    return <code className="bg-[rgba(255,255,255,0.06)] rounded px-1.5 py-0.5 text-xs font-mono text-[rgba(255,255,255,0.7)]">{children}</code>;
  },
  pre: ({ children }) => <pre className="mb-3 last:mb-0">{children}</pre>,
  a: ({ href, children }) => <a href={href} className="text-[rgba(255,255,255,0.7)] underline hover:text-white" target="_blank" rel="noopener noreferrer">{children}</a>,
  table: ({ children }) => <div className="overflow-x-auto mb-3 last:mb-0"><table className="text-xs w-full">{children}</table></div>,
  th: withLogos(({ children }) => <th className="text-left font-medium text-[rgba(255,255,255,0.65)] pb-1.5 pr-4 border-b border-[rgba(255,255,255,0.06)]">{children}</th>),
  td: withLogos(({ children }) => <td className="py-1.5 pr-4 text-[rgba(255,255,255,0.9)] border-b border-[rgba(255,255,255,0.04)]">{children}</td>),
};

/** Pre-process task list syntax into visual checkboxes */
function preprocessTaskLists(md: string): string {
  return md
    .replace(/^(\s*)- \[x\] /gm, "$1- ✅ ")
    .replace(/^(\s*)- \[ \] /gm, "$1- ⬜ ");
}

/** Strip all bold markers (**) from content — they cause more rendering
 *  problems than they solve and don't add to the premium feel.
 *  Also ensure single newlines between content blocks become double newlines
 *  so react-markdown creates proper paragraph breaks.
 */
function cleanMarkdown(md: string): string {
  // Strip all ** bold markers
  let result = md.replace(/\*\*/g, "");

  // Ensure proper paragraph breaks: if a line ends with text and next line
  // starts with text (not a list, header, table, or blank), add extra newline
  result = result.replace(/([^\n])\n(?=(?![#\-*|>\s\n\d+\.])[^\n])/g, "$1\n\n");

  return result;
}

/**
 * Parse GFM pipe tables from markdown content.
 * Returns structured table data instead of HTML strings.
 */
type ParsedTable = { headers: string[]; rows: string[][] };
type ContentSegment = { type: "markdown"; text: string } | { type: "table"; table: ParsedTable };

function splitTablesFromMarkdown(md: string): ContentSegment[] {
  const lines = md.split("\n");
  const segments: ContentSegment[] = [];
  let markdownBuf: string[] = [];
  let i = 0;

  function flushMarkdown() {
    if (markdownBuf.length > 0) {
      segments.push({ type: "markdown", text: markdownBuf.join("\n") });
      markdownBuf = [];
    }
  }

  while (i < lines.length) {
    if (
      i + 1 < lines.length &&
      lines[i].trim().startsWith("|") &&
      lines[i].trim().endsWith("|") &&
      /^\|[\s:]*-{2,}[\s:]*(\|[\s:]*-{2,}[\s:]*)*\|$/.test(lines[i + 1].trim())
    ) {
      flushMarkdown();
      const headers = lines[i].split("|").slice(1, -1).map(c => c.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        rows.push(lines[i].split("|").slice(1, -1).map(c => c.trim()));
        i++;
      }
      segments.push({ type: "table", table: { headers, rows } });
    } else {
      markdownBuf.push(lines[i]);
      i++;
    }
  }
  flushMarkdown();
  return segments;
}

/** Render a cell's text content with emoji→icon and brand logos */
function renderCellContent(text: string): ReactNode {
  // Strip any remaining bold markers from table cells
  const clean = text.replace(/\*\*/g, "");
  return processChildren(clean);
}

/** Strip emojis, bold markers, and markdown syntax for plain text previews (memories, etc.) */
export function cleanTextForPreview(text: string): string {
  return text
    .replace(CATCHALL_EMOJI_REGEX, "")
    .replace(EMOJI_REGEX, "")
    .replace(/\*\*/g, "")
    .replace(/[#_~`>|[\]-]/g, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const MarkdownContent = memo(function MarkdownContent({ content }: { content: string }) {
  const segments = useMemo(() => splitTablesFromMarkdown(cleanMarkdown(preprocessTaskLists(content))), [content]);

  return (
    <>
      {segments.map((seg, idx) => {
        if (seg.type === "markdown") {
          return (
            <ReactMarkdown key={idx} components={mdComponents}>
              {seg.text}
            </ReactMarkdown>
          );
        }
        // Render table as React components directly — no HTML string parsing needed
        const { headers, rows } = seg.table;
        return (
          <div key={idx} className="overflow-x-auto mb-3 last:mb-0">
            <table className="text-xs w-full">
              <thead>
                <tr>
                  {headers.map((h, hi) => (
                    <th key={hi} className="text-left font-medium text-[rgba(255,255,255,0.65)] pb-1.5 pr-4 border-b border-[rgba(255,255,255,0.06)]">
                      {renderCellContent(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-1.5 pr-4 text-[rgba(255,255,255,0.9)] border-b border-[rgba(255,255,255,0.04)]">
                        {renderCellContent(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
});

export default MarkdownContent;
