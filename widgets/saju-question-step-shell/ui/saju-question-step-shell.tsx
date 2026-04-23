import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import {
  FORM_STEPS,
  FORM_STEP_LABELS,
} from "@/shared/config/form-steps";
import type { FormStep } from "@/shared/types/saju-question-form";
import { HeroOrbitOrnament } from "@/shared/ui/hero-orbit-ornament";

interface SajuQuestionStepShellProps {
  currentStep: FormStep;
  children: ReactNode;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  errorMessage?: string | null;
  visualVariant?: "default" | "hero";
}

export function SajuQuestionStepShell({
  currentStep,
  children,
  primaryAction,
  secondaryActions,
  errorMessage,
  visualVariant = "default",
}: SajuQuestionStepShellProps) {
  const currentStepIndex = FORM_STEPS.indexOf(currentStep);
  const hasActionArea = Boolean(primaryAction || secondaryActions);
  const isHeroVariant = visualVariant === "hero";

  return (
    <div className="relative">
      <section
        className={cn(
          isHeroVariant
            ? "pb-[calc(7.25rem+env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top)+0.5rem)] sm:pb-8 sm:pt-[calc(env(safe-area-inset-top)+2rem)]"
            : "py-4 sm:py-6",
          primaryAction
            ? "pb-[calc(7.75rem+env(safe-area-inset-bottom))] sm:pb-6"
            : undefined,
        )}
      >
        <div
          className={cn(
            "mx-auto w-full",
            isHeroVariant ? "max-w-4xl" : "max-w-3xl",
          )}
        >
          <div className="relative">
            {isHeroVariant ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 [overflow-x:clip]"
              >
                <div
                  className="absolute right-[-4rem] top-[-2.5rem] h-48 w-48 rounded-full bg-[var(--hero-halo)] blur-[88px] sm:right-[-2.5rem] sm:top-[-3rem] sm:h-[17rem] sm:w-[17rem]"
                />
                <div
                  className="absolute left-[-3.25rem] top-24 h-52 w-52 rounded-full bg-[color-mix(in_oklch,var(--primary)_12%,transparent)] blur-[104px] sm:h-64 sm:w-64"
                />
                <div
                  className="absolute right-[-1.75rem] top-6 h-52 w-52 sm:right-[-0.75rem] sm:top-0 sm:h-72 sm:w-72"
                >
                  <HeroOrbitOrnament className="hero-ornament-reveal" />
                </div>
                <span
                  className="absolute left-[10%] top-[11%] size-1.5 rounded-full bg-[var(--hero-dust)]"
                />
                <span
                  className="absolute right-[22%] top-[16%] size-1 rounded-full bg-[var(--hero-dust)]"
                />
                <span
                  className="absolute left-[40%] top-[7%] size-1 rounded-full bg-[var(--hero-dust)]"
                />
              </div>
            ) : null}

            <div
              className={cn(
                "relative rounded-[2rem] border p-5 sm:p-7",
                isHeroVariant
                  ? "mx-auto max-w-3xl border-[color-mix(in_oklch,var(--primary)_10%,var(--border)_90%)] bg-[color-mix(in_oklch,var(--card)_94%,var(--background)_6%)] shadow-[0_28px_72px_color-mix(in_oklch,var(--primary)_10%,transparent)]"
                  : "border-border/75 bg-[color-mix(in_oklch,var(--card)_95%,var(--background)_5%)] shadow-[0_24px_60px_color-mix(in_oklch,var(--primary)_8%,transparent)] dark:border-border/95 dark:bg-[color-mix(in_oklch,var(--card)_97%,var(--background)_3%)]",
              )}
            >
              <div className="space-y-6 sm:space-y-7">
                <div className={cn("space-y-3", isHeroVariant && "space-y-4")}>
                  {isHeroVariant ? (
                    <div className="flex items-center gap-3">
                      <span className="h-px w-7 bg-primary/35" />
                      <span className="type-caption font-semibold tracking-[0.18em] text-primary/80">
                        AI SAJU QUESTION DESIGNER
                      </span>
                    </div>
                  ) : null}

                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[color-mix(in_oklch,var(--primary)_7%,var(--background)_93%)] px-3 py-1.5 text-[0.8125rem] font-semibold tracking-[0.04em] text-[color:color-mix(in_oklch,var(--foreground)_82%,var(--primary)_18%)] dark:border-primary/28 dark:bg-[color-mix(in_oklch,var(--primary)_14%,var(--background)_86%)] dark:text-[color:color-mix(in_oklch,var(--foreground)_88%,var(--primary)_12%)]">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-accent/80"
                      />
                      단계 {currentStepIndex + 1} / {FORM_STEPS.length}
                    </div>

                    <div className="space-y-2">
                      <h2
                        className={cn(
                          "type-title-md font-semibold text-foreground",
                          isHeroVariant && "max-w-[14ch] tracking-[-0.03em]",
                        )}
                      >
                        {FORM_STEP_LABELS[currentStep]}
                      </h2>
                    </div>
                  </div>
                </div>

                {children}

                {errorMessage ? (
                  <div className="rounded-[1.125rem] border border-destructive/20 bg-destructive/6 px-4 py-3">
                    <p className="type-body-sm text-destructive">{errorMessage}</p>
                  </div>
                ) : null}

                {hasActionArea ? (
                  <div className="border-t border-border/75 dark:border-border/95 pt-4 sm:pt-5">
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

                      {primaryAction ? (
                        <div className="fixed inset-x-0 bottom-0 z-30 bg-[linear-gradient(to_top,var(--background)_58%,transparent)] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:static sm:z-auto sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0">
                          <div className="mx-auto w-full max-w-3xl sm:mx-0 sm:max-w-none sm:w-auto sm:min-w-[15rem]">
                            {primaryAction}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
