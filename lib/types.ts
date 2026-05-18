export type BudgetRange = "under-5k" | "5k-15k" | "15k-50k" | "50k-150k" | "150k-plus";
export type RoomType = "kitchen" | "bathroom" | "bedroom" | "lounge" | "dining-room" | "bathroom-en-suite" | "garage" | "other";
export type OwnershipType = "own" | "rent";
export type RenovationGoal = "paint" | "flooring" | "tiling" | "lighting" | "cupboards" | "plumbing" | "electrical" | "damp-repair" | "full-makeover" | "prepare-rental-sale";
export type ProjectStatus = "draft" | "planned" | "in-progress" | "complete";

export interface ProjectPhoto {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
}

export interface ProjectInput {
  name: string;
  location: string;
  room_type: RoomType;
  ownership_type: OwnershipType;
  room_size: string;
  budget_range: BudgetRange;
  goals: RenovationGoal[];
  photos?: ProjectPhoto[];
  include_feng_shui?: boolean;
  compass_direction?: CompassDirection;
  floor_plan?: FloorPlanUpload;
}

export type CompassDirection =
  | "north" | "northeast" | "east" | "southeast"
  | "south" | "southwest" | "west" | "northwest"
  | "unknown";

export interface FloorPlanAnalysis {
  room_type_detected: string;
  estimated_dimensions: string;
  visible_features: string[];
  demolition_zones: string[];
  renovation_scope_detected: string[];
  structural_concerns: string[];
  ai_notes: string;
}

export interface FloorPlanUpload {
  name: string;
  analysis?: FloorPlanAnalysis;
}

export interface FengShuiColour {
  colour: string;
  hex: string;
  reason: string;
}

export interface FengShuiAnalysis {
  bagua_area: string;
  dominant_element: string;
  energy_assessment: string;
  colour_recommendations: FengShuiColour[];
  placement_tips: string[];
  things_to_avoid: string[];
  favourable_directions: string[];
  compass_notes: string;
}

export interface StoredProject {
  id: string;
  input: ProjectInput;
  plan: RenovationPlan;
  created_at: string;
  updated_at: string;
}

export interface SavedProject {
  id: string;
  name: string;
  location: string;
  room_type: RoomType;
  budget_range: BudgetRange;
  goals: RenovationGoal[];
  created_at: string;
  status: ProjectStatus;
  estimated_cost_range?: string;
  photo_count?: number;
}

export interface WorkItem {
  category: string;
  description: string;
  estimated_cost: string;
  low: number;
  high: number;
}

export interface TimelinePhase {
  name: string;
  duration: string;
  pct: number;
}

export interface RenovationPlan {
  room_summary: string;
  recommended_approach: string;
  budget_realism: string;
  work_items: WorkItem[];
  materials_list: string[];
  labour_categories: string[];
  estimated_cost_range: string;
  cost_low: number;
  cost_high: number;
  budget_max: number;
  risks_and_hidden_costs: string[];
  questions_for_contractor: string[];
  whatsapp_brief: string;
  timeline_phases: TimelinePhase[];
  feng_shui?: FengShuiAnalysis;
  floor_plan_notes?: string;
}

export interface QuoteReview {
  quote_summary: string;
  missing_details: string[];
  red_flags: string[];
  fairness_score: number;
  fairness_estimate: string;
  questions_to_ask: string[];
  rewritten_scope: string;
}

export interface QuoteComparisonInput {
  quotes: string[];
  project_id?: string;
}

export type ScopeClarity = "clear" | "partial" | "vague";

export interface SingleQuoteSummary {
  index: number;
  label: string;
  price_mentioned: string;
  scope_clarity: ScopeClarity;
  missing_items: string[];
  red_flags: string[];
  payment_terms: string;
  strengths: string[];
}

export interface QuoteComparison {
  quotes: SingleQuoteSummary[];
  price_comparison: string;
  scope_comparison: string;
  recommended_followup: string;
  shared_missing_items: string[];
  questions_for_all: string[];
}

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  "under-5k": "Under R5,000",
  "5k-15k": "R5,000 – R15,000",
  "15k-50k": "R15,000 – R50,000",
  "50k-150k": "R50,000 – R150,000",
  "150k-plus": "R150,000+",
};

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  bedroom: "Bedroom",
  lounge: "Lounge",
  "dining-room": "Dining Room",
  "bathroom-en-suite": "En-Suite",
  garage: "Garage",
  other: "Other",
};

export const GOAL_LABELS: Record<RenovationGoal, string> = {
  paint: "Paint",
  flooring: "Flooring",
  tiling: "Tiling",
  lighting: "Lighting",
  cupboards: "Cupboards & Storage",
  plumbing: "Plumbing",
  electrical: "Electrical",
  "damp-repair": "Damp & Mould Repair",
  "full-makeover": "Full Makeover",
  "prepare-rental-sale": "Prepare for Sale",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: "Draft",
  planned: "Planned",
  "in-progress": "In Progress",
  complete: "Complete",
};

export const ROOM_ICONS: Record<string, string> = {
  kitchen: "M3 9l9-7 9 7v11a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2V9z",
  bathroom: "M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 16V8a4 4 0 014-4h8a4 4 0 014 4v8",
  bedroom: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4",
  lounge: "M20 12V8a2 2 0 00-2-2H6a2 2 0 00-2 2v4m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0H4",
  garage: "M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11",
  other: "M12 6v6m0 0v6m0-6h6m-6 0H6",
};

export const BUDGET_OPTIONS: BudgetRange[] = ["under-5k", "5k-15k", "15k-50k", "50k-150k", "150k-plus"];
export const ROOM_TYPES: RoomType[] = ["kitchen", "bathroom", "bedroom", "lounge", "dining-room", "bathroom-en-suite", "garage", "other"];
export const GOAL_OPTIONS: RenovationGoal[] = ["paint", "flooring", "tiling", "lighting", "cupboards", "plumbing", "electrical", "damp-repair", "full-makeover", "prepare-rental-sale"];
