"use client";

import { motion } from "framer-motion";
import InsightsSection from "./shared/InsightsSection";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChartProps {
  type: "line" | "bar" | "pie";
  title?: string;
  data: Record<string, unknown>[];
  xKey?: string;
  yKey?: string;
  colors?: string[];
  insights?: string[];
  recommendations?: string[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Brand-first palette: primary accent, then muted neutrals */
const COLORS = [
  "#DA4E24",
  "rgba(255,255,255,0.40)",
  "rgba(255,255,255,0.25)",
  "rgba(218,78,36,0.50)",
  "rgba(255,255,255,0.15)",
  "rgba(218,78,36,0.30)",
];

const tooltipStyle = {
  contentStyle: {
    background: "#16161b",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    fontSize: "11px",
    color: "rgba(255,255,255,0.95)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    padding: "8px 12px",
  },
  itemStyle: { color: "rgba(255,255,255,0.95)", padding: "2px 0" },
  cursor: { fill: "transparent", stroke: "transparent" },
};

const axisProps = {
  tick: { fontSize: 10, fill: "rgba(255,255,255,0.7)" },
  axisLine: { stroke: "rgba(255,255,255,0.08)" },
  tickLine: false as const,
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function LineChart({
  data,
  xKey,
  yKey,
  colors,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  colors: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors[0]} stopOpacity={0.15} />
            <stop offset="100%" stopColor={colors[0]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.03)"
        />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={colors[0]}
          strokeWidth={2.5}
          fill="url(#lineGradient)"
          dot={{ r: 3, fill: colors[0], strokeWidth: 0 }}
          activeDot={{
            r: 5,
            stroke: colors[0],
            strokeWidth: 2,
            fill: "#0a0a0f",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function BarChartView({
  data,
  xKey,
  yKey,
  colors,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  colors: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barSize={32}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.03)"
        />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle} cursor={false} />
        <Bar dataKey={yKey} radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={colors[i % colors.length]}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function PieChartView({
  data,
  xKey,
  yKey,
  colors,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  colors: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          dataKey={yKey}
          nameKey={xKey}
          paddingAngle={3}
          strokeWidth={0}
          cornerRadius={4}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ paddingTop: 16 }}
          formatter={(value) => (
            <span
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "11px",
                fontWeight: 500,
                marginLeft: 4,
              }}
            >
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Chart({
  type,
  title,
  data = [],
  xKey = "name",
  yKey = "value",
  colors = COLORS,
  insights,
  recommendations,
}: ChartProps) {
  return (
    <div className="w-full space-y-4">
      {/* Title with colored left border bar */}
      {title && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex items-center gap-2.5"
        >
          <div
            className="h-4 w-1 rounded-full"
            style={{ background: colors[0] }}
          />
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </motion.div>
      )}

      {/* Chart area */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        className="h-[300px] w-full"
      >
        {type === "line" ? (
          <LineChart data={data} xKey={xKey} yKey={yKey} colors={colors} />
        ) : type === "bar" ? (
          <BarChartView data={data} xKey={xKey} yKey={yKey} colors={colors} />
        ) : (
          <PieChartView data={data} xKey={xKey} yKey={yKey} colors={colors} />
        )}
      </motion.div>

      {/* Insights */}
      <InsightsSection insights={insights || []} recommendations={recommendations} />
    </div>
  );
}
