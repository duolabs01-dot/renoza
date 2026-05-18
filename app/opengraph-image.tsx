import { ImageResponse } from "next/og";

export const alt = "Renoza — Know what your renovation should cost. Before the contractor does.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #1e5541 0%, #133a2c 100%)",
          color: "#faf8f5",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top row: eyebrow chip */}
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(250, 248, 245, 0.25)",
              background: "rgba(250, 248, 245, 0.08)",
              borderRadius: 999,
              padding: "10px 20px",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#85c0a8",
            }}
          >
            Built for South African homeowners
          </div>
        </div>

        {/* Headline block — fills the middle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            marginTop: 32,
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            Know what your renovation should cost.
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 400,
              lineHeight: 1.1,
              marginTop: 20,
              color: "rgba(250, 248, 245, 0.7)",
            }}
          >
            Before the contractor does.
          </div>
        </div>

        {/* Bottom row: brand mark + tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#85c0a8",
                color: "#1e5541",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              R
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              Renoza
            </div>
          </div>

          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#c7603e",
            }}
          >
            renoza.vercel.app
          </div>
        </div>
      </div>
    ),
    size
  );
}
