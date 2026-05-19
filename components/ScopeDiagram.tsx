"use client";

import type { ProjectInput, RenovationGoal } from "@/lib/types";
import { parseDimensions } from "@/lib/pricing";

interface Props {
  input: ProjectInput;
  plan?: unknown;
  showFengShui?: boolean;
  compassDirection?: string;
}

// Distinct colours per goal — used for chip dot + border
const GOAL_COLORS: Partial<Record<RenovationGoal, string>> = {
  paint:                  "#2a7a5c",
  flooring:               "#8B6F52",
  tiling:                 "#C7603E",
  lighting:               "#D4900A",
  cupboards:              "#9B6F38",
  electrical:             "#3B6FC8",
  plumbing:               "#2898A8",
  "damp-repair":          "#C7603E",
  "full-makeover":        "#1e5541",
  "prepare-rental-sale":  "#4A8A5A",
};

const GOAL_SHORT: Partial<Record<RenovationGoal, string>> = {
  paint:                  "Paint",
  flooring:               "Flooring",
  tiling:                 "Tiling",
  lighting:               "Lighting",
  cupboards:              "Cupboards",
  electrical:             "Electrical",
  plumbing:               "Plumbing",
  "damp-repair":          "Damp repair",
  "full-makeover":        "Full makeover",
  "prepare-rental-sale":  "Sale prep",
};

// Bagua grid for feng shui overlay
const BAGUA: [string, string][] = [
  ["NW", "Helpful"], ["N",  "Career"],  ["NE", "Knowledge"],
  ["W",  "Creativ."],["",   "Health"],  ["E",  "Family"],
  ["SW", "Wealth"],  ["S",  "Fame"],    ["SE", "Love"],
];

export default function ScopeDiagram({ input, showFengShui, compassDirection }: Props) {
  const dims = parseDimensions(input.room_size ?? "");
  const goals = input.goals;

  // SVG canvas
  const W = 520, H = 400;
  const pL = 52, pT = 28, pR = 52, pB = 60;
  const rAW = W - pL - pR;  // 416
  const rAH = H - pT - pB;  // 312

  const scale = Math.min(rAW / Math.max(dims.w, 1), rAH / Math.max(dims.h, 1));
  const rW = Math.round(dims.w * scale);
  const rH = Math.round(dims.h * scale);
  const rX = pL + Math.round((rAW - rW) / 2);
  const rY = pT + Math.round((rAH - rH) / 2);

  // Chip layout — 2 per row for readability
  const chipH = 22;
  const chipGapX = 8;
  const chipGapY = 7;
  const chipPadX = 14;  // padding inside room from left/right edge
  const chipPadTop = 14; // padding from top wall
  const chipsPerRow = rW >= 260 ? 2 : 1;
  const chipW = Math.max(
    60,
    Math.floor((rW - chipPadX * 2 - chipGapX * (chipsPerRow - 1)) / chipsPerRow),
  );
  const chipRows = Math.ceil(goals.length / chipsPerRow);
  const chipsBlockH = chipRows * chipH + (chipRows - 1) * chipGapY;

  // Door (bottom wall, left side)
  const doorSize = Math.min(rW * 0.18, 42);
  const doorOffsetFromLeft = 20;

  // Window (top wall, center)
  const winW = Math.min(rW * 0.30, 70);
  const winX = rX + (rW - winW) / 2;

  // Room label position — centered in lower portion below chips
  const chipsEndY = rY + chipPadTop + chipsBlockH;
  const roomLabelY = chipsEndY + (rY + rH - chipsEndY) / 2 + 5;

  // Room type display name
  const roomLabel = input.room_type.toUpperCase().replace(/-/g, " ");

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Scope sketch: ${roomLabel}, ${goals.map(g => GOAL_SHORT[g] ?? g).join(", ")}`}
      >
        <defs>
          {/* Subtle floor tile pattern */}
          <pattern id="sp-floor" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <rect width="28" height="28" fill="#faf8f5" />
            <rect x="0" y="0" width="14" height="14" fill="rgba(0,0,0,0.012)" />
            <rect x="14" y="14" width="14" height="14" fill="rgba(0,0,0,0.012)" />
          </pattern>

          {/* Clip path to keep things inside the room */}
          <clipPath id="sp-room-clip">
            <rect x={rX + 2} y={rY + 2} width={rW - 4} height={rH - 4} />
          </clipPath>
        </defs>

        {/* ── Floor (tiled pattern) ── */}
        <rect x={rX + 2} y={rY + 2} width={rW - 4} height={rH - 4} fill="url(#sp-floor)" />

        {/* ── Feng shui bagua overlay ── */}
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
              <g key={i} clipPath="url(#sp-room-clip)">
                <rect
                  x={cx} y={cy} width={cW} height={cH}
                  fill={isCenter ? "rgba(30,85,65,0.07)" : "rgba(30,85,65,0.03)"}
                  stroke="rgba(30,85,65,0.15)"
                  strokeWidth="0.5"
                />
                {dir && (
                  <text
                    x={cx + cW / 2} y={cy + cH / 2 - 5}
                    textAnchor="middle" fontSize="8"
                    fill="rgba(30,85,65,0.55)" fontWeight="700" fontFamily="inherit"
                  >{dir}</text>
                )}
                <text
                  x={cx + cW / 2} y={cy + cH / 2 + (dir ? 7 : 4)}
                  textAnchor="middle" fontSize="7.5"
                  fill="rgba(30,85,65,0.45)" fontFamily="inherit"
                >{label}</text>
              </g>
            );
          })}

        {/* ── Room outline ── */}
        <rect
          x={rX} y={rY} width={rW} height={rH}
          fill="none" stroke="#1e5541" strokeWidth="2.5" rx="2"
        />

        {/* ── Window (top wall, center) ── */}
        {/* Mask the wall gap */}
        <line
          x1={winX + 2} y1={rY} x2={winX + winW - 2} y2={rY}
          stroke="#faf8f5" strokeWidth="4"
        />
        {/* Window frame box */}
        <rect
          x={winX} y={rY - 5} width={winW} height={10}
          fill="rgba(200,230,240,0.4)" stroke="#1e5541" strokeWidth="1"
        />
        {/* Center pane divider */}
        <line
          x1={winX + winW / 2} y1={rY - 5} x2={winX + winW / 2} y2={rY + 5}
          stroke="#1e5541" strokeWidth="0.8"
        />

        {/* ── Door (bottom wall, left side) ── */}
        {/* Mask the wall gap */}
        <line
          x1={rX + doorOffsetFromLeft + 1} y1={rY + rH}
          x2={rX + doorOffsetFromLeft + doorSize - 1} y2={rY + rH}
          stroke="#faf8f5" strokeWidth="4"
        />
        {/* Door leaf */}
        <line
          x1={rX + doorOffsetFromLeft} y1={rY + rH}
          x2={rX + doorOffsetFromLeft} y2={rY + rH - doorSize}
          stroke="#1e5541" strokeWidth="1.5"
        />
        {/* Door swing arc */}
        <path
          d={`M ${rX + doorOffsetFromLeft} ${rY + rH - doorSize}
              A ${doorSize} ${doorSize} 0 0 1
              ${rX + doorOffsetFromLeft + doorSize} ${rY + rH}`}
          fill="rgba(30,85,65,0.05)"
          stroke="#1e5541" strokeWidth="1" strokeDasharray="4 2.5"
        />

        {/* ── Room type watermark ── */}
        <text
          x={rX + rW / 2} y={roomLabelY}
          textAnchor="middle" fontSize="15"
          fill="rgba(30,85,65,0.11)" fontWeight="800"
          fontFamily="inherit" letterSpacing="0.09em"
        >
          {roomLabel}
        </text>

        {/* ── Goal chips ── */}
        {goals.map((goal, i) => {
          const row = Math.floor(i / chipsPerRow);
          const col = i % chipsPerRow;
          const cx = rX + chipPadX + col * (chipW + chipGapX);
          const cy = rY + chipPadTop + row * (chipH + chipGapY);
          const color = GOAL_COLORS[goal] ?? "#1e5541";
          const label = GOAL_SHORT[goal] ?? goal;
          // Cap chip to stay within the room horizontally
          const safeChipW = Math.min(chipW, rX + rW - chipPadX - cx);
          return (
            <g key={goal}>
              {/* Chip background */}
              <rect
                x={cx} y={cy} width={safeChipW} height={chipH} rx={chipH / 2}
                fill={color} fillOpacity="0.12"
                stroke={color} strokeWidth="0.8" strokeOpacity="0.5"
              />
              {/* Colour dot */}
              <circle cx={cx + 12} cy={cy + chipH / 2} r={4} fill={color} fillOpacity="0.9" />
              {/* Label */}
              <text
                x={cx + 22} y={cy + chipH / 2 + 4}
                fontSize="9.5" fontWeight="700"
                fill={color}
                fontFamily="inherit"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* ── Width dimension (below room) ── */}
        <line x1={rX}      y1={rY + rH + 6}  x2={rX}      y2={rY + rH + 18} stroke="#999" strokeWidth="1" />
        <line x1={rX + rW} y1={rY + rH + 6}  x2={rX + rW} y2={rY + rH + 18} stroke="#999" strokeWidth="1" />
        <line x1={rX}      y1={rY + rH + 12} x2={rX + rW} y2={rY + rH + 12} stroke="#999" strokeWidth="1" />
        <text
          x={rX + rW / 2} y={rY + rH + 28}
          textAnchor="middle" fontSize="11" fill="#666" fontFamily="inherit"
        >
          {dims.approximate ? "≈ " : ""}{dims.w}m
        </text>

        {/* ── Height dimension (left of room) ── */}
        <line x1={rX - 6}  y1={rY}      x2={rX - 18} y2={rY}      stroke="#999" strokeWidth="1" />
        <line x1={rX - 6}  y1={rY + rH} x2={rX - 18} y2={rY + rH} stroke="#999" strokeWidth="1" />
        <line x1={rX - 12} y1={rY}      x2={rX - 12} y2={rY + rH} stroke="#999" strokeWidth="1" />
        <text
          x={rX - 24} y={rY + rH / 2}
          textAnchor="middle" fontSize="11" fill="#666" fontFamily="inherit"
          transform={`rotate(-90 ${rX - 24} ${rY + rH / 2})`}
        >
          {dims.h}m
        </text>

        {/* ── Compass rose (top-right) ── */}
        <g transform={`translate(${W - 28}, 26)`}>
          <circle cx="0" cy="0" r="14" fill="white" fillOpacity="0.92" stroke="rgba(0,0,0,0.10)" strokeWidth="1" />
          <line x1="0" y1="-10" x2="0" y2="10" stroke="#ccc" strokeWidth="0.8" />
          <line x1="-10" y1="0" x2="10" y2="0" stroke="#ccc" strokeWidth="0.8" />
          {/* North pointer */}
          <polygon points="0,-10 -3,-3.5 3,-3.5" fill="#1e5541" />
          {/* South pointer */}
          <polygon points="0,10 -3,3.5 3,3.5" fill="#bbb" />
          <text x="0" y="-12" textAnchor="middle" fontSize="7.5" fill="#1e5541" fontWeight="700" fontFamily="inherit">N</text>
          {compassDirection && compassDirection !== "unknown" && (
            <text x="0" y="27" textAnchor="middle" fontSize="7" fill="#999" fontFamily="inherit">
              {compassDirection}
            </text>
          )}
        </g>
      </svg>

      <figcaption className="mt-1.5 text-center text-xs text-charcoal-light">
        Scope sketch — not a structural drawing
      </figcaption>
    </figure>
  );
}
