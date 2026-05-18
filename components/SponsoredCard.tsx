import type { SponsorProduct } from "@/lib/sponsors";

export default function SponsoredCard({ product }: { product: SponsorProduct }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < product.rating ? "★" : "☆").join("");
  return (
    <div className="card-hover" style={{
      background: "white", borderRadius: 12, border: "1px solid var(--canvas-dark)",
      padding: 20, minWidth: 260, maxWidth: 280, flexShrink: 0,
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
        Sponsored · Matched to your project
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--canvas-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "var(--muted)", flexShrink: 0 }}>
          {product.brand.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--charcoal)" }}>{product.name}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{product.type} · {product.size}</div>
        </div>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--petrol-700)", fontVariantNumeric: "tabular-nums" }}>From {product.price}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#f59e0b" }}>{stars}</span>
        <span style={{ fontSize: 11, color: "var(--muted)" }}>at {product.retailer}</span>
      </div>
      <button className="btn-scale" style={{
        padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
        color: "var(--petrol-700)", border: "1px solid var(--petrol-200)",
        background: "var(--petrol-50)", transition: "all 0.2s",
      }}>
        View product →
      </button>
    </div>
  );
}
