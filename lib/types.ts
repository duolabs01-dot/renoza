export type BudgetRange =
  | "under-5k"
  | "5k-15k"
  | "15k-50k"
  | "50k-150k"
  | "150k-plus";

export type RoomType =
  | "kitchen"
  | "bathroom"
  | "bedroom"
  | "lounge"
  | "dining-room"
  | "bathroom-en-suite"
  | "garage"
  | "other";

export type OwnershipType = "own" | "rent";

export type RenovationGoal =
  | "paint"
  | "flooring"
  | "tiling"
  | "lighting"
  | "cupboards"
  | "plumbing"
  | "electrical"
  | "damp-repair"
  | "full-makeover"
  | "prepare-rental-sale";

export interface ProjectInput {
  name: string;
  location: string;
  room_type: RoomType;
  ownership_type: OwnershipType;
  room_size: string;
  budget_range: BudgetRange;
  goals: RenovationGoal[];
  photo_urls?: string[];
}

export interface WorkItem {
  category: string;
  description: string;
  estimated_cost: string;
}

export interface RenovationPlan {
  room_summary: string;
  recommended_approach: string;
  budget_realism: string;
  work_items: WorkItem[];
  materials_list: string[];
  labour_categories: string[];
  estimated_cost_range: string;
  risks_and_hidden_costs: string[];
  questions_for_contractor: string[];
  whatsapp_brief: string;
}

export interface QuoteReviewInput {
  quote_text: string;
  project_id?: string;
}

export interface QuoteReview {
  quote_summary: string;
  missing_details: string[];
  red_flags: string[];
  fairness_estimate: string;
  questions_to_ask: string[];
  rewritten_scope: string;
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
  lounge: "Lounge / Living Room",
  "dining-room": "Dining Room",
  "bathroom-en-suite": "En-Suite Bathroom",
  garage: "Garage",
  other: "Other",
};

export const GOAL_LABELS: Record<RenovationGoal, string> = {
  paint: "Paint",
  flooring: "Flooring",
  tiling: "Tiling",
  lighting: "Lighting",
  cupboards: "Cupboards or Storage",
  plumbing: "Plumbing",
  electrical: "Electrical",
  "damp-repair": "Damp or Mould Repair",
  "full-makeover": "Full Makeover",
  "prepare-rental-sale": "Prepare for Rental or Sale",
};
