import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { MODE_OPTIONS } from "@/features/select-analysis-mode/config/mode-options";
import type { AnalysisMode } from "@/shared/types/saju-question-form";

interface AnalysisModeSelectorProps {
  activeMode: AnalysisMode;
  onSelect: (mode: AnalysisMode) => void;
}

interface ModeButtonProps {
  index: number;
  value: AnalysisMode;
  activeMode: AnalysisMode;
  label: string;
  description: string;
  onSelect: (mode: AnalysisMode) => void;
}

function ModeButton({
  index,
  value,
  activeMode,
  label,
  description,
  onSelect,
}: ModeButtonProps) {
  const isActive = activeMode === value;

  return (
    <Button
      type="button"
      variant={isActive ? "secondary" : "outline"}
      onClick={() => onSelect(value)}
      className={cn(
        "group relative h-auto min-h-[10rem] w-full flex-col items-start justify-start gap-3 overflow-hidden rounded-[1.75rem] px-5 py-5 text-left whitespace-normal transition-all duration-300 hover:-translate-y-0.5 sm:min-h-[11rem]",
        isActive
          ? "border-[color-mix(in_oklch,var(--primary)_22%,var(--accent)_18%)] bg-[color-mix(in_oklch,var(--primary)_8%,var(--background)_92%)] shadow-[0_22px_42px_color-mix(in_oklch,var(--primary)_14%,transparent)]"
          : "border-border/75 bg-[color-mix(in_oklch,var(--background)_96%,var(--card)_4%)] shadow-[0_16px_32px_color-mix(in_oklch,var(--foreground)_4%,transparent)] hover:border-primary/16 hover:bg-[color-mix(in_oklch,var(--background)_93%,var(--primary)_7%)] dark:shadow-[0_18px_36px_color-mix(in_oklch,var(--foreground)_8%,transparent)]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-[-1.75rem] top-[-1.5rem] h-24 w-24 rounded-full blur-3xl transition-opacity duration-300",
          isActive
            ? "bg-[color-mix(in_oklch,var(--primary)_16%,transparent)] opacity-100"
            : "bg-[color-mix(in_oklch,var(--primary)_10%,transparent)] opacity-75 group-hover/button:opacity-100",
        )}
      />
      <span className="relative flex w-full items-center gap-3">
        <span className="type-caption font-semibold tracking-[0.18em] text-primary/76">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          aria-hidden
          className={cn(
            "h-px flex-1",
            isActive
              ? "bg-[color-mix(in_oklch,var(--primary)_26%,transparent)]"
              : "bg-[color-mix(in_oklch,var(--border)_72%,transparent)]",
          )}
        />
      </span>
      <span className="relative type-body w-full font-semibold leading-snug break-keep">
        {label}
      </span>
      <span
        className={`relative type-body-sm w-full break-keep leading-relaxed whitespace-normal ${
          isActive ? "text-foreground/84" : "text-muted-foreground"
        }`}
      >
        {description}
      </span>
    </Button>
  );
}

export function AnalysisModeSelector({
  activeMode,
  onSelect,
}: AnalysisModeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
      {MODE_OPTIONS.map((option, index) => (
        <ModeButton
          key={option.value}
          index={index}
          value={option.value}
          activeMode={activeMode}
          label={option.label}
          description={option.description}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
