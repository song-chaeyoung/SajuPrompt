import type {
  BirthProfile,
  PromptStyle,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";

export interface SajuPromptGuardrails {
  requiredSections: readonly string[];
  responseFormat: string;
  analysisPurpose: string;
  interpretationTone: string;
  prohibitDefinitiveClaims: boolean;
  useSimpleLanguage: boolean;
}

export const SAJU_PROMPT_GUARDRAILS: SajuPromptGuardrails = {
  requiredSections: [
    "대상 사주 정보 요약",
    "현재 상황 요약",
    "질문 목적 요약",
    "질문문 본문",
    "추가 확인 질문(선택)",
  ],
  responseFormat:
    "항목 제목을 유지한 구조화된 텍스트 형식으로만 응답한다. JSON, 마크다운 테이블, 코드블록은 사용하지 않는다.",
  analysisPurpose:
    "사용자가 다른 AI에 붙여 넣어 사주 해석을 요청할 수 있도록, 질문문 초안을 설계하는 것이 유일한 목적이다.",
  interpretationTone:
    "명확하고 차분한 조언형 톤을 유지한다. 자극적 표현이나 공포 유도 표현은 금지한다.",
  prohibitDefinitiveClaims: true,
  useSimpleLanguage: true,
};

interface BuiltSajuPrompt {
  systemPrompt: string;
  userPrompt: string;
  guardrails: SajuPromptGuardrails;
}

function resolveGuardrails(): SajuPromptGuardrails {
  return {
    requiredSections: [...SAJU_PROMPT_GUARDRAILS.requiredSections],
    responseFormat: SAJU_PROMPT_GUARDRAILS.responseFormat,
    analysisPurpose: SAJU_PROMPT_GUARDRAILS.analysisPurpose,
    interpretationTone: SAJU_PROMPT_GUARDRAILS.interpretationTone,
    prohibitDefinitiveClaims: SAJU_PROMPT_GUARDRAILS.prohibitDefinitiveClaims,
    useSimpleLanguage: SAJU_PROMPT_GUARDRAILS.useSimpleLanguage,
  };
}

function toStyleLabel(style: PromptStyle): string {
  if (style === "direct") {
    return "직설형";
  }

  if (style === "empathetic") {
    return "공감형";
  }

  return "균형형";
}

function formatBirthDate(profile: BirthProfile): string {
  if (!profile.birthDate) {
    return "미입력";
  }

  return profile.birthDate;
}

function formatBirthTime(profile: BirthProfile): string {
  if (profile.isBirthTimeUnknown) {
    return "모름";
  }

  if (!profile.birthTime) {
    return "미입력";
  }

  return profile.birthTime;
}

function formatProfile(label: string, profile: BirthProfile): string {
  return [
    `[${label}]`,
    `이름: ${profile.name || "미입력"}`,
    `성별: ${profile.gender}`,
    `달력: ${profile.calendarType}`,
    `생년월일: ${formatBirthDate(profile)}`,
    `출생시간: ${formatBirthTime(profile)}`,
  ].join("\n");
}

export function buildSajuPrompt(form: SajuQuestionFormData): BuiltSajuPrompt {
  const isCompatibilityMode = form.mode === "compatibility";
  const guardrails = resolveGuardrails();

  const systemPrompt = [
    "당신은 사주 해석 질문문 설계 어시스턴트입니다.",
    "아래 고정 가드레일을 반드시 지키세요.",
    `1) 필수 포함 항목 고정: ${guardrails.requiredSections.join(", ")}`,
    `2) 응답 형식 고정: ${guardrails.responseFormat}`,
    `3) 분석 목적 고정: ${guardrails.analysisPurpose}`,
    `4) 해석 톤 고정: ${guardrails.interpretationTone}`,
    `5) 단정 금지 고정: ${
      guardrails.prohibitDefinitiveClaims
        ? "사실 단정/예언형 표현 금지"
        : "없음"
    }`,
    `6) 쉬운 설명 고정: ${
      guardrails.useSimpleLanguage
        ? "전문용어를 풀어 쓰고 중학생도 이해 가능한 문장 사용"
        : "없음"
    }`,
  ].join("\n");

  const userPrompt = [
    `분석 모드: ${isCompatibilityMode ? "궁합 분석" : "내 사주 분석"}`,
    formatProfile("내 정보", form.me),
    isCompatibilityMode ? formatProfile("상대방 정보", form.partner) : "",
    `현재 상황: ${form.goal.situation || "미입력"}`,
    `질문 목적: ${form.goal.purpose || "미입력"}`,
    `해석 스타일: ${toStyleLabel(form.goal.style)}`,
    `추가 요청사항: ${form.goal.customRequest || "없음"}`,
    "",
    "위 정보를 바탕으로, 가드레일을 지키는 질문문 초안을 작성하세요.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    systemPrompt,
    userPrompt,
    guardrails,
  };
}
