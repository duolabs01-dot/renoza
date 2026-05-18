"use client";

import Link from "next/link";
import { ArrowRight, Camera, CheckCircle2, ChevronDown, FileSearch, Hammer, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import CountUpDisplay from "@/components/CountUpDisplay";
import SamplePlanPreview from "@/components/SamplePlanPreview";
import SponsorStrip from "@/components/SponsorStrip";

const steps = [
  { icon: Camera, title: "Upload photos", body: "Capture the room as it is. Renoza turns visible condition, budget, and goals into a practical brief." },
  { icon: Hammer, title: "Set the budget", body: "Choose what you can spend and see what is realistic before a contractor shapes the conversation." },
  { icon: FileSearch, title: "Get the plan", body: "Receive cost ranges, work items, risks, and a WhatsApp brief that contractors can actually quote against." },
];

const features = [
  "Rand-based ranges instead of fake precision",
  "Safety checks for damp, electrical, plumbing, and waterproofing",
  "Native sponsored recommendations labelled clearly",
  "Contractor language rewritten into plain English",
];

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 900], reduceMotion ? [0, 0] : [0, 170]);

  return (
    <div className="overflow-hidden">
      <section className="hero-image relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-x-0 -top-24 bottom-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-petrol-dark/28 to-petrol-dark/70" />
        <div className="container-page relative z-10 grid min-h-[calc(100vh-4rem)] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-petrol-light backdrop-blur">
              AI renovation planning for South African homes
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[0.98] tracking-normal text-white sm:text-7xl lg:text-8xl">
              Your renovation. Your budget. No surprises.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/72">
              Renoza turns room photos, budget, and contractor quotes into practical renovation plans grounded in South African prices and real renovation risk.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/projects/new" className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-bold text-petrol-dark shadow-2xl shadow-black/20 transition hover:-translate-y-0.5">
                Plan my renovation
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link href="/quote-review" className="inline-flex items-center justify-center rounded-full border border-white/32 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/18">
                Check a quote
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel hidden rounded-[32px] p-4 lg:block"
          >
            <div className="rounded-[24px] bg-white p-5">
              <div className="feature-image-kitchen mb-5 h-64 rounded-[22px]" />
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Estimate", "R18k-R42k"],
                  ["Risk", "Moisture"],
                  ["Brief", "Ready"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-canvas p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal-light">{label}</p>
                    <p className="mt-2 font-display text-2xl font-semibold text-petrol-dark">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        <ChevronDown className="absolute bottom-8 left-1/2 h-7 w-7 -translate-x-1/2 animate-bounce text-white/70" />
      </section>

      <section className="border-b border-charcoal/10 bg-white py-10">
        <div className="container-page grid gap-6 sm:grid-cols-3">
          {[
            { value: 3840, suffix: "+", label: "Plans generated" },
            { value: 12, prefix: "R", suffix: "m+", label: "Bad quote exposure flagged" },
            { value: 890, suffix: "+", label: "Contractor briefs created" },
          ].map((stat, index) => (
            <AnimatedSection key={stat.label} delay={index * 0.06} className="text-center">
              <CountUpDisplay value={stat.value} prefix={stat.prefix} suffix={stat.suffix} className="text-4xl" />
              <p className="mt-2 text-sm font-semibold text-charcoal-light">{stat.label}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <SamplePlanPreview />

      <section className="container-page py-24">
        <AnimatedSection className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">Show, then plan</p>
          <h2 className="font-display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
            See the difference before you brief the contractor.
          </h2>
        </AnimatedSection>
        <BeforeAfterSlider />
      </section>

      <section className="bg-white py-24">
        <div className="container-page">
          <AnimatedSection className="mx-auto mb-12 max-w-2xl text-center">
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="font-display text-4xl font-semibold text-charcoal sm:text-5xl">
              Calm steps for a stressful decision.
            </h2>
          </AnimatedSection>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <AnimatedSection key={step.title} delay={index * 0.08}>
                <motion.div whileHover={{ y: -4 }} className="premium-card h-full rounded-[28px] p-7">
                  <div className="mb-8 flex items-center justify-between">
                    <step.icon className="h-7 w-7 text-petrol-dark" />
                    <span className="font-display text-5xl font-semibold text-petrol-light/55">0{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-charcoal">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-charcoal-light">{step.body}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
        <AnimatedSection className="feature-image-lounge min-h-[520px] rounded-[36px] editorial-shadow" />
        <AnimatedSection className="max-w-xl">
          <p className="eyebrow mb-4">Trust layer</p>
          <h2 className="font-display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
            Pretty images are easy. Renovating safely is the hard part.
          </h2>
          <div className="mt-8 grid gap-4">
            {features.map((feature) => (
              <div key={feature} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-petrol-mid" />
                <p className="text-sm font-semibold leading-6 text-charcoal-light">{feature}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section className="border-y border-charcoal/10 bg-white py-20">
        <div className="container-page mb-8">
          <p className="eyebrow mb-3">Curated recommendations</p>
          <h2 className="font-display text-4xl font-semibold text-charcoal">
            Tools, materials, and services matched to your project.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-charcoal-light">
            Sponsored placements are labelled, contextual, and designed to feel like a helpful shortlist rather than a noisy banner.
          </p>
        </div>
        <SponsorStrip />
      </section>

      <section className="bg-petrol-dark py-24 text-white">
        <AnimatedSection className="container-page text-center">
          <Sparkles className="mx-auto mb-5 h-8 w-8 text-petrol-light" />
          <h2 className="font-display text-4xl font-semibold sm:text-6xl">
            Ready to renovate smarter?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/68">
            Start with a plan that helps you feel capable before anyone asks for a deposit.
          </p>
          <Link href="/projects/new" className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-bold text-petrol-dark">
            Build my Renoza plan <ShieldCheck className="h-4 w-4" />
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
