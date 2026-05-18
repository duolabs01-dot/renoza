import type {
  ProjectInput,
  RenovationPlan,
  QuoteReviewInput,
  QuoteReview,
} from "./types";

// Swap these functions for real AI calls (Claude / OpenAI server actions) when ready.

export function generateRenovationPlan(input: ProjectInput): RenovationPlan {
  const roomLabel = input.room_type.replace(/-/g, " ");
  const goalsText = input.goals.join(", ");

  return {
    room_summary: `This is a ${roomLabel} in ${input.location}. Based on the selected budget of ${input.budget_range.replace(/-/g, " ")} and goals (${goalsText}), this plan focuses on practical, cost-effective improvements suited to the South African market. The approximate room size of ${input.room_size} has been considered in the estimates below.`,

    recommended_approach: `Start with any damp, mould, or structural issues before cosmetic work — these are always hidden costs that grow if ignored. Once the room is structurally sound, prioritise painting and flooring as they deliver the biggest visual return for the budget. Electrical and plumbing work should only be done by registered tradespeople to maintain compliance certificates.`,

    budget_realism: `Your selected budget is realistic for targeted improvements but may not cover a full makeover in a single phase. Consider phasing the work — address structural and damp issues first, then cosmetics. Labour typically accounts for 40–60% of renovation costs in South Africa.`,

    work_items: [
      {
        category: "Surface Preparation",
        description:
          "Filling cracks, sanding, cleaning walls before paint. Skimming if needed.",
        estimated_cost: "R800 – R2,500",
      },
      {
        category: "Interior Paint",
        description:
          "Two coats on all walls and ceiling. Good quality mid-range paint (e.g. Plascon, Dulux).",
        estimated_cost: "R3,500 – R8,000",
      },
      {
        category: "Flooring",
        description:
          "Vinyl planks or laminate. Includes adhesive, underlay, and skirting replacement.",
        estimated_cost: "R6,000 – R18,000",
      },
      {
        category: "Lighting",
        description:
          "Replace fittings with LED downlights or pendants. Basic electrical point changes.",
        estimated_cost: "R2,000 – R6,000",
      },
    ],

    materials_list: [
      "Plascon Velvaglo or equivalent (10L – 20L)",
      "Primer / undercoat (where needed)",
      "Crack filler and sealant",
      "Sandpaper (coarse and fine grit)",
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
      "Electrician (for any fitting changes)",
      "General labourer (prep and cleanup)",
    ],

    estimated_cost_range: "R12,000 – R34,500",

    risks_and_hidden_costs: [
      "Damp or rising moisture behind walls — inspect before tiling or painting.",
      "Old or non-compliant electrical wiring — may require a full inspection and certificate of compliance (CoC) at extra cost.",
      "Rotting or uneven subfloor — may need to be levelled before flooring is laid.",
      "Hidden plumbing leaks — always pressure-test before closing up walls.",
      "Asbestos in older homes (pre-1990s) — requires specialist removal.",
      "Price of materials fluctuates — confirm prices from supplier before accepting any quote.",
    ],

    questions_for_contractor: [
      "Are you registered with the NHBRC or relevant trade association?",
      "Do you carry public liability insurance?",
      "Will you provide a written itemised quote with labour and materials listed separately?",
      "What deposit do you require, and what is the payment schedule?",
      "How long will the work take, and what happens if it runs over?",
      "Will the electrical work include a Certificate of Compliance?",
      "Who is responsible for sourcing materials — you or me?",
      "What guarantee do you offer on your workmanship?",
    ],

    whatsapp_brief: `Hi, I'm looking for a quote for a ${roomLabel} renovation in ${input.location}.

*Scope of work:*
- ${input.goals.map((g) => g.replace(/-/g, " ")).join("\n- ")}

*Room size:* ${input.room_size}
*Budget:* ${input.budget_range.replace(/-/g, " ")}
*Ownership:* ${input.ownership_type === "own" ? "Own property" : "Renting — landlord approval obtained"}

Please provide an itemised quote with labour and materials listed separately. I'd also like to confirm your NHBRC registration and whether electrical work will include a Certificate of Compliance.

When are you available for a site visit?`,
  };
}

export function reviewContractorQuote(input: QuoteReviewInput): QuoteReview {
  const excerpt = input.quote_text.slice(0, 80);

  return {
    quote_summary: `The quote appears to cover general renovation work. The text begins: "${excerpt}...". Based on the content, this is a partial scope quote that lists some labour items but may lack full materials breakdown and important compliance provisions.`,

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

    fairness_estimate: `Without knowing the exact location and scope, it is not possible to confirm a precise fairness verdict. As a rough guide: labour in South Africa typically runs R350–R700/hour per skilled tradesperson. Materials should be itemised at current market rates (confirm with a Builders Warehouse or CTM quote). A full bathroom renovation typically costs R15,000–R80,000+ depending on scope and finishes. Compare this quote against at least two others.`,

    questions_to_ask: [
      "Can you break this down into separate line items for labour, materials, and other costs?",
      "What is your payment schedule — how much upfront and when are the remaining payments due?",
      "Are you registered with the NHBRC or a relevant trade body? Can I see your registration number?",
      "Does this quote include a Certificate of Compliance (CoC) for electrical work?",
      "What is your workmanship guarantee?",
      "What happens if you discover additional problems once work starts — how are extra costs handled?",
      "Who sources the materials — you or me? If you, what markup do you charge?",
      "What is your projected completion date and what is the consequence if you run over?",
    ],

    rewritten_scope: `RENOVATION SCOPE — REWRITTEN FOR CLARITY

Project Address: [INSERT ADDRESS]
Contractor: [INSERT NAME + REGISTRATION NO.]
Date: [INSERT DATE]
Valid Until: [INSERT DATE]

SCOPE OF WORK:
[List each work item clearly, e.g.:]
1. Supply and apply 2 coats interior paint to all walls and ceiling — [room name]
2. Remove existing floor tiles and dispose off-site
3. Supply and install [specify flooring type] to [area in m²]
4. Replace [X] light fittings with LED downlights
5. Issue Certificate of Compliance (CoC) for all electrical work

MATERIALS:
[List each material, brand, quantity, and unit price]

LABOUR:
[List each trade, number of days, and daily rate]

PAYMENT SCHEDULE:
- 30% deposit on acceptance
- 40% on completion of [milestone]
- 30% on final completion and sign-off

TIMELINE: [Start date] to [End date]
GUARANTEE: [X] months on workmanship
EXCLUSIONS: [List anything explicitly not included]`,
  };
}
