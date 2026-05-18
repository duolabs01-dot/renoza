"use client";

import { useState } from "react";

const BEFORE_URL = "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=82";
const AFTER_URL  = "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=82";

export default function BeforeAfterSlider() {
  const [pct, setPct] = useState(50);

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-[32px] editorial-shadow select-none">
      {/* Before layer */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${BEFORE_URL}")` }}
      />

      {/* After layer — clipped from the left */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${AFTER_URL}")`,
          clipPath: `inset(0 ${100 - pct}% 0 0)`,
        }}
      />

      {/* Divider line + handle */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-px bg-white/80"
        style={{ left: `${pct}%` }}
      >
        <div className="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-white/95 shadow-xl text-petrol-dark font-bold text-xs tracking-tight">
          ↔
        </div>
      </div>

      {/* Labels */}
      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-charcoal/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        Before
      </div>
      <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-petrol-dark backdrop-blur">
        After
      </div>

      {/* Invisible range input — handles all drag + touch */}
      <input
        type="range"
        min={5}
        max={95}
        value={pct}
        onChange={(e) => setPct(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
