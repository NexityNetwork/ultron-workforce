"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import InsightsSection from "./shared/InsightsSection";
import { surface, brand } from "./shared/tokens";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  insights?: string[];
  recommendations?: string[];
}

export default function Timeline({ events = [], insights, recommendations }: TimelineProps) {
  return (
    <div className="w-full">
      {/* Summary header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", brand.iconBox)}>
            <Clock className="w-4 h-4 text-[#DA4E24]" />
          </div>
          <h2 className="text-[15px] font-semibold text-white">Timeline</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold tabular-nums text-white/60">
            {events.length} events
          </span>
          {events.length >= 2 && (
            <span className="text-[10px] text-white/50">
              {events[0].date} - {events[events.length - 1].date}
            </span>
          )}
        </div>
      </div>

      {/* Roadmap timeline */}
      <div className="relative pl-10">
        {/* Vertical connecting line */}
        <div className="absolute left-[10px] top-4 bottom-4 w-px bg-gradient-to-b from-white/[0.08] via-white/[0.06] to-transparent" />

        <div className="space-y-3">
          {events.map((event, i) => {
            const color = event.color || "#DA4E24";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.35,
                  ease: "easeOut",
                }}
                className="relative group"
              >
                {/* Dot on the line */}
                <div className="absolute -left-10 top-4 z-10">
                  <div className="relative flex items-center justify-center">
                    <div
                      className="w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        background: `${color}15`,
                        border: `2px solid ${color}40`,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                    <div
                      className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-200"
                      style={{ background: color }}
                    />
                  </div>
                </div>

                {/* Content card */}
                <div
                  className={cn(
                    "rounded-xl border p-4",
                    surface.normal.border,
                    "bg-gradient-to-r from-white/[0.04] to-white/[0.01]",
                    "shadow-[0_1px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.04)]",
                    "group-hover:border-white/[0.14] group-hover:shadow-lg group-hover:shadow-black/20",
                    "transition-all duration-200",
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13px] font-semibold text-white group-hover:text-white transition-colors">
                        {event.title}
                      </h4>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] text-white/60 font-mono flex-shrink-0 px-2 py-0.5 rounded-md border",
                        surface.subtle.bg,
                        surface.subtle.border,
                      )}
                    >
                      {event.date}
                    </span>
                  </div>
                  <p className="text-[12px] text-white/80 leading-relaxed group-hover:text-white transition-colors">
                    {event.description}
                  </p>
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
