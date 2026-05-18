"use client";

import { Player } from "@remotion/player";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimelinePhase } from "@/lib/types";

function TimelineComposition({ phases }: { phases: TimelinePhase[] }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const lineWidth = interpolate(progress, [0, 1], [0, 100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "transparent", padding: "28px 34px", justifyContent: "center" }}>
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${phases.length}, 1fr)` }}>
        <div style={{ position: "absolute", left: 24, right: 24, top: 19, height: 3, borderRadius: 999, background: "#F2EDE7" }} />
        <div style={{ position: "absolute", left: 24, top: 19, height: 3, width: `calc((100% - 48px) * ${lineWidth / 100})`, borderRadius: 999, background: "linear-gradient(90deg,#1E5541,#E27A4D)" }} />
        {phases.map((phase, index) => {
          const pop = spring({ frame: Math.max(0, frame - index * 12), fps, config: { damping: 12, stiffness: 140 } });
          return (
            <div key={phase.name} style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
              <div style={{
                width: 40,
                height: 40,
                margin: "0 auto 12px",
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background: "#fff",
                border: "2px solid #85C0A8",
                transform: `scale(${interpolate(pop, [0, 1], [0.65, 1], { extrapolateRight: "clamp" })})`,
                boxShadow: "0 12px 28px rgba(30,85,65,0.14)",
              }}>
                <span style={{ width: 12, height: 12, borderRadius: 999, background: index === phases.length - 1 ? "#C7603E" : "#1E5541" }} />
              </div>
              <div style={{ color: "#2D2D2D", fontSize: 13, fontWeight: 700 }}>{phase.name}</div>
              <div style={{ color: "#4A4A4A", fontSize: 11, marginTop: 3 }}>{phase.duration}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

export default function TimelinePlayer({ phases }: { phases: TimelinePhase[] }) {
  return (
    <div className="rounded-[24px] border border-canvas-dark bg-white">
      <Player
        component={TimelineComposition}
        inputProps={{ phases }}
        durationInFrames={150}
        compositionWidth={720}
        compositionHeight={180}
        fps={30}
        autoPlay
        loop
        controls={false}
        style={{ width: "100%" }}
      />
    </div>
  );
}
