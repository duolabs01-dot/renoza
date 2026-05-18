import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://renoza.vercel.app"),
  title: "Renoza — Know what your renovation should cost",
  description:
    "Built for South African homeowners. Get a Rand range, spot the red flags, and send any contractor a WhatsApp brief that puts you in charge — before anyone asks for a deposit.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Know what your renovation should cost. Before the contractor does.",
    description:
      "Real Rand ranges, red flag detection, and a WhatsApp brief that puts SA homeowners in charge — before anyone asks for a deposit.",
    url: "https://renoza.vercel.app",
    siteName: "Renoza",
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Know what your renovation should cost. Before the contractor does.",
    description:
      "Real Rand ranges, red flag detection, and a WhatsApp brief that puts SA homeowners in charge.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Nav />
        {children}
        <footer className="border-t border-charcoal/10 bg-canvas px-6 py-8 text-center text-xs leading-6 font-medium text-charcoal-light">
          Renoza — built in South Africa, for South African homeowners. Numbers here are estimates, not quotes. Always get two itemised quotes from registered contractors before signing anything.
        </footer>
      </body>
    </html>
  );
}
