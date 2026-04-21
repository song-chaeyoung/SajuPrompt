import { Button } from "@/components/ui/button";
import { MODE_OPTIONS } from "@/features/saju-question-form/config/mode-options";
import type { AnalysisMode } from "@/shared/types/saju-question-form";

interface ModeStepProps {
  activeMode: AnalysisMode;
  onSelect: (mode: AnalysisMode) => void;
}

interface ModeButtonProps {
  value: AnalysisMode;
  activeMode: AnalysisMode;
  label: string;
  description: string;
  onSelect: (mode: AnalysisMode) => void;
}

function ModeButton({
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
      variant={isActive ? "default" : "outline"}
      onClick={() => onSelect(value)}
      className="h-auto min-h-20 w-full items-start justify-start gap-2 px-4 py-3.5 text-left sm:min-h-24"
    >
      <span className="type-body font-semibold">{label}</span>
      <span
        className={`type-body-sm leading-snug ${
          isActive ? "text-accent-foreground/75" : "text-muted-foreground"
        }`}
      >
        {description}
      </span>
    </Button>
  );
}

export function ModeStep({ activeMode, onSelect }: ModeStepProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {MODE_OPTIONS.map((option) => (
        <ModeButton
          key={option.value}
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
