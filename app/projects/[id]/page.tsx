import Link from "next/link";
import { generateRenovationPlan } from "@/lib/mock-ai";
import type { ProjectInput, RenovationPlan } from "@/lib/types";
import { BUDGET_LABELS, ROOM_TYPE_LABELS } from "@/lib/types";
import CopyButton from "@/components/CopyButton";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ data?: string }>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-canvas-dark bg-white p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-petrol-700 uppercase tracking-wide mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-charcoal leading-relaxed">
          <span className="text-petrol-500 mt-0.5 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectResultPage({ params, searchParams }: Props) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);
  const { id } = resolvedParams;
  const { data } = resolvedSearch;

  let input: ProjectInput | null = null;
  let plan: RenovationPlan | null = null;

  if (data) {
    try {
      input = JSON.parse(decodeURIComponent(data)) as ProjectInput;
      plan = generateRenovationPlan(input);
    } catch {
      // fallback to null — error state shown below
    }
  }

  if (!input || !plan) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted text-sm mb-4">
          Could not load project data. Please start a new plan.
        </p>
        <Link
          href="/projects/new"
          className="inline-block px-5 py-2.5 rounded-lg bg-petrol-700 text-white text-sm font-medium"
        >
          New renovation plan
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-medium text-petrol-600 uppercase tracking-widest mb-1">
              Renovation plan
            </p>
            <h1 className="text-2xl font-bold text-charcoal">{input.name}</h1>
            <p className="text-sm text-muted mt-1">
              {ROOM_TYPE_LABELS[input.room_type]} · {input.location} ·{" "}
              {BUDGET_LABELS[input.budget_range]}
            </p>
          </div>
          <Link
            href="/projects/new"
            className="text-sm text-petrol-700 underline underline-offset-2"
          >
            Start new plan
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 rounded-lg bg-clay-50 border border-clay-200 px-4 py-3 text-xs text-clay-700 leading-relaxed">
        Cost estimates are broad ranges based on typical South African market rates. Always get at least two itemised quotes from registered contractors before committing. Renoza is an AI planning tool — not a substitute for professional advice.
      </div>

      <div className="space-y-5">

        {/* Room summary */}
        <Section title="Room Summary">
          <p className="text-sm text-charcoal leading-relaxed">{plan.room_summary}</p>
        </Section>

        {/* Recommended approach */}
        <Section title="Recommended Approach">
          <p className="text-sm text-charcoal leading-relaxed">{plan.recommended_approach}</p>
        </Section>

        {/* Budget realism */}
        <Section title="Budget Realism">
          <p className="text-sm text-charcoal leading-relaxed">{plan.budget_realism}</p>
        </Section>

        {/* Suggested work items */}
        <Section title="Suggested Work Items">
          <div className="space-y-3">
            {plan.work_items.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 py-3 border-b border-canvas-dark last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-charcoal">
                    {item.category}
                  </div>
                  <div className="text-sm text-muted mt-0.5 leading-relaxed">
                    {item.description}
                  </div>
                </div>
                <div className="text-sm font-semibold text-petrol-700 whitespace-nowrap shrink-0">
                  {item.estimated_cost}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-petrol-50 px-4 py-3">
            <span className="text-sm font-semibold text-charcoal">
              Total estimated range
            </span>
            <span className="text-base font-bold text-petrol-800">
              {plan.estimated_cost_range}
            </span>
          </div>
        </Section>

        {/* Materials list */}
        <Section title="Materials List">
          <BulletList items={plan.materials_list} />
        </Section>

        {/* Labour */}
        <Section title="Labour Categories Needed">
          <BulletList items={plan.labour_categories} />
        </Section>

        {/* Risks */}
        <Section title="Risks &amp; Hidden Costs to Watch For">
          <ul className="space-y-2">
            {plan.risks_and_hidden_costs.map((risk, i) => (
              <li key={i} className="flex gap-2 text-sm text-charcoal leading-relaxed">
                <span className="text-clay-500 mt-0.5 shrink-0">⚠</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Questions for contractor */}
        <Section title="Questions to Ask Your Contractor">
          <ol className="space-y-1.5 list-none">
            {plan.questions_for_contractor.map((q, i) => (
              <li key={i} className="flex gap-2 text-sm text-charcoal leading-relaxed">
                <span className="text-petrol-500 font-semibold shrink-0 w-5">
                  {i + 1}.
                </span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* WhatsApp brief */}
        <Section title="WhatsApp Contractor Brief">
          <p className="text-xs text-muted mb-3">
            Copy and send to contractors via WhatsApp to get consistent,
            comparable quotes.
          </p>
          <div className="rounded-lg bg-canvas border border-canvas-dark p-4">
            <pre className="text-sm text-charcoal whitespace-pre-wrap font-sans leading-relaxed">
              {plan.whatsapp_brief}
            </pre>
          </div>
          <CopyButton text={plan.whatsapp_brief} />
        </Section>

      </div>

      {/* Bottom actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/quote-review"
          className="inline-block px-5 py-2.5 rounded-lg bg-petrol-700 text-white text-sm font-medium hover:bg-petrol-800 transition-colors"
        >
          Review a contractor quote →
        </Link>
        <Link
          href="/projects/new"
          className="inline-block px-5 py-2.5 rounded-lg border border-canvas-dark bg-white text-charcoal text-sm font-medium hover:border-petrol-400 transition-colors"
        >
          Plan another room
        </Link>
      </div>

      <p className="mt-6 text-xs text-muted">Project ID: {id}</p>
    </div>
  );
}
