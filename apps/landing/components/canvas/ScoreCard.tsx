"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import InsightsSection from "./shared/InsightsSection";
import NumberTicker from "./shared/NumberTicker";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MetricStatus = "good" | "warning" | "critical";

interface Metric {
  name: string;
  score: number;
  detail: string;
  status?: MetricStatus;
}

export interface ScoreCardProps {
  title: string;
  overallScore: number;
  metrics: Metric[];
  insights?: string[];
  recommendations?: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function grade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function overallColor(score: number) {
  if (score >= 80) return { stroke: "#34d399", glow: "rgba(52,211,153,0.15)", text: "text-emerald-400" };
  if (score >= 60) return { stroke: "#DA4E24", glow: "rgba(218,78,36,0.15)", text: "text-[#DA4E24]" };
  if (score >= 40) return { stroke: "#fbbf24", glow: "rgba(251,191,36,0.15)", text: "text-amber-400" };
  return { stroke: "#f87171", glow: "rgba(248,113,113,0.15)", text: "text-red-400" };
}

function statusConfig(status: MetricStatus) {
  switch (status) {
    case "good":
      return {
        Icon: CheckCircle,
        label: "Passed",
        iconColor: "text-emerald-400",
        bg: "bg-emerald-400/[0.04]",
        border: "border-emerald-400/[0.08]",
        stroke: "#34d399",
      };
    case "warning":
      return {
        Icon: AlertTriangle,
        label: "Warning",
        iconColor: "text-amber-400",
        bg: "bg-amber-400/[0.04]",
        border: "border-amber-400/[0.08]",
        stroke: "#fbbf24",
      };
    case "critical":
      return {
        Icon: XCircle,
        label: "Critical",
        iconColor: "text-red-400",
        bg: "bg-red-400/[0.04]",
        border: "border-red-400/[0.08]",
        stroke: "#f87171",
      };
  }
}

function resolveStatus(metric: Metric): MetricStatus {
  if (metric.status) return metric.status;
  if (metric.score >= 80) return "good";
  if (metric.score >= 50) return "warning";
  return "critical";
}

// ---------------------------------------------------------------------------
// Animated SVG score circle
// ---------------------------------------------------------------------------

function ScoreCircle({
  score,
  size,
  strokeWidth,
  delay,
  className,
}: {
  score: number;
  size: number;
  strokeWidth: number;
  delay: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (pct / 100) * circumference;
  const colors = overallColor(score);

  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut", delay }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Metric card
// ---------------------------------------------------------------------------

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const status = resolveStatus(metric);
  const config = statusConfig(status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.2 + index * 0.04 }}
      className={cn(
        "relative flex min-h-[120px] flex-col justify-between overflow-hidden rounded-xl border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        config.border,
        config.bg,
      )}
    >
      {/* Top row: name + small score circle */}
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
          {metric.name}
        </span>
        <ScoreCircle
          score={metric.score}
          size={36}
          strokeWidth={3}
          delay={0.3 + index * 0.04}
        />
      </div>

      {/* Bottom section */}
      <div className="mt-auto space-y-1.5">
        <div className="flex items-center gap-1.5">
          <config.Icon className={cn("h-3.5 w-3.5", config.iconColor)} />
          <span className={cn("text-[11px] font-medium", config.iconColor)}>
            {config.label}
          </span>
        </div>
        <p className="line-clamp-2 text-[10px] leading-relaxed text-white/70">
          {metric.detail}
        </p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ScoreCard({
  title,
  overallScore,
  metrics = [],
  insights,
  recommendations,
}: ScoreCardProps) {
  const colors = overallColor(overallScore);

  // Summary counts
  const counts = React.useMemo(() => {
    let good = 0;
    let warning = 0;
    let critical = 0;
    for (const m of metrics) {
      const s = resolveStatus(m);
      if (s === "good") good++;
      else if (s === "warning") warning++;
      else critical++;
    }
    return { good, warning, critical };
  }, [metrics]);

  return (
    <div className="w-full">
      {/* ---- Hero section ---- */}
      <div className="relative flex items-center gap-8 pb-7">
        {/* Glow */}
        <div
          className="pointer-events-none absolute -left-4 -top-4 h-32 w-32 rounded-full blur-3xl"
          style={{ background: colors.glow, opacity: 0.15 }}
        />

        {/* Score circle */}
        <div className="relative">
          <ScoreCircle
            score={overallScore}
            size={96}
            strokeWidth={5}
            delay={0}
          />
          {/* Centered number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <NumberTicker
              value={overallScore}
              duration={0.9}
              delay={0.3}
              className={cn("text-2xl font-bold tabular-nums", colors.text)}
            />
          </div>
        </div>

        {/* Title + grade + summary */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-xs font-bold",
                colors.text,
                "bg-white/[0.04]",
              )}
            >
              {grade(overallScore)}
            </span>
          </div>

          {/* Summary counts */}
          <div className="flex items-center gap-4 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {counts.good} passed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {counts.warning} warnings
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              {counts.critical} critical
            </span>
          </div>
        </div>
      </div>

      {/* ---- Divider ---- */}
      <div className="mb-6 h-px bg-white/[0.07]" />

      {/* ---- Metric grid ---- */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {metrics.map((metric, i) => (
          <MetricCard key={metric.name} metric={metric} index={i} />
        ))}
      </div>

      {/* ---- Insights ---- */}
      <InsightsSection insights={insights || []} recommendations={recommendations} />
    </div>
  );
}
