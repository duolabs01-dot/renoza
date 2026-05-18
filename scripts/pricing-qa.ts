/**
 * Pricing QA — run with:  npx ts-node --project tsconfig.json scripts/pricing-qa.ts
 *
 * Asserts deterministic pricing invariants without spinning up the app.
 */

import { calculatePlan, getCityMultiplier } from "../lib/pricing";
import type { ProjectInput } from "../lib/types";

let passed = 0;
let failed = 0;

function ok(label: string, value: boolean) {
  if (value) {
    console.log(`  ✓  ${label}`);
    passed++;
  } else {
    console.error(`  ✗  ${label}`);
    failed++;
  }
}

const BASE: ProjectInput = {
  name:           "QA Test",
  location:       "Johannesburg",
  room_type:      "kitchen",
  ownership_type: "own",
  room_size:      "4m x 5m",   // 20 sqm
  budget_range:   "15k-50k",
  goals:          ["paint"],
};

// ── 1. City multipliers ──────────────────────────────────────────────────────

console.log("\n[1] City multipliers");

ok("Cape Town multiplier > Bloemfontein",
  getCityMultiplier("Cape Town") > getCityMultiplier("Bloemfontein"));

ok("Johannesburg multiplier = 1.00",
  getCityMultiplier("Johannesburg") === 1.00);

{
  // Use tiling on 100sqm to stay well clear of the minimum job cost floor
  const ct    = calculatePlan({ ...BASE, location: "Cape Town",    goals: ["tiling"], room_size: "10m x 10m" });
  const bloem = calculatePlan({ ...BASE, location: "Bloemfontein", goals: ["tiling"], room_size: "10m x 10m" });

  ok("Cape Town cost_low > Bloemfontein cost_low (tiling, 100sqm)",
    ct.cost_low > bloem.cost_low);
  ok("Cape Town cost_high > Bloemfontein cost_high (tiling, 100sqm)",
    ct.cost_high > bloem.cost_high);
}

// ── 2. full-makeover does not double-count sub-goals ─────────────────────────

console.log("\n[2] full-makeover composite cost");

{
  const makeover     = calculatePlan({ ...BASE, goals: ["full-makeover"] });
  const withSubs     = calculatePlan({ ...BASE, goals: ["full-makeover", "paint", "tiling", "plumbing"] });

  ok("full-makeover + non-cupboard sub-goals: cost_low unchanged",
    withSubs.cost_low === makeover.cost_low);
  ok("full-makeover + non-cupboard sub-goals: cost_high unchanged",
    withSubs.cost_high === makeover.cost_high);

  // Materials/labour labels should be richer with sub-goals
  ok("full-makeover + sub-goals: more materials than makeover alone",
    withSubs.materials_list.length >= makeover.materials_list.length);
}

// ── 3. Cupboards use flat room-type allowance, not per-sqm ──────────────────

console.log("\n[3] Cupboard flat allowance");

{
  const small = calculatePlan({ ...BASE, room_size: "2m x 2m",   goals: ["cupboards"] });
  const large = calculatePlan({ ...BASE, room_size: "10m x 10m", goals: ["cupboards"] });

  ok("Cupboard cost_low identical regardless of room size",
    small.cost_low === large.cost_low);
  ok("Cupboard cost_high identical regardless of room size",
    small.cost_high === large.cost_high);

  // Bathroom should have lower allowance than kitchen
  const bathroomCupboards = calculatePlan({ ...BASE, room_type: "bathroom", goals: ["cupboards"] });
  const kitchenCupboards  = calculatePlan({ ...BASE, room_type: "kitchen",  goals: ["cupboards"] });

  ok("Kitchen cupboard allowance > bathroom cupboard allowance",
    kitchenCupboards.cost_high > bathroomCupboards.cost_high);
}

// ── 4. cost_low <= cost_high for all goal combinations ───────────────────────

console.log("\n[4] cost_low ≤ cost_high invariant");

const TEST_COMBOS: Array<Partial<ProjectInput>> = [
  { goals: ["paint"] },
  { goals: ["tiling"] },
  { goals: ["plumbing", "electrical"] },
  { goals: ["full-makeover"] },
  { goals: ["full-makeover", "paint", "tiling", "plumbing", "electrical"] },
  { goals: ["cupboards"], room_type: "kitchen" },
  { goals: ["cupboards"], room_type: "bathroom" },
  { goals: ["tiling", "flooring", "paint", "lighting", "cupboards"] },
  { goals: ["damp-repair"] },
  { goals: ["prepare-rental-sale"] },
  { goals: ["paint"], room_size: "1m x 1m" },    // very small room → hits minimum
  { goals: ["paint"], room_size: "50m x 50m" },  // very large room
];

for (const partial of TEST_COMBOS) {
  const p = calculatePlan({ ...BASE, ...partial });
  ok(`cost_low (${p.cost_low}) ≤ cost_high (${p.cost_high}) — ${partial.goals?.join("+")}`,
    p.cost_low <= p.cost_high);
}

// ── 5. estimated_cost_range matches cost_low / cost_high ─────────────────────

console.log("\n[5] estimated_cost_range string consistency");

{
  const p        = calculatePlan({ ...BASE, goals: ["paint", "tiling"] });
  const expected = `R${p.cost_low.toLocaleString("en-ZA")} – R${p.cost_high.toLocaleString("en-ZA")}`;

  ok(`estimated_cost_range = "${p.estimated_cost_range}"`,
    p.estimated_cost_range === expected);
}

// ── 6. Minimum job cost enforced ─────────────────────────────────────────────

console.log("\n[6] Minimum job cost");

{
  const tiny = calculatePlan({ ...BASE, goals: ["paint"], room_size: "1m x 1m" });
  ok("cost_low >= R2 500 (minimum)",  tiny.cost_low  >= 2500);
  ok("cost_high >= R4 500 (minimum)", tiny.cost_high >= 4500);
}

// ── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
console.log(`  ${passed + failed} tests: ${passed} passed, ${failed} failed`);
console.log(`${"─".repeat(50)}\n`);

if (failed > 0) process.exit(1);
