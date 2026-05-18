"use client";

import { Player } from "@remotion/player";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { WorkItem } from "@/lib/types";

function ChartComposition({ items, maxCost }: { items: WorkItem[]; maxCost: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "transparent", padding: 22, justifyContent: "center", gap: 14 }}>
      {items.map((item, index) => {
        const local = Math.max(0, frame - index * 10);
        const fill = spring({ frame: local, fps, config: { damping: 18, stiffness: 110 } });
        const width = interpolate(fill, [0, 1], [0, (item.high / maxCost) * 100], { extrapolateRight: "clamp" });
        return (
          <div key={item.category} style={{ display: "grid", gridTemplateColumns: "128px 1fr 86px", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#2D2D2D", fontSize: 13, fontWeight: 600 }}>{item.category}</span>
            <div style={{ height: 12, borderRadius: 999, overflow: "hidden", background: "#F2EDE7" }}>
              <div style={{ width: `${width}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#1E5541,#85C0A8)" }} />
            </div>
            <span style={{ color: "#1E5541", fontSize: 12, fontWeight: 700, textAlign: "right" }}>{item.estimated_cost}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

export default function CostBreakdownChart({
  items,
  maxCost,
}: {
  items: WorkItem[];
  maxCost: number;
}) {
  return (
    <div className="rounded-[24px] border border-canvas-dark bg-white">
      <Player
        component={ChartComposition}
        inputProps={{ items, maxCost }}
        durationInFrames={150}
        compositionWidth={720}
        compositionHeight={220}
        fps={30}
        autoPlay
        loop
        controls={false}
        style={{ width: "100%" }}
      />
    </div>
  );
}
