"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { ColourSwatch } from "@/lib/types";

interface Props {
  palette: ColourSwatch[];
  roomLabel: string;
}

export default function ColourPaletteCard({ palette, roomLabel }: Props) {
  const [copied, setCopied] = useState(false);

  const copyPalette = () => {
    const text = palette
      .map(
        (s) =>
          `${s.name}${s.code ? ` (${s.brand} ${s.code})` : ` (${s.brand})`} — ${s.hex} — ${s.use} — ${s.mood}`,
      )
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <div>
      {/* Swatch grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {palette.map((swatch, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-charcoal/10 transition hover:shadow-sm"
          >
            {/* Colour block */}
            <div
              className="h-16 w-full"
              style={{ backgroundColor: swatch.hex }}
              title={swatch.hex}
            />
            {/* Details */}
            <div className="bg-white px-3 pb-3 pt-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-charcoal">{swatch.name}</p>
                  <p className="mt-0.5 truncate text-xs text-charcoal-light">
                    {swatch.brand}
                    {swatch.code ? ` · ${swatch.code}` : ""}
                  </p>
                </div>
                {/* Hex chip */}
                <span
                  className="shrink-0 rounded-lg px-2 py-0.5 text-xs font-mono font-semibold"
                  style={{
                    backgroundColor: swatch.hex + "22",
                    color: darkenHex(swatch.hex),
                  }}
                >
                  {swatch.hex}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="rounded-full bg-canvas-dark px-2 py-0.5 text-xs font-medium text-charcoal-light">
                  {swatch.use}
                </span>
                <span className="rounded-full bg-canvas-dark px-2 py-0.5 text-xs font-medium text-charcoal-light">
                  {swatch.mood}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-canvas-dark px-4 py-3">
        <p className="min-w-0 flex-1 text-xs leading-5 text-charcoal-light">
          Colours picked for a {roomLabel.toLowerCase()}. Verify availability at your local Plascon or
          Dulux stockist — batches vary slightly between stores.
        </p>
        <button
          onClick={copyPalette}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-charcoal shadow-sm transition hover:shadow"
        >
          {copied ? (
            <Check className="h-3 w-3 text-petrol-mid" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Copied!" : "Copy list"}
        </button>
      </div>
    </div>
  );
}

/** Darken a hex colour for readable text on a light tinted background */
function darkenHex(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (luminance > 0.5) {
    // Light colour → darken significantly
    return `rgb(${Math.round(r * 0.45)},${Math.round(g * 0.45)},${Math.round(b * 0.45)})`;
  }
  // Dark colour → return as-is (already dark enough for text)
  return hex;
}
