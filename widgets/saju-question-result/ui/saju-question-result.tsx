"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CardSequenceLoader } from "@/components/ui/card-sequence-loader";
import { usePlanSajuQuestion } from "@/features/plan-saju-question/model/use-plan-saju-question";
import { GeneratedQuestionPreview } from "@/features/view-generated-question/ui/generated-question-preview";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import { SajuQuestionStepShell } from "@/widgets/saju-question-step-shell/ui/saju-question-step-shell";

const MIN_RESULT_LOADING_DURATION_MS = 1400;

export function SajuQuestionResult() {
  const router = useRouter();
  const hasQueuedGenerationStartedRef = useRef(false);
  const isMountedRef = useRef(true);
  const {
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
                질문을 정리하고 있어요
              </h3>
              <p className="type-body-sm text-muted-foreground">
                입력하신 정보로 AI에 전달할 질문 흐름을 구성하는 중입니다.
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

  const desktopPrimaryAction = (
    <Button
      type="button"
      onClick={handleCopyQuestion}
      className="w-full rounded-[1.125rem] shadow-[0_16px_32px_color-mix(in_oklch,var(--primary)_18%,transparent)]"
    >
      복사하기
    </Button>
  );

  const mobilePrimaryAction = (
    <Button
      type="button"
      onClick={handleCopyQuestion}
      className="w-full rounded-[1.125rem] shadow-[0_16px_32px_color-mix(in_oklch,var(--primary)_18%,transparent)]"
    >
      복사하기
    </Button>
  );

  const secondaryActions = (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleRegenerate}
        className="h-11 rounded-[1rem] px-4"
      >
        다시 생성
      </Button>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={handleReset}
        className="h-11 rounded-[1rem] px-4 text-muted-foreground hover:text-foreground"
      >
        처음으로
      </Button>
    </>
  );

  return (
    <SajuQuestionStepShell
      currentStep="result"
      errorMessage={generationError}
      desktopPrimaryAction={desktopPrimaryAction}
      mobilePrimaryAction={mobilePrimaryAction}
      secondaryActions={secondaryActions}
    >
      <GeneratedQuestionPreview
        generatedQuestion={generatedQuestion}
        copyFeedback={copyFeedback}
      />
    </SajuQuestionStepShell>
  );
}
