"use client";

import { useState } from "react";
import { SPONSOR_BRANDS, type SponsorBrand } from "@/lib/sponsors";

function BrandLogo({ brand }: { brand: SponsorBrand }) {
  const [failed, setFailed] = useState(false);

  if (brand.domain && !failed) {
    return (
      <img
        src={`https://logo.clearbit.com/${brand.domain}`}
        alt={brand.name}
        width={22}
        height={22}
        style={{ borderRadius: 4, objectFit: "contain", flexShrink: 0 }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div style={{
      width: 22, height: 22, borderRadius: 5, background: brand.color,
      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 10, fontWeight: 700, color: "white", letterSpacing: "-0.02em",
    }}>
      {brand.name[0]}
    </div>
  );
}

export default function SponsorStrip() {
  const items = [...SPONSOR_BRANDS, ...SPONSOR_BRANDS];
  return (
    <div style={{ overflow: "hidden", padding: "8px 0" }}>
      <div className="sponsor-track">
        {items.map((brand, i) => (
          <div key={i} className="card-hover" style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 20px", borderRadius: 40, background: "white",
            border: "1px solid var(--canvas-dark)", whiteSpace: "nowrap", cursor: "pointer",
          }}>
            <BrandLogo brand={brand} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--charcoal)" }}>{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
