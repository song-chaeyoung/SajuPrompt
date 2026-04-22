"use client";

import { useCallback, useEffect, useState } from "react";

import { useSajuQuestionPlannerStore } from "@/features/plan-saju-question/model/saju-question-planner.store";
import { hasCoreRequiredFields } from "@/shared/lib/saju-question-form/validation";
import type { AnalysisMode } from "@/shared/types/saju-question-form";

type GenerationResponse = {
  question?: string;
  message?: string;
};

export type CopyFeedback = {
  type: "success" | "error";
  message: string;
};

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
    startGeneration,
    setGenerationSuccess,
    setGenerationError,
    reset,
  } = useSajuQuestionPlannerStore();
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback | null>(null);

  const isGenerating = generationStatus === "loading";

  const handleModeSelect = useCallback(
    (mode: AnalysisMode) => {
      setMode(mode);
    },
    [setMode],
  );

  const handleGenerateQuestion = useCallback(async () => {
    if (!hasCoreRequiredFields(form)) {
      setGenerationError("생년월일, 현재 상황, 질문 목적을 먼저 입력해 주세요.");
      return false;
    }

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
        throw new Error(body?.message ?? "질문문 생성 중 오류가 발생했습니다.");
      }

      const question = body?.question?.trim();

      if (!question) {
        throw new Error("생성된 질문문이 비어 있습니다. 다시 시도해 주세요.");
      }

      setGenerationSuccess(question);
      setCopyFeedback(null);
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "질문문 생성 중 오류가 발생했습니다.";

      setGenerationError(message);
      return false;
    }
  }, [form, setGenerationError, setGenerationSuccess, startGeneration]);

  const handleCopyQuestion = useCallback(async () => {
    if (!generatedQuestion) {
      setCopyFeedback({
        type: "error",
        message: "복사할 질문문이 없습니다.",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedQuestion);
      setCopyFeedback({
        type: "success",
        message: "질문문이 클립보드에 복사되었습니다.",
      });
    } catch {
      setCopyFeedback({
        type: "error",
        message: "복사에 실패했습니다. 브라우저 권한을 확인해 주세요.",
      });
    }
  }, [generatedQuestion]);

  const handleResetPlanner = useCallback(() => {
    reset();
    setCopyFeedback(null);
  }, [reset]);

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
    form,
    generatedQuestion,
    generationError,
    isGenerating,
    copyFeedback,
    updateMe,
    updatePartner,
    updateGoal,
    handleModeSelect,
    handleGenerateQuestion,
    handleCopyQuestion,
    handleResetPlanner,
  };
}
