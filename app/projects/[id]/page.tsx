"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle, Check, ChevronDown, Download, Edit3,
  MessageSquare, Share2, Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProject, deleteProject } from "@/lib/storage";
import { BUDGET_LABELS, ROOM_TYPE_LABELS } from "@/lib/types";
import type { StoredProject } from "@/lib/types";
import { SPONSOR_PRODUCTS, FEATURED_CONTRACTORS } from "@/lib/sponsors";
import { filterContractors } from "@/lib/contractors";
import AnimatedSection from "@/components/AnimatedSection";
import SectionCard from "@/components/SectionCard";
import BudgetGauge from "@/components/BudgetGauge";
import CountUpDisplay from "@/components/CountUpDisplay";
import CostBreakdownChart from "@/components/CostBreakdownChart";
import TimelinePlayer from "@/components/TimelinePlayer";
import WhatsAppBubble from "@/components/WhatsAppBubble";
import SponsoredCard from "@/components/SponsoredCard";
import ContractorTile from "@/components/ContractorTile";
import ContractorCard from "@/components/ContractorCard";
import CopyButton from "@/components/CopyButton";
import ScopeDiagram from "@/components/ScopeDiagram";
import FengShuiCard from "@/components/FengShuiCard";
import SnaggingList from "@/components/SnaggingList";
import DepositShield from "@/components/DepositShield";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const SECTIONS = [
  { id: "summary",         label: "Summary" },
  { id: "budget",          label: "Budget" },
  { id: "scope-sketch",    label: "Scope" },
  { id: "whatsapp",        label: "WhatsApp" },
  { id: "work-items",      label: "Work Items" },
  { id: "materials",       label: "Materials" },
  { id: "labour",          label: "Labour" },
  { id: "timeline",        label: "Timeline" },
  { id: "risks",           label: "Risks" },
  { id: "questions",       label: "Questions" },
  { id: "snagging",        label: "Snagging" },
  { id: "contractors",     label: "Contractors" },
  { id: "payment",         label: "Payment" },
  { id: "spatial-harmony", label: "Harmony" }, // only shown when plan.feng_shui exists
];

export default function ProjectResultPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [project, setProject] = useState<StoredProject | null | undefined>(undefined);
  const [activeSection, setActiveSection] = useState("summary");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Load from localStorage on mount
  useEffect(() => {
    if (!id) {
      queueMicrotask(() => setProject(null));
      return;
    }

    // Check if this is a shared link (no local storage match)
    const stored = getProject(id);
    if (stored) {
      queueMicrotask(() => setProject(stored));
      return;
    }

    // Try share param fallback
    const shareParam = new URLSearchParams(window.location.search).get("share");
    if (shareParam) {
      try {
        const { input } = JSON.parse(atob(shareParam));
        // Regenerate plan for shared links
        fetch("/api/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
          .then((r) => r.json())
          .then((plan) => {
            setProject({ id, input, plan, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
          })
          .catch(() => setProject(null));
        return;
      } catch {
        queueMicrotask(() => setProject(null));
        return;
      }
    }

    queueMicrotask(() => setProject(null));
  }, [id]);

  // Intersection observer for active section
  useEffect(() => {
    if (!project) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.15, rootMargin: "-80px 0px -60% 0px" },
    );
    Object.values(sectionRefs.current).forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [project]);

  const scrollTo = (sectionId: string) => {
    const el = sectionRefs.current[sectionId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const shareUrl = useCallback(() => {
    if (!project) return;
    const shareData = btoa(JSON.stringify({ input: project.input }));
    const url = `${window.location.origin}/projects/${id}?share=${shareData}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    });
  }, [project, id]);

  const handleDelete = () => {
    if (!id) return;
    deleteProject(id);
    router.push("/projects");
  };

  // Loading / not found states
  if (project === undefined) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-petrol-light border-t-petrol-dark" />
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-6 text-center">
        <div>
          <p className="mb-4 text-sm text-charcoal-light">Plan not found or link expired.</p>
          <button
            onClick={() => router.push("/projects/new")}
            className="rounded-full bg-petrol-dark px-5 py-2.5 text-sm font-bold text-white"
          >
            Start a new plan
          </button>
        </div>
      </div>
    );
  }

  const { input, plan } = project;
  const relevantProducts = SPONSOR_PRODUCTS.filter((p) =>
    input.goals.some((g) => p.tags.includes(g)),
  ).slice(0, 4);
  const maxItemCost = Math.max(...plan.work_items.map((w) => w.high));

  return (
    <div>
      {/* ── Page header ── */}
      <div className="border-b border-charcoal/10 bg-white">
        <div className="container-page py-6 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="eyebrow mb-2">Renovation Plan</p>
              <h1 className="font-display text-2xl font-semibold text-charcoal sm:text-3xl">
                {input.name}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">{ROOM_TYPE_LABELS[input.room_type]}</Badge>
                <Badge variant="secondary">{input.location}</Badge>
                <Badge variant="secondary">{BUDGET_LABELS[input.budget_range]}</Badge>
              </div>
            </div>

            {/* Action buttons */}
            <div className="no-print flex shrink-0 flex-wrap gap-2">
              <CopyButton text={plan.whatsapp_brief} label="Copy brief" />
              <button
                onClick={shareUrl}
                className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-white px-4 py-2 text-sm font-semibold text-charcoal-light hover:text-charcoal"
              >
                {copiedUrl ? <Check className="h-4 w-4 text-petrol-mid" /> : <Share2 className="h-4 w-4" />}
                {copiedUrl ? "Copied!" : "Share"}
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-white px-4 py-2 text-sm font-semibold text-charcoal-light hover:text-charcoal"
              >
                <Download className="h-4 w-4" />
                PDF
              </button>
              <button
                onClick={() => router.push(`/projects/new?edit=${id}`)}
                className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-white px-4 py-2 text-sm font-semibold text-charcoal-light hover:text-charcoal"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-white px-4 py-2 text-sm font-semibold text-charcoal-light hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile horizontal section nav */}
        <div className="no-print -mx-0 overflow-x-auto border-t border-charcoal/10 lg:hidden">
          <div className="flex gap-1 px-4 py-2">
            {SECTIONS
              .filter((s) => s.id !== "spatial-harmony" || !!plan.feng_shui)
              .filter((s) => s.id !== "contractors")
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    activeSection === s.id
                      ? "bg-petrol-dark text-white"
                      : "text-charcoal-light hover:bg-canvas-dark hover:text-charcoal"
                  }`}
                >
                  {s.label}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="container-page py-4">
        <div className="flex gap-3 rounded-2xl border border-clay/25 bg-clay-50 px-4 py-3 text-xs leading-relaxed text-clay-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
          Cost estimates are broad ranges based on typical South African market rates. Always get at least two itemised quotes from registered contractors before committing.
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container-page grid gap-8 pb-24 lg:grid-cols-[200px_1fr] lg:pb-16">

        {/* Desktop sidebar */}
        <aside className="no-print hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <div className="flex flex-col gap-0.5">
            {SECTIONS
              .filter((s) => s.id !== "spatial-harmony" || !!plan.feng_shui)
              .filter((s) => s.id !== "contractors")
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    activeSection === s.id
                      ? "bg-petrol-dark/8 font-semibold text-petrol-dark"
                      : "font-medium text-charcoal-light hover:text-charcoal"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      activeSection === s.id ? "bg-petrol-dark" : "bg-charcoal/20"
                    }`}
                  />
                  {s.label}
                </button>
              ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-w-0 flex-col gap-5">

          <section id="summary" ref={(el) => { sectionRefs.current["summary"] = el; }}>
            <SectionCard title="Room Summary">
              <p className="text-sm leading-7 text-charcoal">{plan.room_summary}</p>
              <p className="mt-3 text-sm leading-7 text-charcoal-light">{plan.recommended_approach}</p>
            </SectionCard>
          </section>

          <section id="budget" ref={(el) => { sectionRefs.current["budget"] = el; }}>
            <SectionCard title="Budget Realism">
              <p className="mb-6 text-sm leading-7 text-charcoal">{plan.budget_realism}</p>
              <div className="grid items-center gap-6 sm:grid-cols-2">
                <BudgetGauge low={plan.cost_low} high={plan.cost_high} max={plan.budget_max} size={200} />
                <div className="text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-charcoal-light">
                    Estimated range
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <CountUpDisplay value={plan.cost_low} prefix="R" className="text-3xl" />
                    <span className="text-xl text-charcoal-light">–</span>
                    <CountUpDisplay value={plan.cost_high} prefix="R" className="text-3xl" />
                  </div>
                </div>
              </div>
            </SectionCard>
          </section>

          <section id="scope-sketch" ref={(el) => { sectionRefs.current["scope-sketch"] = el; }}>
            <SectionCard title="Scope Sketch" kicker="Sketch only — not a structural drawing">
              <ScopeDiagram
                input={input}
                plan={plan}
                showFengShui={!!input.include_feng_shui}
                compassDirection={input.compass_direction}
              />
              {plan.floor_plan_notes && (
                <p className="mt-4 rounded-2xl bg-canvas px-4 py-3 text-sm leading-6 text-charcoal-light">
                  <span className="font-semibold text-charcoal">AI floor plan notes: </span>
                  {plan.floor_plan_notes}
                </p>
              )}
            </SectionCard>
          </section>

          {/* WhatsApp brief — 3rd on mobile (most important feature) */}
          <section id="whatsapp" ref={(el) => { sectionRefs.current["whatsapp"] = el; }}>
            <SectionCard title="WhatsApp Contractor Brief">
              <p className="mb-4 text-xs text-charcoal-light">
                Copy and send this to contractors via WhatsApp for consistent, comparable quotes.
              </p>
              <WhatsAppBubble text={plan.whatsapp_brief} />
            </SectionCard>
          </section>

          <section id="work-items" ref={(el) => { sectionRefs.current["work-items"] = el; }}>
            <SectionCard title="Suggested Work Items">
              <div className="divide-y divide-charcoal/8">
                {plan.work_items.map((item, i) => (
                  <AnimatedSection key={i} delay={i * 0.06}>
                    <div className="flex items-start gap-4 py-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-charcoal">{item.category}</p>
                        <p className="mt-1 text-sm leading-6 text-charcoal-light">{item.description}</p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-petrol-dark">
                        {item.estimated_cost}
                      </span>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-petrol-dark px-5 py-4">
                <span className="text-sm font-semibold text-white">Total estimated range</span>
                <span className="text-lg font-bold text-white">{plan.estimated_cost_range}</span>
              </div>
              <div className="mt-6">
                <CostBreakdownChart items={plan.work_items} maxCost={maxItemCost * 1.2} />
              </div>
            </SectionCard>
          </section>

          {/* Sponsored products */}
          {relevantProducts.length > 0 && (
            <AnimatedSection className="no-print">
              <p className="eyebrow mb-3">Recommended for your renovation</p>
              <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
                {relevantProducts.map((p) => (
                  <SponsoredCard key={p.id} product={p} />
                ))}
              </div>
            </AnimatedSection>
          )}

          <section id="materials" ref={(el) => { sectionRefs.current["materials"] = el; }}>
            <SectionCard title="Materials List">
              <ul className="grid gap-2 sm:grid-cols-2">
                {plan.materials_list.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-6 text-charcoal">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-petrol-mid" />
                    {m}
                  </li>
                ))}
              </ul>
            </SectionCard>
          </section>

          <section id="labour" ref={(el) => { sectionRefs.current["labour"] = el; }}>
            <SectionCard title="Labour Categories">
              <ul className="grid gap-2 sm:grid-cols-2">
                {plan.labour_categories.map((l, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-6 text-charcoal">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-petrol-mid" />
                    {l}
                  </li>
                ))}
              </ul>
            </SectionCard>
          </section>

          {/* Featured contractors */}
          <AnimatedSection className="no-print">
            <p className="eyebrow mb-3">Featured contractors near you</p>
            <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              {FEATURED_CONTRACTORS.map((c) => (
                <ContractorTile key={c.id} contractor={c} />
              ))}
            </div>
          </AnimatedSection>

          <section id="timeline" ref={(el) => { sectionRefs.current["timeline"] = el; }}>
            <SectionCard title="Renovation Timeline">
              <TimelinePlayer phases={plan.timeline_phases} />
            </SectionCard>
          </section>

          <section id="risks" ref={(el) => { sectionRefs.current["risks"] = el; }} className="print-avoid-break">
            <SectionCard title="Risks & Hidden Costs">
              <ul className="flex flex-col gap-3">
                {plan.risks_and_hidden_costs.map((r, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-xl border-l-4 border-clay bg-clay-50 px-4 py-3 text-sm leading-6 text-charcoal"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
                    {r}
                  </li>
                ))}
              </ul>
            </SectionCard>
          </section>

          <section id="questions" ref={(el) => { sectionRefs.current["questions"] = el; }} className="print-avoid-break">
            <SectionCard title="Questions for Your Contractor">
              <ol className="flex flex-col gap-3">
                {plan.questions_for_contractor.map((q, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-6 text-charcoal">
                    <span className="shrink-0 font-bold text-petrol-mid">{i + 1}.</span>
                    {q}
                  </li>
                ))}
              </ol>
            </SectionCard>
          </section>

          {/* Snagging checklist */}
          <section id="snagging" ref={(el) => { sectionRefs.current["snagging"] = el; }} className="print-avoid-break">
            <SectionCard title="Snagging Checklist" kicker="Sign off before paying the final invoice">
              <SnaggingList goals={input.goals} roomType={input.room_type} projectId={id} />
            </SectionCard>
          </section>

          {/* Contractor directory — filtered by goals + location */}
          <section id="contractors" ref={(el) => { sectionRefs.current["contractors"] = el; }} className="print-avoid-break no-print">
            <SectionCard title="Find a Contractor" kicker="Demo profiles — matched to your goals">
              <div className="grid gap-4 sm:grid-cols-2">
                {filterContractors(input.location, input.goals).map((c) => (
                  <ContractorCard
                    key={c.id}
                    contractor={c}
                    whatsappBrief={plan.whatsapp_brief}
                    highlightGoals={input.goals}
                  />
                ))}
              </div>
              <Link href="/contractors" className="mt-4 inline-block text-sm font-semibold text-petrol-dark hover:underline">
                Browse all contractors →
              </Link>
            </SectionCard>
          </section>

          {/* Payment Schedule */}
          <section id="payment" ref={(el) => { sectionRefs.current["payment"] = el; }} className="print-avoid-break">
            <SectionCard title="Payment Schedule" kicker="Plan your milestone payments">
              <DepositShield plan={plan} input={input} projectId={id} />
            </SectionCard>
          </section>

          {/* Spatial Harmony — conditional on feng_shui data */}
          {plan.feng_shui && (
            <section id="spatial-harmony" ref={(el) => { sectionRefs.current["spatial-harmony"] = el; }} className="print-avoid-break">
              <SectionCard title="Spatial Harmony Guidance" kicker="Optional — traditional feng shui principles">
                <FengShuiCard analysis={plan.feng_shui} />
              </SectionCard>
            </section>
          )}

          {/* Bottom CTAs */}
          <div className="no-print flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => router.push("/quote-review")}
              className="rounded-full bg-petrol-dark px-5 py-3 text-sm font-bold text-white"
            >
              Review a contractor quote →
            </button>
            <button
              onClick={() => router.push("/projects/new")}
              className="rounded-full border border-charcoal/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal"
            >
              Plan another room
            </button>
          </div>

          {/* Financing banner */}
          <AnimatedSection className="no-print">
            <div className="rounded-2xl border border-petrol-light/30 border-l-4 border-l-petrol-dark bg-white p-5">
              <p className="eyebrow mb-2">Sponsored</p>
              <p className="font-semibold text-charcoal">Financing available</p>
              <p className="mt-1 text-sm leading-6 text-charcoal-light">
                Standard Bank Home Improvement Loan — from R5,000 to R300,000. Apply online in 5 minutes with instant pre-approval.
              </p>
              <button className="mt-3 rounded-full border border-petrol-light/40 bg-petrol-dark/6 px-4 py-2 text-sm font-semibold text-petrol-dark">
                Learn more →
              </button>
            </div>
          </AnimatedSection>

        </div>
      </div>

      {/* ── Sticky mobile WhatsApp copy button ── */}
      <div className="no-print fixed bottom-6 left-0 right-0 z-40 flex justify-center lg:hidden">
        <button
          onClick={() => navigator.clipboard.writeText(plan.whatsapp_brief)}
          className="inline-flex items-center gap-2 rounded-full bg-petrol-dark px-6 py-3.5 text-sm font-bold text-white shadow-2xl shadow-petrol-dark/35"
        >
          <MessageSquare className="h-4 w-4" />
          Copy WhatsApp Brief
        </button>
      </div>

      {/* ── Delete confirm dialog ── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-charcoal/50 p-4 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            >
              <h2 className="font-display text-xl font-semibold text-charcoal">Delete this plan?</h2>
              <p className="mt-2 text-sm text-charcoal-light">This cannot be undone.</p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-full border border-charcoal/10 py-3 text-sm font-semibold text-charcoal"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-full bg-red-600 py-3 text-sm font-bold text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Section nav scroll indicator (desktop) ── */}
      <button
        onClick={() => scrollTo("questions")}
        className="no-print fixed bottom-8 right-8 hidden h-10 w-10 place-items-center rounded-full bg-white shadow-lg shadow-charcoal/10 lg:grid"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-5 w-5 text-charcoal-light" />
      </button>
    </div>
  );
}
