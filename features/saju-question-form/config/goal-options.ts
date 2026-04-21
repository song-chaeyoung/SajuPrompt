import type { PromptStyle } from "@/shared/types/saju-question-form";

export const STYLE_OPTIONS: { value: PromptStyle; label: string }[] = [
  { value: "balanced", label: "균형형" },
  { value: "direct", label: "직설형" },
  { value: "empathetic", label: "공감형" },
];

export const SITUATION_OPTIONS = [
  "이직/진로를 고민 중이에요",
  "연애/관계 방향을 알고 싶어요",
  "재물/소비 흐름을 점검하고 싶어요",
  "올해 운세 흐름을 듣고 싶어요",
  "최근 고민과 스트레스가 있어요",
];

export const PURPOSE_OPTIONS = [
  "전체 성향과 강점을 알고 싶어요",
  "연애를 중심으로 보고 싶어요",
  "직업/재물을 중심으로 보고 싶어요",
  "올해 주의할 시기를 알고 싶어요",
  "실천 가능한 조언을 받고 싶어요",
];

export const CUSTOM_REQUEST_OPTIONS = [
  "단점만 짚지 말고 명확하게",
  "현실 조언을 더 구체적으로",
  "감정과 관계 해석 중심으로",
  "긍정/주의 사인을 균형 있게",
];
