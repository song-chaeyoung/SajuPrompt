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
    <div className="space-y-1">
      <p className="text-xs font-semibold tracking-wide text-zinc-500">
        단계 {currentStepIndex + 1} / {FORM_STEPS.length}
      </p>
      <h2 className="text-lg font-semibold text-zinc-900">
        {STEP_LABELS[currentStep]}
      </h2>
    </div>
  );
}
