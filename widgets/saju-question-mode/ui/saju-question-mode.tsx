"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";
import {
  useSajuQuestionModeState,
  useSajuQuestionResetAction,
} from "@/features/plan-saju-question/model/use-plan-saju-question";
import { AnalysisModeSelector } from "@/features/select-analysis-mode/ui/analysis-mode-selector";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import { SajuQuestionStepShell } from "@/widgets/saju-question-step-shell/ui/saju-question-step-shell";

export function SajuQuestionMode() {
  const router = useRouter();
  const { mode, handleModeSelect } = useSajuQuestionModeState();
  const handleResetPlanner = useSajuQuestionResetAction();

  const handleSelectAndNext = (
    nextMode: Parameters<typeof handleModeSelect>[0],
  ) => {
    handleModeSelect(nextMode);
    router.push(FORM_STEP_PATHS.saju, { scroll: true });
  };

  const handleNext = () => {
    router.push(FORM_STEP_PATHS.saju, { scroll: true });
  };

  const handleReset = () => {
    handleResetPlanner();
    router.push("/", { scroll: true });
  };

  const primaryAction = (
    <Button
      type="button"
      size="lg"
      onClick={handleNext}
      className="w-full rounded-[1.125rem] shadow-[0_16px_32px_color-mix(in_oklch,var(--primary)_18%,transparent)]"
    >
      다음
    </Button>
  );

  const secondaryActions = (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={handleReset}
      className="h-11 rounded-[1rem] px-4 text-muted-foreground hover:text-foreground"
    >
      처음으로
    </Button>
  );

  return (
    <SajuQuestionStepShell
      currentStep="mode"
      visualVariant="hero"
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
    >
      <div className="space-y-4">
        <p className="type-body-sm max-w-[34rem] text-muted-foreground">
          이번 질문이 내 사주를 보는 흐름인지, 상대와의 궁합과 관계를 함께
          정리하는 흐름인지 먼저 선택해 주세요.
        </p>

        <AnalysisModeSelector
          activeMode={mode}
          onSelect={handleSelectAndNext}
        />
      </div>
    </SajuQuestionStepShell>
  );
}
