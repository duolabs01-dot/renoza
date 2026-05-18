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
  title: "Renoza - AI Renovation Planner for South African Homes",
  description:
    "From room photo to fair quote. Renoza helps South African homeowners plan renovations, check contractor quotes, and build WhatsApp-ready briefs.",
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
        <footer className="border-t border-charcoal/10 bg-canvas px-6 py-8 text-center text-xs font-medium text-charcoal-light">
          Renoza - AI renovation planning for South African homes. Prices are estimates only. Always get at least two itemised quotes.
        </footer>
      </body>
    </html>
  );
}
