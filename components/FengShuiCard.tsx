"use client";

import type { FengShuiAnalysis } from "@/lib/types";

interface Props {
  analysis: FengShuiAnalysis;
}

const ELEMENT_STYLES: Record<string, { badge: string; text: string }> = {
  Wood:  { badge: "#dcfce7", text: "#166534" },
  Fire:  { badge: "#fee2e2", text: "#991b1b" },
  Earth: { badge: "#fef3c7", text: "#78350f" },
  Metal: { badge: "#e2e8f0", text: "#334155" },
  Water: { badge: "#dbeafe", text: "#1e40af" },
};

export default function FengShuiCard({ analysis }: Props) {
  const elemStyle = ELEMENT_STYLES[analysis.dominant_element] ?? ELEMENT_STYLES.Earth;

  return (
    <div className="grid gap-6">

      {/* Element badge + bagua area */}
      <div className="flex flex-wrap items-start gap-3">
        <span
          className="inline-flex items-center rounded-full px-4 py-2 text-sm font-bold"
          style={{ backgroundColor: elemStyle.badge, color: elemStyle.text }}
        >
          {analysis.dominant_element} element
        </span>
        <span className="inline-flex items-center rounded-full border border-charcoal/10 bg-canvas px-4 py-2 text-sm font-semibold text-charcoal-light">
          Bagua: {analysis.bagua_area}
        </span>
      </div>

      {/* Energy assessment */}
      <p className="text-sm leading-7 text-charcoal">{analysis.energy_assessment}</p>

      {/* Colour swatches */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-charcoal-light">
          Recommended colours
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {analysis.colour_recommendations.map((c, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-charcoal/8 bg-white p-3">
              <div
                className="h-9 w-9 shrink-0 rounded-lg border border-charcoal/10 shadow-sm"
                style={{ backgroundColor: c.hex }}
                title={c.hex}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-charcoal">{c.colour}</p>
                <p className="mt-0.5 text-xs leading-5 text-charcoal-light line-clamp-2">{c.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Placement tips + things to avoid */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-charcoal-light">
            Placement tips
          </p>
          <ul className="flex flex-col gap-2">
            {analysis.placement_tips.map((tip, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-6 text-charcoal">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-petrol-mid" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-charcoal-light">
            Things to avoid
          </p>
          <ul className="flex flex-col gap-2">
            {analysis.things_to_avoid.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-6 text-charcoal">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Compass notes */}
      <div className="rounded-2xl border border-petrol-light/30 bg-petrol-light/8 p-4">
        <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.12em] text-petrol-dark">
          Compass guidance
        </p>
        <p className="text-sm leading-6 text-charcoal">{analysis.compass_notes}</p>
      </div>

      {/* Favourable directions */}
      {analysis.favourable_directions.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-charcoal-light">
            Favourable directions
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.favourable_directions.map((d, i) => (
              <span
                key={i}
                className="rounded-full border border-charcoal/10 bg-white px-3 py-1 text-sm font-semibold capitalize text-charcoal"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
