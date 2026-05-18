import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-[calc(100vh-3.5rem)] place-items-center px-6">
      <div className="max-w-lg text-center">
        <p className="eyebrow mb-3">404</p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
          This page got demolished.
        </h1>
        <p className="mt-5 text-base leading-7 text-charcoal-light">
          Wrong URL, broken link, or something we&apos;ve since pulled down. Either way, nothing here. Head back and start over.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-petrol-dark px-5 py-3 text-sm font-bold text-white shadow-xl shadow-petrol-dark/20"
          >
            <Home className="h-4 w-4" /> Back to home
          </Link>
          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/10 bg-white px-5 py-3 text-sm font-bold text-charcoal-light"
          >
            Build a plan instead <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
