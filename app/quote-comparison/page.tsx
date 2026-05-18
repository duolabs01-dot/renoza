"use client";

import { useState } from "react";
import { compareContractorQuotes } from "@/lib/mock-ai";
import type { QuoteComparison, SingleQuoteSummary } from "@/lib/types";
import AnimatedSection from "@/components/AnimatedSection";

const CLARITY_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  clear:   { bg: "#dcfce7", color: "#166534", label: "Clear" },
  partial: { bg: "#fef9c3", color: "#854d0e", label: "Partial" },
  vague:   { bg: "#fee2e2", color: "#991b1b", label: "Vague" },
};

const PLACEHOLDER = [
  "Hi, please quote for painting my lounge (4m x 5m). Labour and materials, 2 coats. Let me know your price and when you can start.",
  "Good day, I need a quote for the full bathroom retile. Remove old tiles, supply and fix new 300x300 ceramic tiles to walls and floor. Include waterproofing. Will need CoC for the geyser work. Payment: 30% deposit, 70% on completion.",
];

function QuoteTextarea({ index, value, onChange }: { index: number; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 14, fontWeight: 500, color: "var(--charcoal)" }}>
        Quote {index + 1}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER[index] || `Paste contractor quote ${index + 1} here…`}
        rows={6}
        style={{
          width: "100%", padding: "14px 16px", borderRadius: 10,
          border: "1px solid var(--canvas-dark)", fontSize: 14,
          color: "var(--charcoal)", background: "white", resize: "vertical",
          outline: "none", fontFamily: "inherit", lineHeight: 1.6,
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => { e.target.style.borderColor = "var(--petrol-500)"; e.target.style.boxShadow = "0 0 0 3px rgba(51,133,103,0.12)"; }}
        onBlur={(e) => { e.target.style.borderColor = "var(--canvas-dark)"; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

function QuoteResultCard({ summary, isBest }: { summary: SingleQuoteSummary; isBest: boolean }) {
  const clarity = CLARITY_COLORS[summary.scope_clarity];
  return (
    <div style={{
      background: "white", borderRadius: 14, padding: 24,
      border: isBest ? "2px solid var(--petrol-500)" : "1px solid var(--canvas-dark)",
      position: "relative",
    }}>
      {isBest && (
        <div style={{
          position: "absolute", top: -1, right: 16,
          background: "var(--petrol-700)", color: "white",
          fontSize: 10, fontWeight: 700, padding: "3px 10px",
          borderRadius: "0 0 8px 8px", letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          Best to clarify first
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12 }}>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--charcoal)", marginBottom: 4 }}>
            {summary.label}
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--petrol-700)" }}>
            {summary.price_mentioned}
          </p>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20,
          background: clarity.bg, color: clarity.color, whiteSpace: "nowrap", flexShrink: 0,
        }}>
          {clarity.label} scope
        </span>
      </div>

      {/* Strengths */}
      {summary.strengths.length > 0 && summary.strengths[0] !== "Minimal detail provided to assess strengths" && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--petrol-700)", marginBottom: 8 }}>
            Strengths
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {summary.strengths.map((s, i) => (
              <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--charcoal)", lineHeight: 1.5 }}>
                <span style={{ color: "var(--petrol-500)", flexShrink: 0 }}>✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing items */}
      {summary.missing_items[0] !== "No major omissions detected — verify with a site visit" && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 8 }}>
            Missing
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {summary.missing_items.map((m, i) => (
              <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--charcoal)", lineHeight: 1.5, paddingLeft: 10, borderLeft: "3px solid var(--canvas-dark)" }}>
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Red flags */}
      {summary.red_flags[0] !== "No major red flags detected" && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--clay-500)", marginBottom: 8 }}>
            Red flags
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {summary.red_flags.map((f, i) => (
              <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--charcoal)", lineHeight: 1.5, paddingLeft: 10, borderLeft: "3px solid var(--clay-300)" }}>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Payment terms */}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--canvas-dark)" }}>
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{summary.payment_terms}</p>
      </div>
    </div>
  );
}

export default function QuoteComparisonPage() {
  const [quoteTexts, setQuoteTexts] = useState(["", "", ""]);
  const [quoteCount, setQuoteCount] = useState(2);
  const [result, setResult] = useState<QuoteComparison | null>(null);
  const [analysing, setAnalysing] = useState(false);

  const filledCount = quoteTexts.slice(0, quoteCount).filter((q) => q.trim()).length;
  const canAnalyse = filledCount >= 2;

  const handleAnalyse = () => {
    const quotes = quoteTexts.slice(0, quoteCount).filter((q) => q.trim());
    setAnalysing(true);
    setResult(null);
    setTimeout(() => {
      setResult(compareContractorQuotes({ quotes }));
      setAnalysing(false);
    }, 1800);
  };

  const handleReset = () => {
    setResult(null);
    setQuoteTexts(["", "", ""]);
  };

  const updateQuote = (i: number, v: string) => {
    setQuoteTexts((prev) => { const n = [...prev]; n[i] = v; return n; });
  };

  if (analysing) {
    return (
      <div className="page-enter" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--petrol-700)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, animation: "pulse 1.5s ease infinite" }}>
          <span style={{ color: "white", fontSize: 16, fontWeight: 700 }}>RZ</span>
        </div>
        <p className="shimmer-text" style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
          Comparing quotes…
        </p>
        <p style={{ fontSize: 14, color: "var(--muted)" }}>Checking scope, pricing, and red flags</p>
      </div>
    );
  }

  return (
    <div className="page-enter">
      {/* Hero */}
      <section style={{ background: "var(--charcoal)", padding: "60px 24px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <AnimatedSection>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--petrol-300)", marginBottom: 12 }}>
              Quote Comparison
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "white", lineHeight: 1.15, marginBottom: 14 }}>
              Compare up to 3 contractor quotes
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, maxWidth: 520 }}>
              Paste each quote below. Renoza checks scope clarity, flags red flags, and tells you which quote is safest to build on — before you pick a winner.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        {!result ? (
          <>
            <AnimatedSection>
              {/* Quote count toggle */}
              <div style={{ display: "flex", gap: 8, marginBottom: 28, alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "var(--charcoal)", fontWeight: 500, marginRight: 4 }}>Comparing</span>
                {[2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuoteCount(n)}
                    className="btn-scale"
                    style={{
                      padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                      border: quoteCount === n ? "2px solid var(--petrol-600)" : "1px solid var(--canvas-dark)",
                      background: quoteCount === n ? "var(--petrol-700)" : "white",
                      color: quoteCount === n ? "white" : "var(--charcoal)",
                      transition: "all 0.2s",
                    }}
                  >
                    {n} quotes
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
                {Array.from({ length: quoteCount }).map((_, i) => (
                  <QuoteTextarea key={i} index={i} value={quoteTexts[i]} onChange={(v) => updateQuote(i, v)} />
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <p style={{ fontSize: 13, color: "var(--muted)" }}>
                  {filledCount < 2 ? `Add at least ${2 - filledCount} more quote${2 - filledCount !== 1 ? "s" : ""} to compare.` : `${filledCount} quote${filledCount !== 1 ? "s" : ""} ready to compare.`}
                </p>
                <button
                  onClick={handleAnalyse}
                  disabled={!canAnalyse}
                  className="btn-scale"
                  style={{
                    padding: "13px 32px", borderRadius: 10, fontSize: 14, fontWeight: 600,
                    background: canAnalyse ? "var(--petrol-700)" : "var(--canvas-dark)",
                    color: canAnalyse ? "white" : "var(--muted)",
                    transition: "all 0.2s",
                  }}
                >
                  Compare quotes →
                </button>
              </div>
            </AnimatedSection>
          </>
        ) : (
          <>
            {/* Results */}
            <AnimatedSection>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--petrol-600)", marginBottom: 6 }}>
                    Analysis complete
                  </p>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: "var(--charcoal)" }}>
                    Your quote comparison
                  </h2>
                </div>
                <button onClick={handleReset} style={{ fontSize: 13, color: "var(--muted)", background: "none", border: "1px solid var(--canvas-dark)", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}>
                  ← Compare new quotes
                </button>
              </div>
            </AnimatedSection>

            {/* Per-quote cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 32 }}>
              {result.quotes.map((q, i) => (
                <AnimatedSection key={q.index} delay={i * 0.08}>
                  <QuoteResultCard
                    summary={q}
                    isBest={q.label === result.recommended_followup.split(" ")[1] + " " + result.recommended_followup.split(" ")[2]}
                  />
                </AnimatedSection>
              ))}
            </div>

            {/* Cross-quote insights */}
            <AnimatedSection delay={0.15}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 24 }}>
                <div style={{ background: "var(--canvas)", borderRadius: 12, border: "1px solid var(--canvas-dark)", padding: "20px 24px" }}>
                  <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--petrol-700)", marginBottom: 10 }}>Price comparison</h4>
                  <p style={{ fontSize: 14, color: "var(--charcoal)", lineHeight: 1.7 }}>{result.price_comparison}</p>
                </div>
                <div style={{ background: "var(--canvas)", borderRadius: 12, border: "1px solid var(--canvas-dark)", padding: "20px 24px" }}>
                  <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--petrol-700)", marginBottom: 10 }}>Scope comparison</h4>
                  <p style={{ fontSize: 14, color: "var(--charcoal)", lineHeight: 1.7 }}>{result.scope_comparison}</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Recommended next step */}
            <AnimatedSection delay={0.2}>
              <div style={{ background: "var(--petrol-700)", borderRadius: 14, padding: "24px 28px", marginBottom: 24, color: "white" }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7, marginBottom: 10 }}>
                  Recommended next step
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.7 }}>{result.recommended_followup}</p>
              </div>
            </AnimatedSection>

            {/* Shared missing items + questions */}
            <AnimatedSection delay={0.25}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
                <div style={{ background: "var(--canvas)", borderRadius: 12, border: "1px solid var(--canvas-dark)", padding: "20px 24px" }}>
                  <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 12 }}>Missing from all quotes</h4>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {result.shared_missing_items.map((item, i) => (
                      <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--charcoal)", lineHeight: 1.5, paddingLeft: 10, borderLeft: "3px solid var(--canvas-dark)" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ background: "var(--canvas)", borderRadius: 12, border: "1px solid var(--canvas-dark)", padding: "20px 24px" }}>
                  <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--petrol-700)", marginBottom: 12 }}>Questions to send all contractors</h4>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {result.questions_for_all.map((q, i) => (
                      <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--charcoal)", lineHeight: 1.5 }}>
                        <span style={{ color: "var(--petrol-500)", flexShrink: 0 }}>→</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </>
        )}
      </div>
    </div>
  );
}
