"use client";

import React, { useEffect } from "react";
import { useMotionValue, useTransform, animate, motion } from "framer-motion";

interface NumberTickerProps {
  value: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Custom formatter — receives the animated float, return display string */
  format?: (n: number) => string;
}

/**
 * Animates a number from 0 → value on mount using Framer Motion.
 * Uses only framer-motion (already installed). No layout impact.
 */
export default function NumberTicker({
  value,
  duration = 0.8,
  delay = 0,
  decimals = 0,
  className,
  style,
  format,
}: NumberTickerProps) {
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => {
    if (format) return format(v);
    return v.toFixed(decimals);
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      delay,
      ease: "easeOut",
    });
    return controls.stop;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <motion.span className={className} style={style}>{display}</motion.span>;
}
