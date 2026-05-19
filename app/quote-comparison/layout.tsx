import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare contractor quotes — Renoza",
  description:
    "Three quotes, three different numbers. Paste them in. We'll show you which is honest, which is hiding scope, and which has the small print that'll cost you later.",
  alternates: { canonical: "https://renoza.vercel.app/quote-comparison" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
