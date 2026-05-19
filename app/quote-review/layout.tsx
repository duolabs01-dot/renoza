import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Is this contractor quote fair? — Renoza",
  description:
    "Paste a WhatsApp, email, or scribbled list from a contractor. We'll show you what's missing, what to push back on, and the exact questions to send before anyone touches your deposit.",
  alternates: { canonical: "https://renoza.vercel.app/quote-review" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
