import { z } from "zod";

export const workItemSchema = z.object({
  category: z.string(),
  description: z.string(),
  estimated_cost: z.string(),
  low: z.number(),
  high: z.number(),
});

export const timelinePhaseSchema = z.object({
  name: z.string(),
  duration: z.string(),
  pct: z.number(),
});

export const fengShuiColourSchema = z.object({
  colour: z.string(),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  reason: z.string(),
});

export const fengShuiAnalysisSchema = z.object({
  bagua_area: z.string(),
  dominant_element: z.string(),
  energy_assessment: z.string(),
  colour_recommendations: z.array(fengShuiColourSchema).min(3).max(6),
  placement_tips: z.array(z.string()).min(3).max(8),
  things_to_avoid: z.array(z.string()).min(2).max(6),
  favourable_directions: z.array(z.string()),
  compass_notes: z.string(),
});

export const floorPlanAnalysisSchema = z.object({
  room_type_detected: z.string(),
  estimated_dimensions: z.string(),
  visible_features: z.array(z.string()),
  demolition_zones: z.array(z.string()),
  renovation_scope_detected: z.array(z.string()),
  structural_concerns: z.array(z.string()),
  ai_notes: z.string(),
});

export const renovationPlanSchema = z.object({
  room_summary: z.string(),
  recommended_approach: z.string(),
  budget_realism: z.string(),
  work_items: z.array(workItemSchema).min(3).max(10),
  materials_list: z.array(z.string()).min(5).max(20),
  labour_categories: z.array(z.string()).min(2).max(8),
  estimated_cost_range: z.string(),
  cost_low: z.number(),
  cost_high: z.number(),
  budget_max: z.number(),
  risks_and_hidden_costs: z.array(z.string()).min(4).max(10),
  questions_for_contractor: z.array(z.string()).min(6).max(12),
  whatsapp_brief: z.string(),
  timeline_phases: z.array(timelinePhaseSchema).min(3).max(6),
  feng_shui: fengShuiAnalysisSchema.optional(),
  floor_plan_notes: z.string().optional(),
});

export const quoteReviewSchema = z.object({
  quote_summary: z.string(),
  missing_details: z.array(z.string()).min(3).max(10),
  red_flags: z.array(z.string()).min(1).max(8),
  fairness_score: z.number().min(0).max(1),
  fairness_estimate: z.string(),
  questions_to_ask: z.array(z.string()).min(5).max(12),
  rewritten_scope: z.string(),
});

const scopeClaritySchema = z.enum(["clear", "partial", "vague"]);

export const singleQuoteSummarySchema = z.object({
  index: z.number(),
  label: z.string(),
  price_mentioned: z.string(),
  scope_clarity: scopeClaritySchema,
  missing_items: z.array(z.string()),
  red_flags: z.array(z.string()),
  payment_terms: z.string(),
  strengths: z.array(z.string()),
});

export const quoteComparisonSchema = z.object({
  quotes: z.array(singleQuoteSummarySchema),
  price_comparison: z.string(),
  scope_comparison: z.string(),
  recommended_followup: z.string(),
  shared_missing_items: z.array(z.string()).min(2).max(8),
  questions_for_all: z.array(z.string()).min(4).max(10),
});
