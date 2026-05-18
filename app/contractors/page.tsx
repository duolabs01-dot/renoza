"use client";

import { useState } from "react";
import { CONTRACTORS } from "@/lib/contractors";
import ContractorCard from "@/components/ContractorCard";
import AnimatedSection from "@/components/AnimatedSection";
import type { RenovationGoal } from "@/lib/types";
import { GOAL_LABELS, GOAL_OPTIONS } from "@/lib/types";

type Province = "all" | "GP" | "WC" | "KZN" | "EC";

const PROVINCE_LABELS: Record<Province, string> = {
  all: "All provinces",
  GP: "Gauteng",
  WC: "Western Cape",
  KZN: "KwaZulu-Natal",
  EC: "Eastern Cape",
};

export default function ContractorsPage() {
  const [province, setProvince] = useState<Province>("all");
  const [goalFilter, setGoalFilter] = useState<RenovationGoal | "all">("all");

  const filtered = CONTRACTORS.filter((c) => {
    const matchProvince = province === "all" || c.province === province;
    const matchGoal = goalFilter === "all" || c.goals.includes(goalFilter);
    return matchProvince && matchGoal;
  });

  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      <div className="container-page py-8 sm:py-12">

        <AnimatedSection>
          <div className="mb-2 inline-block rounded-full border border-canvas-dark bg-canvas px-3 py-1 text-xs font-bold uppercase tracking-widest text-charcoal-light">
            Demo profiles
          </div>
          <h1 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
            Find a contractor for your renovation
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-charcoal-light">
            These are sample contractor profiles for demonstration purposes. They are not real verified businesses.
            Always do your own due diligence before hiring any contractor.
          </p>
        </AnimatedSection>

        {/* Filters */}
        <AnimatedSection delay={0.05}>
          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Province chips */}
            <div className="flex flex-wrap gap-2">
              {(["all", "GP", "WC", "KZN", "EC"] as Province[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setProvince(p)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    province === p
                      ? "bg-petrol-dark text-white shadow-sm"
                      : "border border-charcoal/10 bg-white text-charcoal-light hover:border-petrol-dark/30 hover:text-petrol-dark"
                  }`}
                >
                  {PROVINCE_LABELS[p]}
                </button>
              ))}
            </div>

            {/* Goal filter */}
            <select
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value as RenovationGoal | "all")}
              className="rounded-2xl border border-charcoal/10 bg-white px-4 py-2 text-sm font-semibold text-charcoal focus:border-petrol-dark focus:outline-none"
            >
              <option value="all">All specialties</option>
              {GOAL_OPTIONS.map((g) => (
                <option key={g} value={g}>{GOAL_LABELS[g]}</option>
              ))}
            </select>
          </div>
        </AnimatedSection>

        {/* Grid */}
        <div className="mt-8">
          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c, i) => (
                <AnimatedSection key={c.id} delay={i * 0.04}>
                  <ContractorCard contractor={c} whatsappBrief="" />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection delay={0.05}>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-lg font-semibold text-charcoal">No contractors found</p>
                <p className="mt-2 text-sm text-charcoal-light">Try a different province or specialty filter.</p>
                <button
                  onClick={() => { setProvince("all"); setGoalFilter("all"); }}
                  className="mt-4 rounded-full border border-charcoal/10 px-5 py-2 text-sm font-semibold text-charcoal hover:bg-canvas"
                >
                  Clear filters
                </button>
              </div>
            </AnimatedSection>
          )}
        </div>

      </div>
    </main>
  );
}
