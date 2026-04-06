"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
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

const CHART_COLORS = {
  primary: "#DA4E24",
  secondary: "#2dd4bf",
  muted: "rgba(255,255,255,0.08)",
} as const;

function trendColor(trend?: string, kpiStatus?: string): string {
  if (kpiStatus === "good") return "text-emerald-400";
  if (kpiStatus === "warning") return "text-amber-400";
  if (kpiStatus === "critical") return "text-red-400";
  if (trend === "up") return "text-emerald-400";
  if (trend === "down") return "text-red-400";
  return "text-white/40";
}

function trendBg(trend?: string, kpiStatus?: string): string {
  if (kpiStatus === "good" || trend === "up") return "bg-emerald-400/10";
  if (kpiStatus === "critical" || trend === "down") return "bg-red-400/10";
  if (kpiStatus === "warning") return "bg-amber-400/10";
  return "bg-white/[0.04]";
}

function KPICard({ kpi, index }: { kpi: KPI; index: number }) {
  const TrendIcon = kpi.trend === "up" ? ArrowUpRight : kpi.trend === "down" ? ArrowDownRight : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4"
    >
      <p className="text-[11px] font-medium text-white/50 tracking-wide">
        {kpi.label}
      </p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-[22px] font-semibold font-heading tabular-nums text-white leading-none tracking-tight">
          {kpi.value}
        </p>
        {kpi.change && (
          <div
            className={cn(
              "flex items-center gap-0.5 rounded-md px-1.5 py-0.5",
              trendBg(kpi.trend, kpi.status),
            )}
          >
            <TrendIcon
              className={cn("h-3 w-3", trendColor(kpi.trend, kpi.status))}
            />
            <span
              className={cn(
                "text-[10px] font-semibold tabular-nums",
                trendColor(kpi.trend, kpi.status),
              )}
            >
              {kpi.change}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StagesTimeline({ stages }: { stages: Stage[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="mt-6"
    >
      <p className="mb-4 text-[11px] font-semibold font-heading uppercase tracking-wider text-white/50">
        Stages
      </p>
      <div className="relative rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
        <div className="flex items-start gap-0">
          {stages.map((stage, i) => {
            const isCompleted = stage.status === "completed";
            const isActive = stage.status === "active";
            return (
              <div key={i} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {i > 0 && (
                    <div
                      className={cn(
                        "h-[2px] flex-1 rounded-full",
                        stages[i - 1].status === "completed"
                          ? "bg-emerald-400/60"
                          : "bg-white/[0.08]",
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "relative z-10 h-2.5 w-2.5 shrink-0 rounded-full",
                      isCompleted && "bg-emerald-400",
                      isActive && "bg-[#DA4E24]",
                      !isCompleted && !isActive && "bg-white/20 border border-white/10",
                    )}
                  >
                    {isActive && (
                      <div className="absolute -inset-1 rounded-full border border-[#DA4E24]/30" />
                    )}
                  </div>
                  {i < stages.length - 1 && (
                    <div
                      className={cn(
                        "h-[2px] flex-1 rounded-full",
                        isCompleted ? "bg-emerald-400/60" : "bg-white/[0.08]",
                      )}
                    />
                  )}
                </div>
                <div className="mt-3 w-full px-1 text-center">
                  <p
                    className={cn(
                      "text-[11px] font-semibold font-heading",
                      isCompleted && "text-white/70",
                      isActive && "text-white",
                      !isCompleted && !isActive && "text-white/35",
                    )}
                  >
                    {stage.name}
                  </p>
                  <p className="mt-0.5 text-[9px] text-white/40">{stage.range}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function ChartSection({ chart }: { chart: ChartConfig }) {
  const xKey = chart.xKey ?? "name";
  const yKey = chart.yKey ?? "value";

  const tooltipStyle = {
    background: "rgba(12,12,12,0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    fontSize: 11,
    color: "rgba(255,255,255,0.9)",
    padding: "8px 12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  };

  const tickStyle = { fontSize: 10, fill: "rgba(255,255,255,0.35)" };

  const chartContent = () => {
    switch (chart.type) {
      case "bar":
        return (
          <BarChart data={chart.data} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="none"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey={xKey}
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey={yKey} fill={CHART_COLORS.primary} radius={[3, 3, 0, 0]} />
          </BarChart>
        );
      case "area":
        return (
          <AreaChart data={chart.data}>
            <defs>
              <linearGradient id="metricAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.15} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="none"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey={xKey}
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(255,255,255,0.08)" }} />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={CHART_COLORS.primary}
              fill="url(#metricAreaGrad)"
              strokeWidth={1.5}
            />
          </AreaChart>
        );
      default:
        return (
          <LineChart data={chart.data}>
            <CartesianGrid
              strokeDasharray="none"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey={xKey}
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(255,255,255,0.08)" }} />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={CHART_COLORS.primary}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ fill: CHART_COLORS.primary, r: 3, strokeWidth: 0 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="mt-6"
    >
      <p className="mb-3 text-[11px] font-semibold font-heading uppercase tracking-wider text-white/50">
        Trend
      </p>
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 pt-5">
        <ResponsiveContainer width="100%" height={200}>
          {chartContent()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function BreakdownSection({ breakdown }: { breakdown: BreakdownItem[] }) {
  const maxPercentage = Math.max(
    ...breakdown.map((b) => b.percentage ?? 0),
    1,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
      className="mt-6"
    >
      <p className="mb-3 text-[11px] font-semibold font-heading uppercase tracking-wider text-white/50">
        Breakdown
      </p>
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] divide-y divide-white/[0.06]">
        {breakdown.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.04 }}
            className="flex items-center gap-3 px-4 py-3"
          >
            <span className="flex-1 text-[12px] font-medium font-body text-white/80">
              {item.label}
            </span>
            {item.percentage !== undefined && (
              <div className="w-20 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#DA4E24]/80"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((item.percentage / maxPercentage) * 100, 100)}%`,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: 0.35 + i * 0.04,
                  }}
                />
              </div>
            )}
            <span className="text-[11px] font-semibold font-heading tabular-nums text-white/60 min-w-[48px] text-right">
              {item.value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

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
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#DA4E24]/10 border border-[#DA4E24]/15">
            <BarChart3 className="h-3.5 w-3.5 text-[#DA4E24]" />
          </div>
          <h2 className="text-[14px] font-semibold font-heading text-white tracking-tight">
            {title}
          </h2>
        </div>
        {period && (
          <span className="text-[10px] font-medium text-white/40 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5">
            {period}
          </span>
        )}
      </div>

      {/* KPI grid */}
      {safeKpis.length > 0 && (
        <div
          className="grid gap-2.5"
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
