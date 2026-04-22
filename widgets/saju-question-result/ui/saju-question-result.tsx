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
      <SajuQuestionStepShell currentStep="result" footer={null}>
        <section className="flex min-h-72 flex-col items-center justify-center rounded-[calc(var(--radius-3xl)*0.95)] border border-border/70 bg-[color-mix(in_oklch,var(--card)_80%,var(--background)_20%)] px-6 py-10 text-center shadow-[0_18px_40px_color-mix(in_oklch,var(--color-text)_5%,transparent)]">
          <div className="flex max-w-sm flex-col items-center gap-5">
            <CardSequenceLoader size="lg" />

            <div className="space-y-2">
              <h3 className="type-title-sm font-semibold text-foreground">
                질문을 정리하고 있어요
              </h3>
              <p className="type-body-sm text-[color:var(--color-text-muted)]">
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

  return (
    <SajuQuestionStepShell
      currentStep="result"
      errorMessage={generationError}
      footer={
        <div className="border-t border-border/70 pt-5">
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              onClick={handleCopyQuestion}
              className="h-11 w-full"
            >
              복사하기
            </Button>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleRegenerate}
                className="h-9 px-4"
              >
                다시 생성
              </Button>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleReset}
                className="h-9 px-3 text-muted-foreground hover:text-foreground"
              >
                처음으로
              </Button>
            </div>
          </div>
        </div>
      }
    >
      <GeneratedQuestionPreview
        generatedQuestion={generatedQuestion}
        copyFeedback={copyFeedback}
      />
    </SajuQuestionStepShell>
  );
}
