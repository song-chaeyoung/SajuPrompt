import { Button } from "@/components/ui/button";
import { FORM_STEPS } from "@/shared/config/form-steps";

interface QuestionPlannerActionsProps {
  currentStep: (typeof FORM_STEPS)[number];
  isGenerating: boolean;
  onMoveToSajuStep: () => void;
  onGenerateQuestion: () => void;
  onCopyQuestion: () => void;
  onResetToStart: () => void;
}

export function QuestionPlannerActions({
  currentStep,
  isGenerating,
  onMoveToSajuStep,
  onGenerateQuestion,
  onCopyQuestion,
  onResetToStart,
}: QuestionPlannerActionsProps) {
  const isResultStep = currentStep === "result";

  return (
    <div className="border-t border-border/70 pt-5">
      <div className="flex flex-col gap-3">
        {currentStep === "mode" ? (
          <Button type="button" onClick={onMoveToSajuStep} className="h-11 w-full">
            다음
          </Button>
        ) : null}

        {currentStep === "saju" ? (
          <Button
            type="button"
            onClick={onGenerateQuestion}
            disabled={isGenerating}
            className="h-11 w-full"
          >
            {isGenerating ? "질문문 생성 중..." : "질문문 생성"}
          </Button>
        ) : null}

        {isResultStep ? (
          <Button
            type="button"
            onClick={onCopyQuestion}
            className="h-11 w-full"
          >
            복사하기
          </Button>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-2">
          {isResultStep ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onGenerateQuestion}
              disabled={isGenerating}
              className="h-9 px-4"
            >
              {isGenerating ? "다시 생성 중..." : "다시 생성"}
            </Button>
          ) : null}

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onResetToStart}
            className="h-9 px-3 text-muted-foreground hover:text-foreground"
          >
            처음부터
          </Button>
        </div>
      </div>
    </div>
  );
}
