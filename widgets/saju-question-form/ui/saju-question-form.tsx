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
    generationStatus,
    generationError,
    updateMe,
    updatePartner,
    updateGoal,
    handleQueueGeneration,
    handleResetPlanner,
  } = usePlanSajuQuestion();
  const isTransitioningToResult =
    generationStatus === "queued" || generationStatus === "loading";

  const handleGenerate = () => {
    const didQueue = handleQueueGeneration();

    if (!didQueue) {
      return;
    }

    router.push(FORM_STEP_PATHS.result, { scroll: false });
  };

  const handleReset = () => {
    handleResetPlanner();
    router.push("/", { scroll: false });
  };

  const primaryActionLabel = isTransitioningToResult
    ? "질문 흐름을 정리하는 중..."
    : "질문문 생성";

  const desktopPrimaryAction = (
    <Button
      type="button"
      onClick={handleGenerate}
      disabled={isTransitioningToResult}
      className="w-full rounded-[1.125rem] shadow-[0_16px_32px_color-mix(in_oklch,var(--primary)_18%,transparent)]"
    >
      {primaryActionLabel}
    </Button>
  );

  const mobilePrimaryAction = (
    <Button
      type="button"
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
      errorMessage={generationError}
      desktopPrimaryAction={desktopPrimaryAction}
      mobilePrimaryAction={mobilePrimaryAction}
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
