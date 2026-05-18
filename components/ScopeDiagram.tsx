"use client";

import type { ProjectInput, RenovationGoal, RenovationPlan } from "@/lib/types";
import { parseDimensions } from "@/lib/pricing";

interface Props {
  input: ProjectInput;
  plan?: RenovationPlan;
  showFengShui?: boolean;
  compassDirection?: string;
}

const GOAL_FILLS: Partial<Record<RenovationGoal, string>> = {
  paint:                "rgba(133,192,168,0.20)",
  flooring:             "rgba(155,135,114,0.17)",
  tiling:               "rgba(199,96,62,0.13)",
  lighting:             "rgba(255,210,80,0.14)",
  cupboards:            "rgba(180,130,80,0.16)",
  electrical:           "rgba(80,130,200,0.13)",
  plumbing:             "rgba(80,180,200,0.13)",
  "damp-repair":        "rgba(199,96,62,0.25)",
  "full-makeover":      "rgba(30,85,65,0.13)",
  "prepare-rental-sale":"rgba(100,150,90,0.13)",
};

const DEMOLITION_GOALS: RenovationGoal[] = ["damp-repair", "full-makeover"];

const GOAL_SHORT: Partial<Record<RenovationGoal, string>> = {
  paint: "Paint", flooring: "Flooring", tiling: "Tiling",
  lighting: "Lighting", cupboards: "Cupboards", electrical: "Electrical",
  plumbing: "Plumbing", "damp-repair": "Damp repair",
  "full-makeover": "Full makeover", "prepare-rental-sale": "Sale prep",
};

const BAGUA: [string, string][] = [
  ["NW", "Helpful"], ["N",  "Career"],  ["NE", "Knowledge"],
  ["W",  "Creativ."],["",   "Health"],  ["E",  "Family"],
  ["SW", "Wealth"],  ["S",  "Fame"],    ["SE", "Love"],
];

export default function ScopeDiagram({ input, showFengShui, compassDirection }: Props) {
  const dims = parseDimensions(input.room_size ?? "");
  const goals = input.goals;
  const hasDemolition = goals.some((g) => DEMOLITION_GOALS.includes(g));

  // Canvas constants
  const W = 520, H = 400;
  const pL = 52, pT = 28, pR = 52, pB = 78;
  const rAW = W - pL - pR;
  const rAH = H - pT - pB;

  const scale = Math.min(rAW / dims.w, rAH / dims.h);
  const rW = Math.round(dims.w * scale);
  const rH = Math.round(dims.h * scale);
  const rX = pL + Math.round((rAW - rW) / 2);
  const rY = pT + Math.round((rAH - rH) / 2);

  // Legend
  const legendGoals = goals.filter((g) => GOAL_FILLS[g]);
  const legendItems: { fill: string; label: string }[] = [
    ...legendGoals.map((g) => ({ fill: GOAL_FILLS[g]!, label: GOAL_SHORT[g] ?? g })),
    ...(hasDemolition ? [{ fill: "hatch", label: "Risk zone" }] : []),
  ].slice(0, 8);
  const LX = pL;
  const LY = H - pB + 14;
  const LIPH = 17;
  const LIPW = 14;
  const itemsPerRow = Math.min(legendItems.length, 5);
  const ITEM_W = itemsPerRow > 0 ? Math.floor((W - pL - pR) / itemsPerRow) : 90;

  const roomLabel = input.room_type.toUpperCase().replace(/-/g, " ");

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Renovation scope sketch"
      >
        <defs>
          <pattern
            id="sp-hatch"
            x="0" y="0" width="8" height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(199,96,62,0.45)" strokeWidth="2.5" />
          </pattern>
          <pattern
            id="sp-grid"
            x="0" y="0" width="24" height="24"
            patternUnits="userSpaceOnUse"
          >
            <path d="M24 0L0 0 0 24" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Floor grid */}
        <rect x={rX} y={rY} width={rW} height={rH} fill="url(#sp-grid)" />

        {/* Goal fill zones */}
        {goals.map((g) => {
          const fill = GOAL_FILLS[g];
          return fill ? (
            <rect key={g} x={rX} y={rY} width={rW} height={rH} fill={fill} />
          ) : null;
        })}

        {/* Demolition hatching */}
        {hasDemolition && (
          <rect x={rX} y={rY} width={rW} height={rH} fill="url(#sp-hatch)" />
        )}

        {/* Bagua overlay */}
        {showFengShui &&
          BAGUA.map(([dir, label], i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const cW = rW / 3;
            const cH = rH / 3;
            const cx = rX + col * cW;
            const cy = rY + row * cH;
            const isCenter = dir === "";
            return (
              <g key={i}>
                <rect
                  x={cx} y={cy} width={cW} height={cH}
                  fill={isCenter ? "rgba(30,85,65,0.07)" : "rgba(30,85,65,0.03)"}
                  stroke="rgba(30,85,65,0.18)"
                  strokeWidth="0.5"
                />
                {dir && (
                  <text
                    x={cx + cW / 2} y={cy + cH / 2 - 5}
                    textAnchor="middle" fontSize="8"
                    fill="rgba(30,85,65,0.65)" fontWeight="700" fontFamily="inherit"
                  >
                    {dir}
                  </text>
                )}
                <text
                  x={cx + cW / 2} y={cy + cH / 2 + (dir ? 7 : 4)}
                  textAnchor="middle" fontSize="7.5"
                  fill="rgba(30,85,65,0.55)" fontFamily="inherit"
                >
                  {label}
                </text>
              </g>
            );
          })}

        {/* Room outline */}
        <rect
          x={rX} y={rY} width={rW} height={rH}
          fill="none" stroke="#1e5541" strokeWidth="2.5" rx="3"
        />

        {/* Room type label */}
        <text
          x={rX + rW / 2} y={rY + rH / 2 + 5}
          textAnchor="middle" fontSize="13"
          fill="rgba(30,85,65,0.25)" fontWeight="700" fontFamily="inherit"
        >
          {roomLabel}
        </text>

        {/* Width dimension (below room) */}
        <line x1={rX}      y1={rY + rH + 4} x2={rX}      y2={rY + rH + 16} stroke="#999" strokeWidth="1" />
        <line x1={rX + rW} y1={rY + rH + 4} x2={rX + rW} y2={rY + rH + 16} stroke="#999" strokeWidth="1" />
        <line x1={rX}      y1={rY + rH + 10} x2={rX + rW} y2={rY + rH + 10} stroke="#999" strokeWidth="1" />
        <text x={rX + rW / 2} y={rY + rH + 26} textAnchor="middle" fontSize="11" fill="#666" fontFamily="inherit">
          {dims.approximate ? "approx. " : ""}{dims.w}m
        </text>

        {/* Height dimension (left of room) */}
        <line x1={rX - 4}  y1={rY}      x2={rX - 16} y2={rY}      stroke="#999" strokeWidth="1" />
        <line x1={rX - 4}  y1={rY + rH} x2={rX - 16} y2={rY + rH} stroke="#999" strokeWidth="1" />
        <line x1={rX - 10} y1={rY}      x2={rX - 10} y2={rY + rH} stroke="#999" strokeWidth="1" />
        <text
          x={rX - 22} y={rY + rH / 2}
          textAnchor="middle" fontSize="11" fill="#666" fontFamily="inherit"
          transform={`rotate(-90 ${rX - 22} ${rY + rH / 2})`}
        >
          {dims.h}m
        </text>

        {/* Compass rose */}
        <g transform={`translate(${W - 32}, 28)`}>
          <circle cx="0" cy="0" r="16" fill="white" fillOpacity="0.9" stroke="rgba(0,0,0,0.10)" strokeWidth="1" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#ccc" strokeWidth="1" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#ccc" strokeWidth="1" />
          {/* North pointer (filled) */}
          <polygon points="0,-12 -3.5,-4 3.5,-4" fill="#1e5541" />
          {/* South pointer (grey) */}
          <polygon points="0,12 -3.5,4 3.5,4" fill="#bbb" />
          <text x="0" y="-14" textAnchor="middle" fontSize="8" fill="#1e5541" fontWeight="700" fontFamily="inherit">
            N
          </text>
          {compassDirection && compassDirection !== "unknown" && (
            <text x="0" y="30" textAnchor="middle" fontSize="7.5" fill="#999" fontFamily="inherit">
              {compassDirection}
            </text>
          )}
        </g>

        {/* Legend */}
        {legendItems.length > 0 && (
          <g>
            {legendItems.map((item, i) => {
              const row = Math.floor(i / itemsPerRow);
              const col = i % itemsPerRow;
              const lx = LX + col * ITEM_W;
              const ly = LY + row * LIPH;
              return (
                <g key={i} transform={`translate(${lx},${ly})`}>
                  {item.fill === "hatch" ? (
                    <rect x="0" y="0" width={LIPW} height={LIPH - 5}
                      fill="url(#sp-hatch)" stroke="rgba(199,96,62,0.4)" strokeWidth="0.5" rx="2" />
                  ) : (
                    <rect x="0" y="0" width={LIPW} height={LIPH - 5}
                      fill={item.fill} stroke="rgba(0,0,0,0.12)" strokeWidth="0.5" rx="2" />
                  )}
                  <text x={LIPW + 4} y={LIPH - 7} fontSize="9" fill="#666" fontFamily="inherit">
                    {item.label}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>
      <figcaption className="mt-1.5 text-center text-xs text-charcoal-light">
        Scope sketch — not a structural drawing
      </figcaption>
    </figure>
  );
}
