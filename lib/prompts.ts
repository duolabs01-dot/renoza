import type { ProjectInput } from "./types";
import { BUDGET_LABELS, GOAL_LABELS, ROOM_TYPE_LABELS } from "./types";
import type { calculatePlan } from "./pricing";

export function buildPlanPrompt(input: ProjectInput): string {
  const goals = input.goals.map((g) => GOAL_LABELS[g] || g).join(", ");
  const roomLabel = ROOM_TYPE_LABELS[input.room_type] || input.room_type;
  const budgetLabel = BUDGET_LABELS[input.budget_range] || input.budget_range;

  let prompt = `You are a senior South African renovation consultant. Generate a detailed, realistic renovation plan for the following project.

PROJECT DETAILS:
- Project name: ${input.name}
- Location: ${input.location} (South Africa)
- Room type: ${roomLabel}
- Ownership: ${input.ownership_type === "own" ? "Owner-occupied" : "Renting (landlord approval required)"}
- Room size: ${input.room_size}
- Budget: ${budgetLabel}
- Goals: ${goals}
- Photos uploaded: ${input.photos?.length ?? 0}

REQUIREMENTS:
- All costs in South African Rand (ZAR). Use current 2025 SA market rates.
- Be specific to the location — mention local suppliers, labour rates for that region.
- Work items must be specific to the selected goals (${goals}). Do NOT include generic items unrelated to these goals.
- The estimated_cost_range, cost_low, and cost_high must be consistent with the budget range ${budgetLabel} and the work items.
- budget_max should be the upper end of the budget range in numbers (e.g. 50000 for "15k-50k").
- timeline_phases must sum to approximately 100% in pct values.
- whatsapp_brief must be a ready-to-send WhatsApp message to a contractor — use *bold* for section headers, include all key project details, and ask for itemised quotes and CoC for electrical.
- risks_and_hidden_costs: SPECIFIC to this room (${roomLabel}) and goals. Voice: a South African builder mate warning you over a coffee — direct, no jargon, name specific Rand amounts or % contingencies where you can, and reference real SA things (SANS, NHBRC, body corporate, pre-1990 asbestos, galvanised pipes, etc.) where relevant. Each item should sound like a warning, not a textbook.
- questions_for_contractor must be SPECIFIC to the selected goals and SA compliance requirements.
- Be honest about what the budget can and cannot achieve.${input.ownership_type === "rent" ? "\n- Since this is a rental, flag that structural changes may require landlord permission and note this in the WhatsApp brief." : ""}`;

  if (input.floor_plan?.analysis) {
    const a = input.floor_plan.analysis;
    prompt += `

FLOOR PLAN CONTEXT (from uploaded drawing — use as soft context only, do not invent structural certainty):
- Detected dimensions: ${a.estimated_dimensions}
- Visible features: ${a.visible_features.join(", ")}
- Demolition zones noted: ${a.demolition_zones.join(", ") || "none"}
- Renovation scope visible: ${a.renovation_scope_detected.join(", ") || "none"}
- Structural concerns: ${a.structural_concerns.join(", ") || "none flagged"}
- AI notes: ${a.ai_notes}
Include a floor_plan_notes string summarising what the drawing revealed and how it influenced the plan. Keep it under 3 sentences.`;
  } else {
    prompt += `\nDo NOT include a floor_plan_notes field.`;
  }

  if (input.include_feng_shui) {
    const dir = input.compass_direction && input.compass_direction !== "unknown"
      ? input.compass_direction
      : "not provided — use general principles";
    prompt += `

SPATIAL HARMONY / FENG SHUI:
Include a feng_shui object with practical spatial harmony guidance framed around feng shui principles.
- bagua_area: which of the 9 bagua areas this room most likely corresponds to for this room type
- dominant_element: Wood, Fire, Earth, Metal, or Water — most fitting for this ${roomLabel}
- energy_assessment: How the renovation goals affect chi/energy flow. Be practical, not mystical.
- colour_recommendations: 3–5 colours that support this room's energy. Include hex codes (real, accurate hex values).
- placement_tips: 3–6 practical layout and flow tips for this room type
- things_to_avoid: 2–4 things to avoid in layout, materials, or renovation choices
- favourable_directions: which compass directions are best for the main function (door, desk, bed, stove etc.)
- compass_notes: Specific guidance based on compass direction "${dir}"
Keep the tone warm and practical — helpful for believers and non-believers alike.`;
  } else {
    prompt += `\nDo NOT include a feng_shui field.`;
  }

  prompt += `\n\nGenerate the renovation plan now.`;
  return prompt;
}

export function buildNarrativePrompt(
  input: ProjectInput,
  calculated: ReturnType<typeof calculatePlan>,
): string {
  const roomLabel = ROOM_TYPE_LABELS[input.room_type] ?? input.room_type;
  const goals = input.goals.map((g) => GOAL_LABELS[g] ?? g).join(", ");
  const budgetLabel = BUDGET_LABELS[input.budget_range] ?? input.budget_range;

  let prompt = `You are a South African renovation consultant. Write ONLY the narrative fields below — all numeric estimates have already been calculated by a separate engine.

PROJECT:
- Room: ${roomLabel} in ${input.location ?? "South Africa"}
- Goals: ${goals}
- Budget: ${budgetLabel}
- Room size: ${input.room_size ?? "not specified"}
- Calculated cost range: ${calculated.estimated_cost_range}
- Key work items: ${calculated.work_items.slice(0, 5).map(w => w.category).join(", ")}

INSTRUCTIONS:
- Do NOT invent, change, or dispute any numbers. The cost range is ${calculated.estimated_cost_range} — reference it as-is.
- Write in plain, friendly South African English. No jargon.
- room_summary: 2 sentences. What is this renovation covering and what is the key context.
- recommended_approach: 3 sentences. What to do first and why (prioritise structural before cosmetic, etc.).
- budget_realism: 2 sentences. Honest assessment — does the budget fit the scope? Be direct.
- whatsapp_brief: A ready-to-send WhatsApp message to a contractor. Max 220 words. Open casually ("Hi, looking for a quote on…"). Use *asterisks* for section headers (Scope / Room size / Budget). Then a bulleted list of asks that MUST include: labour and materials itemised separately; who supplies materials (and markup if contractor does); deposit capped at 30% with balance against milestones; NHBRC or trade body registration number; workmanship guarantee in writing; and Certificate of Compliance (CoC) ONLY IF electrical work is in scope. Close by asking for earliest start date and typical timeline. Tone: a South African homeowner who's done their homework — direct but not adversarial.`;

  if (input.floor_plan?.analysis) {
    const a = input.floor_plan.analysis;
    prompt += `

FLOOR PLAN CONTEXT (from uploaded drawing):
- Dimensions: ${a.estimated_dimensions}
- Features: ${a.visible_features.join(", ")}
- Concerns: ${a.structural_concerns.join(", ") || "none"}
- AI notes: ${a.ai_notes}
Include a floor_plan_notes string (1–2 sentences) summarising what the drawing revealed. Keep it grounded — only state what the drawing clearly shows.`;
  } else {
    prompt += `\nDo NOT include a floor_plan_notes field.`;
  }

  if (input.include_feng_shui) {
    const dir = input.compass_direction && input.compass_direction !== "unknown"
      ? input.compass_direction
      : "not provided — use general principles";
    prompt += `

SPATIAL HARMONY / FENG SHUI:
Include a feng_shui object with practical guidance framed around feng shui principles for a ${roomLabel}.
- bagua_area: which bagua area best fits this room type
- dominant_element: Wood, Fire, Earth, Metal, or Water
- energy_assessment: Practical, warm, 2 sentences on chi flow for this renovation scope
- colour_recommendations: 3–5 colours with accurate hex codes and reasons
- placement_tips: 3–5 practical layout tips
- things_to_avoid: 2–4 avoid items
- favourable_directions: array of compass direction strings
- compass_notes: Guidance based on compass direction "${dir}"`;
  } else {
    prompt += `\nDo NOT include a feng_shui field.`;
  }

  prompt += `\n\nWrite the narrative fields now.`;
  return prompt;
}

export function buildFloorPlanPrompt(input: Partial<ProjectInput>): string {
  return `You are a South African renovation consultant reviewing an uploaded floor plan, sketch, or room photo.
Room type: ${input.room_type ?? "unknown"}. Location: ${input.location ?? "South Africa"}.

Analyse the image and extract:
- room_type_detected: What room type is visible
- estimated_dimensions: Estimate dimensions if scale markings or furniture give clues. Say "unclear" if not determinable.
- visible_features: List visible features (windows, doors, plumbing fixtures, built-in cupboards, etc.)
- demolition_zones: Any areas marked for demolition, removal, or that look structurally concerning
- renovation_scope_detected: Any renovation scope you can read from the drawing (markings, annotations, etc.)
- structural_concerns: ONLY flag what is visually clear. Do not invent concerns. Err on the side of caution — say "none visible" rather than guessing.
- ai_notes: 1–2 sentences on what the drawing reveals and any important caveats

Be honest about uncertainty. If this is a photo rather than a drawing, note that.`;
}

export function buildReviewPrompt(quoteText: string): string {
  return `You are a South African consumer advocate and construction expert. Analyse this contractor quote and provide a fair assessment.

CONTRACTOR QUOTE:
${quoteText}

REQUIREMENTS:
- fairness_score: A number 0.0 to 1.0 (0 = very unfair/suspicious, 1.0 = excellent and fair). Be objective.
- Identify ALL missing details that a proper SA contractor quote must include (itemised costs, CoC, payment schedule, NHBRC registration, workmanship guarantee, etc.)
- red_flags: Only flag genuine concerns — things that indicate hidden costs, overcharging, or compliance issues.
- rewritten_scope: Produce a properly structured quote template the user can send back to the contractor to fill in.
- All monetary references in ZAR. Reference 2025 SA labour rates (R350–R800/hour for skilled trades).
- questions_to_ask must be actionable and specific to what is missing from THIS quote.

Analyse the quote now.`;
}

export function buildComparePrompt(quotes: string[]): string {
  const quotesText = quotes
    .map((q, i) => `QUOTE ${String.fromCharCode(65 + i)}:\n${q}`)
    .join("\n\n---\n\n");

  return `You are a South African construction consultant helping a homeowner compare ${quotes.length} contractor quotes.

${quotesText}

REQUIREMENTS:
- Analyse each quote independently then compare them.
- quotes array must have exactly ${quotes.length} items with index 0, 1${quotes.length > 2 ? ", 2" : ""} and labels "Quote A", "Quote B"${quotes.length > 2 ? ', "Quote C"' : ""}.
- scope_clarity: "clear" = itemised with labour/materials/timeline/payment. "partial" = some detail. "vague" = lump sum only.
- price_mentioned: Extract the actual price or "Not clearly stated".
- recommended_followup: Name the best quote to start with and explain why. Start the string with "Start with Quote [X]" so it can be detected programmatically.
- All advice in ZAR. Reference 2025 SA compliance requirements (CoC, NHBRC).
- shared_missing_items: Items ALL quotes are missing.
- Be balanced — acknowledge strengths, not just weaknesses.

Compare the quotes now.`;
}
