import type { MetadataRoute } from "next";

const SITE = "https://renoza.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE,                        lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE}/projects/new`,      lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/quote-review`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/quote-comparison`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/contractors`,       lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
  ];
}
