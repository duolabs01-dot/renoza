import type { Contractor } from "@/lib/contractors";
import type { RenovationGoal } from "@/lib/types";
import { GOAL_LABELS } from "@/lib/types";
import { MessageCircle, BadgeCheck } from "lucide-react";

interface Props {
  contractor: Contractor;
  whatsappBrief: string;
  highlightGoals?: RenovationGoal[];
}

export default function ContractorCard({ contractor, whatsappBrief, highlightGoals }: Props) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(contractor.rating) ? "★" : "☆").join("");
  const waLink = `https://wa.me/${contractor.whatsapp}?text=${encodeURIComponent(
    whatsappBrief || `Hi, found you on Renoza and looking to get a renovation quote. Got a minute to chat?`
  )}`;

  return (
    <div className="flex flex-col gap-4 rounded-[20px] border border-canvas-dark bg-white p-5">
      {/* Demo label */}
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-canvas-dark bg-canvas px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-charcoal-light">
          Demo contractor profile
        </span>
        {contractor.verifiedBadge && (
          <span className="flex items-center gap-1 rounded-full border border-petrol-light/40 bg-petrol-light/10 px-2.5 py-0.5 text-[10px] font-bold text-petrol-dark">
            <BadgeCheck className="h-3 w-3" />
            Demo verified
          </span>
        )}
      </div>

      {/* Name + rating */}
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-petrol-light/20 text-base font-bold text-petrol-dark">
          {contractor.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-charcoal">{contractor.name}</p>
          <p className="text-xs text-charcoal-light">{contractor.company} · {contractor.city}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="text-xs text-amber-500">{stars}</span>
            <span className="text-xs text-charcoal-light">{contractor.rating} ({contractor.reviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Goals badges */}
      <div className="flex flex-wrap gap-1.5">
        {contractor.goals.map(g => {
          const highlighted = highlightGoals?.includes(g);
          return (
            <span
              key={g}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                highlighted
                  ? "bg-petrol-dark text-white"
                  : "border border-canvas-dark bg-canvas text-charcoal-light"
              }`}
            >
              {GOAL_LABELS[g]}
            </span>
          );
        })}
      </div>

      {/* WhatsApp CTA */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
      >
        <MessageCircle className="h-4 w-4" />
        Send the brief on WhatsApp
      </a>
    </div>
  );
}
