"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SajuQuestionFields } from "@/features/fill-saju-question/ui/saju-question-fields";
import { usePlanSajuQuestion } from "@/features/plan-saju-question/model/use-plan-saju-question";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import { SajuQuestionStepShell } from "@/widgets/saju-question-step-shell/ui/saju-question-step-shell";

export function SajuQuestionForm() {
  const router = useRouter();
  const {
    form,
    generationError,
    isGenerating,
    updateMe,
    updatePartner,
    updateGoal,
    handleGenerateQuestion,
    handleResetPlanner,
  } = usePlanSajuQuestion();

  const handleGenerate = async () => {
    const didGenerate = await handleGenerateQuestion();

    if (!didGenerate) {
      return;
    }

    router.push(FORM_STEP_PATHS.result, { scroll: false });
  };

  const handleReset = () => {
    handleResetPlanner();
    router.push("/", { scroll: false });
  };

  return (
    <SajuQuestionStepShell
      currentStep="saju"
      errorMessage={generationError}
      footer={
        <div className="border-t border-border/70 pt-5">
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="h-11 w-full"
            >
              {isGenerating ? "질문문 생성 중..." : "질문문 생성"}
            </Button>

            <div className="flex flex-wrap items-center justify-end gap-2">
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
      <SajuQuestionFields
        form={form}
        onUpdateMe={updateMe}
        onUpdatePartner={updatePartner}
        onUpdateGoal={updateGoal}
      />
    </SajuQuestionStepShell>
  );
}
