import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Renoza — AI Renovation Planner for South African Homes",
  description:
    "From room photo to fair quote. Renoza helps South African homeowners plan renovations, check contractor quotes, and build WhatsApp-ready briefs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-canvas text-charcoal antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-canvas-dark py-6 text-center text-xs text-muted">
          Renoza — AI renovation planning for South African homes &nbsp;·&nbsp;
          Prices are estimates only. Always get at least two quotes.
        </footer>
      </body>
    </html>
  );
}
