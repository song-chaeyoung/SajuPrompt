"use client";

import {
  Check,
  Copy,
  ExternalLink,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { GENDER_OPTIONS } from "@/entities/saju-profile/config/birth-profile-options";
import {
  GENERATION_MIN_DURATION_MS,
  type CopyFeedback,
  useSajuQuestionCopy,
  useSajuQuestionFormState,
  useSajuQuestionGenerationActions,
  useSajuQuestionGenerationState,
  useSajuQuestionResetAction,
} from "@/features/plan-saju-question/model/use-plan-saju-question";
import { MODE_OPTIONS } from "@/features/select-analysis-mode/config/mode-options";
import { GeneratedQuestionPreview } from "@/features/view-generated-question/ui/generated-question-preview";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { CardSequenceLoader } from "@/shared/ui/card-sequence-loader";
import { HeroOrbitOrnament } from "@/shared/ui/hero-orbit-ornament";
import { FORM_STEP_PATHS, FORM_STEPS } from "@/shared/config/form-steps";
import type {
  BirthProfile,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";
import { SajuQuestionStepShell } from "@/widgets/saju-question-step-shell/ui/saju-question-step-shell";

const RESULT_STEP_NUMBER = FORM_STEPS.indexOf("result") + 1;

type SummaryChip = {
  key: string;
  label: string;
};

const AI_LINK_TARGETS = [
  {
    key: "chatgpt",
    label: "ChatGPT",
    href: "https://chatgpt.com/",
    shouldPrefillQuestion: true,
  },
  {
    key: "gemini",
    label: "Gemini",
    href: "https://gemini.google.com/app",
    shouldPrefillQuestion: false,
  },
  {
    key: "claude",
    label: "Claude",
    href: "https://claude.ai/new",
    shouldPrefillQuestion: false,
  },
] as const;

const RESULT_STEP_BADGE_CLASSNAME =
  "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[color-mix(in_oklch,var(--primary)_7%,var(--background)_93%)] px-3 py-1.5 text-[0.8125rem] font-semibold tracking-[0.04em] text-[color:color-mix(in_oklch,var(--foreground)_82%,var(--primary)_18%)] dark:border-primary/28 dark:bg-[color-mix(in_oklch,var(--primary)_14%,var(--background)_86%)] dark:text-[color:color-mix(in_oklch,var(--foreground)_88%,var(--primary)_12%)]";

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

function ResultHeroBackdrop({
  ornamentClassName,
}: {
  ornamentClassName: string;
}) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-4.5rem] top-[-2.5rem] h-52 w-52 rounded-full bg-[var(--hero-halo)] blur-[88px] sm:right-[-2.5rem] sm:top-[-3rem] sm:h-72 sm:w-72"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-3.5rem] top-32 h-56 w-56 rounded-full bg-[color-mix(in_oklch,var(--primary)_12%,transparent)] blur-[110px] sm:h-72 sm:w-72"
      />
      <div aria-hidden className={ornamentClassName}>
        <HeroOrbitOrnament className="hero-ornament-reveal" />
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
    </>
  );
}

function ResultHeroSection({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="pb-[calc(8.5rem+env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top)+0.5rem)] sm:pb-10 sm:pt-[calc(env(safe-area-inset-top)+2.5rem)]">
      <div className="relative mx-auto w-full max-w-4xl">
        <ResultHeroBackdrop ornamentClassName="pointer-events-none absolute right-[-2rem] top-8 h-60 w-60 sm:right-[-1rem] sm:top-[-0.5rem] sm:h-80 sm:w-80" />
        {children}
      </div>
    </section>
  );
}

function buildAiLinkHref(
  target: (typeof AI_LINK_TARGETS)[number],
  generatedQuestion: string,
) {
  if (!target.shouldPrefillQuestion || !generatedQuestion) {
    return target.href;
  }

  return `${target.href}?q=${encodeURIComponent(generatedQuestion)}`;
}

function AiOpenLinks({
  generatedQuestion,
  className,
}: {
  generatedQuestion: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(3,minmax(0,1fr))] gap-2",
        className,
      )}
    >
      {AI_LINK_TARGETS.map((target) => (
        <Button
          key={target.key}
          asChild
          size="sm"
          variant="secondary"
          data-icon="inline-end"
          className="w-full min-w-0 [&_span]:min-w-0 [&_span]:truncate"
        >
          <a
            href={buildAiLinkHref(target, generatedQuestion)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${target.label} 새 창에서 열기`}
          >
            <span>{target.label}</span>
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </Button>
      ))}
    </div>
  );
}

export function SajuQuestionResult() {
  const router = useRouter();
  const { form } = useSajuQuestionFormState();
  const {
    generatedQuestion,
    generationStatus,
    generationError,
    isWaitingForResult,
  } = useSajuQuestionGenerationState();
  const { handleGenerateQuestion: triggerQuestionGeneration } =
    useSajuQuestionGenerationActions();
  const handleResetPlanner = useSajuQuestionResetAction();
  const { copyFeedback, handleCopyQuestion } =
    useSajuQuestionCopy(generatedQuestion);

  useEffect(() => {
    if (
      generatedQuestion ||
      generationStatus === "loading" ||
      generationStatus === "error"
    ) {
      return;
    }

    router.replace(FORM_STEP_PATHS.saju, { scroll: true });
  }, [generatedQuestion, generationStatus, router]);

  const handleReset = () => {
    handleResetPlanner();
    router.push("/", { scroll: true });
  };

  const handleRegenerate = async () => {
    await triggerQuestionGeneration({
      minDurationMs: GENERATION_MIN_DURATION_MS,
    });
  };

  if (
    generationStatus === "loading" ||
    (!generatedQuestion && isWaitingForResult)
  ) {
    return (
      <ResultHeroSection>
        <div className="relative flex min-h-[calc(100dvh-8rem)] flex-col gap-6 sm:min-h-[calc(100dvh-10rem)]">
          <div
            className="hero-enter flex items-center justify-between gap-3"
            style={{ animationDelay: "40ms" }}
          >
            <div className={RESULT_STEP_BADGE_CLASSNAME}>
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-accent/80"
              />
              단계 {RESULT_STEP_NUMBER} / {FORM_STEPS.length}
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div
              className="hero-enter w-full max-w-[26rem]"
              style={{ animationDelay: "120ms" }}
            >
              <CardSequenceLoader />
            </div>
          </div>
        </div>
      </ResultHeroSection>
    );
  }

  if (!generatedQuestion && generationStatus !== "error") {
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

  const primaryAction = buildCopyButton();

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
        <ResultHeroSection>
          <div className="relative flex flex-col gap-5 sm:gap-6">
              <div
                className="hero-enter flex items-center justify-between gap-3"
                style={{ animationDelay: "40ms" }}
              >
                <div className={RESULT_STEP_BADGE_CLASSNAME}>
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
                className="hero-enter hidden gap-3 sm:flex sm:flex-col lg:flex-row lg:items-center lg:justify-between"
                style={{ animationDelay: "350ms" }}
              >
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  data-icon="inline-start"
                  onClick={handleRegenerate}
                  className="h-11 rounded-[1rem] px-4 sm:self-start lg:self-auto"
                >
                  <RotateCcw className="size-4" aria-hidden />
                  다시 생성
                </Button>

                <div className="grid w-full gap-2 sm:grid-cols-[minmax(0,1fr)_16rem] lg:max-w-[42rem]">
                  <AiOpenLinks generatedQuestion={generatedQuestion} />
                  <div>{buildCopyButton()}</div>
                </div>
              </div>
          </div>
        </ResultHeroSection>

        <div className="fixed inset-x-0 bottom-0 z-30 bg-[linear-gradient(to_top,var(--background)_72%,transparent)] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:hidden">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-2">
            {buildCopyButton()}
            <AiOpenLinks generatedQuestion={generatedQuestion} />
          </div>
        </div>
      </>
    );
  }

  return (
    <SajuQuestionStepShell
      currentStep="result"
      errorMessage={generationError}
      primaryAction={generatedQuestion ? primaryAction : undefined}
      secondaryActions={secondaryActions}
    >
      {generatedQuestion ? (
        <GeneratedQuestionPreview generatedQuestion={generatedQuestion} />
      ) : null}
    </SajuQuestionStepShell>
  );
}
