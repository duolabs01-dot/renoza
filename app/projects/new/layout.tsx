import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build your renovation plan — Renoza",
  description:
    "Five minutes now, thousands saved later. Pick the room, set the budget, get a Rand range, risk list, and a WhatsApp brief ready to send any contractor.",
  alternates: { canonical: "https://renoza.vercel.app/projects/new" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
