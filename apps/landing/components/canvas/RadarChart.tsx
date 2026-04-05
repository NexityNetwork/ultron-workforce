"use client";

import React from "react";
import { motion } from "framer-motion";
import { Radar } from "lucide-react";
import { cn } from "@/lib/utils";
import InsightsSection from "./shared/InsightsSection";
import { scoreStatus, status } from "./shared/tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RadarAxis {
  label: string;
  value: number; // 0–100
  max?: number;  // defaults to 100
}

interface RadarEntity {
  name: string;
  color?: string;
  axes: RadarAxis[];
}

export interface RadarChartProps {
  title?: string;
  /** Legacy single-entity format */
  axes?: RadarAxis[];
  /** Multi-entity comparison format */
  entities?: RadarEntity[];
  /** Legacy optional second dataset for comparison */
  comparison?: { label: string; values: number[] };
  insights?: string[];
  recommendations?: string[];
}

// ---------------------------------------------------------------------------
// Default colors for entities
// ---------------------------------------------------------------------------

const ENTITY_COLORS = [
  "#DA4E24",   // brand orange
  "#60A5FA",   // blue
  "#A78BFA",   // purple
  "#34D399",   // green
  "#FBBF24",   // amber
];

// ---------------------------------------------------------------------------
// SVG Radar generator
// ---------------------------------------------------------------------------

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 110;
const RINGS = 4;

function polarToCartesian(
  angle: number,
  radius: number,
): { x: number; y: number } {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

function buildPolygonPoints(
  values: number[],
  maxValues: number[],
  count: number,
): string {
  const angleStep = 360 / count;
  return values
    .map((val, i) => {
      const max = maxValues[i] || 100;
      const r = (Math.min(val, max) / max) * RADIUS;
      const { x, y } = polarToCartesian(i * angleStep, r);
      return `${x},${y}`;
    })
    .join(" ");
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function RadarChart({
  title,
  axes: legacyAxes,
  entities: rawEntities,
  comparison,
  insights,
  recommendations,
}: RadarChartProps) {
  // Normalize: support both legacy (axes) and new (entities) format
  const entities: RadarEntity[] = rawEntities && rawEntities.length > 0
    ? rawEntities
    : legacyAxes && legacyAxes.length > 0
      ? [{ name: "Current", axes: legacyAxes }]
      : [];

  if (entities.length === 0) return null;

  // Use the first entity's axes as the reference for labels and axis lines
  const referenceAxes = entities[0].axes;
  const count = referenceAxes.length;
  if (count < 3) return null;

  const angleStep = 360 / count;
  const maxValues = referenceAxes.map((a) => a.max || 100);

  // Compute avg score across first entity for header display
  const primaryValues = entities[0].axes.map((a) => a.value);
  const avgScore = Math.round(
    primaryValues.reduce((sum, v, i) => sum + (v / maxValues[i]) * 100, 0) / count,
  );
  const avgStatus = scoreStatus(avgScore);

  const isMultiEntity = entities.length > 1;

  return (
    <div className="w-full">
      {/* Summary header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              status[avgStatus].bg,
              status[avgStatus].border,
              "border",
            )}
          >
            <Radar className={cn("w-4 h-4", status[avgStatus].text)} />
          </div>
          <h2 className="text-[15px] font-semibold text-white">
            {title || "Radar Chart"}
          </h2>
        </div>
        {isMultiEntity && (
          <span className="text-[10px] text-white/50 font-medium rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1">
            {entities.length} entities &middot; {count} dimensions
          </span>
        )}
        {!isMultiEntity && (
          <span className={cn("text-[10px] font-bold tabular-nums rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1", status[avgStatus].text)}>
            {avgScore} avg
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* SVG Radar */}
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full max-w-[320px] overflow-visible"
        >
          {/* Concentric rings */}
          {Array.from({ length: RINGS }).map((_, ri) => {
            const r = ((ri + 1) / RINGS) * RADIUS;
            const points = Array.from({ length: count })
              .map((_, i) => {
                const { x, y } = polarToCartesian(i * angleStep, r);
                return `${x},${y}`;
              })
              .join(" ");
            return (
              <polygon
                key={ri}
                points={points}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            );
          })}

          {/* Axis lines */}
          {referenceAxes.map((_, i) => {
            const { x, y } = polarToCartesian(i * angleStep, RADIUS);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            );
          })}

          {/* Legacy comparison polygon */}
          {comparison && !isMultiEntity && (() => {
            const compPoints = buildPolygonPoints(comparison.values, maxValues, count);
            return (
              <motion.polygon
                points={compPoints}
                fill="rgba(251,191,36,0.06)"
                stroke="rgba(251,191,36,0.4)"
                strokeWidth="1.5"
                strokeLinejoin="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
            );
          })()}

          {/* Entity polygons — render in reverse so first entity is on top */}
          {[...entities].reverse().map((entity, reverseIdx) => {
            const idx = entities.length - 1 - reverseIdx;
            const color = entity.color || ENTITY_COLORS[idx % ENTITY_COLORS.length];
            const entityValues = entity.axes.map((a) => a.value);
            const points = buildPolygonPoints(entityValues, maxValues, count);
            const isFirst = idx === 0;

            return (
              <React.Fragment key={idx}>
                <motion.polygon
                  points={points}
                  fill={`${color}${isFirst ? "1A" : "0D"}`}
                  stroke={color}
                  strokeWidth={isFirst ? 2 : 1.5}
                  strokeLinejoin="round"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 + idx * 0.1 }}
                  style={{ transformOrigin: `${CX}px ${CY}px` }}
                />
                {/* Data points for this entity */}
                {entityValues.map((val, i) => {
                  const max = maxValues[i];
                  const r = (Math.min(val, max) / max) * RADIUS;
                  const { x, y } = polarToCartesian(i * angleStep, r);
                  return (
                    <motion.circle
                      key={`${idx}-${i}`}
                      cx={x}
                      cy={y}
                      r={isFirst ? 4 : 3}
                      fill={color}
                      stroke="rgba(10,10,10,0.8)"
                      strokeWidth="2"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1 + i * 0.05, duration: 0.3 }}
                    />
                  );
                })}
              </React.Fragment>
            );
          })}

          {/* Axis labels */}
          {referenceAxes.map((axis, i) => {
            const labelR = RADIUS + 20;
            const { x, y } = polarToCartesian(i * angleStep, labelR);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white/40 text-[10px] font-medium"
              >
                {axis.label}
              </text>
            );
          })}

          {/* Center score (only for single entity) */}
          {!isMultiEntity && (
            <>
              <text
                x={CX}
                y={CY - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white/80 text-lg font-bold"
              >
                {avgScore}
              </text>
              <text
                x={CX}
                y={CY + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white/25 text-[9px] font-medium uppercase tracking-wider"
              >
                avg
              </text>
            </>
          )}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {entities.map((entity, idx) => {
            const color = entity.color || ENTITY_COLORS[idx % ENTITY_COLORS.length];
            return (
              <div key={idx} className="flex items-center gap-1.5">
                <div className="w-3 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] text-white/60">{entity.name}</span>
              </div>
            );
          })}
          {comparison && !isMultiEntity && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[10px] text-white/60">
                {comparison.label}
              </span>
            </div>
          )}
        </div>

        {/* Axis breakdown — show per-entity scores for multi-entity */}
        {isMultiEntity ? (
          <div className="w-full space-y-3 mt-2">
            {referenceAxes.map((axis, axisIdx) => (
              <div key={axisIdx}>
                <span className="text-[10px] text-white/60 font-medium">{axis.label}</span>
                <div className="space-y-1 mt-1">
                  {entities.map((entity, eIdx) => {
                    const val = entity.axes[axisIdx]?.value || 0;
                    const max = entity.axes[axisIdx]?.max || 100;
                    const pct = Math.round((val / max) * 100);
                    const color = entity.color || ENTITY_COLORS[eIdx % ENTITY_COLORS.length];
                    return (
                      <motion.div
                        key={eIdx}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + axisIdx * 0.04 + eIdx * 0.02 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-[9px] text-white/60 w-20 truncate">{entity.name}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 + axisIdx * 0.04 }}
                          />
                        </div>
                        <span className="text-[10px] font-bold tabular-nums w-8 text-right text-white/50">
                          {val}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full grid grid-cols-2 gap-2 mt-2">
            {referenceAxes.map((axis, i) => {
              const max = maxValues[i];
              const pct = Math.round((axis.value / max) * 100);
              const s = scoreStatus(pct);
              const barColor = status[s].dot;
              const textColor = status[s].text;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.04 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[10px] text-white/60 w-24 truncate">
                    {axis.label}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", barColor)}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 0.5 + i * 0.04,
                      }}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold tabular-nums w-8 text-right",
                      textColor,
                    )}
                  >
                    {axis.value}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <InsightsSection insights={insights || []} recommendations={recommendations} />
    </div>
  );
}
