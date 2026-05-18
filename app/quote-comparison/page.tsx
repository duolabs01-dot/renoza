"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { QuoteComparison, SingleQuoteSummary } from "@/lib/types";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogoMark } from "@/components/Logo";

const CLARITY_BADGE: Record<string, string> = {
  clear:   "bg-green-100 text-green-800 border-0",
  partial: "bg-yellow-100 text-yellow-800 border-0",
  vague:   "bg-red-100 text-red-800 border-0",
};
const CLARITY_LABEL: Record<string, string> = { clear: "Clear", partial: "Partial", vague: "Vague" };

const PLACEHOLDERS = [
  "Hi, please quote for painting my lounge (4m x 5m). Labour and materials, 2 coats. Let me know your price and when you can start.",
  "Good day, I need a quote for a full bathroom retile. Remove old tiles, supply and fix new 300x300 ceramic tiles to walls and floor. Include waterproofing. CoC for geyser work. Payment: 30% deposit, 70% on completion.",
  "Paste third contractor quote here…",
];

function QuoteResultCard({ summary, isBest }: { summary: SingleQuoteSummary; isBest: boolean }) {
  return (
    <Card className={`relative overflow-visible border-2 bg-white ${isBest ? "border-petrol-dark" : "border-canvas-dark"}`}>
      {isBest && (
        <span className="absolute -top-px right-4 rounded-b-xl bg-petrol-dark px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          Best to clarify first
        </span>
      )}
      <CardContent className="flex flex-col gap-5 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-xl font-bold text-charcoal">{summary.label}</p>
            <p className="mt-0.5 text-sm font-semibold text-petrol-dark">{summary.price_mentioned}</p>
          </div>
          <Badge className={CLARITY_BADGE[summary.scope_clarity]}>
            {CLARITY_LABEL[summary.scope_clarity]} scope
          </Badge>
        </div>

        {/* Strengths */}
        {summary.strengths.length > 0 && summary.strengths[0] !== "Minimal detail provided to assess strengths" && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-petrol-dark">Strengths</p>
            <ul className="space-y-2">
              {summary.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm leading-6 text-charcoal-light">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-petrol-mid" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing */}
        {summary.missing_items[0] !== "No major omissions detected — verify with a site visit" && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-charcoal-light/60">Missing</p>
            <ul className="space-y-2">
              {summary.missing_items.map((m, i) => (
                <li key={i} className="border-l-2 border-canvas-dark pl-3 text-sm leading-6 text-charcoal-light">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Red flags */}
        {summary.red_flags[0] !== "No major red flags detected" && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-clay">Red flags</p>
            <ul className="space-y-2">
              {summary.red_flags.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm leading-6 text-charcoal-light">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Payment */}
        <div className="border-t border-canvas-dark pt-4 text-xs leading-5 text-charcoal-light/70">
          {summary.payment_terms}
        </div>
      </CardContent>
    </Card>
  );
}

export default function QuoteComparisonPage() {
  const [quoteTexts, setQuoteTexts] = useState(["", "", ""]);
  const [quoteCount, setQuoteCount] = useState(2);
  const [result, setResult] = useState<QuoteComparison | null>(null);
  const [analysing, setAnalysing] = useState(false);

  const filled = quoteTexts.slice(0, quoteCount).filter((q) => q.trim()).length;
  const canAnalyse = filled >= 2;

  const handleAnalyse = async () => {
    const quotes = quoteTexts.slice(0, quoteCount).filter((q) => q.trim());
    setAnalysing(true);
    setResult(null);
    try {
      const res = await fetch("/api/compare-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotes }),
      });
      setResult(await res.json());
    } catch {
      const { compareContractorQuotes } = await import("@/lib/mock-ai");
      setResult(compareContractorQuotes({ quotes }));
    } finally {
      setAnalysing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setQuoteTexts(["", "", ""]);
  };

  const update = (i: number, v: string) =>
    setQuoteTexts((prev) => { const n = [...prev]; n[i] = v; return n; });

  /* Loading screen */
  if (analysing) {
    return (
      <main className="grid min-h-[calc(100vh-3.5rem)] place-items-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-[22px] bg-petrol-dark shadow-xl shadow-petrol-dark/25">
            <LogoMark size={50} inverse />
          </div>
          <h1 className="font-display text-3xl font-semibold text-charcoal">Reading all of them…</h1>
          <p className="mt-2 text-sm text-charcoal-light">Spotting the gaps, the gotchas, and what&apos;s actually different</p>
          <div className="mx-auto mt-8 h-1 w-64 overflow-hidden rounded-full bg-canvas-dark">
            <motion.div className="h-full bg-petrol-dark" initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} />
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-charcoal px-4 py-12 text-white sm:px-6 sm:py-16">
        <div className="container-page">
          <AnimatedSection>
            <p className="eyebrow mb-3 text-petrol-light">Quote Comparison</p>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Three quotes,<br className="hidden sm:block" /> three different numbers.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-8 text-white/60">
              Paste them in. We&apos;ll show you which one is honest, which one&apos;s hiding scope, and which one has the small print that&apos;ll cost you later.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="container-page py-8 sm:py-12">
        {!result ? (
          <AnimatedSection>
            {/* How many quotes toggle */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-charcoal">Comparing</span>
              {[2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setQuoteCount(n)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    quoteCount === n
                      ? "bg-petrol-dark text-white shadow-sm"
                      : "border border-charcoal/10 bg-white text-charcoal-light hover:border-petrol-dark/30"
                  }`}
                >
                  {n} quotes
                </button>
              ))}
            </div>

            {/* Textarea inputs */}
            <div className="flex flex-col gap-5">
              {Array.from({ length: quoteCount }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold text-charcoal">
                    Quote {i + 1}
                  </Label>
                  <Textarea
                    value={quoteTexts[i]}
                    onChange={(e) => update(i, e.target.value)}
                    placeholder={PLACEHOLDERS[i]}
                    rows={6}
                    className="resize-y rounded-2xl border-canvas-dark bg-white text-base leading-7 text-charcoal placeholder:text-charcoal-light/40 focus-visible:ring-petrol-mid"
                  />
                </div>
              ))}
            </div>

            {/* Action row */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="order-2 text-sm text-charcoal-light sm:order-1">
                {filled < 2
                  ? `Need at least ${2 - filled} more — comparison only works with two or three.`
                  : `${filled} loaded. Let's see what they say.`}
              </p>
              <Button
                onClick={handleAnalyse}
                disabled={!canAnalyse}
                className="order-1 w-full rounded-2xl bg-petrol-dark py-6 text-base font-bold text-white hover:bg-petrol-mid disabled:bg-canvas-dark disabled:text-charcoal-light sm:order-2 sm:w-auto sm:py-3"
              >
                Compare quotes <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </AnimatedSection>
        ) : (
          <>
            {/* Results header */}
            <AnimatedSection>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow mb-2">Analysis complete</p>
                  <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
                    Here&apos;s how they stack up.
                  </h2>
                </div>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 self-start rounded-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm font-semibold text-charcoal-light sm:self-auto"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Compare new quotes
                </button>
              </div>
            </AnimatedSection>

            {/* Per-quote cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.quotes.map((q, i) => (
                <AnimatedSection key={q.index} delay={i * 0.07}>
                  <QuoteResultCard
                    summary={q}
                    isBest={result.recommended_followup.startsWith(`Start with ${q.label}`)}
                  />
                </AnimatedSection>
              ))}
            </div>

            {/* Cross-quote insights */}
            <AnimatedSection delay={0.15}>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="border-canvas-dark bg-canvas">
                  <CardHeader className="pb-2 pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-petrol-dark">The price story</p>
                  </CardHeader>
                  <CardContent className="pb-5 pt-0">
                    <p className="text-sm leading-7 text-charcoal-light">{result.price_comparison}</p>
                  </CardContent>
                </Card>
                <Card className="border-canvas-dark bg-canvas">
                  <CardHeader className="pb-2 pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-petrol-dark">Are they quoting the same job?</p>
                  </CardHeader>
                  <CardContent className="pb-5 pt-0">
                    <p className="text-sm leading-7 text-charcoal-light">{result.scope_comparison}</p>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>

            {/* Recommended next step */}
            <AnimatedSection delay={0.2}>
              <div className="mt-4 rounded-3xl bg-petrol-dark p-6 text-white">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-petrol-light/70">
                  What to do next
                </p>
                <p className="text-base leading-7">{result.recommended_followup}</p>
              </div>
            </AnimatedSection>

            {/* Shared missing + questions */}
            <AnimatedSection delay={0.25}>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="border-canvas-dark bg-canvas">
                  <CardHeader className="pb-2 pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-light/60">What none of them mentioned</p>
                  </CardHeader>
                  <CardContent className="pb-5 pt-0">
                    <ul className="space-y-3">
                      {result.shared_missing_items.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm leading-6 text-charcoal-light">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-charcoal-light/40" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-canvas-dark bg-canvas">
                  <CardHeader className="pb-2 pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-petrol-dark">Send these to all three</p>
                  </CardHeader>
                  <CardContent className="pb-5 pt-0">
                    <ol className="space-y-3">
                      {result.questions_for_all.map((q, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-6 text-charcoal-light">
                          <span className="font-display text-base font-bold text-petrol-dark">{i + 1}</span>
                          {q}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          </>
        )}
      </div>
    </main>
  );
}
