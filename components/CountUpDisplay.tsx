"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  fontSize?: number;
};

export default function CountUpDisplay({ value, prefix = "", suffix = "", className = "", fontSize }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(reduceMotion ? value : 0);
  const rounded = useTransform(count, (latest) => `${prefix}${Math.round(latest).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 1.35, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [count, inView, reduceMotion, value]);

  return (
    <motion.span
      ref={ref}
      className={`font-display font-semibold tabular-nums text-petrol-dark ${className}`}
      style={fontSize ? { fontSize } : undefined}
    >
      {rounded}
    </motion.span>
  );
}
