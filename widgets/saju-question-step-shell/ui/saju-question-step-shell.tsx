import type { ReactNode } from "react";

import {
  FORM_STEPS,
  FORM_STEP_LABELS,
} from "@/shared/config/form-steps";
import type { FormStep } from "@/shared/types/saju-question-form";

interface SajuQuestionStepShellProps {
  currentStep: FormStep;
  children: ReactNode;
  footer: ReactNode;
  errorMessage?: string | null;
}

export function SajuQuestionStepShell({
  currentStep,
  children,
  footer,
  errorMessage,
}: SajuQuestionStepShellProps) {
  const currentStepIndex = FORM_STEPS.indexOf(currentStep);

  return (
    <section className="py-4 sm:py-6">
      <div className="mx-auto w-full max-w-3xl rounded-[1.75rem] border border-border/70 bg-card/95 p-5 shadow-[0_20px_56px_color-mix(in_oklch,var(--primary)_7%,transparent)] sm:p-7">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="type-caption font-semibold text-muted-foreground">
              단계 {currentStepIndex + 1} / {FORM_STEPS.length}
            </p>
            <h2 className="type-title-md font-semibold text-foreground">
              {FORM_STEP_LABELS[currentStep]}
            </h2>
          </div>

          {children}

          {errorMessage ? (
            <p className="type-body-sm text-destructive">{errorMessage}</p>
          ) : null}

          {footer}
        </div>
      </div>
    </section>
  );
}
