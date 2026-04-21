import { Button } from "@/components/ui/button";
import { FORM_STEPS } from "@/shared/config/form-steps";

interface QuestionPlannerActionsProps {
  currentStep: (typeof FORM_STEPS)[number];
  currentStepIndex: number;
  isGenerating: boolean;
  onPrevStep: () => void;
  onMoveToSajuStep: () => void;
  onGenerateQuestion: () => void;
  onCopyQuestion: () => void;
  onResetToStart: () => void;
}

export function QuestionPlannerActions({
  currentStep,
  currentStepIndex,
  isGenerating,
  onPrevStep,
  onMoveToSajuStep,
  onGenerateQuestion,
  onCopyQuestion,
  onResetToStart,
}: QuestionPlannerActionsProps) {
  const isResultStep = currentStep === "result";

  return (
    <div className="border-t border-border/70 pt-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-2 sm:order-2 sm:w-auto sm:flex-row sm:justify-end">
          {currentStep === "mode" ? (
            <Button type="button" onClick={onMoveToSajuStep} className="w-full sm:w-auto">
              다음
            </Button>
          ) : null}

          {currentStep === "saju" ? (
            <Button
              type="button"
              onClick={onGenerateQuestion}
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? "질문문 생성 중.." : "질문문 생성"}
            </Button>
          ) : null}

          {isResultStep ? (
            <Button type="button" onClick={onCopyQuestion} className="w-full sm:w-auto">
              복사하기
            </Button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:order-1">
          {!isResultStep ? (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevStep}
              disabled={currentStepIndex === 0 || isGenerating}
            >
              이전
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={onGenerateQuestion}
              disabled={isGenerating}
            >
              {isGenerating ? "다시 생성 중.." : "다시 생성"}
            </Button>
          )}

          <Button type="button" variant="outline" onClick={onResetToStart}>
            {isResultStep ? "처음부터 다시 하기" : "초기화"}
          </Button>
        </div>
      </div>
    </div>
  );
}
