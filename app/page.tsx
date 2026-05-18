import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16">

      {/* Hero */}
      <div className="mb-12">
        <p className="text-sm font-medium text-petrol-600 uppercase tracking-widest mb-3">
          AI renovation planning for South African homes
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal leading-tight mb-4">
          From room photo to fair quote.
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
          Renoza turns your budget and goals into a practical renovation plan —
          complete with rand-based cost ranges, a materials list, and a
          contractor-ready WhatsApp brief.
        </p>
      </div>

      {/* Primary actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14 max-w-2xl">
        <Link
          href="/projects/new"
          className="flex flex-col gap-3 rounded-xl bg-petrol-700 text-white p-6 hover:bg-petrol-800 transition-colors"
        >
          <span className="text-2xl">🏠</span>
          <div>
            <div className="font-semibold text-base mb-1">
              Start renovation plan
            </div>
            <div className="text-sm text-petrol-200 leading-snug">
              Upload photos, set a budget, and get a practical scope with
              rand-based cost ranges.
            </div>
          </div>
        </Link>

        <Link
          href="/quote-review"
          className="flex flex-col gap-3 rounded-xl bg-white border border-canvas-dark text-charcoal p-6 hover:border-petrol-300 hover:shadow-sm transition-all"
        >
          <span className="text-2xl">🔍</span>
          <div>
            <div className="font-semibold text-base mb-1">
              Check a contractor quote
            </div>
            <div className="text-sm text-muted leading-snug">
              Paste a quote and get a plain-language review — red flags, missing
              items, and questions to ask.
            </div>
          </div>
        </Link>
      </div>

      {/* What Renoza does */}
      <div className="mb-14">
        <h2 className="text-lg font-semibold text-charcoal mb-5">
          What you get
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: "💰",
              title: "Rand-based budgets",
              body: "Cost ranges based on South African market rates. No fake precision — broad bands that reflect real-world variation.",
            },
            {
              icon: "📋",
              title: "Contractor briefs",
              body: "A WhatsApp-ready message with your scope, goals, and questions pre-written. Send it to three contractors in minutes.",
            },
            {
              icon: "🛡️",
              title: "Quote protection",
              body: "Spot vague language, risky deposits, missing CoC requirements, and hidden costs before you sign anything.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-canvas-dark bg-white p-5"
            >
              <div className="text-xl mb-3">{item.icon}</div>
              <div className="font-semibold text-sm text-charcoal mb-1">
                {item.title}
              </div>
              <div className="text-sm text-muted leading-relaxed">{item.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* South African context note */}
      <div className="rounded-xl bg-petrol-50 border border-petrol-100 p-5 max-w-2xl">
        <p className="text-sm text-petrol-800 leading-relaxed">
          <strong>Built for South Africa.</strong> All prices are in rand.
          Renoza understands local home realities — damp, load shedding prep,
          CoC requirements, and the difference between a paint job and a
          plastering job. Budget ranges are broad because material costs and
          labour rates vary significantly across provinces.
        </p>
      </div>
    </div>
  );
}
