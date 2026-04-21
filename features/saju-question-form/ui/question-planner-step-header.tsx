import { STEP_LABELS } from "@/features/saju-question-form/config/step-labels";
import { FORM_STEPS } from "@/shared/config/form-steps";

interface QuestionPlannerStepHeaderProps {
  currentStepIndex: number;
  currentStep: (typeof FORM_STEPS)[number];
}

export function QuestionPlannerStepHeader({
  currentStepIndex,
  currentStep,
}: QuestionPlannerStepHeaderProps) {
  return (
    <div className="space-y-2">
      <p className="type-caption font-semibold text-muted-foreground">
        단계 {currentStepIndex + 1} / {FORM_STEPS.length}
      </p>
      <h2 className="type-title-md font-semibold text-foreground">
        {STEP_LABELS[currentStep]}
      </h2>
    </div>
  );
}
