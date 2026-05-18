import type {
  ProjectInput, RenovationPlan, QuoteReview,
  QuoteComparisonInput, QuoteComparison, SavedProject,
} from "./types";
import { ROOM_TYPE_LABELS, BUDGET_LABELS, GOAL_LABELS } from "./types";

// Swap these functions for real Claude API calls (server actions) when ready.

export function generateRenovationPlan(input: ProjectInput): RenovationPlan {
  const roomLabel = ROOM_TYPE_LABELS[input.room_type] || input.room_type;

  return {
    room_summary: `This is a ${roomLabel.toLowerCase()} in ${input.location}. Based on the selected budget of ${BUDGET_LABELS[input.budget_range]} and your goals, this plan focuses on practical, cost-effective improvements suited to the South African market. The approximate room size of ${input.room_size} has been considered in the estimates below.`,
    recommended_approach: `Start with any damp, mould, or structural issues before cosmetic work — these are always hidden costs that grow if ignored. Once the room is structurally sound, prioritise painting and flooring as they deliver the biggest visual return for the budget. Electrical and plumbing work should only be done by registered tradespeople to maintain compliance certificates.`,
    budget_realism: `Your selected budget is realistic for targeted improvements but may not cover a full makeover in a single phase. Consider phasing the work — address structural and damp issues first, then cosmetics. Labour typically accounts for 40–60% of renovation costs in South Africa.`,
    work_items: [
      { category: "Surface Preparation", description: "Filling cracks, sanding, cleaning walls. Skimming if needed.", estimated_cost: "R800 – R2,500", low: 800, high: 2500 },
      { category: "Interior Paint", description: "Two coats on all walls and ceiling. Good quality mid-range paint (Plascon, Dulux).", estimated_cost: "R3,500 – R8,000", low: 3500, high: 8000 },
      { category: "Flooring", description: "Vinyl planks or laminate. Includes adhesive, underlay, and skirting replacement.", estimated_cost: "R6,000 – R18,000", low: 6000, high: 18000 },
      { category: "Lighting", description: "Replace fittings with LED downlights or pendants. Basic electrical point changes.", estimated_cost: "R2,000 – R6,000", low: 2000, high: 6000 },
    ],
    materials_list: [
      "Plascon Velvaglo or equivalent (10–20L)",
      "Primer / undercoat",
      "Crack filler and sealant",
      "Sandpaper (coarse and fine)",
      "Vinyl or laminate flooring boards",
      "Floor adhesive or click-lock system",
      "Skirting boards",
      "LED light fittings",
      "Paintbrushes, rollers, drop sheets",
      "Masking tape",
    ],
    labour_categories: [
      "Painter (walls and ceiling)",
      "Flooring installer",
      "Electrician (for fitting changes)",
      "General labourer (prep and cleanup)",
    ],
    estimated_cost_range: "R12,000 – R34,500",
    cost_low: 12000,
    cost_high: 34500,
    budget_max: 50000,
    risks_and_hidden_costs: [
      "Damp or rising moisture behind walls — inspect before tiling or painting.",
      "Old or non-compliant electrical wiring — may require full inspection and CoC at extra cost.",
      "Rotting or uneven subfloor — may need levelling before flooring.",
      "Hidden plumbing leaks — always pressure-test before closing up walls.",
      "Asbestos in older homes (pre-1990s) — requires specialist removal.",
      "Material price fluctuations — confirm prices before accepting any quote.",
    ],
    questions_for_contractor: [
      "Are you registered with the NHBRC or relevant trade association?",
      "Do you carry public liability insurance?",
      "Will you provide a written itemised quote with labour and materials listed separately?",
      "What deposit do you require, and what is the payment schedule?",
      "How long will the work take, and what happens if it runs over?",
      "Will electrical work include a Certificate of Compliance?",
      "Who is responsible for sourcing materials — you or me?",
      "What guarantee do you offer on your workmanship?",
    ],
    whatsapp_brief: `Hi, I'm looking for a quote for a ${roomLabel.toLowerCase()} renovation in ${input.location}.\n\n*Scope of work:*\n- ${input.goals.map((g) => GOAL_LABELS[g] || g).join("\n- ")}\n\n*Room size:* ${input.room_size}\n*Budget:* ${BUDGET_LABELS[input.budget_range]}\n*Ownership:* ${input.ownership_type === "own" ? "Own property" : "Renting — landlord approval obtained"}\n\nPlease provide an itemised quote with labour and materials listed separately. I'd also like to confirm your NHBRC registration and whether electrical work will include a Certificate of Compliance.\n\nWhen are you available for a site visit?`,
    timeline_phases: [
      { name: "Prep", duration: "1–2 days", pct: 15 },
      { name: "Structural", duration: "2–3 days", pct: 30 },
      { name: "Cosmetic", duration: "3–5 days", pct: 40 },
      { name: "Finishing", duration: "1–2 days", pct: 15 },
    ],
  };
}

export function reviewContractorQuote(quoteText: string): QuoteReview {
  void quoteText;
  return {
    quote_summary: "The quote covers general renovation work. It lists some labour items but lacks a full materials breakdown and important compliance provisions. The pricing appears to be in a plausible range but several critical details are missing.",
    missing_details: [
      "No itemised breakdown of materials vs labour costs.",
      "Payment schedule and deposit amount not specified.",
      "Project timeline and completion date not mentioned.",
      "No mention of a Certificate of Compliance (CoC) for electrical work.",
      "Contractor registration number or NHBRC membership not included.",
      "No workmanship guarantee or warranty period stated.",
      "Waste removal and cleanup responsibilities not defined.",
    ],
    red_flags: [
      "Large upfront deposit requested without a clear payment milestone plan — ask for stage payments tied to work completed.",
      "Vague line items like 'sundries' or 'miscellaneous' without explanation — push for specifics.",
      "No written scope for what happens if additional work is discovered (e.g. damp, rotting subfloor).",
      "Quote may be unusually low — this can indicate missing scope items that will appear as extras later.",
    ],
    fairness_score: 0.42,
    fairness_estimate: "Without knowing the exact location and scope, a precise verdict isn't possible. As a rough guide: labour in South Africa typically runs R350–R700/hour per skilled tradesperson. Materials should be itemised at current market rates. Compare this quote against at least two others.",
    questions_to_ask: [
      "Can you break this down into separate line items for labour, materials, and other costs?",
      "What is your payment schedule — how much upfront and when are remaining payments due?",
      "Are you registered with the NHBRC or a relevant trade body?",
      "Does this quote include a Certificate of Compliance (CoC) for electrical work?",
      "What is your workmanship guarantee?",
      "What happens if you discover additional problems once work starts?",
      "Who sources materials — you or me? If you, what markup do you charge?",
      "What is your projected completion date?",
    ],
    rewritten_scope: `RENOVATION SCOPE — REWRITTEN FOR CLARITY\n\nProject Address: [INSERT ADDRESS]\nContractor: [INSERT NAME + REGISTRATION NO.]\nDate: [INSERT DATE]\nValid Until: [INSERT DATE]\n\nSCOPE OF WORK:\n1. Supply and apply 2 coats interior paint to all walls and ceiling\n2. Remove existing floor covering and dispose off-site\n3. Supply and install vinyl plank flooring to specified area\n4. Replace light fittings with LED downlights\n5. Issue Certificate of Compliance (CoC) for all electrical work\n\nMATERIALS:\n[List each material, brand, quantity, and unit price]\n\nLABOUR:\n[List each trade, number of days, and daily rate]\n\nPAYMENT SCHEDULE:\n- 30% deposit on acceptance\n- 40% on completion of structural work\n- 30% on final completion and sign-off\n\nTIMELINE: [Start date] to [End date]\nGUARANTEE: [X] months on workmanship\nEXCLUSIONS: [List anything explicitly not included]`,
  };
}

export function compareContractorQuotes(input: QuoteComparisonInput): QuoteComparison {
  const labels = ["Quote A", "Quote B", "Quote C"];

  const quotes = input.quotes.map((text, i) => {
    const lower = text.toLowerCase();
    const hasPrice = /r\s?[\d,]+/.test(lower);
    const hasPayment = /deposit|payment|upfront|stage/.test(lower);
    const hasTimeline = /days|weeks|start|complet/.test(lower);
    const hasCoc = /coc|compliance|certificate/.test(lower);
    const hasNhbrc = /nhbrc|registered|registration/.test(lower);
    const hasItemised = /labour|material|supply|per m/.test(lower);

    const missing: string[] = [];
    if (!hasItemised) missing.push("No itemised breakdown of labour vs materials");
    if (!hasPayment) missing.push("No payment schedule or deposit terms");
    if (!hasTimeline) missing.push("No project timeline or completion date");
    if (!hasCoc) missing.push("No mention of Certificate of Compliance (CoC)");
    if (!hasNhbrc) missing.push("Contractor registration number not provided");

    const flags: string[] = [];
    if (/50%|60%|70%|full.{0,10}deposit|full.{0,10}upfront/.test(lower)) flags.push("High upfront deposit requested — seek stage payments instead.");
    if (/sundries|misc|other costs/.test(lower)) flags.push("Vague line items (sundries/miscellaneous) without explanation.");
    if (!hasItemised) flags.push("Lump-sum quote with no breakdown — hard to compare or challenge.");

    const strengths: string[] = [];
    if (hasItemised) strengths.push("Itemised breakdown provided");
    if (hasPayment) strengths.push("Payment terms specified");
    if (hasTimeline) strengths.push("Timeline included");
    if (hasCoc) strengths.push("CoC mentioned");

    const priceMatch = lower.match(/r\s?([\d,]+)/);
    const priceStr = priceMatch ? `R${priceMatch[1]}` : "Price unclear";

    const clarityScore = (hasItemised ? 2 : 0) + (hasPayment ? 1 : 0) + (hasTimeline ? 1 : 0) + (hasCoc ? 1 : 0);
    const clarity = clarityScore >= 4 ? "clear" : clarityScore >= 2 ? "partial" : "vague";

    return {
      index: i,
      label: labels[i] || `Quote ${i + 1}`,
      price_mentioned: hasPrice ? priceStr : "Not clearly stated",
      scope_clarity: clarity as "clear" | "partial" | "vague",
      missing_items: missing.length > 0 ? missing : ["No major omissions detected — verify with a site visit"],
      red_flags: flags.length > 0 ? flags : ["No major red flags detected"],
      payment_terms: hasPayment ? "Payment terms mentioned — review deposit % and milestone triggers" : "No payment terms specified",
      strengths: strengths.length > 0 ? strengths : ["Minimal detail provided to assess strengths"],
    };
  });

  const clarityRanking = [...quotes].sort((a, b) => {
    const order = { clear: 0, partial: 1, vague: 2 };
    return order[a.scope_clarity] - order[b.scope_clarity];
  });

  const bestToClarify = clarityRanking[0];

  return {
    quotes,
    price_comparison: `The quotes ${quotes.map((q) => `${q.label}: ${q.price_mentioned}`).join(", ")}. Price differences of more than 20% between quotes usually indicate different scopes — do not assume the cheapest quote covers the same work as the most expensive. Always reconcile scope line-by-line before comparing prices.`,
    scope_comparison: `${quotes.filter((q) => q.scope_clarity === "clear").length} of ${quotes.length} quotes provide a reasonably clear scope. ${quotes.filter((q) => q.scope_clarity === "vague").length > 0 ? `${quotes.filter((q) => q.scope_clarity === "vague").map((q) => q.label).join(" and ")} ${quotes.filter((q) => q.scope_clarity === "vague").length === 1 ? "is" : "are"} too vague to evaluate fairly — request a detailed breakdown before proceeding.` : "All quotes have some level of detail, but review the missing items for each."}`,
    recommended_followup: `Start with ${bestToClarify.label} — it has the most detail, making it the easiest to build on. Send the rewritten scope template to all contractors and ask them to re-quote against the same line items. Do not pick a winner until all three are on equal footing. The goal of this step is to get comparable quotes, not to choose one.`,
    shared_missing_items: [
      "All quotes should include a Certificate of Compliance (CoC) for any electrical work",
      "Request itemised materials list with brand, quantity, and unit price from each contractor",
      "Confirm each contractor's NHBRC registration or relevant trade body membership",
      "Ask all contractors to specify waste removal and site cleanup responsibilities",
    ],
    questions_for_all: [
      "Can you re-quote against this itemised scope? [attach rewritten scope template]",
      "What is your exact payment schedule — deposit %, and milestones for each stage payment?",
      "Will this quote include a Certificate of Compliance for all electrical work?",
      "What is your registration number with the NHBRC or relevant trade body?",
      "What happens if you discover hidden problems (damp, rotting subfloor, etc.) once work starts?",
      "What workmanship guarantee do you offer, and is it in writing?",
    ],
  };
}

export function getMockSavedProjects(): SavedProject[] {
  return [
    {
      id: "proj-001",
      name: "Kitchen upgrade — Sunninghill",
      location: "Johannesburg, Gauteng",
      room_type: "kitchen",
      budget_range: "15k-50k",
      goals: ["paint", "flooring", "lighting"],
      created_at: "2025-05-14T09:22:00Z",
      status: "planned",
      estimated_cost_range: "R12,000 – R34,500",
      photo_count: 3,
    },
    {
      id: "proj-002",
      name: "Main bathroom retile",
      location: "Cape Town, Western Cape",
      room_type: "bathroom",
      budget_range: "15k-50k",
      goals: ["tiling", "plumbing"],
      created_at: "2025-05-10T14:05:00Z",
      status: "in-progress",
      estimated_cost_range: "R18,000 – R45,000",
      photo_count: 2,
    },
    {
      id: "proj-003",
      name: "Lounge & dining makeover",
      location: "Durban, KwaZulu-Natal",
      room_type: "lounge",
      budget_range: "50k-150k",
      goals: ["paint", "flooring", "lighting", "full-makeover"],
      created_at: "2025-04-28T11:00:00Z",
      status: "draft",
      estimated_cost_range: undefined,
      photo_count: 0,
    },
  ];
}

// Sample plan for home page preview (static mock)
export const SAMPLE_PLAN_PREVIEW = {
  project: { name: "Kitchen renovation", location: "Cape Town", room_type: "Kitchen", budget: "R15,000 – R50,000" },
  room_summary: "A dated Cape Town kitchen with original 1990s cupboards, worn vinyl flooring, and single overhead fluorescent fitting. The room is structurally sound but shows early signs of moisture near the sink area.",
  estimated_cost_range: "R18,500 – R42,000",
  cost_low: 18500,
  cost_high: 42000,
  risks: [
    "Moisture near sink — investigate source before any tiling or painting.",
    "Electrical panel may need upgrading for additional appliance circuits.",
    "Cupboard replacement costs escalate quickly — consider refacing vs full replacement.",
  ],
  whatsapp_snippet: "Hi, I'm looking for a quote for a kitchen renovation in Cape Town.\n\n*Scope:* Paint · Flooring · Lighting · Cupboards\n*Budget:* R15,000 – R50,000\n\nPlease provide an itemised quote with labour and materials listed separately…",
};
