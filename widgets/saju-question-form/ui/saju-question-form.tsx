"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";
import { SajuQuestionFields } from "@/features/fill-saju-question/ui/saju-question-fields";
import {
  GENERATION_MIN_DURATION_MS,
  useSajuQuestionFormState,
  useSajuQuestionGenerationActions,
  useSajuQuestionGenerationState,
  useSajuQuestionResetAction,
} from "@/features/plan-saju-question/model/use-plan-saju-question";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import { SajuQuestionStepShell } from "@/widgets/saju-question-step-shell/ui/saju-question-step-shell";

export function SajuQuestionForm() {
  const router = useRouter();
  const { form, updateMe, updatePartner, updateGoal } = useSajuQuestionFormState();
  const {
    generationStatus,
    generationError,
  } = useSajuQuestionGenerationState();
  const { handlePrepareGeneration, handleGenerateQuestion } =
    useSajuQuestionGenerationActions();
  const handleResetPlanner = useSajuQuestionResetAction();
  const isTransitioningToResult = generationStatus === "loading";

  const handleGenerate = () => {
    const didPrepare = handlePrepareGeneration();

    if (!didPrepare) {
      return;
    }

    void handleGenerateQuestion({
      minDurationMs: GENERATION_MIN_DURATION_MS,
    });
    router.push(FORM_STEP_PATHS.result, { scroll: true });
  };

  const handleReset = () => {
    handleResetPlanner();
    router.push("/", { scroll: true });
  };

  const primaryActionLabel = isTransitioningToResult
    ? "질문 흐름을 정리하는 중..."
    : "질문문 생성";

  const primaryAction = (
    <Button
      type="button"
      size="lg"
      onClick={handleGenerate}
      disabled={isTransitioningToResult}
      className="w-full rounded-[1.125rem] shadow-[0_16px_32px_color-mix(in_oklch,var(--primary)_18%,transparent)]"
    >
      {primaryActionLabel}
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
      currentStep="saju"
      visualVariant="hero"
      errorMessage={generationError}
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
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
