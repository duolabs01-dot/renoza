import type { BudgetRange, ProjectInput, RenovationGoal, RenovationPlan, RoomType, WorkItem, TimelinePhase } from "./types";
import { BUDGET_LABELS, ROOM_TYPE_LABELS, GOAL_LABELS } from "./types";

// ─── Dimension parsing ────────────────────────────────────────────────────────

export function parseDimensions(roomSize: string): { w: number; h: number; sqm: number; approximate: boolean } {
  if (!roomSize || !roomSize.trim()) return { w: 5, h: 4, sqm: 20, approximate: true };

  const s = roomSize.toLowerCase().trim();

  // "approx 20m2" / "20 sqm" / "20m²" / "±20m2"
  const areaMatch = s.match(/(\d+(?:\.\d+)?)\s*(?:m²|m2|sqm|sq\s*m)/);
  if (areaMatch) {
    const sqm = parseFloat(areaMatch[1]);
    const w = Math.sqrt(sqm * 1.25);
    const h = sqm / w;
    return { w: Math.round(w * 10) / 10, h: Math.round(h * 10) / 10, sqm, approximate: true };
  }

  // "4m x 5m" / "4x5" / "4 by 5" / "4m*5m"
  const dimMatch = s.match(/(\d+(?:\.\d+)?)\s*(?:m|metres?|meters?)?\s*(?:x|by|\*|×)\s*(\d+(?:\.\d+)?)/);
  if (dimMatch) {
    const w = parseFloat(dimMatch[1]);
    const h = parseFloat(dimMatch[2]);
    return { w, h, sqm: Math.round(w * h * 10) / 10, approximate: false };
  }

  // single number like "20" — treat as sqm
  const singleMatch = s.match(/^(\d+(?:\.\d+)?)\s*$/);
  if (singleMatch) {
    const sqm = parseFloat(singleMatch[1]);
    const w = Math.sqrt(sqm * 1.25);
    const h = sqm / w;
    return { w: Math.round(w * 10) / 10, h: Math.round(h * 10) / 10, sqm, approximate: true };
  }

  return { w: 5, h: 4, sqm: 20, approximate: true };
}

// ─── City multipliers ─────────────────────────────────────────────────────────

export const CITY_MULTIPLIERS: Record<string, number> = {
  "cape town":    1.12,
  capetown:       1.12,
  "cape-town":    1.12,
  "sea point":    1.12,
  "green point":  1.12,
  stellenbosch:   1.08,
  johannesburg:   1.00,
  joburg:         1.00,
  jozi:           1.00,
  "jo'burg":      1.00,
  sandton:        1.05,
  soweto:         0.92,
  durban:         0.95,
  "kwa-zulu":     0.95,
  kwazulu:        0.95,
  pretoria:       0.97,
  tshwane:        0.97,
  centurion:      0.97,
  "port elizabeth": 0.90,
  gqeberha:       0.90,
  "pe ":          0.90,
  bloemfontein:   0.88,
  bloem:          0.88,
  "east london":  0.88,
  "east-london":  0.88,
  polokwane:      0.86,
  nelspruit:      0.86,
  mbombela:       0.86,
  kimberley:      0.85,
  rustenburg:     0.88,
};

export function getCityMultiplier(location: string): number {
  const loc = location.toLowerCase();
  for (const [key, val] of Object.entries(CITY_MULTIPLIERS)) {
    if (loc.includes(key)) return val;
  }
  return 1.00;
}

// ─── Budget max lookup ────────────────────────────────────────────────────────

export const BUDGET_RANGE_MAX: Record<BudgetRange, number> = {
  "under-5k":   5000,
  "5k-15k":     15000,
  "15k-50k":    50000,
  "50k-150k":   150000,
  "150k-plus":  300000,
};

// ─── Per-goal cost data ───────────────────────────────────────────────────────

const LABOUR_RATE_PER_DAY = 850; // Joburg base, R/day

interface GoalCost {
  matLow: number;
  matHigh: number;
  labourDaysPerSqm: number;
  contingencyPct: number;
}

const GOAL_COSTS: Record<RenovationGoal, GoalCost> = {
  paint:              { matLow: 35,   matHigh: 75,   labourDaysPerSqm: 0.08, contingencyPct: 0    },
  flooring:           { matLow: 180,  matHigh: 550,  labourDaysPerSqm: 0.15, contingencyPct: 0    },
  tiling:             { matLow: 220,  matHigh: 650,  labourDaysPerSqm: 0.25, contingencyPct: 0    },
  lighting:           { matLow: 120,  matHigh: 350,  labourDaysPerSqm: 0.10, contingencyPct: 0    },
  cupboards:          { matLow: 0,    matHigh: 0,    labourDaysPerSqm: 0,    contingencyPct: 0    }, // handled separately
  plumbing:           { matLow: 800,  matHigh: 2500, labourDaysPerSqm: 0.40, contingencyPct: 0.20 },
  electrical:         { matLow: 600,  matHigh: 1800, labourDaysPerSqm: 0.35, contingencyPct: 0.15 },
  "damp-repair":      { matLow: 350,  matHigh: 900,  labourDaysPerSqm: 0.45, contingencyPct: 0.25 },
  "full-makeover":    { matLow: 800,  matHigh: 2200, labourDaysPerSqm: 1.20, contingencyPct: 0.15 },
  "prepare-rental-sale": { matLow: 250, matHigh: 700, labourDaysPerSqm: 0.60, contingencyPct: 0  },
};

// ─── Cupboard allowance ───────────────────────────────────────────────────────

const CUPBOARD_ALLOWANCE: Partial<Record<RoomType, { low: number; high: number }>> = {
  kitchen:             { low: 18000, high: 55000 },
  bathroom:            { low: 4500,  high: 14000 },
  bedroom:             { low: 8000,  high: 22000 },
  "bathroom-en-suite": { low: 3500,  high: 12000 },
};
const CUPBOARD_ALLOWANCE_DEFAULT = { low: 6000, high: 18000 };

// ─── Work item descriptions per goal ─────────────────────────────────────────

const WORK_ITEM_DESCRIPTIONS: Partial<Record<RenovationGoal, Array<{ category: string; description: string }>>> = {
  paint: [
    { category: "Surface Preparation", description: "Fill cracks, sand walls and ceiling, apply sealer where needed." },
    { category: "Interior Paint", description: "Two full coats of quality paint (Plascon/Dulux) on all walls and ceiling." },
  ],
  flooring: [
    { category: "Subfloor Preparation", description: "Level and clean subfloor; remove existing flooring if required." },
    { category: "Flooring Installation", description: "Vinyl plank, laminate, or engineered wood. Includes underlay, adhesive, skirting." },
  ],
  tiling: [
    { category: "Tile Removal / Prep", description: "Remove existing tiles if applicable; prepare substrate and apply adhesive bed." },
    { category: "Floor Tiling", description: "600×600 or similar format ceramic/porcelain tiles. Labour includes grouting and sealing." },
    { category: "Wall Tiling", description: "Full-height or splash-back tiles; waterproofing behind wet areas." },
  ],
  lighting: [
    { category: "Lighting Fixtures", description: "Supply and fit LED downlights, pendants or fittings as per design." },
    { category: "Switching & Points", description: "Relocate or add light switches; install dimmers where specified." },
  ],
  cupboards: [
    { category: "Cupboard Supply & Install", description: "Melamine or solid timber carcasses, hinges, handles, and runners. Quote includes cornice and plinths." },
  ],
  plumbing: [
    { category: "Plumbing Rough-in", description: "Relocate or extend supply and waste pipes to new fixture positions." },
    { category: "Fixture Installation", description: "Install basin, toilet, bath, shower tray or tap sets. Includes connections and sealing." },
  ],
  electrical: [
    { category: "Electrical Rough-in", description: "Install conduits, cable runs, and distribution board amendments." },
    { category: "Electrical Fit-off", description: "Install socket outlets, isolators, and fittings. Certificate of Compliance (CoC) included." },
  ],
  "damp-repair": [
    { category: "Damp Investigation", description: "Probe, test, and identify source of moisture ingress (rising damp, leaks, condensation)." },
    { category: "Waterproofing", description: "Apply bituminous membrane, acrylic, or crystalline waterproofing to affected areas." },
    { category: "Reinstatement", description: "Re-plaster affected walls; repaint or re-tile over treated areas." },
  ],
  "full-makeover": [
    { category: "Demolition & Strip-out", description: "Remove existing finishes, fixtures and fittings as per scope." },
    { category: "Structural & Wet Works", description: "Waterproofing, plastering, screed, and any structural alterations." },
    { category: "Finishes", description: "Full paint, tiling or flooring, lighting, and joinery as per design brief." },
    { category: "Fit-off", description: "Electrical, plumbing, and fixture installation to complete the room." },
  ],
  "prepare-rental-sale": [
    { category: "Cosmetic Repairs", description: "Fill holes, touch-up paint, fix squeaky doors, replace broken hardware." },
    { category: "Deep Clean & Refresh", description: "Professional clean; re-grout tiles; refinish or polish floors." },
    { category: "Lighting & Fixtures", description: "Replace dated fittings; fix any non-functional switches or taps." },
  ],
};

// ─── Materials per goal ───────────────────────────────────────────────────────

const GOAL_MATERIALS: Partial<Record<RenovationGoal, string[]>> = {
  paint: [
    "Interior paint — Plascon Velvaglo or Dulux Wash & Wear (10–20L)",
    "Primer / undercoat",
    "Crack filler and flexible sealant",
    "Fine and medium grit sandpaper",
    "Rollers, brushes, drop sheets, masking tape",
  ],
  flooring: [
    "Vinyl plank / laminate / engineered wood (allow 10% waste)",
    "Underlay / moisture barrier",
    "Skirting boards (MDF or timber)",
    "Floor adhesive or click-lock system",
    "Threshold strips",
  ],
  tiling: [
    "Floor tiles — 600×600 or 300×600 format (allow 10% waste)",
    "Wall tiles",
    "Tile adhesive (cement-based, grey or white)",
    "Grout — matching colour",
    "Tile waterproofing membrane (wet areas)",
    "Silicone sealant — colour matched",
  ],
  lighting: [
    "LED downlights or pendant fittings",
    "Single-pole dimmer switches",
    "Electrical cable (SABS approved)",
    "Junction boxes and mounting brackets",
  ],
  cupboards: [
    "Melamine or solid timber carcasses",
    "Cabinet hinges and soft-close drawer runners",
    "Handles / knobs",
    "Cornice, plinths and filler panels",
    "Laminate or solid surface countertop (if kitchen)",
  ],
  plumbing: [
    "CPVC or PPR supply pipes and fittings",
    "PVC waste pipe and gully connections",
    "Basin / bath / shower tray / toilet suite",
    "Tap set or mixer",
    "Flexible connectors and isolation valves",
    "Silicone sealant and plumber's tape",
  ],
  electrical: [
    "PVC conduit and draw wire",
    "Twin-and-earth cable (SABS approved)",
    "Socket outlets and switch plates",
    "Circuit breakers (if DB amendment required)",
    "LED lamp replacements",
  ],
  "damp-repair": [
    "Bituminous / acrylic / crystalline waterproofing membrane",
    "Damp-proof course injection materials (if rising damp)",
    "Plastering sand and cement",
    "Anti-fungal primer",
    "Replacement tiles or paint as per reinstatement",
  ],
  "full-makeover": [
    "All materials per scope (paint, tiles/flooring, lighting, fixtures)",
    "Plasterboard / skim coat plaster",
    "Screed mix (if floor levelling required)",
    "General hardware (fixings, adhesives, sealants)",
  ],
  "prepare-rental-sale": [
    "Touch-up paint (sample pots in existing colours)",
    "Crack filler and multi-purpose sealant",
    "Grout pen or re-grouting kit",
    "Replacement hardware (door handles, hinges)",
    "Cleaning supplies / professional cleaner allowance",
  ],
};

// ─── Labour categories per goal ───────────────────────────────────────────────

const GOAL_LABOUR: Partial<Record<RenovationGoal, string[]>> = {
  paint:             ["Painter (walls and ceiling)"],
  flooring:          ["Flooring installer"],
  tiling:            ["Tiler (floor and wall)", "General labourer (prep)"],
  lighting:          ["Electrician (fitting changes)"],
  cupboards:         ["Cabinet maker / installer"],
  plumbing:          ["Licensed plumber"],
  electrical:        ["Registered electrician (CoC)"],
  "damp-repair":     ["Waterproofing specialist", "Plasterer", "General labourer"],
  "full-makeover":   ["Project manager / foreman", "Painter", "Tiler or flooring installer", "Plumber (if required)", "Electrician (if required)", "General labourers"],
  "prepare-rental-sale": ["General handyman", "Painter (touch-up)", "Cleaning crew"],
};

// ─── Risks per goal ───────────────────────────────────────────────────────────

const GOAL_RISKS: Partial<Record<RenovationGoal, string[]>> = {
  paint:          ["Painting over damp doesn't fix damp — it hides it for two months. Look for blistered old paint and salt deposits on walls before they start."],
  flooring:       ["Uneven subfloor adds R150–R300/m² in levelling compound. Most quotes leave it out and bill you for it later.", "Homes built pre-1990 may have asbestos-backed vinyl underneath. Test before anyone pulls it up — proper testing runs around R600."],
  tiling:         ["Tap the existing tiles. A hollow sound means the bed underneath has failed — re-tiling over it will pop within a year.", "Waterproofing missed behind a shower is the most expensive thing to fix later. Get it in writing that it's included."],
  lighting:       ["If the existing wiring doesn't meet SANS 10142, the electrician can't sign a CoC for your new fittings without bringing it up to spec — that's a full DB inspection charge on top."],
  cupboards:      ["Custom cupboards take 3–6 weeks from order to install. If a contractor says 'next week', they're either lying or supplying off-the-shelf — ask which."],
  plumbing:       ["Old galvanised pipes in pre-1990 homes are usually corroded. They only find out once the wall is open — budget at least 15% contingency.", "Sectional title? Body corporate may need to approve waste-stack work before anyone touches it. Get the letter in advance."],
  electrical:     ["Pre-2003 wiring often doesn't meet current SANS 10142. The electrician can't issue a CoC without bringing it up to standard — that's a separate charge.", "Asbestos-backed ceiling boards (Nutec) in older homes need specialist removal. Don't let the sparky chance it."],
  "damp-repair":  ["Rising damp comes back if you only treat the wall — find the source first. Usually a broken DPC, blocked downpipe, or rainwater pooling outside.", "Pulling off damp plaster sometimes reveals cracked foundations or failed waterproofing. Budget 25% contingency."],
  "full-makeover":["Strip-outs always uncover something — old wiring, rotten window frames, leaking pipes. The contingency line in your quote isn't optional.", "Three-week jobs become six-week jobs. Agree a weekly site visit with the foreman from day one — in writing."],
  "prepare-rental-sale": ["A coat of paint won't hide damp from a buyer or rental inspector. Fix the cause, not the symptom — you'll lose more on the deal than the repair would have cost."],
};

// ─── Questions per goal ───────────────────────────────────────────────────────

const GOAL_QUESTIONS: Partial<Record<RenovationGoal, string[]>> = {
  paint: [
    "Will you be using washable interior paint suitable for South African conditions?",
    "Does your quote include surface preparation (filling, sanding, sealing)?",
  ],
  flooring: [
    "Is subfloor levelling included in your quote?",
    "What is the warranty on the flooring material and installation?",
  ],
  tiling: [
    "Does the quote include tile removal and substrate preparation?",
    "Are wet areas (shower, bath surround) waterproofed before tiling?",
  ],
  lighting: [
    "Will a Certificate of Compliance (CoC) be issued for any new electrical points?",
    "Are the fittings you supply SANS-approved?",
  ],
  cupboards: [
    "What is the lead time from order to installation?",
    "Is a countertop or worktop included in the quoted price?",
  ],
  plumbing: [
    "Are you a registered plumber? Can you provide your PIRB registration number?",
    "Will you pressure-test all new pipework before closing up walls?",
  ],
  electrical: [
    "Are you a registered electrician? Can I see your CoC from a previous job?",
    "Does your quote include a Certificate of Compliance for the work scope?",
  ],
  "damp-repair": [
    "Have you diagnosed the source of the damp? Is it rising, penetrating, or condensation?",
    "What product system are you using and what warranty does the manufacturer offer?",
  ],
  "full-makeover": [
    "Who is the site foreman and will they be on-site daily?",
    "How do you handle variations (scope changes) — in writing, before work proceeds?",
    "What is the payment schedule and what triggers each milestone payment?",
  ],
  "prepare-rental-sale": [
    "Have you identified any items that would flag on a building inspection report?",
    "Is a professional deep clean included in your scope?",
  ],
};

// ─── Shared base questions ────────────────────────────────────────────────────

const BASE_QUESTIONS = [
  "Are you registered with the NHBRC or a relevant trade association?",
  "Do you carry public liability insurance?",
  "Will you provide an itemised written quote with labour and materials listed separately?",
  "What deposit do you require, and what is the payment schedule?",
  "How long will the work take, and what happens if it overruns?",
  "Who is responsible for sourcing materials — you or me?",
  "What guarantee do you offer on your workmanship?",
];

const BASE_RISKS = [
  "Quotes go stale fast. Most are good for 14 days — after that, material prices may have moved and the contractor will come back asking for more.",
  "Unregistered contractors. If they can't show you an NHBRC or PIRB number, walk. Doesn't matter how cheap they are.",
  "Big upfront deposits. Anything over 30% is a red flag — proper builders work to milestones, not lump sums.",
];

// ─── Default room sqm for BallparkEstimator ───────────────────────────────────

export const ROOM_DEFAULT_SQM: Record<RoomType, number> = {
  kitchen:             12,
  bathroom:            6,
  bedroom:             14,
  lounge:              20,
  "dining-room":       16,
  "bathroom-en-suite": 5,
  garage:              24,
  other:               15,
};

// ─── Main calculatePlan export ────────────────────────────────────────────────

type CalculatedPlan = Omit<RenovationPlan,
  "room_summary" | "recommended_approach" | "budget_realism" | "whatsapp_brief" | "feng_shui" | "floor_plan_notes">;

export function calculatePlan(input: ProjectInput): CalculatedPlan {
  const { sqm } = parseDimensions(input.room_size ?? "");
  const multiplier = getCityMultiplier(input.location ?? "");
  const goals = input.goals ?? [];

  // Full-makeover is composite — use it alone for cost; still use other goals for labels
  const hasMakeover = goals.includes("full-makeover");
  const costGoals: RenovationGoal[] = hasMakeover ? ["full-makeover"] : goals;

  const workItems: WorkItem[] = [];
  let totalLow = 0;
  let totalHigh = 0;

  for (const goal of costGoals) {
    if (goal === "cupboards") continue; // handled separately below

    const cost = GOAL_COSTS[goal];
    const descriptions = WORK_ITEM_DESCRIPTIONS[goal] ?? [];

    const goalMatLow  = cost.matLow  * sqm * multiplier;
    const goalMatHigh = cost.matHigh * sqm * multiplier;
    const labourLow   = cost.labourDaysPerSqm * sqm * LABOUR_RATE_PER_DAY * multiplier * 0.8;
    const labourHigh  = cost.labourDaysPerSqm * sqm * LABOUR_RATE_PER_DAY * multiplier * 1.2;

    const goalLow  = Math.round(goalMatLow  + labourLow);
    const goalHigh = Math.round(goalMatHigh + labourHigh);

    // Spread cost proportionally across sub-items
    const itemCount = descriptions.length || 1;
    descriptions.forEach((desc, i) => {
      const share = i === descriptions.length - 1
        ? 1 - (i / itemCount)  // last item gets remainder
        : 1 / itemCount;
      workItems.push({
        category: desc.category,
        description: desc.description,
        estimated_cost: `R${Math.round(goalLow * share).toLocaleString()} – R${Math.round(goalHigh * share).toLocaleString()}`,
        low:  Math.round(goalLow  * share),
        high: Math.round(goalHigh * share),
      });
    });

    totalLow  += goalLow;
    totalHigh += goalHigh;

    // Contingency line item for high-risk goals
    if (cost.contingencyPct > 0) {
      const cLow  = Math.round(goalLow  * cost.contingencyPct * 0.5);
      const cHigh = Math.round(goalHigh * cost.contingencyPct);
      workItems.push({
        category: "Contingency",
        description: `Risk allowance for hidden works (${goal.replace(/-/g, " ")}).`,
        estimated_cost: `R${cLow.toLocaleString()} – R${cHigh.toLocaleString()}`,
        low: cLow,
        high: cHigh,
      });
      totalLow  += cLow;
      totalHigh += cHigh;
    }
  }

  // Cupboards allowance (separate from per-sqm pricing)
  if (goals.includes("cupboards")) {
    const allowance = CUPBOARD_ALLOWANCE[input.room_type] ?? CUPBOARD_ALLOWANCE_DEFAULT;
    const cLow  = Math.round(allowance.low  * multiplier);
    const cHigh = Math.round(allowance.high * multiplier);
    const cupDesc = WORK_ITEM_DESCRIPTIONS.cupboards?.[0];
    workItems.push({
      category: cupDesc?.category ?? "Cupboard Supply & Install",
      description: cupDesc?.description ?? "Melamine or timber carcasses, hinges, handles and runners.",
      estimated_cost: `R${cLow.toLocaleString()} – R${cHigh.toLocaleString()}`,
      low: cLow,
      high: cHigh,
    });
    totalLow  += cLow;
    totalHigh += cHigh;
  }

  // Minimum job cost
  totalLow  = Math.max(totalLow,  2500);
  totalHigh = Math.max(totalHigh, 4500);

  // Materials — merge and deduplicate across all goals (including non-cost goals)
  const allGoalsForLabels = hasMakeover ? goals : costGoals;
  const materialsSet = new Set<string>();
  for (const goal of allGoalsForLabels) {
    for (const m of GOAL_MATERIALS[goal] ?? []) materialsSet.add(m);
  }
  const materials_list = Array.from(materialsSet);

  // Labour categories
  const labourSet = new Set<string>();
  for (const goal of allGoalsForLabels) {
    for (const l of GOAL_LABOUR[goal] ?? []) labourSet.add(l);
  }
  labourSet.add("General labourer (cleanup and sundry)");
  const labour_categories = Array.from(labourSet);

  // Risks — merge base + goal-specific, deduplicate
  const risksSet = new Set<string>([...BASE_RISKS]);
  for (const goal of allGoalsForLabels) {
    for (const r of GOAL_RISKS[goal] ?? []) risksSet.add(r);
  }
  const risks_and_hidden_costs = Array.from(risksSet);

  // Questions — merge base + goal-specific, deduplicate
  const questionsSet = new Set<string>([...BASE_QUESTIONS]);
  for (const goal of allGoalsForLabels) {
    for (const q of GOAL_QUESTIONS[goal] ?? []) questionsSet.add(q);
  }
  const questions_for_contractor = Array.from(questionsSet);

  // Timeline phases
  const timeline_phases: TimelinePhase[] = buildTimeline(costGoals, goals, sqm, multiplier);

  return {
    work_items: workItems,
    materials_list,
    labour_categories,
    estimated_cost_range: `R${totalLow.toLocaleString("en-ZA")} – R${totalHigh.toLocaleString("en-ZA")}`,
    cost_low:  totalLow,
    cost_high: totalHigh,
    budget_max: BUDGET_RANGE_MAX[input.budget_range ?? "15k-50k"],
    risks_and_hidden_costs,
    questions_for_contractor,
    timeline_phases,
  };
}

function buildTimeline(
  costGoals: RenovationGoal[],
  allGoals: RenovationGoal[],
  sqm: number,
  multiplier: number,
): TimelinePhase[] {
  // Group goals into logical phases
  const phaseGroups: Array<{ name: string; goals: RenovationGoal[] }> = [
    { name: "Preparation & strip-out",   goals: ["damp-repair"] },
    { name: "Structural & wet works",    goals: ["plumbing", "electrical"] },
    { name: "Finishes",                  goals: ["tiling", "flooring", "paint"] },
    { name: "Fit-off & joinery",         goals: ["lighting", "cupboards", "prepare-rental-sale"] },
    { name: "Full renovation",           goals: ["full-makeover"] },
  ];

  const activePhases: TimelinePhase[] = [];
  const usedGoals = new Set<RenovationGoal>();
  let totalDays = 0;

  for (const group of phaseGroups) {
    const matched = group.goals.filter(g => allGoals.includes(g) && !usedGoals.has(g));
    if (matched.length === 0) continue;

    let phaseDays = 0;
    for (const g of matched) {
      const cost = GOAL_COSTS[g];
      if (cost.labourDaysPerSqm > 0) {
        phaseDays = Math.max(phaseDays, Math.ceil(sqm * cost.labourDaysPerSqm * multiplier));
      }
      usedGoals.add(g);
    }
    phaseDays = Math.max(phaseDays, 1);
    totalDays += phaseDays;

    activePhases.push({
      name: group.name,
      duration: phaseDays === 1 ? "1 day" : `${phaseDays} days`,
      pct: 0, // filled in below
    });
  }

  if (activePhases.length === 0) return [];

  // Assign percentages based on relative day count
  let accDays = 0;
  for (let i = 0; i < activePhases.length; i++) {
    const days = parseInt(activePhases[i].duration);
    accDays += days;
    activePhases[i].pct = Math.round((accDays / totalDays) * 100);
  }
  activePhases[activePhases.length - 1].pct = 100;

  return activePhases;
}

// ─── Fallback narrative (no AI required) ─────────────────────────────────────

function buildRecommendedApproach(input: ProjectInput): string {
  const goals = new Set(input.goals ?? []);
  const isRental = input.ownership_type === "rent";

  // Full makeover — needs sequencing advice
  if (goals.has("full-makeover")) {
    return "Sequence matters more than speed on a full strip-out. Get any damp, structural or rotting work sorted before anyone lays a tile or opens a paint tin. Then run wet works (plumbing, tiling, waterproofing) and electrical rough-in together, finishes last. Insist on a single foreman and a weekly site walkthrough — that's how scope creep gets caught early.";
  }

  // Damp present — damp leads everything else
  if (goals.has("damp-repair")) {
    return "Find the source before you spend a cent on cosmetics. Rising damp, leaks, and condensation all need different fixes — guessing means it comes back in six months. Once you've diagnosed it, get the waterproofing done and let everything dry properly before any plaster, tile or paint goes up.";
  }

  // Plumbing or electrical — wet/wired works first
  if (goals.has("plumbing") || goals.has("electrical")) {
    const trades = [goals.has("plumbing") && "plumbing", goals.has("electrical") && "electrical"].filter(Boolean).join(" and ");
    return `Get the ${trades} done before any finishes. Once walls are closed up and tiles are laid, every change costs three times more. Pressure-test pipework and get the CoC signed off ${goals.has("electrical") ? "" : "(if any electrical is involved) "}before plastering or tiling starts.`;
  }

  // Tiling specifically — substrate first
  if (goals.has("tiling")) {
    return "Tap the existing tiles before anyone quotes for re-tiling — hollow ones mean the bed needs replacing, not just the surface. Sort waterproofing in wet areas before the first tile goes down, not after. Cheap grouting is where amateur jobs fall apart within a year.";
  }

  // Cupboards — lead times
  if (goals.has("cupboards")) {
    return "Order the cupboards before you book demolition. Custom joinery is 3–6 weeks from sign-off — if you strip the kitchen first, you'll be eating off the braai for over a month. Confirm the supplier's measurement visit happens before any tiling, so the dimensions are locked in.";
  }

  // Sale/rental prep
  if (goals.has("prepare-rental-sale")) {
    return "Fix what would fail an inspection first — damp patches, broken cupboard runners, dripping taps, anything safety-related. Cosmetic work (paint, regrouting, polishing) goes last and shouldn't take more than a week if the underlying place is sound. Don't over-capitalise on a sale prep — buyers notice fresh paint hiding problems.";
  }

  // Paint / lighting / flooring only — cosmetic-only flow
  return `${isRental ? "Confirm scope changes with your landlord in writing before you start — even cosmetic work can cause deposit disputes later. " : ""}Cosmetic-only jobs are quick if the room is sound, so spend the first day checking — walk the room, look for damp stains, cracks, soft floor patches. Better to push the start date a week than discover a problem mid-paint.`;
}

export function buildFallbackNarrative(
  input: ProjectInput,
  calculated: CalculatedPlan,
): Pick<RenovationPlan, "room_summary" | "recommended_approach" | "budget_realism" | "whatsapp_brief"> {
  const roomLabel = ROOM_TYPE_LABELS[input.room_type] ?? input.room_type;
  const goalsLabel = (input.goals ?? []).map(g => GOAL_LABELS[g]).join(", ");
  const { sqm, approximate } = parseDimensions(input.room_size ?? "");
  const sqmStr = approximate ? `approximately ${sqm}m²` : `${sqm}m²`;

  const room_summary = `This plan covers a ${roomLabel.toLowerCase()} renovation in ${input.location ?? "South Africa"}, ${sqmStr} in size. The scope includes ${goalsLabel || "general renovation work"} with all estimates in South African Rand.`;

  const recommended_approach = buildRecommendedApproach(input);

  const budgetMax  = BUDGET_RANGE_MAX[input.budget_range ?? "15k-50k"];
  const overBudget = calculated.cost_high > budgetMax;
  const budget_realism = overBudget
    ? `Your selected budget of ${BUDGET_LABELS[input.budget_range ?? "15k-50k"]} is lower than the estimated cost range of ${calculated.estimated_cost_range}. Consider phasing the work or reducing scope — address structural and damp issues first.`
    : `Your budget of ${BUDGET_LABELS[input.budget_range ?? "15k-50k"]} aligns with the estimated cost range of ${calculated.estimated_cost_range}. Allow 10–15% contingency for hidden costs that are common in South African renovations.`;

  const hasElectrical = (input.goals ?? []).includes("electrical");
  const whatsapp_brief = `Hi, looking for a quote on a ${roomLabel.toLowerCase()} renovation in ${input.location ?? "South Africa"}.

*Scope:* ${goalsLabel}
*Room size:* ${sqmStr}
*Budget:* ${BUDGET_LABELS[input.budget_range ?? "15k-50k"]}

A few things I'll need in the quote:
• Labour and materials itemised separately (not lumped together)
• Who supplies the materials — you or me? If you, please show your markup
• Payment terms — deposit capped at 30%, balance against milestones${hasElectrical ? "\n• Certificate of Compliance (CoC) included for the electrical work" : ""}
• Your NHBRC number or trade body registration
• Workmanship guarantee period in writing

Please also share your earliest start date and how long the job typically takes. Happy to send photos of the space if it helps.`;

  return { room_summary, recommended_approach, budget_realism, whatsapp_brief };
}
