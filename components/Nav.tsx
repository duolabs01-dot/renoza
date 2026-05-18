"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { href: "/projects", label: "My Projects" },
  { href: "/projects/new", label: "New Plan" },
  { href: "/quote-review", label: "Quote Review" },
  { href: "/quote-comparison", label: "Compare Quotes" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-canvas/90 backdrop-blur-2xl">
      <div className="container-page flex h-14 items-center justify-between sm:h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-petrol-dark text-xs font-bold tracking-tight text-white shadow-md shadow-petrol-dark/20 sm:h-9 sm:w-9">
            RZ
          </span>
          <span className="font-display text-lg font-semibold text-charcoal sm:text-xl">
            Renoza
          </span>
        </Link>

        {/* Desktop pill nav — hidden on mobile */}
        <nav className="hidden items-center gap-1 rounded-full border border-charcoal/10 bg-white/70 p-1 text-sm shadow-sm md:flex">
          {links.map((link) => {
            const active = pathname === link.href || (link.href === "/projects" && pathname.startsWith("/projects") && pathname !== "/projects/new");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active ? "text-white" : "text-charcoal-light hover:text-petrol-dark"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-petrol-dark"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile: CTA + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-petrol-dark px-3.5 py-2 text-xs font-bold text-white"
          >
            New plan <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="grid h-9 w-9 place-items-center rounded-xl border border-charcoal/10 bg-white text-charcoal"
              aria-label="Open menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-canvas p-0">
              <div className="flex h-full flex-col">
                {/* Sheet header */}
                <div className="flex items-center gap-2.5 border-b border-charcoal/10 px-5 py-4">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-petrol-dark text-xs font-bold text-white">
                    RZ
                  </span>
                  <span className="font-display text-lg font-semibold text-charcoal">Renoza</span>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col gap-1 p-4">
                  {links.map((link) => {
                    const active = pathname === link.href || (link.href === "/projects" && pathname.startsWith("/projects") && pathname !== "/projects/new");
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors ${
                          active
                            ? "bg-petrol-dark text-white"
                            : "text-charcoal-light hover:bg-white hover:text-charcoal"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Bottom CTA */}
                <div className="mt-auto border-t border-charcoal/10 p-4">
                  <Link
                    href="/projects/new"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-petrol-dark py-3.5 text-sm font-bold text-white"
                  >
                    Start a new plan <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
