import type { FeaturedContractor } from "@/lib/sponsors";

export default function ContractorTile({ contractor }: { contractor: FeaturedContractor }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < contractor.rating ? "★" : "☆").join("");
  return (
    <div className="card-hover" style={{
      background: "white", borderRadius: 12, border: "1px solid var(--canvas-dark)",
      padding: 20, minWidth: 280, flexShrink: 0,
    }}>
      <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 12 }}>
        Featured Contractor · {contractor.location}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--petrol-50)", border: "2px solid var(--petrol-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "var(--petrol-700)" }}>
          {contractor.name.charAt(0)}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--charcoal)" }}>{contractor.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: 13, color: "#f59e0b" }}>{stars}</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{contractor.reviews} reviews</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {contractor.specialties.map((s) => (
          <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "var(--canvas)", border: "1px solid var(--canvas-dark)", color: "var(--charcoal-light)" }}>{s}</span>
        ))}
        {contractor.verified && (
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "var(--petrol-50)", border: "1px solid var(--petrol-200)", color: "var(--petrol-700)" }}>✓ Verified</span>
        )}
      </div>
      <button className="btn-scale" style={{
        width: "100%", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600,
        color: "white", background: "var(--petrol-700)", transition: "all 0.2s",
      }}>
        Request quote
      </button>
    </div>
  );
}
