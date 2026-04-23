import { cn } from "@/shared/lib/utils";

interface HeroOrbitOrnamentProps {
  className?: string;
}

export function HeroOrbitOrnament({
  className,
}: HeroOrbitOrnamentProps) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full opacity-70", className)}
      style={{ color: "var(--hero-ornament)" }}
    >
      <circle cx="160" cy="160" r="132" stroke="currentColor" strokeWidth="1" />
      <circle
        cx="160"
        cy="160"
        r="102"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="5 9"
      />
      <circle cx="160" cy="160" r="70" stroke="currentColor" strokeWidth="0.9" />
      <line
        x1="160"
        y1="24"
        x2="160"
        y2="296"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <line
        x1="24"
        y1="160"
        x2="296"
        y2="160"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <line
        x1="63"
        y1="63"
        x2="257"
        y2="257"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <line
        x1="257"
        y1="63"
        x2="63"
        y2="257"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <circle cx="160" cy="124" r="34" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="160" cy="196" r="34" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="160" cy="106" r="15" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="160" cy="214" r="15" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}
