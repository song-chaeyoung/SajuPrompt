import type { PromptStyle } from "@/shared/types/saju-question-form";

export const STYLE_OPTIONS: { value: PromptStyle; label: string }[] = [
  { value: "balanced", label: "균형형" },
  { value: "direct", label: "직설형" },
  { value: "empathetic", label: "공감형" },
];

export const SITUATION_OPTIONS = [
  "이직이나 진로 방향을 고민 중이에요",
  "연애나 관계 방향이 궁금해요",
  "재물이나 소비 흐름을 알고 싶어요",
  "올해 운세의 흐름을 보고 싶어요",
  "최근 고민과 스트레스가 커졌어요",
];

export const PURPOSE_OPTIONS = [
  "전체 성향과 강점을 알고 싶어요",
  "연애를 중심으로 보고 싶어요",
  "직업과 재물을 중심으로 보고 싶어요",
  "주의해야 할 시기를 알고 싶어요",
  "실천 가능한 조언을 받고 싶어요",
];

export const CUSTOM_REQUEST_OPTIONS = [
  "좋은 점만 말하지 말고 명확하게",
  "실전 조언 위주로 구체적으로",
  "감정과 관계 해석 중심으로",
  "긍정과 주의 포인트를 균형 있게",
];
