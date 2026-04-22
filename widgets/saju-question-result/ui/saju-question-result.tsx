"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { usePlanSajuQuestion } from "@/features/plan-saju-question/model/use-plan-saju-question";
import { GeneratedQuestionPreview } from "@/features/view-generated-question/ui/generated-question-preview";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import { SajuQuestionStepShell } from "@/widgets/saju-question-step-shell/ui/saju-question-step-shell";

export function SajuQuestionResult() {
  const router = useRouter();
  const {
    generatedQuestion,
    generationError,
    isGenerating,
    copyFeedback,
    handleGenerateQuestion,
    handleCopyQuestion,
    handleResetPlanner,
  } = usePlanSajuQuestion();

  useEffect(() => {
    if (generatedQuestion) {
      return;
    }

    router.replace(FORM_STEP_PATHS.saju, { scroll: false });
  }, [generatedQuestion, router]);

  const handleReset = () => {
    handleResetPlanner();
    router.push("/", { scroll: false });
  };

  const handleRegenerate = async () => {
    await handleGenerateQuestion();
  };

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
                disabled={isGenerating}
                className="h-9 px-4"
              >
                {isGenerating ? "다시 생성 중..." : "다시 생성"}
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
