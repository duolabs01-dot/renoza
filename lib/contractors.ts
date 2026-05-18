import type { RenovationGoal } from "./types";

export interface Contractor {
  id: string;
  name: string;
  company: string;
  city: string;
  province: "GP" | "WC" | "KZN" | "EC";
  goals: RenovationGoal[];
  rating: number;
  reviews: number;
  verifiedBadge: boolean;
  whatsapp: string; // placeholder — not a real number
  specialties: string[];
}

// All WhatsApp numbers are placeholders (27000000000) — demo profiles only
export const CONTRACTORS: Contractor[] = [
  // ── Gauteng (JHB) ──────────────────────────────────────────────────────────
  {
    id: "gp-001",
    name: "Sipho Dlamini",
    company: "Dlamini Renovations",
    city: "Johannesburg",
    province: "GP",
    goals: ["paint", "flooring", "full-makeover"],
    rating: 4.7,
    reviews: 84,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Interior paint", "Vinyl flooring", "Residential makeovers"],
  },
  {
    id: "gp-002",
    name: "Thabo Nkosi",
    company: "Nkosi Tiling & Waterproofing",
    city: "Johannesburg",
    province: "GP",
    goals: ["tiling", "damp-repair", "plumbing"],
    rating: 4.8,
    reviews: 112,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Large-format tiling", "Waterproofing", "Bathroom renovations"],
  },
  {
    id: "gp-003",
    name: "Karen van Zyl",
    company: "KVZ Interiors",
    city: "Sandton",
    province: "GP",
    goals: ["cupboards", "lighting", "full-makeover"],
    rating: 4.9,
    reviews: 57,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Custom joinery", "Kitchen renovations", "Lighting design"],
  },
  {
    id: "gp-004",
    name: "Moses Sithole",
    company: "Sithole Electrical & Plumbing",
    city: "Johannesburg",
    province: "GP",
    goals: ["electrical", "plumbing", "lighting"],
    rating: 4.6,
    reviews: 93,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["CoC electrical", "Geyser replacements", "Bathroom plumbing"],
  },
  {
    id: "gp-005",
    name: "Zanele Mokoena",
    company: "Mokoena Build & Finish",
    city: "Soweto",
    province: "GP",
    goals: ["paint", "flooring", "prepare-rental-sale"],
    rating: 4.5,
    reviews: 38,
    verifiedBadge: false,
    whatsapp: "27000000000",
    specialties: ["Prep for sale", "Interior & exterior paint", "Laminate flooring"],
  },
  {
    id: "gp-006",
    name: "Heinrich Joubert",
    company: "Joubert Construction",
    city: "Johannesburg",
    province: "GP",
    goals: ["full-makeover", "damp-repair", "tiling"],
    rating: 4.7,
    reviews: 66,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Full renovations", "Rising damp treatment", "Bathroom & kitchen remodels"],
  },
  // ── Gauteng (Pretoria) ─────────────────────────────────────────────────────
  {
    id: "pta-001",
    name: "Lungelo Shabalala",
    company: "Shabalala Builders",
    city: "Pretoria",
    province: "GP",
    goals: ["paint", "tiling", "flooring", "full-makeover"],
    rating: 4.6,
    reviews: 74,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Full house renovations", "Floor & wall tiling", "Quality paint finish"],
  },
  {
    id: "pta-002",
    name: "Marietjie Potgieter",
    company: "MP Home Improvements",
    city: "Centurion",
    province: "GP",
    goals: ["cupboards", "flooring", "prepare-rental-sale"],
    rating: 4.5,
    reviews: 41,
    verifiedBadge: false,
    whatsapp: "27000000000",
    specialties: ["Built-in cupboards", "Laminate & vinyl flooring", "Pre-sale touch-ups"],
  },
  {
    id: "pta-003",
    name: "Patrick Molefe",
    company: "Molefe Waterproofing",
    city: "Pretoria",
    province: "GP",
    goals: ["damp-repair", "tiling", "plumbing"],
    rating: 4.8,
    reviews: 58,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Crystalline waterproofing", "Roof repairs", "Wet room tiling"],
  },
  {
    id: "pta-004",
    name: "Ronel du Plessis",
    company: "DP Electrical Solutions",
    city: "Pretoria",
    province: "GP",
    goals: ["electrical", "lighting"],
    rating: 4.7,
    reviews: 90,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Domestic CoC", "Smart lighting", "DB upgrades"],
  },
  // ── Western Cape ───────────────────────────────────────────────────────────
  {
    id: "wc-001",
    name: "Pieter Botha",
    company: "Botha Renovations CT",
    city: "Cape Town",
    province: "WC",
    goals: ["full-makeover", "paint", "flooring"],
    rating: 4.9,
    reviews: 141,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Premium finishes", "Open-plan conversions", "Engineered wood flooring"],
  },
  {
    id: "wc-002",
    name: "Yusuf Adams",
    company: "Adams Tiling & Waterproofing",
    city: "Cape Town",
    province: "WC",
    goals: ["tiling", "damp-repair", "plumbing"],
    rating: 4.7,
    reviews: 88,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Bathroom renovations", "External waterproofing", "Underfloor heating prep"],
  },
  {
    id: "wc-003",
    name: "Nomsa Khumalo",
    company: "NK Interiors",
    city: "Cape Town",
    province: "WC",
    goals: ["cupboards", "lighting", "paint"],
    rating: 4.8,
    reviews: 52,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Bespoke kitchens", "Feature lighting", "Colour consultation"],
  },
  {
    id: "wc-004",
    name: "Ethan Abrahams",
    company: "Abrahams Electrical",
    city: "Cape Town",
    province: "WC",
    goals: ["electrical", "lighting"],
    rating: 4.6,
    reviews: 73,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Residential CoC", "Solar-ready wiring", "Outdoor lighting"],
  },
  {
    id: "wc-005",
    name: "Chantelle Venter",
    company: "Venter Home Refresh",
    city: "Stellenbosch",
    province: "WC",
    goals: ["paint", "flooring", "prepare-rental-sale"],
    rating: 4.5,
    reviews: 29,
    verifiedBadge: false,
    whatsapp: "27000000000",
    specialties: ["Prep for rental", "Interior painting", "Laminate & vinyl"],
  },
  {
    id: "wc-006",
    name: "Siyanda Jacobs",
    company: "Jacobs Plumbing Services",
    city: "Cape Town",
    province: "WC",
    goals: ["plumbing", "damp-repair"],
    rating: 4.7,
    reviews: 96,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Burst pipes & leaks", "Geyser install", "Bathroom plumbing"],
  },
  // ── KwaZulu-Natal ──────────────────────────────────────────────────────────
  {
    id: "kzn-001",
    name: "Nhlanhla Zulu",
    company: "Zulu Construction DBN",
    city: "Durban",
    province: "KZN",
    goals: ["full-makeover", "tiling", "damp-repair"],
    rating: 4.6,
    reviews: 61,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Coastal damp treatment", "Full bathroom renovations", "Tiling"],
  },
  {
    id: "kzn-002",
    name: "Priya Naidoo",
    company: "Naidoo Interiors",
    city: "Durban",
    province: "KZN",
    goals: ["cupboards", "paint", "flooring"],
    rating: 4.8,
    reviews: 47,
    verifiedBadge: false,
    whatsapp: "27000000000",
    specialties: ["Kitchen makeovers", "Custom cabinetry", "Interior painting"],
  },
  {
    id: "kzn-003",
    name: "Ravi Pillay",
    company: "Pillay Electrical",
    city: "Durban",
    province: "KZN",
    goals: ["electrical", "lighting"],
    rating: 4.7,
    reviews: 80,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Domestic CoC", "LED retrofitting", "Pre-sale electrical clearance"],
  },
  {
    id: "kzn-004",
    name: "Bongani Mthembu",
    company: "Mthembu Building Works",
    city: "Durban",
    province: "KZN",
    goals: ["paint", "flooring", "full-makeover"],
    rating: 4.5,
    reviews: 33,
    verifiedBadge: false,
    whatsapp: "27000000000",
    specialties: ["Interior & exterior paint", "Floor finishes", "General renovations"],
  },
  {
    id: "kzn-005",
    name: "Sandile Gwala",
    company: "Gwala Waterproofing KZN",
    city: "Durban",
    province: "KZN",
    goals: ["damp-repair", "tiling", "plumbing"],
    rating: 4.6,
    reviews: 55,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Roof & wall waterproofing", "Wet area tiling", "Leak detection"],
  },
  // ── Eastern Cape ───────────────────────────────────────────────────────────
  {
    id: "ec-001",
    name: "Johan Swanepoel",
    company: "Swanepoel Builders PE",
    city: "Gqeberha",
    province: "EC",
    goals: ["full-makeover", "tiling", "paint"],
    rating: 4.5,
    reviews: 42,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Residential renovations", "Tiling", "Interior paint"],
  },
  {
    id: "ec-002",
    name: "Lungisa Maqina",
    company: "Maqina Home Improvements",
    city: "East London",
    province: "EC",
    goals: ["paint", "flooring", "prepare-rental-sale"],
    rating: 4.4,
    reviews: 26,
    verifiedBadge: false,
    whatsapp: "27000000000",
    specialties: ["Rental prep", "Painting", "Flooring install"],
  },
  {
    id: "ec-003",
    name: "Ashwin Govender",
    company: "Govender Plumbing EC",
    city: "Gqeberha",
    province: "EC",
    goals: ["plumbing", "damp-repair"],
    rating: 4.6,
    reviews: 38,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Bathroom plumbing", "Leak repairs", "Geyser replacements"],
  },
  {
    id: "ec-004",
    name: "Tamara Smith",
    company: "Smith Electrical EL",
    city: "East London",
    province: "EC",
    goals: ["electrical", "lighting"],
    rating: 4.5,
    reviews: 31,
    verifiedBadge: true,
    whatsapp: "27000000000",
    specialties: ["Domestic wiring", "CoC inspections", "LED lighting"],
  },
];

export function filterContractors(
  location?: string,
  goals?: RenovationGoal[],
): Contractor[] {
  let list = [...CONTRACTORS];

  if (location) {
    const loc = location.toLowerCase();
    const byCity = list.filter(c =>
      loc.includes(c.city.toLowerCase()) ||
      (c.province === "GP" && (loc.includes("johannesburg") || loc.includes("joburg") || loc.includes("jozi") || loc.includes("pretoria") || loc.includes("tshwane") || loc.includes("sandton") || loc.includes("centurion"))) ||
      (c.province === "WC" && (loc.includes("cape town") || loc.includes("capetown") || loc.includes("stellenbosch"))) ||
      (c.province === "KZN" && (loc.includes("durban") || loc.includes("kwazulu"))) ||
      (c.province === "EC" && (loc.includes("port elizabeth") || loc.includes("gqeberha") || loc.includes("east london")))
    );
    if (byCity.length > 0) list = byCity;
  }

  if (goals && goals.length > 0) {
    list = list.sort((a, b) => {
      const aScore = goals.filter(g => a.goals.includes(g)).length;
      const bScore = goals.filter(g => b.goals.includes(g)).length;
      return bScore - aScore;
    });
  }

  return list.slice(0, 6);
}
