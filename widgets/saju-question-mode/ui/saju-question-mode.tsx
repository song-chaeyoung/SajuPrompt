"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { usePlanSajuQuestion } from "@/features/plan-saju-question/model/use-plan-saju-question";
import { AnalysisModeSelector } from "@/features/select-analysis-mode/ui/analysis-mode-selector";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import { SajuQuestionStepShell } from "@/widgets/saju-question-step-shell/ui/saju-question-step-shell";

export function SajuQuestionMode() {
  const router = useRouter();
  const { form, handleModeSelect, handleResetPlanner } = usePlanSajuQuestion();

  const handleNext = () => {
    router.push(FORM_STEP_PATHS.saju, { scroll: false });
  };

  const handleReset = () => {
    handleResetPlanner();
    router.push("/", { scroll: false });
  };

  return (
    <SajuQuestionStepShell
      currentStep="mode"
      footer={
        <div className="border-t border-border/70 pt-5">
          <div className="flex flex-col gap-3">
            <Button type="button" onClick={handleNext} className="h-11 w-full">
              다음
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
      <AnalysisModeSelector activeMode={form.mode} onSelect={handleModeSelect} />
    </SajuQuestionStepShell>
  );
}
