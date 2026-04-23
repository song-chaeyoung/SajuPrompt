"use client";

import { useCallback, useEffect, useState } from "react";

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

export type CopyFeedback = {
  type: "success" | "error";
  message: string;
};

export const GENERATION_MIN_DURATION_MS = 6600;

const REQUIRED_FIELDS_MESSAGE =
  "생년월일, 현재 상황, 질문 목적을 먼저 입력해 주세요.";
const REQUIRED_FIELDS_TITLE = "입력값을 확인해 주세요";
const GENERATION_FAILED_MESSAGE = "질문문 생성 중 오류가 발생했습니다.";
const GENERATION_FAILED_TITLE = "질문 생성에 실패했습니다";
const EMPTY_QUESTION_MESSAGE =
  "생성된 질문문이 비어 있습니다. 다시 시도해 주세요.";
const COPY_MISSING_MESSAGE = "복사할 질문문이 없습니다.";
const COPY_MISSING_TITLE = "복사할 내용이 없습니다";
const COPY_SUCCESS_MESSAGE = "질문문이 클립보드에 복사되었습니다.";
const COPY_SUCCESS_TITLE = "복사 완료";
const COPY_FAILED_MESSAGE =
  "복사에 실패했습니다. 브라우저 권한을 확인해 주세요.";
const COPY_FAILED_TITLE = "복사에 실패했습니다";

function waitForMinimumDuration(durationMs: number) {
  if (durationMs <= 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

function getPlannerForm() {
  return useSajuQuestionPlannerStore.getState().form;
}

function hasValidGenerationInput() {
  return hasCoreRequiredFields(getPlannerForm());
}

export function useSajuQuestionModeState() {
  const mode = useSajuQuestionPlannerStore((state) => state.form.mode);
  const setMode = useSajuQuestionPlannerStore((state) => state.setMode);

  const handleModeSelect = useCallback(
    (nextMode: AnalysisMode) => {
      setMode(nextMode);
    },
    [setMode],
  );

  return {
    mode,
    handleModeSelect,
  };
}

export function useSajuQuestionFormState() {
  const form = useSajuQuestionPlannerStore((state) => state.form);
  const updateMe = useSajuQuestionPlannerStore((state) => state.updateMe);
  const updatePartner = useSajuQuestionPlannerStore(
    (state) => state.updatePartner,
  );
  const updateGoal = useSajuQuestionPlannerStore((state) => state.updateGoal);

  return {
    form,
    updateMe,
    updatePartner,
    updateGoal,
  };
}

export function useSajuQuestionGenerationState() {
  const generatedQuestion = useSajuQuestionPlannerStore(
    (state) => state.generatedQuestion,
  );
  const generationStatus = useSajuQuestionPlannerStore(
    (state) => state.generationStatus,
  );
  const generationError = useSajuQuestionPlannerStore(
    (state) => state.generationError,
  );

  const isGenerating = generationStatus === "loading";

  return {
    generatedQuestion,
    generationStatus,
    generationError,
    isGenerating,
    isWaitingForResult: isGenerating,
  };
}

export function useSajuQuestionGenerationActions() {
  const startGeneration = useSajuQuestionPlannerStore(
    (state) => state.startGeneration,
  );
  const setGenerationSuccess = useSajuQuestionPlannerStore(
    (state) => state.setGenerationSuccess,
  );
  const setGenerationError = useSajuQuestionPlannerStore(
    (state) => state.setGenerationError,
  );
  const clearGenerationError = useSajuQuestionPlannerStore(
    (state) => state.clearGenerationError,
  );

  const handlePrepareGeneration = useCallback(() => {
    if (hasValidGenerationInput()) {
      clearGenerationError();
      return true;
    }

    clearGenerationError();
    showErrorToast(REQUIRED_FIELDS_MESSAGE, {
      id: "saju-required-fields",
      title: REQUIRED_FIELDS_TITLE,
    });

    return false;
  }, [clearGenerationError]);

  const handleGenerateQuestion = useCallback(
    async (options: GenerateQuestionOptions = {}) => {
      const form = getPlannerForm();

      if (!hasCoreRequiredFields(form)) {
        clearGenerationError();
        showErrorToast(REQUIRED_FIELDS_MESSAGE, {
          id: "saju-required-fields",
          title: REQUIRED_FIELDS_TITLE,
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
          title: GENERATION_FAILED_TITLE,
        });

        return false;
      }
    },
    [
      clearGenerationError,
      setGenerationError,
      setGenerationSuccess,
      startGeneration,
    ],
  );

  return {
    handlePrepareGeneration,
    handleGenerateQuestion,
  };
}

export function useSajuQuestionResetAction() {
  const reset = useSajuQuestionPlannerStore((state) => state.reset);

  return useCallback(() => {
    reset();
  }, [reset]);
}

export function useSajuQuestionCopy(generatedQuestion: string) {
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback | null>(null);

  const handleCopyQuestion = useCallback(async () => {
    if (!generatedQuestion) {
      setCopyFeedback({
        type: "error",
        message: COPY_MISSING_MESSAGE,
      });
      showErrorToast(COPY_MISSING_MESSAGE, {
        id: "saju-copy-missing",
        title: COPY_MISSING_TITLE,
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedQuestion);
      setCopyFeedback({
        type: "success",
        message: COPY_SUCCESS_MESSAGE,
      });
      showSuccessToast(COPY_SUCCESS_MESSAGE, {
        id: "saju-copy-success",
        title: COPY_SUCCESS_TITLE,
      });
    } catch {
      setCopyFeedback({
        type: "error",
        message: COPY_FAILED_MESSAGE,
      });
      showErrorToast(COPY_FAILED_MESSAGE, {
        id: "saju-copy-failed",
        title: COPY_FAILED_TITLE,
      });
    }
  }, [generatedQuestion]);

  useEffect(() => {
    if (!copyFeedback) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopyFeedback(null);
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copyFeedback]);

  return {
    copyFeedback,
    handleCopyQuestion,
  };
}
