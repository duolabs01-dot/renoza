import type { RenovationGoal, RoomType } from "./types";
import { GOAL_LABELS } from "./types";

export interface SnaggingItem {
  id: string;
  goal: RenovationGoal | "general";
  label: string;
  tip: string;
  critical: boolean;
}

// ─── Items per goal ───────────────────────────────────────────────────────────

const SNAG_BY_GOAL: Record<string, SnaggingItem[]> = {
  paint: [
    { id: "paint-1", goal: "paint", label: "No drips, runs, or sags on walls or ceiling", tip: "Check in raking light (angled torch). Runs should be sanded and touched up before sign-off.", critical: false },
    { id: "paint-2", goal: "paint", label: "Consistent coverage — no thin patches showing previous colour", tip: "Two full coats required. Hold a light at 45° to check for thin spots.", critical: false },
    { id: "paint-3", goal: "paint", label: "Clean, straight cut-in lines at ceiling, skirting, and cornices", tip: "Ragged cut-in lines are the most visible defect. Ask for a touch-up brush if needed.", critical: false },
    { id: "paint-4", goal: "paint", label: "No overspray on tiles, glass, light fittings, or skirting boards", tip: "Check all adjacent surfaces. Paint on glass can be scraped; paint on grout is harder to remove.", critical: false },
  ],
  tiling: [
    { id: "tile-1", goal: "tiling", label: "No hollow tiles — tap each tile with a coin or knuckle", tip: "A hollow sound indicates poor bonding. Hollow tiles will crack. Flag all hollow tiles for re-laying.", critical: true },
    { id: "tile-2", goal: "tiling", label: "Grout lines are consistent width and fully filled — no voids", tip: "Voids in grout allow water ingress. Run your finger along every grout line.", critical: true },
    { id: "tile-3", goal: "tiling", label: "Lippage (height difference between tiles) is within 1mm", tip: "Run a steel rule across tile edges. Lippage > 1mm is a trip hazard and looks poor.", critical: false },
    { id: "tile-4", goal: "tiling", label: "Wet areas (shower, bath surround) have silicone at all junctions — not grout", tip: "Corners and wall/floor junctions must have flexible silicone — rigid grout will crack. Check shower tray perimeter.", critical: true },
    { id: "tile-5", goal: "tiling", label: "Cut tiles at perimeter are neat and consistent", tip: "Cuts should be at least half a tile width where visible. Check corners and door frames.", critical: false },
  ],
  flooring: [
    { id: "floor-1", goal: "flooring", label: "No squeaks or movement underfoot — walk every part of the floor", tip: "Squeaks indicate inadequate adhesive or fixing. Mark problem areas with tape for the contractor to fix.", critical: false },
    { id: "floor-2", goal: "flooring", label: "Expansion gaps at all walls — not visible under skirting", tip: "Laminate and engineered wood expand. No gap = buckling in summer. Gap must be hidden by skirting.", critical: true },
    { id: "floor-3", goal: "flooring", label: "Skirting boards are fitted, neatly mitred at corners, no gaps at floor", tip: "Paint or caulk behind skirting is acceptable. Gaps between skirting and floor are not.", critical: false },
    { id: "floor-4", goal: "flooring", label: "Threshold strips at doorways are fitted and flush", tip: "Threshold strips protect the flooring edge and cover transitions between rooms.", critical: false },
  ],
  lighting: [
    { id: "light-1", goal: "lighting", label: "All light fittings are working and aligned correctly", tip: "Test every switch. Check that downlights are evenly spaced and flush with the ceiling.", critical: false },
    { id: "light-2", goal: "lighting", label: "Dimmers (if installed) operate smoothly without flickering", tip: "LED dimmers require compatible dimmer switches. Flickering = incompatible dimmer. Ask contractor to replace.", critical: false },
    { id: "light-3", goal: "lighting", label: "No exposed cable or conduit visible after installation", tip: "All cable routes should be neatly chased or hidden. Exposed cable is a safety and aesthetic issue.", critical: true },
  ],
  cupboards: [
    { id: "cup-1", goal: "cupboards", label: "All cabinet doors align and close flush with no gaps", tip: "Hinges are adjustable — misaligned doors should be corrected on-site. Check from eye level.", critical: false },
    { id: "cup-2", goal: "cupboards", label: "Drawer runners operate smoothly, fully extend, and don't bind", tip: "Test every drawer under load (put weight in them). Binding indicates a fixings or runner issue.", critical: false },
    { id: "cup-3", goal: "cupboards", label: "Countertop/worktop joints are tight and sealed — no visible gaps", tip: "Gaps at countertop joints allow moisture ingress and are difficult to fix later. Insist on silicone sealing.", critical: true },
    { id: "cup-4", goal: "cupboards", label: "Plinths and cornice are fitted with no visible fastener heads", tip: "Fixings should be concealed or painted over. Visible screwheads in visible joinery are a finish defect.", critical: false },
  ],
  plumbing: [
    { id: "plumb-1", goal: "plumbing", label: "No drips at any new or modified connection — check after 24 hours", tip: "Run all taps, shower, and toilet after installation and check all connections the following morning.", critical: true },
    { id: "plumb-2", goal: "plumbing", label: "Taps, showers, and flush mechanisms operate correctly", tip: "Check flow rate, hot/cold orientation, and flush volume. Cold water on the right, hot on the left (SA standard).", critical: true },
    { id: "plumb-3", goal: "plumbing", label: "All penetrations through walls are sealed — no visible gaps", tip: "Pipe penetrations must be sealed to prevent moisture ingress and vermin entry.", critical: false },
    { id: "plumb-4", goal: "plumbing", label: "Pressure test documentation provided if new supply pipes installed", tip: "Ask for a written pressure test result. This protects you if a leak emerges later.", critical: false },
  ],
  electrical: [
    { id: "elec-1", goal: "electrical", label: "Certificate of Compliance (CoC) issued and handed over", tip: "Without a CoC, you cannot sell the property and your insurance may be invalidated. This is non-negotiable.", critical: true },
    { id: "elec-2", goal: "electrical", label: "All socket outlets and switches are flush, level, and secure", tip: "Loose faceplates indicate poor fixings. Rocker switches should operate without stiff spots.", critical: false },
    { id: "elec-3", goal: "electrical", label: "DB board labels updated to reflect all new circuits", tip: "Ask for a circuit schedule. Unlabelled breakers are a safety hazard.", critical: true },
    { id: "elec-4", goal: "electrical", label: "No live cables or exposed terminals visible", tip: "Any visible live terminations must be fixed before sign-off — this is a safety defect.", critical: true },
  ],
  "damp-repair": [
    { id: "damp-1", goal: "damp-repair", label: "72-hour dry test passed — surface remains dry after rain or water exposure", tip: "Do not sign off until the treated area has been tested through at least one rain event or a hose-down test.", critical: true },
    { id: "damp-2", goal: "damp-repair", label: "Waterproofing membrane is visible at all junctions and upstands", tip: "The membrane should extend at least 150mm up all walls adjacent to the treated area.", critical: true },
    { id: "damp-3", goal: "damp-repair", label: "Re-plastered areas are flush, smooth, and ready for final finish", tip: "Plaster should be allowed to dry fully (at least 28 days before painting in humid conditions).", critical: false },
    { id: "damp-4", goal: "damp-repair", label: "Product data sheet and warranty certificate provided", tip: "Most waterproofing manufacturers offer a 5–10 year system warranty. Ask for the paperwork.", critical: false },
  ],
  "prepare-rental-sale": [
    { id: "prep-1", goal: "prepare-rental-sale", label: "All doors and windows open, close, and lock properly", tip: "A stiff or broken lock is a major red flag for buyers and inspectors.", critical: true },
    { id: "prep-2", goal: "prepare-rental-sale", label: "No visible cracks, chips, or holes in walls or ceilings", tip: "Small cracks should be filled and painted. Large cracks (>3mm wide) suggest movement — flag for investigation.", critical: false },
    { id: "prep-3", goal: "prepare-rental-sale", label: "All taps, toilets, and electrical outlets are functional", tip: "Dripping taps and broken outlets will fail a pre-purchase inspection. Fix everything before listing.", critical: true },
    { id: "prep-4", goal: "prepare-rental-sale", label: "Tiles and grout are clean, with no broken tiles or open grout joints", tip: "Re-grouting is cheap and makes a big visual difference. Broken tiles should be replaced.", critical: false },
  ],
  "full-makeover": [
    // Full-makeover uses a curated general finish group — see below
  ],
};

// ─── General finish group for full-makeover ───────────────────────────────────

const GENERAL_FINISH_ITEMS: SnaggingItem[] = [
  { id: "gen-1", goal: "general", label: "Paint finish is clean, consistent, and free of drips", tip: "Walk all rooms in raking light. Touch up any drips, runs, or thin patches before final payment.", critical: false },
  { id: "gen-2", goal: "general", label: "All tiles are bonded, grout lines filled, and silicone at junctions", tip: "Tap all tiles. Check wet area joints for silicone (not grout). Voids and hollows are defects.", critical: true },
  { id: "gen-3", goal: "general", label: "Flooring is secure, no squeaks or exposed expansion gaps", tip: "Walk every area of the floor. Mark squeaks. Gaps should be hidden under skirting.", critical: false },
  { id: "gen-4", goal: "general", label: "All fittings (taps, light fittings, switches) are seated and functional", tip: "Test every switch, tap, and fixture. A loose fitting or dripping tap is not a sign-off condition.", critical: true },
  { id: "gen-5", goal: "general", label: "Certificate of Compliance (CoC) provided if any electrical work was done", tip: "This is a legal requirement. Do not make final payment without the CoC in hand.", critical: true },
  { id: "gen-6", goal: "general", label: "Site is clean and clear — no building waste left on property", tip: "Rubble removal should be included in the contract. Confirm before work starts.", critical: false },
];

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateSnaggingList(goals: RenovationGoal[], roomType: RoomType): SnaggingItem[] {
  void roomType;
  const hasMakeover = goals.includes("full-makeover");

  if (hasMakeover) {
    // Curated general group + items from other selected goals, capped at ~20
    const otherGoals = goals.filter(g => g !== "full-makeover");
    const otherItems: SnaggingItem[] = [];
    for (const g of otherGoals) {
      otherItems.push(...(SNAG_BY_GOAL[g] ?? []));
    }
    const combined = [...GENERAL_FINISH_ITEMS, ...otherItems];
    // Deduplicate by id and cap at 20
    const seen = new Set<string>();
    const result: SnaggingItem[] = [];
    for (const item of combined) {
      if (!seen.has(item.id) && result.length < 20) {
        seen.add(item.id);
        result.push(item);
      }
    }
    return result;
  }

  // Standard: collect items for each selected goal
  const result: SnaggingItem[] = [];
  const seen = new Set<string>();
  for (const goal of goals) {
    for (const item of SNAG_BY_GOAL[goal] ?? []) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        result.push(item);
      }
    }
  }
  return result;
}

export function getSnaggingGroupLabel(goal: string): string {
  if (goal === "general") return "General Finish";
  return GOAL_LABELS[goal as RenovationGoal] ?? goal;
}
