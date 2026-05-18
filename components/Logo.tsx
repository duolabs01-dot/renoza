import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  size?: number;
  inverse?: boolean;
}

export function LogoMark({ className, size = 40, inverse = false }: LogoMarkProps) {
  const petrol = inverse ? "#ffffff" : "#1e5541";
  const clay = inverse ? "#d8cbb8" : "#9b8b72";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden="true"
    >
      <path d="M15 60V38L44 15L83 60" stroke={petrol} strokeWidth="7.5" strokeLinejoin="miter" />
      <path d="M31 60V29" stroke={petrol} strokeWidth="7.5" />
      <path
        d="M43 15L72 41C79 47 84 55 93 60H79C72 60 67 55 61 49L41 30"
        fill={petrol}
      />
      <path
        d="M58 6H72C88 6 94 17 89 29C86 36 78 40 68 40C78 45 84 54 91 60H80C72 52 64 44 54 40C63 39 71 36 76 31C83 23 79 11 65 9L58 8V6Z"
        fill={petrol}
      />
      <path
        d="M16 38L44 15L83 60"
        stroke={inverse ? "#f8f3eb" : "#ffffff"}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <rect x="40" y="38" width="7" height="7" rx="1" fill={clay} />
      <rect x="51" y="38" width="7" height="7" rx="1" fill={clay} />
      <rect x="40" y="49" width="7" height="7" rx="1" fill={clay} />
      <rect x="51" y="49" width="7" height="7" rx="1" fill={clay} />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  markSize?: number;
  showWordmark?: boolean;
}

export function Logo({ className, markSize = 36, showWordmark = true }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="grid place-items-center rounded-xl bg-white p-1 shadow-md shadow-petrol-dark/15">
        <LogoMark size={markSize} />
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-2xl font-semibold tracking-normal text-charcoal sm:text-3xl">
            Renoza
          </span>
          <span className="mt-1 hidden text-[8px] font-bold uppercase tracking-[0.22em] text-charcoal-light sm:block">
            Plans before contractors
          </span>
        </span>
      )}
    </span>
  );
}
