import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  size?: number;
}

export function LogoMark({ className, size = 40 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden="true"
    >
      {/* R left spine */}
      <line x1="5" y1="4" x2="5" y2="44" stroke="#1e5541" strokeWidth="6" strokeLinecap="round" />
      {/* R bowl arc */}
      <path
        d="M8,4 C28,4 34,12 34,18 C34,24 26,27 16,27 L8,27"
        stroke="#1e5541"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Window squares (2×2 grid) in bowl */}
      <rect x="10" y="11" width="3.5" height="3.5" rx="0.5" fill="#9b7e5c" />
      <rect x="14.5" y="11" width="3.5" height="3.5" rx="0.5" fill="#9b7e5c" />
      <rect x="10" y="15.5" width="3.5" height="3.5" rx="0.5" fill="#9b7e5c" />
      <rect x="14.5" y="15.5" width="3.5" height="3.5" rx="0.5" fill="#9b7e5c" />
      {/* Roofline peak from junction point */}
      <path
        d="M10,42 L22,27 L38,44"
        stroke="#1e5541"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Center post (door/chimney) */}
      <line x1="22" y1="33" x2="22" y2="44" stroke="#1e5541" strokeWidth="3.5" strokeLinecap="round" />
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
      <span className="grid place-items-center rounded-xl bg-canvas p-1 shadow-md shadow-petrol-dark/15">
        <LogoMark size={markSize} />
      </span>
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-charcoal sm:text-xl">
          Renoza
        </span>
      )}
    </span>
  );
}
