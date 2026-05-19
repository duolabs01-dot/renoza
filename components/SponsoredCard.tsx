import type { SponsorProduct } from "@/lib/sponsors";
import { SPONSOR_BRANDS } from "@/lib/sponsors";

function BrandLogo({ brand }: { brand: string }) {
  const data = SPONSOR_BRANDS.find(
    (b) => b.name.toLowerCase() === brand.toLowerCase(),
  );

  if (data?.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={data.logo}
        alt={data.name}
        loading="lazy"
        decoding="async"
        style={{
          height: 36,
          width: "auto",
          maxWidth: 64,
          objectFit: "contain",
        }}
      />
    );
  }

  // Fallback: colour mark
  const fallbackColor = data?.color ?? "#1e5541";
  const mark = data?.mark ?? brand.slice(0, 2).toUpperCase();
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: fallbackColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 800,
        color: "white",
        letterSpacing: "0.02em",
        flexShrink: 0,
      }}
    >
      {mark}
    </div>
  );
}

export default function SponsoredCard({ product }: { product: SponsorProduct }) {
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < product.rating ? "★" : "☆",
  ).join("");

  return (
    <div
      className="card-hover"
      style={{
        background: "white",
        borderRadius: 16,
        border: "1px solid var(--canvas-dark)",
        padding: "16px 20px",
        minWidth: 240,
        maxWidth: 280,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "var(--charcoal-light)",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        Recommended for this job
      </div>

      {/* Brand logo + product name */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            background: "var(--canvas-dark)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
            padding: 6,
          }}
        >
          <BrandLogo brand={product.brand} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--charcoal)",
              lineHeight: 1.35,
            }}
          >
            {product.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--charcoal-light)", marginTop: 3 }}>
            {product.type} · {product.size}
          </div>
        </div>
      </div>

      {/* Price + rating */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--petrol-dark)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          From {product.price}
        </span>
        <span style={{ fontSize: 13, color: "#f59e0b" }}>{stars}</span>
      </div>

      <button
        className="btn-scale"
        style={{
          padding: "9px 16px",
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 600,
          color: "var(--petrol-dark)",
          border: "1px solid var(--canvas-dark)",
          background: "var(--canvas)",
          transition: "all 0.2s",
          textAlign: "center",
        }}
      >
        See it at {product.retailer} →
      </button>
    </div>
  );
}
