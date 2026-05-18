import type { FeaturedContractor } from "@/lib/sponsors";

export default function ContractorTile({ contractor }: { contractor: FeaturedContractor }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < contractor.rating ? "★" : "☆").join("");

  return (
    <div className="card-hover min-w-[280px] shrink-0 rounded-[20px] border border-canvas-dark bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full border border-canvas-dark bg-canvas px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-charcoal-light">
          Demo profile · {contractor.location}
        </span>
        {contractor.verified && (
          <span className="rounded-full border border-petrol-light/40 bg-petrol-light/10 px-2.5 py-0.5 text-[10px] font-bold text-petrol-dark">
            Demo verified
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-petrol-light/20 text-base font-bold text-petrol-dark">
          {contractor.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-charcoal">{contractor.name}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="text-xs text-amber-500">{stars}</span>
            <span className="text-xs text-charcoal-light">{contractor.reviews} reviews</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {contractor.specialties.map((s) => (
          <span key={s} className="rounded-full border border-canvas-dark bg-canvas px-2.5 py-0.5 text-[11px] font-semibold text-charcoal-light">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
