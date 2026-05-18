"use client";

import Link from "next/link";
import { ArrowRight, FileText, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import CountUpDisplay from "./CountUpDisplay";
import WhatsAppBubble from "./WhatsAppBubble";
import { SAMPLE_PLAN_PREVIEW } from "@/lib/mock-ai";

export default function SamplePlanPreview() {
  const plan = SAMPLE_PLAN_PREVIEW;

  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
      <div className="container-page relative z-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <AnimatedSection>
          <p className="eyebrow mb-4">A real plan, not a teaser</p>
          <h2 className="font-display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
            This is what you walk away with.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-8 text-charcoal-light">
            What it should cost in rands. What could bite you halfway through the job. And a message you can send to any contractor before they&apos;ve had a chance to size you up.
          </p>
          <Link href="/projects/new" className="mt-8 inline-flex items-center gap-2 rounded-full bg-petrol-dark px-6 py-4 text-sm font-bold text-white shadow-xl shadow-petrol-dark/20 transition hover:-translate-y-0.5">
            Generate my plan <ArrowRight className="h-4 w-4" />
          </Link>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <motion.div
            whileHover={{ y: -4 }}
            className="premium-card rounded-[34px] p-4 sm:p-6"
          >
            <div className="mb-5 flex flex-wrap gap-2">
              {[plan.project.room_type, plan.project.location, plan.project.budget].map((tag) => (
                <span key={tag} className="rounded-full border border-charcoal/10 bg-canvas px-3 py-1 text-xs font-bold text-charcoal-light">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[26px] bg-canvas p-5">
                <div className="mb-4 flex items-center gap-2 text-petrol-dark">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-[0.12em]">Plan summary</span>
                </div>
                <p className="text-sm leading-7 text-charcoal-light">{plan.room_summary}</p>
                <div className="mt-6 rounded-2xl bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal-light">Estimated range</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <CountUpDisplay value={plan.cost_low} prefix="R" className="text-3xl" />
                    <span className="text-charcoal-light">-</span>
                    <CountUpDisplay value={plan.cost_high} prefix="R" className="text-3xl" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[26px] border border-clay/20 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2 text-clay">
                    <ShieldAlert className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-[0.12em]">Risk flags</span>
                  </div>
                  <div className="space-y-3">
                    {plan.risks.map((risk) => (
                      <p key={risk} className="border-l-2 border-clay pl-3 text-sm leading-6 text-charcoal-light">
                        {risk}
                      </p>
                    ))}
                  </div>
                </div>
                <WhatsAppBubble text={plan.whatsapp_snippet} compact />
              </div>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
