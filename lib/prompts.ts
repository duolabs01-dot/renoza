import type { ProjectInput } from "./types";
import { BUDGET_LABELS, GOAL_LABELS, ROOM_TYPE_LABELS } from "./types";

export function buildPlanPrompt(input: ProjectInput): string {
  const goals = input.goals.map((g) => GOAL_LABELS[g] || g).join(", ");
  const roomLabel = ROOM_TYPE_LABELS[input.room_type] || input.room_type;
  const budgetLabel = BUDGET_LABELS[input.budget_range] || input.budget_range;

  return `You are a senior South African renovation consultant. Generate a detailed, realistic renovation plan for the following project.

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
- risks_and_hidden_costs must be SPECIFIC to this room type (${roomLabel}) and the selected goals.
- questions_for_contractor must be SPECIFIC to the selected goals and SA compliance requirements.
- Be honest about what the budget can and cannot achieve.
${input.ownership_type === "rent" ? "- Since this is a rental, flag that structural changes may require landlord permission and note this in the WhatsApp brief." : ""}

Generate the renovation plan now.`;
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
