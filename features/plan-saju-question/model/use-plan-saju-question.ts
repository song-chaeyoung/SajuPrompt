"use client";

import { useCallback } from "react";

import { useSajuQuestionPlannerStore } from "@/features/plan-saju-question/model/saju-question-planner.store";
import { hasCoreRequiredFields } from "@/shared/lib/saju-question-form/validation";
import { showErrorToast, showSuccessToast } from "@/shared/lib/toast";
import type { AnalysisMode } from "@/shared/types/saju-question-form";

type GenerationResponse = {
  question?: string;
  message?: string;
};

type GenerateQuestionOptions = {
  minDurationMs?: number;
};

const REQUIRED_FIELDS_MESSAGE =
  "생년월일, 현재 상황, 질문 목적을 먼저 입력해 주세요.";
const GENERATION_FAILED_MESSAGE =
  "질문문 생성 중 오류가 발생했습니다.";
const EMPTY_QUESTION_MESSAGE =
  "생성된 질문문이 비어 있습니다. 다시 시도해 주세요.";

function waitForMinimumDuration(durationMs: number) {
  if (durationMs <= 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

export function usePlanSajuQuestion() {
  const {
    form,
    generatedQuestion,
    generationStatus,
    generationError,
    setMode,
    updateMe,
    updatePartner,
    updateGoal,
    queueGeneration,
    startGeneration,
    setGenerationSuccess,
    setGenerationError,
    clearGenerationError,
    reset,
  } = useSajuQuestionPlannerStore();

  const isGenerating = generationStatus === "loading";
  const isQueued = generationStatus === "queued";
  const isWaitingForResult = isQueued || isGenerating;

  const handleModeSelect = useCallback(
    (mode: AnalysisMode) => {
      setMode(mode);
    },
    [setMode],
  );

  const handleQueueGeneration = useCallback(() => {
    if (!hasCoreRequiredFields(form)) {
      clearGenerationError();
      showErrorToast(REQUIRED_FIELDS_MESSAGE, {
        id: "saju-required-fields",
      });
      return false;
    }

    queueGeneration();
    return true;
  }, [clearGenerationError, form, queueGeneration]);

  const handleGenerateQuestion = useCallback(
    async (options: GenerateQuestionOptions = {}) => {
      if (!hasCoreRequiredFields(form)) {
        clearGenerationError();
        showErrorToast(REQUIRED_FIELDS_MESSAGE, {
          id: "saju-required-fields",
        });
        return false;
      }

      const minDurationPromise = waitForMinimumDuration(
        Math.max(0, options.minDurationMs ?? 0),
      );

      startGeneration();

      try {
        const response = await fetch("/api/saju-question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ form }),
        });

        const body = (await response.json().catch(() => null)) as
          | GenerationResponse
          | null;

        if (!response.ok) {
          throw new Error(body?.message ?? GENERATION_FAILED_MESSAGE);
        }

        const question = body?.question?.trim();

        if (!question) {
          throw new Error(EMPTY_QUESTION_MESSAGE);
        }

        await minDurationPromise;

        setGenerationSuccess(question);
        return true;
      } catch (error) {
        await minDurationPromise;

        const message =
          error instanceof Error ? error.message : GENERATION_FAILED_MESSAGE;

        setGenerationError(message);
        showErrorToast(message, {
          id: "saju-generation-error",
        });
        return false;
      }
    },
    [
      clearGenerationError,
      form,
      setGenerationError,
      setGenerationSuccess,
      startGeneration,
    ],
  );

  const handleCopyQuestion = useCallback(async () => {
    if (!generatedQuestion) {
      showErrorToast("복사할 질문문이 없습니다.", {
        id: "saju-copy-missing",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedQuestion);
      showSuccessToast("질문문이 클립보드에 복사되었습니다.", {
        id: "saju-copy-success",
      });
    } catch {
      showErrorToast("복사에 실패했습니다. 브라우저 권한을 확인해 주세요.", {
        id: "saju-copy-failed",
      });
    }
  }, [generatedQuestion]);

  const handleResetPlanner = useCallback(() => {
    reset();
  }, [reset]);

  return {
    form,
    generatedQuestion,
    generationStatus,
    generationError,
    isGenerating,
    isQueued,
    isWaitingForResult,
    updateMe,
    updatePartner,
    updateGoal,
    handleModeSelect,
    handleQueueGeneration,
    handleGenerateQuestion,
    handleCopyQuestion,
    handleResetPlanner,
  };
}
