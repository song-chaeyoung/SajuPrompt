import { Button } from "@/components/ui/button";
import { MODE_OPTIONS } from "@/features/select-analysis-mode/config/mode-options";
import type { AnalysisMode } from "@/shared/types/saju-question-form";

interface AnalysisModeSelectorProps {
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
      variant={isActive ? "secondary" : "outline"}
      onClick={() => onSelect(value)}
      className="h-auto w-full flex-col items-start justify-start gap-2 rounded-2xl px-5 py-4 text-left whitespace-normal"
    >
      <span className="type-body w-full font-semibold leading-snug break-keep">
        {label}
      </span>
      <span
        className={`type-body-sm w-full break-keep leading-relaxed whitespace-normal ${
          isActive ? "text-foreground/72" : "text-muted-foreground"
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
