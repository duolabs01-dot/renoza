"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export default function BeforeAfterSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);
  const clip = useTransform(x, (latest) => {
    const pct = width ? Math.max(18, Math.min(82, ((latest + width / 2) / width) * 100)) : 50;
    return `inset(0 ${100 - pct}% 0 0)`;
  });

  return (
    <div
      ref={(node) => {
        ref.current = node;
        if (node) setWidth(node.getBoundingClientRect().width);
      }}
      className="relative aspect-[5/3] overflow-hidden rounded-[32px] border border-white/20 bg-charcoal editorial-shadow"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=82")' }}
      />
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          clipPath: clip,
          backgroundImage: 'url("https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1400&q=82")',
        }}
      />
      <motion.div
        drag="x"
        dragConstraints={ref}
        dragElastic={0}
        style={{ x }}
        className="absolute left-1/2 top-0 h-full w-px cursor-ew-resize bg-white/80"
      >
        <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-white/90 text-xs font-bold text-petrol-dark shadow-xl">
          DRAG
        </div>
      </motion.div>
      <div className="absolute left-5 top-5 rounded-full bg-charcoal/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        Before
      </div>
      <div className="absolute right-5 top-5 rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-petrol-dark backdrop-blur">
        Renoza plan
      </div>
    </div>
  );
}
