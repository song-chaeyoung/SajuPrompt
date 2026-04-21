import type { FormStep } from "@/shared/types/saju-question-form";

export const FORM_STEPS: FormStep[] = [
  "mode",
  "saju",
  "goal",
  "style",
  "review",
];

export const LAST_STEP_INDEX = FORM_STEPS.length - 1;
