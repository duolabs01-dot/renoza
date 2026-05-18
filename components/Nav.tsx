"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href ? "text-petrol-800 font-semibold" : "text-charcoal-light hover:text-petrol-700";

  return (
    <header className="border-b border-canvas-dark bg-canvas sticky top-0 z-40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-petrol-700 text-white text-xs font-bold tracking-tight">
            RZ
          </span>
          <span className="font-semibold text-charcoal text-sm tracking-tight">
            Renoza
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/projects/new" className={isActive("/projects/new")}>
            New Plan
          </Link>
          <Link href="/quote-review" className={isActive("/quote-review")}>
            Quote Review
          </Link>
        </nav>
      </div>
    </header>
  );
}
