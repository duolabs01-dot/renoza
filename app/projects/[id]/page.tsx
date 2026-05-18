"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { generateRenovationPlan } from "@/lib/mock-ai";
import { BUDGET_LABELS, ROOM_TYPE_LABELS } from "@/lib/types";
import type { ProjectInput } from "@/lib/types";
import { SPONSOR_PRODUCTS, FEATURED_CONTRACTORS } from "@/lib/sponsors";
import AnimatedSection from "@/components/AnimatedSection";
import SectionCard from "@/components/SectionCard";
import BudgetGauge from "@/components/BudgetGauge";
import CountUpDisplay from "@/components/CountUpDisplay";
import CostBreakdownChart from "@/components/CostBreakdownChart";
import TimelinePlayer from "@/components/TimelinePlayer";
import WhatsAppBubble from "@/components/WhatsAppBubble";
import SponsoredCard from "@/components/SponsoredCard";
import ContractorTile from "@/components/ContractorTile";

const SECTIONS = [
  { id: "summary", label: "Summary" }, { id: "approach", label: "Approach" },
  { id: "budget", label: "Budget" }, { id: "work-items", label: "Work Items" },
  { id: "materials", label: "Materials" }, { id: "labour", label: "Labour" },
  { id: "timeline", label: "Timeline" }, { id: "risks", label: "Risks" },
  { id: "questions", label: "Questions" }, { id: "whatsapp", label: "WhatsApp Brief" },
];

export default function ProjectResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("summary");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const raw = searchParams.get("data");
  const input: ProjectInput | null = useMemo(() => {
    if (!raw) return null;
    try { return JSON.parse(raw) as ProjectInput; } catch { return null; }
  }, [raw]);

  const plan = useMemo(() => input ? generateRenovationPlan(input) : null, [input]);

  useEffect(() => {
    if (!plan) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.15, rootMargin: "-80px 0px -60% 0px" });
    Object.values(sectionRefs.current).forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [plan]);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!input || !plan) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>Could not load project data.</p>
        <button onClick={() => router.push("/projects/new")} className="btn-scale" style={{
          padding: "12px 28px", borderRadius: 10, background: "var(--petrol-700)", color: "white", fontSize: 14, fontWeight: 600,
        }}>Start a new plan</button>
      </div>
    );
  }

  const relevantProducts = SPONSOR_PRODUCTS.filter((p) => input.goals.some((g) => p.tags.includes(g))).slice(0, 4);
  const maxItemCost = Math.max(...plan.work_items.map((w) => w.high));

  return (
    <div className="page-enter">

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--canvas-dark)", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--petrol-600)", marginBottom: 6 }}>Renovation Plan</p>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 700, color: "var(--charcoal)", marginBottom: 10 }}>{input.name}</h1>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[ROOM_TYPE_LABELS[input.room_type], input.location, BUDGET_LABELS[input.budget_range]].map((tag, i) => (
                  <span key={i} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "var(--canvas)", border: "1px solid var(--canvas-dark)", color: "var(--charcoal-light)" }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-scale" style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid var(--canvas-dark)", background: "white", color: "var(--charcoal)" }}>Share</button>
              <button className="btn-scale" onClick={() => scrollTo("whatsapp")} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid var(--petrol-200)", background: "var(--petrol-50)", color: "var(--petrol-700)" }}>Copy WhatsApp brief</button>
            </div>
          </div>
        </div>
        <div className="gradient-line" />
      </div>

      {/* Disclaimer */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px" }}>
        <div style={{ borderRadius: 10, background: "var(--clay-50)", border: "1px solid var(--clay-200)", padding: "12px 18px", fontSize: 12, color: "var(--clay-700)", lineHeight: 1.6 }}>
          Cost estimates are broad ranges based on typical South African market rates. Always get at least two itemised quotes from registered contractors before committing.
        </div>
      </div>

      {/* Two-column layout */}
      <div className="result-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 80px", display: "grid", gridTemplateColumns: "200px 1fr", gap: 32 }}>

        {/* Sidebar */}
        <aside className="result-sidebar" style={{ position: "sticky", top: 76, alignSelf: "start", display: "flex", flexDirection: "column", gap: 2 }}>
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => scrollTo(s.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
              borderRadius: 8, fontSize: 13, fontWeight: activeSection === s.id ? 600 : 400,
              color: activeSection === s.id ? "var(--petrol-700)" : "var(--muted)",
              background: activeSection === s.id ? "var(--petrol-50)" : "transparent",
              textAlign: "left", transition: "all 0.2s", width: "100%", border: "none", cursor: "pointer",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: activeSection === s.id ? "var(--petrol-600)" : "var(--canvas-dark)", transition: "all 0.3s" }} />
              {s.label}
            </button>
          ))}
        </aside>

        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>

          <section id="summary" ref={(el) => { sectionRefs.current["summary"] = el; }}>
            <SectionCard title="Room Summary">
              <p style={{ fontSize: 14, color: "var(--charcoal)", lineHeight: 1.7 }}>{plan.room_summary}</p>
            </SectionCard>
          </section>

          <section id="approach" ref={(el) => { sectionRefs.current["approach"] = el; }}>
            <SectionCard title="Recommended Approach">
              <p style={{ fontSize: 14, color: "var(--charcoal)", lineHeight: 1.7 }}>{plan.recommended_approach}</p>
            </SectionCard>
          </section>

          <section id="budget" ref={(el) => { sectionRefs.current["budget"] = el; }}>
            <SectionCard title="Budget Realism">
              <p style={{ fontSize: 14, color: "var(--charcoal)", lineHeight: 1.7, marginBottom: 24 }}>{plan.budget_realism}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
                <BudgetGauge low={plan.cost_low} high={plan.cost_high} max={plan.budget_max} size={200} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Estimated range</div>
                  <CountUpDisplay value={plan.cost_low} prefix="R" fontSize={28} />
                  <span style={{ fontSize: 20, color: "var(--muted)", margin: "0 8px" }}>–</span>
                  <CountUpDisplay value={plan.cost_high} prefix="R" fontSize={28} />
                </div>
              </div>
            </SectionCard>
          </section>

          <section id="work-items" ref={(el) => { sectionRefs.current["work-items"] = el; }}>
            <SectionCard title="Suggested Work Items">
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {plan.work_items.map((item, i) => (
                  <AnimatedSection key={i} delay={i * 0.08}>
                    <div style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: i < plan.work_items.length - 1 ? "1px solid var(--canvas-dark)" : "none", alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--charcoal)", marginBottom: 3 }}>{item.category}</div>
                        <div style={{ fontSize: 13, color: "var(--charcoal-light)", lineHeight: 1.55 }}>{item.description}</div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--petrol-700)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{item.estimated_cost}</div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
              <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--petrol-700)", borderRadius: 10, padding: "14px 20px" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "white" }}>Total estimated range</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: "white", fontVariantNumeric: "tabular-nums" }}>{plan.estimated_cost_range}</span>
              </div>
              <div style={{ marginTop: 24 }}>
                <CostBreakdownChart items={plan.work_items} maxCost={maxItemCost * 1.2} />
              </div>
            </SectionCard>
          </section>

          {/* Sponsored Products */}
          {relevantProducts.length > 0 && (
            <AnimatedSection>
              <div style={{ padding: "20px 0" }}>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>Recommended products for your renovation</p>
                <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
                  {relevantProducts.map((p) => <SponsoredCard key={p.id} product={p} />)}
                </div>
              </div>
            </AnimatedSection>
          )}

          <section id="materials" ref={(el) => { sectionRefs.current["materials"] = el; }}>
            <SectionCard title="Materials List">
              <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {plan.materials_list.map((m, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--charcoal)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--petrol-500)", marginTop: 2, flexShrink: 0 }}>•</span><span>{m}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </section>

          <section id="labour" ref={(el) => { sectionRefs.current["labour"] = el; }}>
            <SectionCard title="Labour Categories">
              <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {plan.labour_categories.map((l, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--charcoal)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--petrol-500)", marginTop: 2, flexShrink: 0 }}>•</span><span>{l}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </section>

          {/* Contractor Tiles */}
          <AnimatedSection>
            <div style={{ padding: "8px 0 20px" }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>Featured contractors near you</p>
              <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
                {FEATURED_CONTRACTORS.map((c) => <ContractorTile key={c.id} contractor={c} />)}
              </div>
            </div>
          </AnimatedSection>

          <section id="timeline" ref={(el) => { sectionRefs.current["timeline"] = el; }}>
            <SectionCard title="Renovation Timeline">
              <TimelinePlayer phases={plan.timeline_phases} />
            </SectionCard>
          </section>

          <section id="risks" ref={(el) => { sectionRefs.current["risks"] = el; }}>
            <SectionCard title="Risks & Hidden Costs">
              <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {plan.risks_and_hidden_costs.map((r, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--charcoal)", lineHeight: 1.6, paddingLeft: 12, borderLeft: "3px solid var(--clay-400)" }}>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </section>

          <section id="questions" ref={(el) => { sectionRefs.current["questions"] = el; }}>
            <SectionCard title="Questions for Your Contractor">
              <ol style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none" }}>
                {plan.questions_for_contractor.map((q, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--charcoal)", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--petrol-600)", fontWeight: 600, flexShrink: 0, width: 24 }}>{i + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
            </SectionCard>
          </section>

          <section id="whatsapp" ref={(el) => { sectionRefs.current["whatsapp"] = el; }}>
            <SectionCard title="WhatsApp Contractor Brief">
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Copy and send to contractors via WhatsApp to get consistent, comparable quotes.</p>
              <WhatsAppBubble text={plan.whatsapp_brief} />
            </SectionCard>
          </section>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 16 }}>
            <button onClick={() => router.push("/quote-review")} className="btn-scale" style={{ padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, background: "var(--petrol-700)", color: "white" }}>
              Review a contractor quote →
            </button>
            <button onClick={() => router.push("/projects/new")} className="btn-scale" style={{ padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 500, border: "1px solid var(--canvas-dark)", background: "white", color: "var(--charcoal)" }}>
              Plan another room
            </button>
          </div>

          {/* Financing banner */}
          <AnimatedSection>
            <div style={{ borderRadius: 12, border: "1px solid var(--petrol-200)", borderLeft: "4px solid var(--petrol-600)", background: "white", padding: "20px 24px" }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Sponsored</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--charcoal)", marginBottom: 4 }}>Financing available</p>
              <p style={{ fontSize: 13, color: "var(--charcoal-light)", lineHeight: 1.6, marginBottom: 12 }}>
                Standard Bank Home Improvement Loan — from R5,000 to R300,000. Apply online in 5 minutes with instant pre-approval.
              </p>
              <button className="btn-scale" style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: "var(--petrol-50)", border: "1px solid var(--petrol-200)", color: "var(--petrol-700)" }}>
                Learn more →
              </button>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </div>
  );
}
