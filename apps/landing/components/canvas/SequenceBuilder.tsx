"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Mail,
  Clock,
  ChevronRight,
  ChevronDown,
  Send,
  FileEdit,
  Zap,
} from "lucide-react";
import InsightsSection from "./shared/InsightsSection";
import { surface, brand } from "./shared/tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SequenceStep {
  step: number;
  subject: string;
  preview: string;
  body?: string;
  send_day: number;
  status?: "draft" | "active" | "sent";
}

interface SequenceBuilderProps {
  sequence_name: string;
  steps: SequenceStep[];
  insights?: string[];
  recommendations?: string[];
}

// ---------------------------------------------------------------------------
// Constants — restrained palette
// ---------------------------------------------------------------------------

const STEP_STATUS: Record<
  string,
  { color: string; bg: string; Icon: typeof Send; label: string }
> = {
  draft: {
    color: "rgba(255,255,255,0.60)",
    bg: "from-white/[0.02] to-transparent",
    Icon: FileEdit,
    label: "Draft",
  },
  active: {
    color: "#DA4E24",
    bg: "from-[#DA4E24]/[0.04] to-transparent",
    Icon: Zap,
    label: "Active",
  },
  sent: {
    color: "#34d399",
    bg: "from-emerald-400/[0.04] to-transparent",
    Icon: Send,
    label: "Sent",
  },
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function SequenceBuilder({
  sequence_name,
  steps = [],
  insights,
  recommendations,
}: SequenceBuilderProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const totalDays = steps.length > 0 ? steps[steps.length - 1].send_day : 0;
  const sentCount = steps.filter((s) => s.status === "sent").length;
  const activeCount = steps.filter((s) => s.status === "active").length;

  const toggleStep = (stepNum: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepNum)) {
        next.delete(stepNum);
      } else {
        next.add(stepNum);
      }
      return next;
    });
  };

  return (
    <div className="w-full space-y-5">
      {/* Summary header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              brand.iconBox,
            )}
          >
            <Mail className="w-4 h-4 text-[#DA4E24]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              {sequence_name}
            </h2>
            <p className="text-[10px] text-white/60 mt-0.5">
              {steps.length} step{steps.length !== 1 ? "s" : ""} over{" "}
              {totalDays} days
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {sentCount > 0 && (
            <span className="text-[10px] font-bold tabular-nums text-emerald-400">
              {sentCount} sent
            </span>
          )}
          {activeCount > 0 && (
            <span className="text-[10px] font-bold tabular-nums text-[#DA4E24]">
              {activeCount} active
            </span>
          )}
          <span className="text-[10px] text-white/60">
            {steps.length - sentCount - activeCount} draft
          </span>
        </div>
      </div>

      {/* Steps flow */}
      <div className="flex flex-wrap items-center justify-center gap-y-4 pb-2">
        {steps.map((step, i) => {
          const st = STEP_STATUS[step.status || "draft"];
          const dayGap =
            i < steps.length - 1
              ? steps[i + 1].send_day - step.send_day
              : 0;

          return (
            <div key={step.step} className="flex items-center flex-shrink-0">
              {/* Step card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.35,
                  ease: "easeOut",
                }}
                className={cn(
                  "min-w-[260px] max-w-[280px] rounded-xl border overflow-hidden",
                  surface.subtle.border,
                  "bg-gradient-to-br",
                  st.bg,
                  "hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/20 transition-all duration-200 group",
                  step.body && "cursor-pointer",
                )}
                style={{ borderTopWidth: 3, borderTopColor: st.color }}
                onClick={() => step.body && toggleStep(step.step)}
              >
                {/* Status header */}
                <div
                  className={cn(
                    "flex items-center justify-between px-4 py-3 border-b",
                    surface.subtle.border,
                    "bg-white/[0.01]",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: `${st.color}18` }}
                    >
                      <st.Icon
                        className="w-3 h-3"
                        style={{ color: st.color }}
                      />
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.15em]"
                      style={{ color: st.color }}
                    >
                      {st.label}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-mono px-2.5 py-1 rounded-lg border flex items-center gap-1.5",
                      surface.subtle.bg,
                      surface.subtle.border,
                      "text-white/60",
                    )}
                  >
                    <Clock className="w-2.5 h-2.5" />
                    Day {step.send_day}
                  </span>
                </div>

                {/* Step content */}
                <div className="px-4 py-4 space-y-2">
                  <p className="text-[12px] font-semibold text-white leading-snug group-hover:text-white transition-colors">
                    {step.subject}
                  </p>
                  <p
                    className={cn(
                      "text-[11px] text-white/70 leading-relaxed group-hover:text-white/80 transition-colors",
                      !expandedSteps.has(step.step) && "line-clamp-3",
                    )}
                  >
                    {step.preview}
                  </p>

                  {/* Expanded body */}
                  <AnimatePresence initial={false}>
                    {expandedSteps.has(step.step) && step.body && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div
                          className={cn(
                            "mt-2 pt-2 border-t",
                            surface.subtle.border,
                          )}
                        >
                          <p className="text-[11px] text-white/60 leading-relaxed whitespace-pre-line">
                            {step.body}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Expand/collapse toggle */}
                  {step.body && (
                    <div className="flex items-center gap-1 pt-1">
                      <ChevronDown
                        className={cn(
                          "w-3 h-3 text-white/40 transition-transform duration-200",
                          expandedSteps.has(step.step) && "rotate-180",
                        )}
                      />
                      <span className="text-[10px] text-white/40">
                        {expandedSteps.has(step.step)
                          ? "Collapse"
                          : "Show full email"}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Connector arrow with day gap */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{
                    delay: i * 0.08 + 0.06,
                    duration: 0.2,
                  }}
                  className="flex items-center px-3 flex-shrink-0"
                >
                  <div className="w-6 h-px bg-gradient-to-r from-white/[0.15] to-white/[0.08]" />
                  <div className="flex flex-col items-center mx-0.5">
                    <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                    <span className="text-[8px] text-white/40 font-mono mt-0.5 whitespace-nowrap font-semibold">
                      +{dayGap}d
                    </span>
                  </div>
                  <div className="w-6 h-px bg-gradient-to-r from-white/[0.08] to-white/[0.15]" />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      <InsightsSection insights={insights || []} recommendations={recommendations} delay={0.4} />
    </div>
  );
}
