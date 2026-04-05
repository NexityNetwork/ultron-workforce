"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import InsightsSection from "./shared/InsightsSection";
import { platform as platformColors, text, tpl } from "./shared/tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Card {
  id: string;
  category?: string;
  hook?: string;
  heading?: string;
  body?: string;
  example?: string;
  platform?: string;
  color?: string;
  order?: number;
}

export interface TextCardsProps {
  title: string;
  cards: Card[];
  layout?: "grid" | "list" | "thread";
  insights?: string[];
  recommendations?: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function platformBadgeColor(p?: string): string {
  if (!p) return "bg-white/[0.06] text-white/40";
  const key = p.toLowerCase() as keyof typeof platformColors;
  if (key in platformColors) {
    return "text-white/80";
  }
  return "bg-white/[0.06] text-white/40";
}

function platformBadgeBg(p?: string): React.CSSProperties {
  if (!p) return {};
  const key = p.toLowerCase() as keyof typeof platformColors;
  if (key in platformColors) {
    return { backgroundColor: `${platformColors[key]}20` };
  }
  return {};
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CardContent({ card }: { card: Card }) {
  return (
    <>
      {/* Category tag */}
      {card.category && (
        <span
          className={cn(tpl.badge, "self-start font-body")}
        >
          {card.category}
        </span>
      )}

      {/* Hook / heading */}
      {(card.hook || card.heading) && (
        <p className="text-[13px] font-semibold font-heading leading-tight text-white">
          {card.hook || card.heading}
        </p>
      )}

      {/* Body */}
      {card.body && (
        <p className={text.body}>{card.body}</p>
      )}

      {/* Example */}
      {card.example && (
        <p className={cn(text.detail, "italic leading-relaxed")}>
          &ldquo;{card.example}&rdquo;
        </p>
      )}

      {/* Platform badge */}
      {card.platform && (
        <div className="mt-auto pt-1">
          <span
            className={cn(
              "inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold font-body",
              platformBadgeColor(card.platform),
            )}
            style={platformBadgeBg(card.platform)}
          >
            {card.platform}
          </span>
        </div>
      )}
    </>
  );
}

function GridCard({ card, index }: { card: Card; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(tpl.cardHover, "flex flex-col gap-2.5 p-4")}
      style={
        card.color
          ? { borderLeftColor: card.color, borderLeftWidth: 2 }
          : undefined
      }
    >
      <CardContent card={card} />
    </motion.div>
  );
}

function ListCard({ card, index }: { card: Card; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(tpl.cardHover, "flex flex-col gap-2.5 p-4")}
      style={
        card.color
          ? { borderLeftColor: card.color, borderLeftWidth: 2 }
          : undefined
      }
    >
      <CardContent card={card} />
    </motion.div>
  );
}

function ThreadCard({
  card,
  index,
  isLast,
}: {
  card: Card;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="relative flex gap-4"
    >
      {/* Step number + vertical line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            tpl.cardEmphasis,
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums text-white/70",
          )}
        >
          {(card.order ?? index + 1)}
        </div>
        {!isLast && (
          <div className="mt-2 w-px flex-1 border-l border-dashed border-white/[0.08]" />
        )}
      </div>

      {/* Card */}
      <div
        className={cn(tpl.cardHover, "mb-4 flex flex-1 flex-col gap-2.5 p-4")}
        style={
          card.color
            ? { borderLeftColor: card.color, borderLeftWidth: 2 }
            : undefined
        }
      >
        <CardContent card={card} />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function TextCards({
  title,
  cards,
  layout = "grid",
  insights,
  recommendations,
}: TextCardsProps) {
  const safeCards = (cards ?? []).slice().sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined)
      return a.order - b.order;
    return 0;
  });

  return (
    <div className="w-full">
      {/* Header */}
      <h2 className={cn(text.title, "mb-6 text-[15px]")}>{title}</h2>

      {safeCards.length === 0 && (
        <div className="flex items-center justify-center py-10">
          <span className="text-xs text-white/60">No cards</span>
        </div>
      )}

      {/* Grid layout */}
      {layout === "grid" && safeCards.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {safeCards.map((card, i) => (
            <GridCard key={card.id} card={card} index={i} />
          ))}
        </div>
      )}

      {/* List layout */}
      {layout === "list" && safeCards.length > 0 && (
        <div className="space-y-3">
          {safeCards.map((card, i) => (
            <ListCard key={card.id} card={card} index={i} />
          ))}
        </div>
      )}

      {/* Thread layout */}
      {layout === "thread" && safeCards.length > 0 && (
        <div className="flex flex-col">
          {safeCards.map((card, i) => (
            <ThreadCard
              key={card.id}
              card={card}
              index={i}
              isLast={i === safeCards.length - 1}
            />
          ))}
        </div>
      )}

      <InsightsSection insights={insights || []} recommendations={recommendations} />
    </div>
  );
}
