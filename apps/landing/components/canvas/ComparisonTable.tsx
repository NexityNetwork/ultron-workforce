"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Scale } from "lucide-react";
import InsightsSection from "./shared/InsightsSection";
import { cn } from "@/lib/utils";
import { surface, brand } from "./shared/tokens";
import { getBrandLogo, getBrandLogoByDomain } from "@/lib/brand-logos";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DimensionValue {
  value: string;
  score?: number;
  source_url?: string;
}

interface Entity {
  name: string;
  logo?: string;
  dimensions: Record<string, DimensionValue>;
}

export interface ComparisonTableProps {
  entities: Entity[];
  insights?: string[];
  recommendations?: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function scoreColor(score: number): string {
  if (score >= 8) return "bg-emerald-400";
  if (score >= 6) return "bg-sky-400";
  if (score >= 4) return "bg-amber-400";
  return "bg-red-400";
}

function initial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function initialBg(name: string): string {
  const opacities = [
    "bg-white/[0.06] text-white/50",
    "bg-white/[0.08] text-white/60",
    "bg-[#DA4E24]/[0.10] text-[#DA4E24]/80",
    "bg-white/[0.05] text-white/60",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return opacities[Math.abs(hash) % opacities.length];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function EntityHeader({ entity }: { entity: Entity }) {
  const logo = entity.logo || getBrandLogo(entity.name) || (() => {
    const slug = entity.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    return getBrandLogoByDomain(`${slug}.com`);
  })();
  const [imgFailed, setImgFailed] = React.useState(false);

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-11 w-11 items-center justify-center">
        {logo && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={entity.name}
            className="h-11 w-11 rounded-xl object-contain"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold",
              initialBg(entity.name),
            )}
          >
            {initial(entity.name)}
          </div>
        )}
      </div>
      <span className="mt-2.5 text-center text-[13px] font-semibold text-white leading-tight">
        {entity.name}
      </span>
    </div>
  );
}

function ScoreBar({
  score,
  delay,
  isBest,
}: {
  score: number;
  delay: number;
  isBest: boolean;
}) {
  const pct = Math.min(Math.max((score / 10) * 100, 0), 100);

  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="relative h-[4px] flex-1 overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div
          className={cn("absolute inset-y-0 left-0 rounded-full", scoreColor(score))}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut", delay }}
        />
      </div>
      {isBest && (
        <span className="shrink-0 rounded bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
          Best
        </span>
      )}
    </div>
  );
}

function CellValue({
  dimValue,
  delay,
  isBest,
}: {
  dimValue: DimensionValue | undefined;
  delay: number;
  isBest: boolean;
}) {
  if (!dimValue) {
    return (
      <div className="px-4 py-4 text-[13px] text-white/30">&mdash;</div>
    );
  }

  return (
    <div className="group relative px-4 py-4">
      <div className="flex items-start gap-1.5">
        <span className="text-[13px] leading-relaxed text-white/70">
          {dimValue.value}
        </span>
        {dimValue.source_url && (
          <a
            href={dimValue.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <ExternalLink className="h-3 w-3 text-white/60 hover:text-white/60" />
          </a>
        )}
      </div>
      {dimValue.score !== undefined && (
        <ScoreBar score={dimValue.score} delay={delay} isBest={isBest} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ComparisonTable({
  entities: rawEntities = [],
  insights,
  recommendations,
}: ComparisonTableProps) {
  const entities = React.useMemo(() => {
    return rawEntities.map((entity) => {
      if (Array.isArray(entity.dimensions)) {
        const record: Record<string, DimensionValue> = {};
        for (const dim of entity.dimensions as unknown as { label: string; value: string; score?: number; source_url?: string }[]) {
          if (dim.label) {
            record[dim.label] = { value: dim.value, score: dim.score, source_url: dim.source_url };
          }
        }
        return { ...entity, dimensions: record };
      }
      return entity;
    });
  }, [rawEntities]);

  const dimensionKeys = React.useMemo(() => {
    const seen = new Set<string>();
    const keys: string[] = [];
    for (const entity of entities) {
      for (const key of Object.keys(entity.dimensions)) {
        if (!seen.has(key)) {
          seen.add(key);
          keys.push(key);
        }
      }
    }
    return keys;
  }, [entities]);

  const bestPerDimension = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const dim of dimensionKeys) {
      let bestIdx = -1;
      let bestScore = -1;
      entities.forEach((entity, idx) => {
        const s = entity.dimensions[dim]?.score;
        if (s !== undefined && s > bestScore) {
          bestScore = s;
          bestIdx = idx;
        }
      });
      if (bestIdx >= 0) map[dim] = bestIdx;
    }
    return map;
  }, [entities, dimensionKeys]);

  const winsPerEntity = React.useMemo(() => {
    const wins = new Array(entities.length).fill(0);
    for (const dim of dimensionKeys) {
      const idx = bestPerDimension[dim];
      if (idx !== undefined) wins[idx]++;
    }
    return wins;
  }, [entities, dimensionKeys, bestPerDimension]);

  // Calculate column width percentage: label column gets fixed share, rest split equally
  const entityCount = entities.length;

  return (
    <div className="w-full">
      {/* Summary header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", brand.iconBox)}>
            <Scale className="w-4 h-4 text-[#DA4E24]" />
          </div>
          <h2 className="text-[15px] font-semibold text-white">Comparison</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tabular-nums text-white/50 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1">
            {entities.length} entities
          </span>
          <span className="text-[10px] font-bold tabular-nums text-white/50 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1">
            {dimensionKeys.length} dimensions
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: `${100 / (entityCount + 1)}%` }} />
            {entities.map((_, i) => (
              <col key={i} style={{ width: `${100 / (entityCount + 1)}%` }} />
            ))}
          </colgroup>

          {/* Entity headers */}
          <thead>
            <tr className={cn("border-b", surface.normal.border)}>
              <th className="p-4" />
              {entities.map((entity, i) => (
                <th key={i} className="p-4 align-bottom">
                  <EntityHeader entity={entity} />
                  {winsPerEntity[i] > 0 && (
                    <div className="mt-1.5 text-center">
                      <span className="text-[9px] font-bold text-emerald-400/60 tabular-nums">
                        {winsPerEntity[i]} best
                      </span>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Dimension rows */}
          <tbody>
            {dimensionKeys.map((dim, rowIdx) => (
              <motion.tr
                key={dim}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                  delay: rowIdx * 0.03,
                }}
                className={cn(
                  rowIdx > 0 && "border-t",
                  surface.subtle.border,
                  "hover:bg-white/[0.015] transition-colors",
                )}
              >
                <td className="px-4 py-4 align-top">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                    {dim.replace(/_/g, " ")}
                  </span>
                </td>
                {entities.map((entity, eIdx) => (
                  <td key={eIdx} className="align-top">
                    <CellValue
                      dimValue={entity.dimensions[dim]}
                      delay={rowIdx * 0.03 + 0.15}
                      isBest={bestPerDimension[dim] === eIdx}
                    />
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <InsightsSection insights={insights || []} recommendations={recommendations} />
    </div>
  );
}
