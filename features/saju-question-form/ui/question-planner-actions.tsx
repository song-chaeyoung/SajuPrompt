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
  return (
    <div className="flex flex-wrap items-center gap-2">
      {currentStep !== "result" ? (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevStep}
          disabled={currentStepIndex === 0 || isGenerating}
        >
          이전
        </Button>
      ) : (
        <Button type="button" variant="outline" onClick={onCopyQuestion}>
          복사하기
        </Button>
      )}

      {currentStep === "mode" ? (
        <Button type="button" onClick={onMoveToSajuStep}>
          다음
        </Button>
      ) : null}

      {currentStep === "saju" ? (
        <Button type="button" onClick={onGenerateQuestion} disabled={isGenerating}>
          {isGenerating ? "질문문 생성 중.." : "질문문 생성"}
        </Button>
      ) : null}

      {currentStep === "result" ? (
        <>
          <Button type="button" onClick={onGenerateQuestion} disabled={isGenerating}>
            {isGenerating ? "다시 생성 중.." : "다시 생성"}
          </Button>
          <Button type="button" variant="outline" onClick={onResetToStart}>
            처음부터 다시 하기
          </Button>
        </>
      ) : (
        <Button type="button" variant="outline" onClick={onResetToStart}>
          초기화
        </Button>
      )}
    </div>
  );
}
