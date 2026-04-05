"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import InsightsSection from "./shared/InsightsSection";
import { brand, status, text, tpl, chartTheme } from "./shared/tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KPI {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "flat";
  status?: "good" | "warning" | "critical";
}

interface Stage {
  name: string;
  range: string;
  status: "completed" | "active" | "upcoming";
  description: string;
  milestones: string[];
}

interface ChartConfig {
  type: "line" | "bar" | "area";
  data: Array<{ name: string; value: number; [key: string]: unknown }>;
  xKey?: string;
  yKey?: string;
}

interface BreakdownItem {
  label: string;
  value: string;
  percentage?: number;
}

export interface MetricsDashboardProps {
  title: string;
  period?: string;
  kpis: KPI[];
  stages?: Stage[];
  chart?: ChartConfig;
  breakdown?: BreakdownItem[];
  insights?: string[];
  recommendations?: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
} as const;

function trendColor(trend?: string, kpiStatus?: string): string {
  if (kpiStatus && kpiStatus in status) {
    return status[kpiStatus as keyof typeof status].text;
  }
  if (trend === "up") return "text-emerald-400";
  if (trend === "down") return "text-red-400";
  return "text-white/40";
}

function statusBorder(s?: string): string {
  if (s === "good") return "border-l-emerald-400";
  if (s === "warning") return "border-l-amber-400";
  if (s === "critical") return "border-l-red-400";
  return "border-l-transparent";
}

function stageStyle(s: string) {
  if (s === "completed")
    return {
      dot: "bg-emerald-400",
      line: "bg-emerald-400",
      text: "text-white/80",
      bg: "bg-emerald-400/[0.06]",
      border: "border-emerald-400/[0.10]",
    };
  if (s === "active")
    return {
      dot: brand.dot,
      line: brand.line,
      text: brand.text,
      bg: brand.bg,
      border: brand.border,
    };
  return {
    dot: "bg-white/20",
    line: "bg-white/[0.06]",
    text: "text-white/40",
    bg: "bg-white/[0.02]",
    border: "border-white/[0.06]",
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function KPICard({ kpi, index }: { kpi: KPI; index: number }) {
  const TrendIcon = kpi.trend ? trendIcons[kpi.trend] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={cn(
        tpl.cardHover,
        "border-l-2 p-5",
        statusBorder(kpi.status),
      )}
    >
      <p className={cn(text.micro, "text-white/50")}>
        {kpi.label}
      </p>
      <p className={cn(text.value, "mt-2")}>
        {kpi.value}
      </p>
      {kpi.change && (
        <div className="mt-3 flex items-center gap-1.5">
          {TrendIcon && (
            <TrendIcon
              className={cn("h-3.5 w-3.5", trendColor(kpi.trend, kpi.status))}
            />
          )}
          <span
            className={cn(
              text.micro,
              "tabular-nums",
              trendColor(kpi.trend, kpi.status),
            )}
          >
            {kpi.change}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function StagesTimeline({ stages }: { stages: Stage[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-8"
    >
      <p className={cn(text.sectionLabel, "mb-5")}>
        Stages
      </p>
      <div className="flex items-start gap-0">
        {stages.map((stage, i) => {
          const s = stageStyle(stage.status);
          return (
            <div key={i} className="flex flex-1 flex-col items-center">
              {/* Connector + dot */}
              <div className="flex w-full items-center">
                {i > 0 && (
                  <div className={cn("h-0.5 flex-1", stageStyle(stages[i - 1].status).line)} />
                )}
                <div
                  className={cn(
                    "h-3 w-3 shrink-0 rounded-full border-2",
                    stage.status === "active"
                      ? `${brand.borderSolid} ${brand.bgSolid}`
                      : stage.status === "completed"
                        ? "border-emerald-400 bg-emerald-400"
                        : "border-white/20 bg-transparent",
                  )}
                />
                {i < stages.length - 1 && (
                  <div className={cn("h-0.5 flex-1", s.line)} />
                )}
              </div>
              {/* Label */}
              <div className="mt-3 w-full px-1 text-center">
                <p className={cn("text-[11px] font-semibold font-heading", s.text)}>
                  {stage.name}
                </p>
                <p className={cn(text.faint, "mt-0.5 text-white/50")}>
                  {stage.range}
                </p>
                <p className={cn(text.body, "mt-1 text-[10px] text-white/60")}>
                  {stage.description}
                </p>
                {stage.milestones.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {stage.milestones.map((m, mi) => (
                      <p key={mi} className={cn(text.detail, "text-white/60")}>
                        • {m}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ChartSection({ chart }: { chart: ChartConfig }) {
  const xKey = chart.xKey ?? "name";
  const yKey = chart.yKey ?? "value";

  const chartContent = () => {
    switch (chart.type) {
      case "bar":
        return (
          <BarChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis
              dataKey={xKey}
              tick={chartTheme.tick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={chartTheme.tick}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={chartTheme.tooltip} />
            <Bar dataKey={yKey} fill={brand.hex} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case "area":
        return (
          <AreaChart data={chart.data}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={brand.hex} stopOpacity={0.2} />
                <stop offset="100%" stopColor={brand.hex} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis
              dataKey={xKey}
              tick={chartTheme.tick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={chartTheme.tick}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={chartTheme.tooltip} />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={brand.hex}
              fill="url(#areaGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        );
      default:
        return (
          <LineChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis
              dataKey={xKey}
              tick={chartTheme.tick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={chartTheme.tick}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={chartTheme.tooltip} />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={brand.hex}
              strokeWidth={2}
              dot={{ fill: brand.hex, r: 3 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-6"
    >
      <p className={cn(text.sectionLabel, "mb-4")}>
        Trend
      </p>
      <div className={cn(tpl.card, "p-5")}>
        <ResponsiveContainer width="100%" height={220}>
          {chartContent()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function BreakdownSection({ breakdown }: { breakdown: BreakdownItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="mt-6"
    >
      <p className={cn(text.sectionLabel, "mb-4")}>
        Breakdown
      </p>
      <div className="space-y-2">
        {breakdown.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.04 }}
            className={cn(
              tpl.card,
              "flex items-center gap-4 px-4 py-3",
            )}
          >
            <span className={cn(text.body, "flex-1 font-medium")}>{item.label}</span>
            {item.percentage !== undefined && (
              <div className="w-24 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", brand.bgSolid)}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(item.percentage, 100)}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 + i * 0.04 }}
                />
              </div>
            )}
            <span className={cn(text.detail, "font-semibold tabular-nums text-white/70")}>
              {item.value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function MetricsDashboard({
  title,
  period,
  kpis,
  stages,
  chart,
  breakdown,
  insights,
  recommendations,
}: MetricsDashboardProps) {
  const safeKpis = kpis ?? [];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={tpl.iconBox}>
            <BarChart3 className={cn("h-4 w-4", brand.text)} />
          </div>
          <h2 className={cn(text.title, "text-[15px]")}>{title}</h2>
        </div>
        {period && (
          <span className={cn(text.micro, "text-white/50 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1")}>
            {period}
          </span>
        )}
      </div>

      {/* KPI grid */}
      {safeKpis.length > 0 && (
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${Math.min(safeKpis.length, 3)}, minmax(0, 1fr))`,
          }}
        >
          {safeKpis.map((kpi, i) => (
            <KPICard key={i} kpi={kpi} index={i} />
          ))}
        </div>
      )}

      {/* Stages */}
      {stages && stages.length > 0 && <StagesTimeline stages={stages} />}

      {/* Chart */}
      {chart && chart.data && chart.data.length > 0 && (
        <ChartSection chart={chart} />
      )}

      {/* Breakdown */}
      {breakdown && breakdown.length > 0 && (
        <BreakdownSection breakdown={breakdown} />
      )}

      <InsightsSection insights={insights || []} recommendations={recommendations} />
    </div>
  );
}
