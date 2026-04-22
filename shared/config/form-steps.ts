import type { FormStep } from "@/shared/types/saju-question-form";

export const FORM_STEPS: FormStep[] = ["mode", "saju", "result"];

export const FORM_STEP_PATHS: Record<FormStep, string> = {
  mode: "/mode",
  saju: "/saju",
  result: "/result",
};

export const FORM_STEP_LABELS: Record<FormStep, string> = {
  mode: "분석 모드",
  saju: "사주 정보",
  result: "결과 확인",
};
