"use client";

import { SPONSOR_BRANDS, type SponsorBrand } from "@/lib/sponsors";

function BrandMark({ brand }: { brand: SponsorBrand }) {
  return (
    <div
      style={{
        width: 26,
        height: 26,
        borderRadius: 7,
        background: brand.color,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 9,
        fontWeight: 800,
        color: "white",
        letterSpacing: "0.02em",
      }}
    >
      {brand.mark}
    </div>
  );
}

export default function SponsorStrip() {
  const items = [...SPONSOR_BRANDS, ...SPONSOR_BRANDS];
  return (
    <div style={{ overflow: "hidden", padding: "8px 0" }}>
      <div className="sponsor-track">
        {items.map((brand, i) => (
          <div
            key={i}
            className="card-hover"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 20px",
              borderRadius: 40,
              background: "white",
              border: "1px solid var(--canvas-dark)",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            <BrandMark brand={brand} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--charcoal)" }}>
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
