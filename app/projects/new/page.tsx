"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RoomType, OwnershipType, BudgetRange, RenovationGoal } from "@/lib/types";
import {
  BUDGET_LABELS,
  ROOM_TYPE_LABELS,
  GOAL_LABELS,
} from "@/lib/types";

const BUDGET_OPTIONS: BudgetRange[] = [
  "under-5k",
  "5k-15k",
  "15k-50k",
  "50k-150k",
  "150k-plus",
];

const ROOM_TYPES: RoomType[] = [
  "kitchen",
  "bathroom",
  "bedroom",
  "lounge",
  "dining-room",
  "bathroom-en-suite",
  "garage",
  "other",
];

const GOAL_OPTIONS: RenovationGoal[] = [
  "paint",
  "flooring",
  "tiling",
  "lighting",
  "cupboards",
  "plumbing",
  "electrical",
  "damp-repair",
  "full-makeover",
  "prepare-rental-sale",
];

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("kitchen");
  const [ownership, setOwnership] = useState<OwnershipType>("own");
  const [roomSize, setRoomSize] = useState("");
  const [budget, setBudget] = useState<BudgetRange>("15k-50k");
  const [goals, setGoals] = useState<RenovationGoal[]>([]);

  const toggleGoal = (goal: RenovationGoal) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (goals.length === 0) {
      alert("Please select at least one renovation goal.");
      return;
    }
    setLoading(true);
    const input = { name, location, room_type: roomType, ownership_type: ownership, room_size: roomSize, budget_range: budget, goals };
    const encoded = encodeURIComponent(JSON.stringify(input));
    const mockId = `mock-${Date.now()}`;
    router.push(`/projects/${mockId}?data=${encoded}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-petrol-600 uppercase tracking-widest mb-2">
          New project
        </p>
        <h1 className="text-2xl font-bold text-charcoal">
          Tell us about your renovation
        </h1>
        <p className="text-sm text-muted mt-1">
          Fill in the details below. The more specific you are, the more useful
          the plan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">

        {/* Project name */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">
            Project name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kitchen upgrade — Sunninghill"
            className="w-full rounded-lg border border-canvas-dark bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-petrol-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">
            City or province
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Johannesburg, Gauteng"
            className="w-full rounded-lg border border-canvas-dark bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-petrol-500"
          />
        </div>

        {/* Room type */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">
            Room type
          </label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value as RoomType)}
            className="w-full rounded-lg border border-canvas-dark bg-white px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-petrol-500"
          >
            {ROOM_TYPES.map((rt) => (
              <option key={rt} value={rt}>
                {ROOM_TYPE_LABELS[rt]}
              </option>
            ))}
          </select>
        </div>

        {/* Own / rent */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Do you own or rent?
          </label>
          <div className="flex gap-3">
            {(["own", "rent"] as OwnershipType[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setOwnership(opt)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  ownership === opt
                    ? "bg-petrol-700 border-petrol-700 text-white"
                    : "bg-white border-canvas-dark text-charcoal hover:border-petrol-400"
                }`}
              >
                {opt === "own" ? "I own this property" : "I rent this property"}
              </button>
            ))}
          </div>
        </div>

        {/* Room size */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">
            Approximate room size
          </label>
          <input
            type="text"
            required
            value={roomSize}
            onChange={(e) => setRoomSize(e.target.value)}
            placeholder="e.g. 4m × 5m or approx. 20m²"
            className="w-full rounded-lg border border-canvas-dark bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-petrol-500"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Budget range
          </label>
          <div className="flex flex-wrap gap-2">
            {BUDGET_OPTIONS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBudget(b)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  budget === b
                    ? "bg-petrol-700 border-petrol-700 text-white"
                    : "bg-white border-canvas-dark text-charcoal hover:border-petrol-400"
                }`}
              >
                {BUDGET_LABELS[b]}
              </button>
            ))}
          </div>
        </div>

        {/* Renovation goals */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            What do you want to do?{" "}
            <span className="font-normal text-muted">(select all that apply)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {GOAL_OPTIONS.map((goal) => {
              const checked = goals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm text-left transition-colors ${
                    checked
                      ? "bg-petrol-50 border-petrol-400 text-petrol-800"
                      : "bg-white border-canvas-dark text-charcoal hover:border-petrol-300"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center ${
                      checked
                        ? "bg-petrol-700 border-petrol-700 text-white"
                        : "border-canvas-dark"
                    }`}
                  >
                    {checked && (
                      <svg
                        viewBox="0 0 10 10"
                        className="w-2.5 h-2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1.5 5l2.5 3 4.5-6" />
                      </svg>
                    )}
                  </span>
                  {GOAL_LABELS[goal]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo upload placeholder */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">
            Room photos{" "}
            <span className="font-normal text-muted">(optional — coming soon)</span>
          </label>
          <div className="rounded-lg border-2 border-dashed border-canvas-dark bg-white py-8 px-4 text-center">
            <div className="text-2xl mb-2">📷</div>
            <p className="text-sm text-muted">
              Photo upload will be enabled in the next release.
            </p>
            <p className="text-xs text-muted mt-1">
              You&apos;ll be able to add up to 5 room photos.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-petrol-700 text-white font-semibold text-sm hover:bg-petrol-800 transition-colors disabled:opacity-60"
          >
            {loading ? "Generating plan…" : "Generate renovation plan →"}
          </button>
        </div>
      </form>
    </div>
  );
}
