"use client";

import { Check, Copy, RotateCcw, TriangleAlert } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { GENDER_OPTIONS } from "@/entities/saju-profile/config/birth-profile-options";
import {
  type CopyFeedback,
  usePlanSajuQuestion,
} from "@/features/plan-saju-question/model/use-plan-saju-question";
import { MODE_OPTIONS } from "@/features/select-analysis-mode/config/mode-options";
import { GeneratedQuestionPreview } from "@/features/view-generated-question/ui/generated-question-preview";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { CardSequenceLoader } from "@/shared/ui/card-sequence-loader";
import { FORM_STEP_PATHS, FORM_STEPS } from "@/shared/config/form-steps";
import type {
  BirthProfile,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";
import { SajuQuestionStepShell } from "@/widgets/saju-question-step-shell/ui/saju-question-step-shell";

const MIN_RESULT_LOADING_DURATION_MS = 1400;
const RESULT_STEP_NUMBER = FORM_STEPS.indexOf("result") + 1;

type SummaryChip = {
  key: string;
  label: string;
};

function getOptionLabel<T extends string>(
  options: { value: T; label: string }[],
  value: T,
) {
  return options.find((option) => option.value === value)?.label ?? "";
}

function getBirthYearLabel(birthDate: string) {
  const [year] = birthDate.split("-");

  return /^\d{4}$/.test(year ?? "") ? `${year}년생` : "";
}

function getProfileSummary(label: string, profile: BirthProfile) {
  const parts = [label];
  const genderLabel =
    profile.gender === "unknown"
      ? ""
      : getOptionLabel(GENDER_OPTIONS, profile.gender);
  const birthYearLabel = getBirthYearLabel(profile.birthDate);

  if (genderLabel) {
    parts.push(genderLabel);
  }

  if (birthYearLabel) {
    parts.push(birthYearLabel);
  }

  return parts.join(" · ");
}

function getSummaryChips(form: SajuQuestionFormData): SummaryChip[] {
  const chips: SummaryChip[] = [
    {
      key: "mode",
      label: getOptionLabel(MODE_OPTIONS, form.mode),
    },
    {
      key: "me",
      label: getProfileSummary("본인", form.me),
    },
  ];

  if (form.mode === "compatibility") {
    chips.push({
      key: "partner",
      label: getProfileSummary("상대", form.partner),
    });
  }

  return chips.filter((chip) => chip.label);
}

function getCopyAction(copyFeedback: CopyFeedback | null) {
  if (copyFeedback?.type === "success") {
    return {
      Icon: Check,
      label: "복사 완료",
      className:
        "bg-[color-mix(in_oklch,var(--success)_30%,var(--primary)_70%)] shadow-[0_16px_32px_color-mix(in_oklch,var(--success)_28%,transparent)] hover:bg-[color-mix(in_oklch,var(--success)_35%,var(--primary)_65%)]",
    };
  }

  if (copyFeedback?.type === "error") {
    return {
      Icon: TriangleAlert,
      label: "복사 실패",
      className:
        "bg-[color-mix(in_oklch,var(--destructive)_16%,var(--primary)_84%)] shadow-[0_16px_32px_color-mix(in_oklch,var(--destructive)_18%,transparent)] hover:bg-[color-mix(in_oklch,var(--destructive)_20%,var(--primary)_80%)]",
    };
  }

  return {
    Icon: Copy,
    label: "질문문 복사하기",
    className: "",
  };
}

function ResultHeroOrnament() {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hero-ornament-reveal h-full w-full opacity-70"
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

export function SajuQuestionResult() {
  const router = useRouter();
  const hasQueuedGenerationStartedRef = useRef(false);
  const isMountedRef = useRef(true);
  const {
    form,
    generatedQuestion,
    generationStatus,
    generationError,
    isWaitingForResult,
    copyFeedback,
    handleGenerateQuestion,
    handleCopyQuestion,
    handleResetPlanner,
  } = usePlanSajuQuestion();

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      generatedQuestion ||
      generationStatus === "queued" ||
      generationStatus === "loading"
    ) {
      return;
    }

    router.replace(FORM_STEP_PATHS.saju, { scroll: false });
  }, [generatedQuestion, generationStatus, router]);

  useEffect(() => {
    if (
      generationStatus !== "queued" ||
      generatedQuestion ||
      hasQueuedGenerationStartedRef.current
    ) {
      return;
    }

    hasQueuedGenerationStartedRef.current = true;

    void (async () => {
      const didGenerate = await handleGenerateQuestion({
        minDurationMs: MIN_RESULT_LOADING_DURATION_MS,
      });

      if (!didGenerate && isMountedRef.current) {
        router.replace(FORM_STEP_PATHS.saju, { scroll: false });
      }
    })();
  }, [generatedQuestion, generationStatus, handleGenerateQuestion, router]);

  const handleReset = () => {
    handleResetPlanner();
    router.push("/", { scroll: false });
  };

  const handleRegenerate = async () => {
    await handleGenerateQuestion({
      minDurationMs: MIN_RESULT_LOADING_DURATION_MS,
    });
  };

  if (
    generationStatus === "loading" ||
    (!generatedQuestion && isWaitingForResult)
  ) {
    return (
      <SajuQuestionStepShell currentStep="result">
        <section className="flex min-h-72 flex-col items-center justify-center rounded-[calc(var(--radius-3xl)*0.95)] border border-border/70 bg-[color-mix(in_oklch,var(--card)_82%,var(--background)_18%)] px-6 py-10 text-center shadow-[0_18px_40px_color-mix(in_oklch,var(--foreground)_5%,transparent)]">
          <div className="flex max-w-sm flex-col items-center gap-5">
            <CardSequenceLoader size="lg" />

            <div className="space-y-2">
              <h3 className="type-title-sm font-semibold text-foreground">
                질문문을 정리하고 있어요
              </h3>
              <p className="type-body-sm text-muted-foreground">
                입력해 주신 정보를 바탕으로 AI에 바로 붙여 넣을 질문 문장을
                구성하는 중입니다.
              </p>
            </div>
          </div>
        </section>
      </SajuQuestionStepShell>
    );
  }

  if (!generatedQuestion) {
    return null;
  }

  const summaryChips = getSummaryChips(form);
  const copyAction = getCopyAction(copyFeedback);
  const CopyActionIcon = copyAction.Icon;
  const buildCopyButton = (className?: string) => (
    <Button
      type="button"
      size="lg"
      data-icon="inline-start"
      onClick={handleCopyQuestion}
      className={cn(
        "w-full rounded-[1.125rem] shadow-[0_16px_32px_color-mix(in_oklch,var(--primary)_18%,transparent)]",
        copyAction.className,
        className,
      )}
    >
      <CopyActionIcon className="size-4" aria-hidden />
      <span aria-live="polite">{copyAction.label}</span>
    </Button>
  );

  const desktopPrimaryAction = buildCopyButton();
  const mobilePrimaryAction = buildCopyButton();

  const secondaryActions = (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        data-icon="inline-start"
        onClick={handleRegenerate}
        className="h-11 rounded-[1rem] px-4"
      >
        <RotateCcw className="size-4" aria-hidden />
        다시 생성
      </Button>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={handleReset}
        className="h-11 rounded-[1rem] px-4 text-muted-foreground hover:text-foreground"
      >
        처음부터
      </Button>
    </>
  );

  if (generationStatus === "success") {
    return (
      <>
        <section className="pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top)+0.5rem)] sm:pb-10 sm:pt-[calc(env(safe-area-inset-top)+2.5rem)]">
          <div className="relative mx-auto w-full max-w-4xl">
            <div
              aria-hidden
              className="pointer-events-none absolute right-[-4.5rem] top-[-2.5rem] h-52 w-52 rounded-full bg-[var(--hero-halo)] blur-[88px] sm:right-[-2.5rem] sm:top-[-3rem] sm:h-72 sm:w-72"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-[-3.5rem] top-32 h-56 w-56 rounded-full bg-[color-mix(in_oklch,var(--primary)_12%,transparent)] blur-[110px] sm:h-72 sm:w-72"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute right-[-2rem] top-8 h-60 w-60 sm:right-[-1rem] sm:top-[-0.5rem] sm:h-80 sm:w-80"
            >
              <ResultHeroOrnament />
            </div>

            <span
              aria-hidden
              className="pointer-events-none absolute left-[10%] top-[12%] size-1.5 rounded-full bg-[var(--hero-dust)]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute right-[22%] top-[18%] size-1 rounded-full bg-[var(--hero-dust)]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-[42%] top-[8%] size-1 rounded-full bg-[var(--hero-dust)]"
            />

            <div className="relative flex flex-col gap-5 sm:gap-6">
              <div
                className="hero-enter flex items-center justify-between gap-3"
                style={{ animationDelay: "40ms" }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[color-mix(in_oklch,var(--primary)_7%,var(--background)_93%)] px-3 py-1.5 text-[0.8125rem] font-semibold tracking-[0.04em] text-[color:color-mix(in_oklch,var(--foreground)_82%,var(--primary)_18%)] dark:border-primary/28 dark:bg-[color-mix(in_oklch,var(--primary)_14%,var(--background)_86%)] dark:text-[color:color-mix(in_oklch,var(--foreground)_88%,var(--primary)_12%)]">
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-accent/80"
                  />
                  단계 {RESULT_STEP_NUMBER} / {FORM_STEPS.length}
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  className="h-10 rounded-full border border-border/70 bg-[color-mix(in_oklch,var(--background)_84%,var(--card)_16%)] px-4 text-muted-foreground hover:border-border hover:bg-[color-mix(in_oklch,var(--background)_78%,var(--card)_22%)] hover:text-foreground dark:border-border/85 dark:bg-[color-mix(in_oklch,var(--card)_84%,var(--background)_16%)]"
                >
                  처음부터
                </Button>
              </div>

              <div className="max-w-[36rem] space-y-3">
                <div className="space-y-3">
                  <h1
                    className="hero-enter max-w-[12ch] text-[clamp(2.3rem,1.95rem+1.85vw,3.8rem)] font-semibold tracking-[-0.04em] text-foreground"
                    style={{ animationDelay: "110ms" }}
                  >
                    질문문이
                    <br />
                    준비됐습니다
                  </h1>

                  <p
                    className="hero-enter type-body max-w-[31rem] text-[color:color-mix(in_oklch,var(--foreground)_72%,var(--muted-foreground)_28%)] sm:text-[1.0625rem]"
                    style={{ animationDelay: "170ms" }}
                  >
                    아래 문장을 복사해 AI에 그대로 붙여 넣으세요.
                  </p>
                </div>
              </div>

              {summaryChips.length ? (
                <ul
                  className="hero-enter flex flex-wrap gap-2.5"
                  style={{ animationDelay: "230ms" }}
                >
                  {summaryChips.map((chip) => (
                    <li key={chip.key}>
                      <span className="inline-flex rounded-full border border-primary/16 bg-[color-mix(in_oklch,var(--primary)_5%,var(--background)_95%)] px-3 py-1.5 type-caption font-semibold text-[color:color-mix(in_oklch,var(--foreground)_72%,var(--primary)_28%)] shadow-[0_10px_24px_color-mix(in_oklch,var(--primary)_6%,transparent)] dark:border-primary/24 dark:bg-[color-mix(in_oklch,var(--primary)_14%,var(--background)_86%)] dark:text-[color:color-mix(in_oklch,var(--foreground)_82%,var(--primary)_18%)]">
                        {chip.label}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div
                className="hero-enter"
                style={{ animationDelay: "290ms" }}
              >
                <GeneratedQuestionPreview generatedQuestion={generatedQuestion} />
              </div>

              <div
                className="hero-enter sm:hidden"
                style={{ animationDelay: "350ms" }}
              >
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  data-icon="inline-start"
                  onClick={handleRegenerate}
                  className="h-11 w-full rounded-[1rem] px-4"
                >
                  <RotateCcw className="size-4" aria-hidden />
                  다시 생성
                </Button>
              </div>

              <div
                className="hero-enter hidden items-center justify-between gap-3 sm:flex"
                style={{ animationDelay: "350ms" }}
              >
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  data-icon="inline-start"
                  onClick={handleRegenerate}
                  className="h-11 rounded-[1rem] px-4"
                >
                  <RotateCcw className="size-4" aria-hidden />
                  다시 생성
                </Button>

                <div className="w-full max-w-[16rem]">{desktopPrimaryAction}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-30 bg-[linear-gradient(to_top,var(--background)_58%,transparent)] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:hidden">
          <div className="mx-auto w-full max-w-4xl">{mobilePrimaryAction}</div>
        </div>
      </>
    );
  }

  return (
    <SajuQuestionStepShell
      currentStep="result"
      errorMessage={generationError}
      desktopPrimaryAction={desktopPrimaryAction}
      mobilePrimaryAction={mobilePrimaryAction}
      secondaryActions={secondaryActions}
    >
      <GeneratedQuestionPreview generatedQuestion={generatedQuestion} />
    </SajuQuestionStepShell>
  );
}
