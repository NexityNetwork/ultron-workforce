"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

class CanvasErrorBoundary extends React.Component<
  { type: string; children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { type: string; children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <p className="text-xs text-white/30">
            Failed to render <span className="font-mono text-white/50">{this.props.type}</span>
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry: Record<string, React.ComponentType<any>> = {
  metrics_dashboard: dynamic(() => import("./MetricsDashboard"), { ssr: false }),
  radar_chart: dynamic(() => import("./RadarChart"), { ssr: false }),
  sequence: dynamic(() => import("./SequenceBuilder"), { ssr: false }),
  comparison_table: dynamic(() => import("./ComparisonTable"), { ssr: false }),
  kanban: dynamic(() => import("./KanbanBoard"), { ssr: false }),
  text_cards: dynamic(() => import("./TextCards"), { ssr: false }),
  checklist: dynamic(() => import("./Checklist"), { ssr: false }),
  chart: dynamic(() => import("./Chart"), { ssr: false }),
  swot_grid: dynamic(() => import("./SwotGrid"), { ssr: false }),
  timeline: dynamic(() => import("./Timeline"), { ssr: false }),
  score_card: dynamic(() => import("./ScoreCard"), { ssr: false }),
};

function LoadingDots() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-white/30"
            animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.85, 1.15, 0.85] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.18,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export interface CanvasBlockProps {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  className?: string;
}

export default function CanvasBlock({ type, data, className }: CanvasBlockProps) {
  const Component = registry[type];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-5",
        className,
      )}
    >
      {Component ? (
        <CanvasErrorBoundary type={type}>
          <Suspense fallback={<LoadingDots />}>
            <Component {...data} />
          </Suspense>
        </CanvasErrorBoundary>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-sm text-white/40">
            This component type is not available yet.
          </p>
        </div>
      )}
    </div>
  );
}
