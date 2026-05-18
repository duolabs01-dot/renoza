"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/projects", label: "My Projects" },
  { href: "/projects/new", label: "New Plan" },
  { href: "/quote-review", label: "Quote Review" },
  { href: "/quote-comparison", label: "Compare Quotes" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-canvas/88 backdrop-blur-2xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-petrol-dark text-xs font-bold tracking-tight text-white shadow-lg shadow-petrol-dark/20">
            RZ
          </span>
          <span className="font-display text-xl font-semibold text-charcoal">
            Renoza
          </span>
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-charcoal/10 bg-white/70 p-1 text-sm shadow-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 font-semibold transition-colors ${
                  active ? "text-white" : "text-charcoal-light hover:text-petrol-dark"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-petrol-dark"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
