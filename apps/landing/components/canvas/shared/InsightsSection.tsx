"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { tpl, text, surface } from "./tokens";

interface InsightsSectionProps {
  insights: string[];
  recommendations?: string[];
  delay?: number;
}

export default function InsightsSection({
  insights,
  recommendations,
  delay = 0.3,
}: InsightsSectionProps) {
  const hasInsights = insights && insights.length > 0;
  const hasRecommendations = recommendations && recommendations.length > 0;

  if (!hasInsights && !hasRecommendations) return null;

  // Recommendations section starts after insights finish animating
  const recDelay = hasInsights ? delay + 0.08 + insights.length * 0.05 + 0.1 : delay;

  return (
    <div className="mt-6 flex flex-col gap-3">
      {/* ── Key Insights ─────────────────────────────────── */}
      {hasInsights && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay }}
          className={`${tpl.card} p-4`}
        >
          <div className={`mb-3 flex items-center gap-2 ${text.sectionLabel}`}>
            Key Insights
          </div>
          <ul className="space-y-2.5">
            {insights.map((insight, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.08 + i * 0.05, duration: 0.3 }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 shrink-0 text-[10px] font-bold tabular-nums text-[#DA4E24] leading-none pt-[1px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={text.body}>{insight}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ── Recommended Actions ──────────────────────────── */}
      {hasRecommendations && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: recDelay }}
          className={`${tpl.card} p-4`}
        >
          <div className={`mb-3 flex items-center gap-2 ${text.sectionLabel}`}>
            <ArrowRight className="h-3.5 w-3.5 text-white/70" />
            Recommended Actions
          </div>
          <ul className="space-y-1.5">
            {recommendations.map((rec, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: recDelay + 0.08 + i * 0.05, duration: 0.3 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent("ultron:recommendation-click", { detail: rec })
                    );
                  }}
                  className={`group flex w-full items-center gap-3 rounded-lg border ${surface.subtle.border} ${surface.subtle.bg} px-3.5 py-3 text-left transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.05]`}
                >
                  <span className="text-[12px] font-body leading-relaxed text-white/90 transition-colors group-hover:text-white">{rec}</span>
                  <span className="ml-auto flex shrink-0 items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[10px] font-medium text-white/50 transition-all group-hover:border-white/[0.15] group-hover:bg-white/[0.08] group-hover:text-white/80">
                    Ask Ultron
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
