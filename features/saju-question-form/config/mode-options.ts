import type { AnalysisMode } from "@/shared/types/saju-question-form";

export interface ModeOption {
  value: AnalysisMode;
  label: string;
  description: string;
}

export const MODE_OPTIONS: ModeOption[] = [
  {
    value: "self",
    label: "내 사주 분석",
    description: "내 사주 정보 기반으로 질문문을 설계합니다.",
  },
  {
    value: "compatibility",
    label: "궁합 분석",
    description: "내 정보와 상대방 정보를 함께 사용합니다.",
  },
];
