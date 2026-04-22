"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useSajuQuestionPlanner } from "@/features/saju-question-form/model/use-saju-question-planner";
import { ModeStep } from "@/features/saju-question-form/ui/mode-step";
import { QuestionPlannerActions } from "@/features/saju-question-form/ui/question-planner-actions";
import { QuestionPlannerStepHeader } from "@/features/saju-question-form/ui/question-planner-step-header";
import { ResultStep } from "@/features/saju-question-form/ui/result-step";
import { SajuStep } from "@/features/saju-question-form/ui/saju-step";

export function SajuQuestionPlanner() {
  const [hasStarted, setHasStarted] = useState(false);
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
    handleResetToStart,
  } = useSajuQuestionPlanner();

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleReset = () => {
    handleResetToStart();
    setHasStarted(false);
  };

  if (!hasStarted) {
    return (
      <>
        <section className="pb-32 pt-4 sm:pb-36 sm:pt-6">
          <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/95 px-5 py-7 shadow-[0_20px_56px_color-mix(in_oklch,var(--primary)_7%,transparent)] sm:px-7 sm:py-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-auto right-[-4rem] top-[-5rem] h-40 w-40 rounded-full bg-primary/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-[-4rem] left-[-3rem] h-36 w-36 rounded-full bg-accent/25 blur-3xl"
            />

            <div className="relative space-y-7">
              <div className="space-y-3">
                <p className="type-caption font-semibold tracking-[0.08em] text-primary">
                  AI 사주 질문 설계기
                </p>
                <div className="space-y-3">
                  <h1 className="type-title-lg max-w-[16ch] font-semibold text-foreground sm:max-w-[15ch]">
                    시작하면 단계별 입력 화면만 보여드립니다.
                  </h1>
                  <p className="type-body max-w-[34rem] text-muted-foreground">
                    처음에는 설명만 간단히 확인하고, 시작 후에는 단계 1, 단계
                    2처럼 현재 입력해야 할 내용만 집중해서 볼 수 있도록
                    구성했습니다.
                  </p>
                </div>
              </div>

              <ol className="grid gap-4 border-y border-border/70 py-4 sm:grid-cols-3 sm:gap-5">
                <li className="space-y-1.5">
                  <p className="type-caption font-semibold tracking-[0.06em] text-primary">
                    STEP 1
                  </p>
                  <p className="type-body font-semibold text-foreground">
                    분석 모드 선택
                  </p>
                  <p className="type-body-sm text-muted-foreground">
                    내 사주 분석인지, 궁합 분석인지 먼저 고릅니다.
                  </p>
                </li>
                <li className="space-y-1.5">
                  <p className="type-caption font-semibold tracking-[0.06em] text-primary">
                    STEP 2
                  </p>
                  <p className="type-body font-semibold text-foreground">
                    사주 정보 입력
                  </p>
                  <p className="type-body-sm text-muted-foreground">
                    필요한 인물 정보와 질문 목적을 한 번에 정리합니다.
                  </p>
                </li>
                <li className="space-y-1.5">
                  <p className="type-caption font-semibold tracking-[0.06em] text-primary">
                    STEP 3
                  </p>
                  <p className="type-body font-semibold text-foreground">
                    질문문 확인
                  </p>
                  <p className="type-body-sm text-muted-foreground">
                    완성된 질문문을 바로 복사해서 AI에 붙여넣을 수 있습니다.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:px-6 md:px-8">
          <div className="mx-auto w-full max-w-3xl">
            <Button
              type="button"
              size="lg"
              onClick={handleStart}
              className="h-11 w-full shadow-[0_16px_32px_color-mix(in_oklch,var(--primary)_20%,transparent)]"
            >
              시작하기
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <section className="py-4 sm:py-6">
      <div className="mx-auto w-full max-w-3xl rounded-[1.75rem] border border-border/70 bg-card/95 p-5 shadow-[0_20px_56px_color-mix(in_oklch,var(--primary)_7%,transparent)] sm:p-7">
        <div className="space-y-6">
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
            <p className="type-body-sm text-destructive">{generationError}</p>
          ) : null}

          <QuestionPlannerActions
            currentStep={currentStep}
            isGenerating={isGenerating}
            onMoveToSajuStep={handleMoveToSajuStep}
            onGenerateQuestion={handleGenerateQuestion}
            onCopyQuestion={handleCopyQuestion}
            onResetToStart={handleReset}
          />
        </div>
      </div>
    </section>
  );
}
