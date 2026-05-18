export interface SponsorProduct {
  id: number;
  brand: string;
  name: string;
  type: string;
  size: string;
  price: string;
  rating: number;
  retailer: string;
  tags: string[];
}

export interface FeaturedContractor {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  specialties: string[];
  verified: boolean;
}

export interface SponsorBrand {
  name: string;
  color: string;
  mark: string;
  logo?: string;
}

export const SPONSOR_PRODUCTS: SponsorProduct[] = [
  { id: 1, brand: "Plascon", name: "Double Velvet Interior Paint", type: "Interior Paint", size: "10L", price: "R389", rating: 4, retailer: "Builders Warehouse", tags: ["paint"] },
  { id: 2, brand: "CTM", name: "Sandstone Floor Tile 600×600", type: "Floor Tile", size: "per m²", price: "R189", rating: 5, retailer: "CTM", tags: ["tiling", "flooring"] },
  { id: 3, brand: "Dulux", name: "Weatherguard Exterior", type: "Exterior Paint", size: "5L", price: "R549", rating: 4, retailer: "Builders Warehouse", tags: ["paint"] },
  { id: 4, brand: "Italtile", name: "Lusso Porcelain 800×800", type: "Porcelain Tile", size: "per m²", price: "R349", rating: 5, retailer: "Italtile", tags: ["tiling", "flooring"] },
  { id: 5, brand: "Eurolux", name: "LED Downlight 3-Pack", type: "LED Lighting", size: "3 × 5W", price: "R279", rating: 4, retailer: "Builders Warehouse", tags: ["lighting", "electrical"] },
  { id: 6, brand: "Floorworx", name: "Oak-Effect LVP Planks", type: "Vinyl Flooring", size: "per m²", price: "R219", rating: 4, retailer: "Cashbuild", tags: ["flooring"] },
];

export const FEATURED_CONTRACTORS: FeaturedContractor[] = [
  { id: 1, name: "PremiumBuild (Pty) Ltd", location: "Johannesburg", rating: 5, reviews: 47, specialties: ["Kitchens", "Bathrooms"], verified: true },
  { id: 2, name: "Cape Renovations Co.", location: "Cape Town", rating: 4, reviews: 31, specialties: ["Full Makeovers", "Painting"], verified: true },
  { id: 3, name: "Durban Home Works", location: "Durban", rating: 5, reviews: 23, specialties: ["Tiling", "Plumbing"], verified: false },
];

export const SPONSOR_BRANDS: SponsorBrand[] = [
  { name: "Plascon",      color: "#1a4a8a", mark: "PL",  logo: "/logos/plascon.png"      },
  { name: "CTM",          color: "#c41e3a", mark: "CTM", logo: "/logos/ctm.jpg"           },
  { name: "Builders",     color: "#e05c00", mark: "BW",  logo: "/logos/builders.png"     },
  { name: "Leroy Merlin", color: "#5a9e1a", mark: "LM",  logo: "/logos/leroymerlin.svg"   },
  { name: "Cashbuild",    color: "#d92c1c", mark: "CB",  logo: "/logos/cashbuild.svg"    },
  { name: "Italtile",     color: "#2a2a2a", mark: "IT",  logo: "/logos/italtile.png"      },
  { name: "Dulux",        color: "#003087", mark: "DLX", logo: "/logos/dulux.png"         },
  { name: "Eurolux",      color: "#d4930a", mark: "EU",  logo: "/logos/eurolux.jpg"      },
];
