"use client";

import { useState } from "react";
import { reviewContractorQuote } from "@/lib/mock-ai";
import type { QuoteReview } from "@/lib/types";

function ResultSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-canvas-dark bg-white p-5">
      <h3 className="text-sm font-semibold text-petrol-700 uppercase tracking-wide mb-3">
        {title}
      </h3>
      {children}
    </section>
  );
}

function BulletList({
  items,
  icon,
}: {
  items: string[];
  icon?: React.ReactNode;
}) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-charcoal leading-relaxed">
          <span className="shrink-0 mt-0.5">{icon ?? "•"}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function QuoteReviewPage() {
  const [quoteText, setQuoteText] = useState("");
  const [review, setReview] = useState<QuoteReview | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteText.trim()) return;
    setLoading(true);
    // Simulate async AI call delay
    await new Promise((r) => setTimeout(r, 800));
    const result = reviewContractorQuote({ quote_text: quoteText });
    setReview(result);
    setLoading(false);
  };

  const handleReset = () => {
    setReview(null);
    setQuoteText("");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-petrol-600 uppercase tracking-widest mb-2">
          Quote Review
        </p>
        <h1 className="text-2xl font-bold text-charcoal">
          Check a contractor quote
        </h1>
        <p className="text-sm text-muted mt-1 max-w-xl">
          Paste or type a contractor quote below. Renoza will flag vague
          language, missing items, red flags, and help you ask the right
          questions before you pay.
        </p>
      </div>

      {!review ? (
        <form onSubmit={handleReview} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Paste contractor quote here
            </label>
            <textarea
              required
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              rows={12}
              placeholder={`Example:\n\nHi, here is my quote for your kitchen:\n\nLabour: R8,000\nMaterials: R4,000\nTotal: R12,000\nDeposit: R6,000 upfront\n\n— Dave`}
              className="w-full rounded-lg border border-canvas-dark bg-white px-4 py-3 text-sm text-charcoal placeholder:text-muted leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-petrol-500 resize-y"
            />
          </div>

          <div className="rounded-lg bg-petrol-50 border border-petrol-100 px-4 py-3 text-xs text-petrol-800 leading-relaxed">
            Tip: The more detail you paste, the more useful the review. Include
            every line item, payment terms, timeline, and any messages from
            the contractor.
          </div>

          <button
            type="submit"
            disabled={loading || !quoteText.trim()}
            className="w-full py-3 rounded-xl bg-petrol-700 text-white font-semibold text-sm hover:bg-petrol-800 transition-colors disabled:opacity-60"
          >
            {loading ? "Reviewing quote…" : "Review this quote →"}
          </button>
        </form>
      ) : (
        <div className="space-y-5">

          {/* Disclaimer */}
          <div className="rounded-lg bg-clay-50 border border-clay-200 px-4 py-3 text-xs text-clay-700 leading-relaxed">
            This review is AI-generated. It is a planning tool to help you ask
            better questions — not a professional legal or financial opinion.
            Always get multiple quotes and consult a qualified person for major
            work.
          </div>

          {/* Quote summary */}
          <ResultSection title="Quote Summary">
            <p className="text-sm text-charcoal leading-relaxed">
              {review.quote_summary}
            </p>
          </ResultSection>

          {/* Fairness estimate */}
          <ResultSection title="Fairness Estimate">
            <p className="text-sm text-charcoal leading-relaxed">
              {review.fairness_estimate}
            </p>
          </ResultSection>

          {/* Missing details */}
          <ResultSection title="Missing Details">
            <BulletList
              items={review.missing_details}
              icon={<span className="text-muted">○</span>}
            />
          </ResultSection>

          {/* Red flags */}
          <ResultSection title="Red Flags">
            {review.red_flags.length === 0 ? (
              <p className="text-sm text-petrol-700">
                No major red flags detected.
              </p>
            ) : (
              <ul className="space-y-2">
                {review.red_flags.map((flag, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-charcoal leading-relaxed"
                  >
                    <span className="text-clay-500 shrink-0 mt-0.5">⚠</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            )}
          </ResultSection>

          {/* Questions to ask */}
          <ResultSection title="Questions to Ask Before Paying">
            <ol className="space-y-1.5 list-none">
              {review.questions_to_ask.map((q, i) => (
                <li key={i} className="flex gap-2 text-sm text-charcoal leading-relaxed">
                  <span className="text-petrol-500 font-semibold shrink-0 w-5">
                    {i + 1}.
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
          </ResultSection>

          {/* Rewritten scope */}
          <ResultSection title="Rewritten Scope Template">
            <p className="text-xs text-muted mb-3">
              Use this as a starting point to ask for a cleaner, more complete
              quote from the contractor.
            </p>
            <div className="rounded-lg bg-canvas border border-canvas-dark p-4">
              <pre className="text-sm text-charcoal whitespace-pre-wrap font-sans leading-relaxed">
                {review.rewritten_scope}
              </pre>
            </div>
            <button
              onClick={() =>
                navigator.clipboard.writeText(review.rewritten_scope)
              }
              className="mt-3 text-xs font-medium text-petrol-700 underline underline-offset-2 hover:text-petrol-900"
            >
              Copy to clipboard
            </button>
          </ResultSection>

          {/* Reset */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg border border-canvas-dark bg-white text-charcoal text-sm font-medium hover:border-petrol-400 transition-colors"
            >
              Review another quote
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
