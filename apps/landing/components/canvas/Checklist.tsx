"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import InsightsSection from "./shared/InsightsSection";
import { hoverCard } from "./shared/tokens";
import NumberTicker from "./shared/NumberTicker";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CheckStatus = "pass" | "fail" | "warning" | "na" | "pending" | "done" | "completed" | "in_progress";

interface CheckItem {
  label: string;
  status: CheckStatus;
  detail?: string;
  note?: string;
}

interface RawCheckSection {
  name?: string;
  heading?: string;
  items: CheckItem[];
}

export interface ChecklistProps {
  title: string;
  sections: RawCheckSection[];
  insights?: string[];
  recommendations?: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusConfig(status: string) {
  switch (status) {
    case "pass":
    case "done":
    case "completed":
      return {
        Icon: CheckCircle2,
        color: "text-emerald-400",
        bg: "bg-emerald-400/[0.06]",
        border: "border-emerald-400/[0.10]",
        label: "Pass",
      };
    case "fail":
    case "failed":
      return {
        Icon: AlertCircle,
        color: "text-red-400",
        bg: "bg-red-400/[0.06]",
        border: "border-red-400/[0.10]",
        label: "Fail",
      };
    case "warning":
    case "in_progress":
      return {
        Icon: AlertCircle,
        color: "text-amber-400",
        bg: "bg-amber-400/[0.06]",
        border: "border-amber-400/[0.10]",
        label: status === "in_progress" ? "In Progress" : "Warning",
      };
    default:
      // "pending", "na", or any unknown status
      return {
        Icon: Circle,
        color: "text-white/50",
        bg: "bg-white/[0.02]",
        border: "border-white/[0.06]",
        label: status === "na" ? "N/A" : "Pending",
      };
  }
}

function sectionScore(items: CheckItem[]): {
  pass: number;
  fail: number;
  warning: number;
  total: number;
  pct: number;
} {
  const scorable = items.filter((i) => i.status !== "na");
  const pass = items.filter((i) => i.status === "pass").length;
  const fail = items.filter((i) => i.status === "fail").length;
  const warning = items.filter((i) => i.status === "warning").length;
  const total = scorable.length;
  const pct = total > 0 ? Math.round((pass / total) * 100) : 0;
  return { pass, fail, warning, total, pct };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHeader({
  name,
  score,
  index,
}: {
  name: string;
  score: ReturnType<typeof sectionScore>;
  index: number;
}) {
  const barColor =
    score.pct >= 80
      ? "bg-emerald-400"
      : score.pct >= 50
        ? "bg-amber-400"
        : "bg-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="flex items-center gap-3"
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-white/50 flex-1">
        {name}
      </span>
      <div className="flex items-center gap-2">
        <div className="w-24 h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full", barColor)}
            initial={{ width: 0 }}
            animate={{ width: `${score.pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 + index * 0.06 }}
          />
        </div>
        <span className="text-[10px] font-bold tabular-nums text-white/60 w-8 text-right">
          {score.pass}/{score.total}
        </span>
      </div>
    </motion.div>
  );
}

function CheckRow({
  item,
  delay,
}: {
  item: CheckItem;
  delay: number;
}) {
  const config = statusConfig(item.status);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay }}
      className={cn(
        "flex items-start gap-3 rounded-lg border px-3 py-2.5",
        config.bg,
        config.border,
        hoverCard,
      )}
    >
      <config.Icon className={cn("h-4 w-4 shrink-0 mt-0.5", config.color)} />
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium text-white/80 leading-tight">
          {item.label}
        </p>
        {item.detail && (
          <p className="text-[11px] text-white/70 leading-relaxed mt-0.5">
            {item.detail}
          </p>
        )}
      </div>
      <span
        className={cn(
          "text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5",
          config.color,
        )}
      >
        {config.label}
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Checklist({
  title,
  sections,
  insights,
  recommendations,
}: ChecklistProps) {
  // Normalize sections: accept "heading" or "name", and "note" or "detail"
  const safeSections = (sections ?? []).map((s) => ({
    name: s.name || s.heading || "Untitled",
    items: (s.items ?? []).map((item) => ({
      ...item,
      detail: item.detail || item.note,
    })),
  }));

  // Overall score
  const overall = React.useMemo(() => {
    const all = safeSections.flatMap((s) => s.items);
    return sectionScore(all);
  }, [safeSections]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[15px] font-semibold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          <NumberTicker
            value={overall.pct}
            duration={0.7}
            format={(n) => `${Math.round(n)}%`}
            className={cn(
              "text-lg font-black tabular-nums",
              overall.pct >= 80
                ? "text-emerald-400"
                : overall.pct >= 50
                  ? "text-amber-400"
                  : "text-red-400",
            )}
          />
          <span className="text-[10px] text-white/60">
            ({overall.pass}/{overall.total} passed)
          </span>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {safeSections.map((section, si) => {
          const score = sectionScore(section.items);
          return (
            <div key={si} className="space-y-2.5">
              <SectionHeader name={section.name} score={score} index={si} />
              <div className="space-y-1.5 pl-0.5">
                {section.items.map((item, ii) => (
                  <CheckRow
                    key={ii}
                    item={item}
                    delay={0.1 + si * 0.06 + ii * 0.03}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <InsightsSection insights={insights || []} recommendations={recommendations} />
    </div>
  );
}
