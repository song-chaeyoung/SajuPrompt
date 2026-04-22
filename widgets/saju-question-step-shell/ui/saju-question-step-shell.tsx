import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  FORM_STEPS,
  FORM_STEP_LABELS,
} from "@/shared/config/form-steps";
import type { FormStep } from "@/shared/types/saju-question-form";

interface SajuQuestionStepShellProps {
  currentStep: FormStep;
  children: ReactNode;
  desktopPrimaryAction?: ReactNode;
  mobilePrimaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  errorMessage?: string | null;
}

export function SajuQuestionStepShell({
  currentStep,
  children,
  desktopPrimaryAction,
  mobilePrimaryAction,
  secondaryActions,
  errorMessage,
}: SajuQuestionStepShellProps) {
  const currentStepIndex = FORM_STEPS.indexOf(currentStep);
  const hasDesktopActionArea = Boolean(desktopPrimaryAction || secondaryActions);

  return (
    <div className="relative">
      <section
        className={cn(
          "py-4 sm:py-6",
          mobilePrimaryAction
            ? "pb-[calc(7.75rem+env(safe-area-inset-bottom))] sm:pb-6"
            : undefined,
        )}
      >
        <div className="mx-auto w-full max-w-3xl rounded-[2rem] border border-border/70 bg-[color-mix(in_oklch,var(--card)_94%,var(--background)_6%)] p-5 shadow-[0_24px_60px_color-mix(in_oklch,var(--primary)_8%,transparent)] sm:p-7">
          <div className="space-y-6 sm:space-y-7">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-[color-mix(in_oklch,var(--primary)_5%,var(--background)_95%)] px-3 py-1.5 text-[0.8125rem] font-semibold tracking-[0.04em] text-[color:color-mix(in_oklch,var(--foreground)_74%,var(--primary)_26%)]">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-accent/80"
                />
                단계 {currentStepIndex + 1} / {FORM_STEPS.length}
              </div>

              <div className="space-y-2">
                <h2 className="type-title-md font-semibold text-foreground">
                  {FORM_STEP_LABELS[currentStep]}
                </h2>
              </div>
            </div>

            {children}

            {errorMessage ? (
              <div className="rounded-[1.125rem] border border-destructive/20 bg-destructive/6 px-4 py-3">
                <p className="type-body-sm text-destructive">{errorMessage}</p>
              </div>
            ) : null}

            {hasDesktopActionArea ? (
              <div className="border-t border-border/70 pt-4 sm:pt-5">
                {secondaryActions ? (
                  <div className="flex flex-wrap items-center justify-end gap-2 sm:hidden">
                    {secondaryActions}
                  </div>
                ) : null}

                <div
                  className={cn(
                    "hidden sm:flex sm:flex-wrap sm:items-center sm:gap-3",
                    secondaryActions ? "sm:justify-between" : "sm:justify-end",
                  )}
                >
                  {secondaryActions ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {secondaryActions}
                    </div>
                  ) : null}

                  {desktopPrimaryAction ? (
                    <div className="w-full sm:w-auto sm:min-w-[13rem]">
                      {desktopPrimaryAction}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {mobilePrimaryAction ? (
        <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:hidden">
          <div className="mx-auto w-full max-w-3xl">
            {mobilePrimaryAction}
          </div>
        </div>
      ) : null}
    </div>
  );
}
