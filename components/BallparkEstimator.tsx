"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { calculatePlan, ROOM_DEFAULT_SQM } from "@/lib/pricing";
import { ROOM_TYPE_LABELS, GOAL_LABELS, ROOM_TYPES, GOAL_OPTIONS } from "@/lib/types";
import type { RoomType, RenovationGoal } from "@/lib/types";

type Step = 1 | 2 | 3;

export default function BallparkEstimator() {
  const [step, setStep] = useState<Step>(1);
  const [roomType, setRoomType] = useState<RoomType | "">("");
  const [goals, setGoals] = useState<RenovationGoal[]>([]);
  const [city, setCity] = useState("");

  function toggleGoal(g: RenovationGoal) {
    setGoals(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  }

  const estimate = roomType && goals.length > 0
    ? calculatePlan({
        name: "Estimate",
        location: city || "Johannesburg",
        room_type: roomType as RoomType,
        ownership_type: "own",
        room_size: `${ROOM_DEFAULT_SQM[roomType as RoomType]}m2`,
        budget_range: "15k-50k",
        goals,
      })
    : null;

  const ctaHref = roomType && goals.length > 0
    ? `/projects/new?room=${roomType}&goals=${goals.join(",")}&city=${encodeURIComponent(city)}`
    : "/projects/new";

  return (
    <div className="rounded-[28px] border border-canvas-dark bg-white shadow-sm">
      {/* Step indicator */}
      <div className="flex items-center gap-2 border-b border-canvas-dark px-6 py-4">
        {(["Room", "Goals", "Location"] as const).map((label, i) => {
          const s = (i + 1) as Step;
          const done = step > s;
          const active = step === s;
          return (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => done && setStep(s)}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  active ? "bg-petrol-dark text-white" :
                  done  ? "bg-petrol-light/30 text-petrol-dark cursor-pointer" :
                  "bg-canvas-dark text-charcoal-light"
                }`}
              >
                {done ? "✓" : s}
              </button>
              <span className={`text-sm font-semibold ${active ? "text-charcoal" : "text-charcoal-light"}`}>
                {label}
              </span>
              {i < 2 && <ChevronRight className="h-3.5 w-3.5 text-charcoal-light/40" />}
            </div>
          );
        })}
      </div>

      <div className="p-6">
        {/* Step 1 — Room type */}
        {step === 1 && (
          <div>
            <p className="mb-4 text-sm font-semibold text-charcoal">Which room are you renovating?</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ROOM_TYPES.map((rt) => (
                <button
                  key={rt}
                  onClick={() => { setRoomType(rt); setStep(2); }}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all text-left ${
                    roomType === rt
                      ? "border-petrol-dark bg-petrol-dark/5 text-petrol-dark"
                      : "border-canvas-dark text-charcoal-light hover:border-petrol-dark/30 hover:text-charcoal"
                  }`}
                >
                  {ROOM_TYPE_LABELS[rt]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Goals */}
        {step === 2 && (
          <div>
            <p className="mb-4 text-sm font-semibold text-charcoal">What needs doing? <span className="font-normal text-charcoal-light">(pick all that apply)</span></p>
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((g) => (
                <button
                  key={g}
                  onClick={() => toggleGoal(g)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    goals.includes(g)
                      ? "border-petrol-dark bg-petrol-dark text-white"
                      : "border-canvas-dark text-charcoal-light hover:border-petrol-dark/30 hover:text-charcoal"
                  }`}
                >
                  {GOAL_LABELS[g]}
                </button>
              ))}
            </div>
            <button
              disabled={goals.length === 0}
              onClick={() => setStep(3)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-petrol-dark px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 3 — City + result */}
        {step === 3 && (
          <div>
            <p className="mb-3 text-sm font-semibold text-charcoal">Where is the property? <span className="font-normal text-charcoal-light">(city or suburb)</span></p>
            <input
              type="text"
              placeholder="e.g. Cape Town, Sandton, Durban North"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full max-w-sm rounded-2xl border border-canvas-dark bg-canvas px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-light/60 focus:border-petrol-dark focus:outline-none"
            />
            {estimate && (
              <div className="mt-6 rounded-[20px] border border-canvas-dark bg-canvas p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-charcoal-light/60">
                  Planning estimate
                </p>
                <p className="mt-1 font-display text-3xl font-semibold text-petrol-dark">
                  {estimate.estimated_cost_range}
                </p>
                <p className="mt-1 text-xs text-charcoal-light">
                  {ROOM_TYPE_LABELS[roomType as RoomType]} · {goals.map(g => GOAL_LABELS[g]).join(", ")} · {city || "Johannesburg"}
                </p>
                <p className="mt-2 text-[11px] text-charcoal-light/60">
                  Based on {ROOM_DEFAULT_SQM[roomType as RoomType]}m² default room size · Regional rates applied · For planning purposes only
                </p>
              </div>
            )}
            <Link
              href={ctaHref}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-petrol-dark px-5 py-3 text-sm font-bold text-white hover:bg-petrol-mid"
            >
              Build my full plan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
