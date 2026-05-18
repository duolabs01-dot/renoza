import { SPONSOR_BRANDS } from "@/lib/sponsors";

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
            <div style={{ width: 24, height: 24, borderRadius: 6, background: brand.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--charcoal)" }}>{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
