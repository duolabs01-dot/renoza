"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FileText, RotateCcw, ScanLine, ShieldAlert } from "lucide-react";
import { useState } from "react";
import CopyButton from "@/components/CopyButton";
import FairnessBar from "@/components/FairnessBar";
import SectionCard from "@/components/SectionCard";
import { reviewContractorQuote } from "@/lib/mock-ai";
import type { QuoteReview } from "@/lib/types";

const scanMessages = ["Reading the quote", "Checking red flags", "Comparing scope", "Building your review"];

export default function QuoteReviewPage() {
  const [quoteText, setQuoteText] = useState("");
  const [review, setReview] = useState<QuoteReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!quoteText.trim()) return;
    setLoading(true);
    setReview(null);
    const timer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % scanMessages.length);
    }, 700);
    window.setTimeout(() => {
      window.clearInterval(timer);
      setReview(reviewContractorQuote(quoteText));
      setLoading(false);
    }, 1900);
  };

  return (
    <main>
      <section className="bg-charcoal px-6 py-20 text-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-petrol-light">Quote review</p>
            <h1 className="font-display text-5xl font-semibold leading-tight sm:text-7xl">Is this quote fair?</h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-white/60">
              Paste a WhatsApp message, email, or typed list. Renoza looks for missing details, risky deposit terms, and vague scope language.
            </p>
          </motion.div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-[32px] bg-white p-4 shadow-2xl shadow-black/25"
          >
            <div className="paper-texture overflow-hidden rounded-[24px] border border-charcoal/10">
              <textarea
                value={quoteText}
                onChange={(event) => setQuoteText(event.target.value)}
                required
                rows={12}
                placeholder={"Paste your contractor quote here...\n\nExample:\nLabour: R8,000\nMaterials: R4,000\nDeposit: 50% upfront\nTimeline: 5 days"}
                className="h-full w-full resize-y bg-transparent px-5 py-5 text-sm leading-8 text-charcoal outline-none placeholder:text-charcoal-light/55"
              />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-medium leading-5 text-charcoal-light">Tip: include payment terms, timelines, line items, and contractor messages.</p>
              <button disabled={!quoteText.trim() || loading} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-clay px-5 py-3 text-sm font-bold text-white transition hover:bg-clay-highlight disabled:bg-canvas-dark disabled:text-charcoal-light">
                Review quote <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      <AnimatePresence>
        {loading ? (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-charcoal/82 px-6 backdrop-blur"
          >
            <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] bg-white p-6 shadow-2xl">
              <motion.div
                className="absolute inset-x-0 top-0 h-1 bg-petrol-light"
                animate={{ y: [0, 420, 0] }}
                transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
              />
              <ScanLine className="mb-5 h-7 w-7 text-petrol-dark" />
              <pre className="max-h-52 overflow-hidden whitespace-pre-wrap text-sm leading-7 text-charcoal-light/70">{quoteText}</pre>
              <p className="mt-6 font-display text-3xl font-semibold text-charcoal">{scanMessages[messageIndex]}...</p>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      {review ? (
        <section className="container-page py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow mb-3">Review complete</p>
              <h2 className="font-display text-4xl font-semibold text-charcoal">What to clarify before you pay.</h2>
            </div>
            <button
              onClick={() => {
                setQuoteText("");
                setReview(null);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white px-4 py-2 text-sm font-bold text-charcoal-light"
            >
              <RotateCcw className="h-4 w-4" /> Review another
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionCard title="Quote summary" kicker="Plain English">
              <p className="text-sm leading-7 text-charcoal-light">{review.quote_summary}</p>
            </SectionCard>

            <SectionCard title="Fairness meter" kicker="Estimate">
              <FairnessBar score={review.fairness_score} />
              <p className="mt-5 text-sm leading-7 text-charcoal-light">{review.fairness_estimate}</p>
            </SectionCard>

            <SectionCard title="Red flags" kicker="Protect the deposit" className="lg:col-span-2">
              <div className="grid gap-3 md:grid-cols-2">
                {review.red_flags.map((flag, index) => (
                  <motion.div
                    key={flag}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex gap-3 rounded-2xl border-l-4 border-clay bg-[#fff7f2] p-4 text-sm leading-6 text-charcoal-light"
                  >
                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-clay" />
                    {flag}
                  </motion.div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Missing details" kicker="Ask for specifics">
              <ul className="space-y-3">
                {review.missing_details.map((detail) => (
                  <li key={detail} className="border-l-2 border-canvas-dark pl-3 text-sm leading-6 text-charcoal-light">{detail}</li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Questions to send" kicker="Before paying">
              <ol className="space-y-3">
                {review.questions_to_ask.map((question, index) => (
                  <li key={question} className="flex gap-3 text-sm leading-6 text-charcoal-light">
                    <span className="font-display text-lg font-semibold text-petrol-dark">{index + 1}</span>
                    {question}
                  </li>
                ))}
              </ol>
            </SectionCard>

            <SectionCard title="Rewritten scope" kicker="Contractor-ready" className="lg:col-span-2">
              <div className="paper-texture rounded-[24px] border border-charcoal/10 p-6 font-serif text-sm leading-8 text-charcoal">
                <FileText className="mb-5 h-6 w-6 text-petrol-dark" />
                <pre className="whitespace-pre-wrap font-serif">{review.rewritten_scope}</pre>
              </div>
              <div className="mt-5">
                <CopyButton text={review.rewritten_scope} label="Copy rewritten scope" />
              </div>
            </SectionCard>
          </div>

          <div className="mt-8 rounded-[28px] bg-petrol-dark p-6 text-white sm:flex sm:items-center sm:justify-between">
            <p className="font-display text-2xl font-semibold">Need a cleaner brief first?</p>
            <Link href="/projects/new" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-petrol-dark sm:mt-0">
              Plan the renovation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
