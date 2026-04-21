"use client";

import { useSajuQuestionPlanner } from "@/features/saju-question-form/model/use-saju-question-planner";
import { ModeStep } from "@/features/saju-question-form/ui/mode-step";
import { QuestionPlannerActions } from "@/features/saju-question-form/ui/question-planner-actions";
import { QuestionPlannerStepHeader } from "@/features/saju-question-form/ui/question-planner-step-header";
import { ResultStep } from "@/features/saju-question-form/ui/result-step";
import { SajuStep } from "@/features/saju-question-form/ui/saju-step";

export function SajuQuestionPlanner() {
  const {
    form,
    currentStepIndex,
    currentStep,
    generatedQuestion,
    generationError,
    isGenerating,
    copyFeedback,
    updateMe,
    updatePartner,
    updateGoal,
    handleModeSelect,
    handleMoveToSajuStep,
    handleGenerateQuestion,
    handleCopyQuestion,
    handlePrevStep,
    handleResetToStart,
  } = useSajuQuestionPlanner();

  return (
    <section className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
      <QuestionPlannerStepHeader
        currentStepIndex={currentStepIndex}
        currentStep={currentStep}
      />

      {currentStep === "mode" ? (
        <ModeStep activeMode={form.mode} onSelect={handleModeSelect} />
      ) : null}

      {currentStep === "saju" ? (
        <SajuStep
          form={form}
          onUpdateMe={updateMe}
          onUpdatePartner={updatePartner}
          onUpdateGoal={updateGoal}
        />
      ) : null}

      {currentStep === "result" ? (
        <ResultStep
          generatedQuestion={generatedQuestion}
          copyFeedback={copyFeedback}
        />
      ) : null}

      {generationError ? (
        <p className="text-sm text-red-600">{generationError}</p>
      ) : null}

      <QuestionPlannerActions
        currentStep={currentStep}
        currentStepIndex={currentStepIndex}
        isGenerating={isGenerating}
        onPrevStep={handlePrevStep}
        onMoveToSajuStep={handleMoveToSajuStep}
        onGenerateQuestion={handleGenerateQuestion}
        onCopyQuestion={handleCopyQuestion}
        onResetToStart={handleResetToStart}
      />
    </section>
  );
}
