"use client";

import React from "react";
import { motion } from "framer-motion";
import { GripVertical, Columns3 } from "lucide-react";
import InsightsSection from "./shared/InsightsSection";
import { cn } from "@/lib/utils";
import { surface, brand, hoverCard } from "./shared/tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KanbanCard {
  id: string;
  title: string;
  subtitle?: string;
  score?: number;
  note?: string;
  tags?: string[];
}

interface KanbanColumn {
  id: string;
  name: string;
  cards: KanbanCard[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  insights?: string[];
  recommendations?: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Derive a muted white-based accent per column position instead of rainbow */
function columnOpacity(index: number, total: number): number {
  // First column is brightest, fades toward the end
  if (total <= 1) return 0.5;
  return 0.5 - (index / (total - 1)) * 0.3;
}

function columnAvgScore(cards: KanbanCard[]): number | null {
  const scored = cards.filter((c) => c.score !== undefined);
  if (scored.length === 0) return null;
  return Math.round(
    scored.reduce((sum, c) => sum + c.score!, 0) / scored.length,
  );
}

function scoreColor(score: number): string {
  if (score >= 70) return "#34d399";
  if (score >= 40) return "#fbbf24";
  return "#f87171";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ScoreRing({ score, delay }: { score: number; delay: number }) {
  const r = 13;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);

  return (
    <div className="relative w-9 h-9 flex-shrink-0">
      <svg width="36" height="36" className="-rotate-90">
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="3"
        />
        <motion.circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circ}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut", delay }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-[9px] font-bold tabular-nums"
          style={{ color }}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function KanbanBoard({ columns = [], insights, recommendations }: KanbanBoardProps) {
  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0);

  // Conversion hint: cards flowing from first to last column
  const conversionRate =
    columns.length >= 2 && columns[0].cards.length > 0
      ? Math.round(
          (columns[columns.length - 1].cards.length /
            columns[0].cards.length) *
            100,
        )
      : null;

  return (
    <div className="w-full">
      {/* Summary header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              brand.iconBox,
            )}
          >
            <Columns3 className="w-4 h-4 text-[#DA4E24]" />
          </div>
          <h2 className="text-[15px] font-semibold text-white">Pipeline</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tabular-nums text-white/50 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1">
            {totalCards} cards
          </span>
          <span className="text-[10px] font-bold tabular-nums text-white/50 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1">
            {columns.length} stages
          </span>
          {conversionRate !== null && (
            <span className="text-[10px] font-bold tabular-nums text-white/50 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1">
              {conversionRate}% throughput
            </span>
          )}
        </div>
      </div>

      {/* Scrollable board */}
      <div className="overflow-x-auto pb-2">
        <div
          className="grid gap-4 min-w-[800px]"
          style={{
            gridTemplateColumns: `repeat(${columns.length}, minmax(220px, 1fr))`,
          }}
        >
          {columns.map((col, ci) => {
            const opacity = columnOpacity(ci, columns.length);
            const avg = columnAvgScore(col.cards);

            return (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: ci * 0.08,
                  duration: 0.35,
                  ease: "easeOut",
                }}
                className="flex flex-col gap-3"
              >
                {/* Column header */}
                <div className="flex items-center gap-2.5 px-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: `rgba(255,255,255,${opacity})` }}
                  />
                  <span className="text-xs font-semibold text-white flex-1 uppercase tracking-wide">
                    {col.name}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold tabular-nums px-2 py-0.5 rounded-md",
                      surface.subtle.bg,
                      "text-white/40",
                    )}
                  >
                    {col.cards.length}
                  </span>
                </div>

                {/* Column stats */}
                {avg !== null && (
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] text-white/60">Avg</span>
                    <span
                      className="text-[10px] font-bold tabular-nums"
                      style={{ color: scoreColor(avg) }}
                    >
                      {avg}
                    </span>
                  </div>
                )}

                {/* Cards */}
                <div className="space-y-2.5">
                  {col.cards.map((card, ki) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: ci * 0.08 + ki * 0.05,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      className={cn(
                        "group relative rounded-xl border",
                        surface.normal.border,
                        "bg-gradient-to-b from-white/[0.04] to-white/[0.01]",
                        "p-4 min-h-[100px] flex flex-col gap-2.5",
                        "shadow-[0_1px_4px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.04)]",
                        hoverCard,
                        "cursor-default",
                      )}
                    >
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0 flex-1">
                          <GripVertical className="w-3.5 h-3.5 text-white/[0.06] group-hover:text-white/25 mt-0.5 flex-shrink-0 transition-colors duration-200" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium text-white leading-tight truncate">
                              {card.title}
                            </p>
                            {card.subtitle && (
                              <p className="text-[10px] text-white/60 mt-0.5 truncate">
                                {card.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                        {card.score !== undefined && (
                          <ScoreRing
                            score={card.score}
                            delay={ci * 0.08 + ki * 0.05 + 0.2}
                          />
                        )}
                      </div>

                      {/* Note */}
                      {card.note && (
                        <p className="text-[10px] text-white/70 leading-relaxed line-clamp-2 pl-[22px]">
                          {card.note}
                        </p>
                      )}

                      {/* Tags */}
                      {card.tags && card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pl-[22px] mt-auto">
                          {card.tags.map((tag) => (
                            <span
                              key={tag}
                              className={cn(
                                "text-[9px] px-2 py-0.5 rounded-full text-white/60 border font-medium",
                                surface.subtle.bg,
                                surface.subtle.border,
                              )}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Empty column placeholder */}
                  {col.cards.length === 0 && (
                    <div
                      className={cn(
                        "rounded-xl border border-dashed p-6 flex items-center justify-center min-h-[100px]",
                        surface.subtle.border,
                      )}
                    >
                      <span className="text-[10px] text-white/15">
                        No cards
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <InsightsSection insights={insights || []} recommendations={recommendations} />
    </div>
  );
}
