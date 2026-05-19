import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Renoza — Plans before contractors",
    short_name: "Renoza",
    description:
      "Know what your renovation should cost. Rand range, risk list, and a WhatsApp brief — built for South African homeowners.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#faf8f5",
    theme_color: "#1e5541",
    lang: "en-ZA",
    categories: ["productivity", "lifestyle", "utilities"],
    icons: [
      { src: "/favicon.svg",  sizes: "any",   type: "image/svg+xml", purpose: "any" },
      { src: "/favicon.svg",  sizes: "192x192", type: "image/svg+xml", purpose: "maskable" },
      { src: "/favicon.svg",  sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
