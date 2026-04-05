"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, AlertTriangle, Target, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import InsightsSection from "./shared/InsightsSection";
import { hoverCard, surface, brand } from "./shared/tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SwotItem {
  text: string;
  detail?: string;
}

export interface SwotGridProps {
  title?: string;
  strengths: SwotItem[];
  weaknesses: SwotItem[];
  opportunities: SwotItem[];
  threats: SwotItem[];
  insights?: string[];
  recommendations?: string[];
}

// ---------------------------------------------------------------------------
// Quadrant config
// ---------------------------------------------------------------------------

const QUADRANTS = [
  {
    key: "strengths" as const,
    label: "Strengths",
    letter: "S",
    Icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-400/[0.03]",
    border: "border-emerald-400/[0.08]",
    itemBg: "bg-emerald-400/[0.04]",
    itemBorder: "border-emerald-400/[0.06]",
    dot: "bg-emerald-400",
    hex: "#34d399",
  },
  {
    key: "weaknesses" as const,
    label: "Weaknesses",
    letter: "W",
    Icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-400/[0.03]",
    border: "border-red-400/[0.08]",
    itemBg: "bg-red-400/[0.04]",
    itemBorder: "border-red-400/[0.06]",
    dot: "bg-red-400",
    hex: "#f87171",
  },
  {
    key: "opportunities" as const,
    label: "Opportunities",
    letter: "O",
    Icon: Target,
    color: "text-[#DA4E24]",
    bg: "bg-[#DA4E24]/[0.03]",
    border: "border-[#DA4E24]/[0.08]",
    itemBg: "bg-[#DA4E24]/[0.04]",
    itemBorder: "border-[#DA4E24]/[0.06]",
    dot: "bg-[#DA4E24]",
    hex: "#DA4E24",
  },
  {
    key: "threats" as const,
    label: "Threats",
    letter: "T",
    Icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-400/[0.03]",
    border: "border-amber-400/[0.08]",
    itemBg: "bg-amber-400/[0.04]",
    itemBorder: "border-amber-400/[0.06]",
    dot: "bg-amber-400",
    hex: "#fbbf24",
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SwotQuadrant({
  config,
  items,
  delay,
}: {
  config: (typeof QUADRANTS)[number];
  items: SwotItem[];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
      className={cn(
        "relative flex flex-col gap-3 rounded-xl border p-4 min-h-[140px] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        config.bg,
        config.border,
      )}
    >
      {/* Watermark letter */}
      <div
        className="absolute -bottom-4 -right-2 text-[80px] font-black leading-none pointer-events-none select-none"
        style={{ color: `${config.hex}06` }}
      >
        {config.letter}
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 relative z-10">
        <config.Icon className={cn("h-4 w-4", config.color)} />
        <span
          className={cn(
            "text-[11px] font-bold uppercase tracking-wider",
            config.color,
          )}
        >
          {config.label}
        </span>
        <span className="ml-auto text-[10px] font-bold tabular-nums text-white/50">
          {items.length}
        </span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-1.5 relative z-10">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 + i * 0.04, duration: 0.25 }}
            className={cn(
              "flex items-start gap-2 rounded-lg border px-3 py-2",
              config.itemBg,
              config.itemBorder,
              hoverCard,
            )}
          >
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0 mt-1.5",
                config.dot,
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-white/80 leading-tight">
                {item.text}
              </p>
              {item.detail && (
                <p className="text-[11px] text-white/70 leading-relaxed mt-0.5">
                  {item.detail}
                </p>
              )}
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <span className="text-[10px] text-white/50 italic">
            No items identified
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function SwotGrid({
  title,
  strengths = [],
  weaknesses = [],
  opportunities = [],
  threats = [],
  insights,
  recommendations,
}: SwotGridProps) {
  const data: Record<string, SwotItem[]> = {
    strengths,
    weaknesses,
    opportunities,
    threats,
  };

  const totalItems =
    strengths.length + weaknesses.length + opportunities.length + threats.length;

  // Internal vs external split
  const internalCount = strengths.length + weaknesses.length;
  const externalCount = opportunities.length + threats.length;

  return (
    <div className="w-full">
      {/* Summary header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", brand.iconBox)}>
            <BarChart3 className="w-4 h-4 text-[#DA4E24]" />
          </div>
          <h2 className="text-[15px] font-semibold text-white">
            {title || "SWOT Analysis"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tabular-nums text-white/50 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1">
            {totalItems} factors
          </span>
          <span className="text-[10px] text-white/50 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1">
            {internalCount} int · {externalCount} ext
          </span>
        </div>
      </div>

      {/* Internal / External row labels + 2x2 grid */}
      <div className="relative">
        {/* Row labels */}
        <div className="absolute -left-3 top-0 bottom-0 flex flex-col pointer-events-none z-10">
          <div className="flex-1 flex items-center">
            <span className="text-[8px] font-bold uppercase tracking-wider text-white/40 -rotate-90 origin-center whitespace-nowrap">
              Internal
            </span>
          </div>
          <div className="flex-1 flex items-center">
            <span className="text-[8px] font-bold uppercase tracking-wider text-white/40 -rotate-90 origin-center whitespace-nowrap">
              External
            </span>
          </div>
        </div>

        {/* Column labels */}
        <div className="ml-4 flex justify-around mb-2">
          <span className="text-[8px] font-bold uppercase tracking-wider text-white/40">
            Helpful
          </span>
          <span className="text-[8px] font-bold uppercase tracking-wider text-white/40">
            Harmful
          </span>
        </div>

        {/* Grid: S/W top row (internal), O/T bottom row (external) */}
        <div className="ml-4 grid grid-cols-2 gap-3">
          {QUADRANTS.map((q, i) => (
            <SwotQuadrant
              key={q.key}
              config={q}
              items={data[q.key]}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className={cn(
          "mt-4 flex items-center gap-4 rounded-lg border px-4 py-2.5",
          surface.subtle.border,
          surface.subtle.bg,
        )}
      >
        {QUADRANTS.map((q) => {
          const count = data[q.key].length;
          const pct = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
          return (
            <div key={q.key} className="flex items-center gap-2 flex-1">
              <div className={cn("w-2 h-2 rounded-full", q.dot)} />
              <span className="text-[10px] text-white/60">{q.label}</span>
              <span
                className={cn("text-[10px] font-bold tabular-nums ml-auto", q.color)}
              >
                {pct}%
              </span>
            </div>
          );
        })}
      </motion.div>

      <InsightsSection insights={insights || []} recommendations={recommendations} />
    </div>
  );
}
