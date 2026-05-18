"use client";

import { Player } from "@remotion/player";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

function GaugeComposition({ percent }: { percent: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const eased = interpolate(progress, [0, 1], [0, percent], { extrapolateRight: "clamp" });
  const radius = 72;
  const circumference = Math.PI * radius;

  return (
    <AbsoluteFill style={{ background: "transparent", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="150" viewBox="0 0 240 150">
        <path d="M48 116 A72 72 0 0 1 192 116" fill="none" stroke="#F2EDE7" strokeWidth="18" strokeLinecap="round" />
        <path
          d="M48 116 A72 72 0 0 1 192 116"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - eased)}
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="48" x2="192" y1="116" y2="116">
            <stop stopColor="#85C0A8" />
            <stop offset="0.68" stopColor="#338567" />
            <stop offset="1" stopColor="#C7603E" />
          </linearGradient>
        </defs>
        <text x="120" y="94" textAnchor="middle" fill="#2D2D2D" fontFamily="Georgia" fontSize="30" fontWeight="700">
          {Math.round(eased * 100)}%
        </text>
        <text x="120" y="118" textAnchor="middle" fill="#4A4A4A" fontSize="12" fontWeight="600">
          of selected budget
        </text>
      </svg>
    </AbsoluteFill>
  );
}

export default function BudgetGauge({
  low,
  high,
  max,
}: {
  low: number;
  high: number;
  max: number;
  size?: number;
}) {
  const percent = Math.min(((low + high) / 2) / max, 1);

  return (
    <div className="overflow-hidden rounded-[24px] bg-canvas/70 p-2">
      <Player
        component={GaugeComposition}
        inputProps={{ percent }}
        durationInFrames={120}
        compositionWidth={240}
        compositionHeight={150}
        fps={30}
        autoPlay
        loop
        controls={false}
        style={{ width: "100%", maxWidth: 260, margin: "0 auto" }}
      />
    </div>
  );
}
