import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a renovation contractor — Renoza",
  description:
    "Browse SA renovation contractors by province and specialty. NHBRC registration, real references, and quote review — the due diligence that protects your deposit.",
  alternates: { canonical: "https://renoza.vercel.app/contractors" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
