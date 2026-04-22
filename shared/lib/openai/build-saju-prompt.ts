import type {
  AnalysisMode,
  BirthProfile,
  CalendarType,
  Gender,
  PromptStyle,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";

export interface SajuPromptGuardrails {
  outputGoal: string;
  outputFormat: string;
  perspectiveInstruction: string;
  missingValueInstruction: string;
  interpretationTone: string;
  prohibitDefinitiveClaims: boolean;
  useSimpleLanguage: boolean;
}

export interface SajuQuestionExpansionGuide {
  structureInstruction: string;
  basicInfoInstruction: string;
  requiredProfileFieldsInstruction: string;
  sectionSeparationInstruction: string;
  prioritizationInstruction: string;
  questionLensInstruction: string;
  duplicateAvoidanceInstruction: string;
  phrasingVariationInstruction: string;
  includeActionTip: boolean;
  timeHorizonInstruction: string;
}

export const SAJU_PROMPT_GUARDRAILS: SajuPromptGuardrails = {
  outputGoal:
    "사용자가 ChatGPT, Gemini, Claude 같은 외부 AI에 그대로 붙여 넣어 사용할 최종 질문문 1개만 작성한다.",
  outputFormat:
    "하나의 완성된 질문문 블록으로 응답한다. 사용자에게 보이는 섹션 제목은 '기본 정보', '현재 상황', '중점적으로 알고 싶은 내용', '응답 방식'만 사용할 수 있다. '중점적으로 알고 싶은 내용' 아래에는 5~6개의 번호 질문을 넣을 수 있다. JSON, 마크다운 테이블, 코드블록은 사용하지 않는다.",
  perspectiveInstruction:
    "결과물은 사용자를 대신해 쓰는 1인칭 시점으로 작성하고, 사용자의 이름을 반복 호명하거나 제3자 설명문처럼 쓰지 않는다.",
  missingValueInstruction:
    "사용자가 입력하지 않은 정보는 추측하지 않고, 비어 있는 값은 '미입력'처럼 노출하지 말고 자연스럽게 생략한다.",
  interpretationTone:
    "명확하고 차분한 조언형 톤을 유지하되, 실제로 복사해 붙여 넣고 싶은 전문적인 질문문처럼 쓴다. 자극적 표현이나 공포 유도 표현은 금지한다.",
  prohibitDefinitiveClaims: true,
  useSimpleLanguage: true,
};

export const SAJU_QUESTION_EXPANSION_GUIDE: SajuQuestionExpansionGuide = {
  structureInstruction:
    "최종 결과물은 '기본 정보', '현재 상황', '중점적으로 알고 싶은 내용', '응답 방식' 순서로 구성한다. 각 섹션은 바로 복사해서 붙여 넣을 수 있을 만큼 간결하고 선명해야 한다.",
  basicInfoInstruction:
    "'기본 정보' 섹션은 입력값을 키-값 요약처럼 옮기지 말고, 사용자가 직접 말하듯 자연스러운 1인칭 문장 1~2개로 작성한다.",
  requiredProfileFieldsInstruction:
    "이름, 달력 기준, 생년월일, 출생시간, 성별 중 입력된 값은 '기본 정보'에서 한 번씩 반드시 반영한다. 특히 달력 기준과 출생시간이 있으면 생략하지 않는다.",
  sectionSeparationInstruction:
    "'기본 정보'에는 프로필 사실만 넣고, 현재 고민이나 요청은 넣지 않는다. '현재 상황'에는 고민, 맥락, 원하는 조언만 넣고 프로필 사실은 넣지 않는다.",
  prioritizationInstruction:
    "현재 상황과 질문 목적을 우선 반영하고, 사주 정보는 필요한 만큼만 반영한다. '중점적으로 알고 싶은 내용'에서는 서로 다른 관점의 질문 5~6개로 확장한다.",
  questionLensInstruction:
    "각 질문은 서로 다른 분석 렌즈 하나만 담당한다. 가능한 렌즈는 성향/강점, 현재 흐름/타이밍, 기회/리스크, 감정/관계 변수, 선택 기준, 실천 조언이다.",
  duplicateAvoidanceInstruction:
    "이미 다룬 렌즈를 다른 표현으로 반복하지 않는다. 비슷한 질문을 둘로 쪼개지 않는다. 갈등/리스크와 감정/소통처럼 가까운 렌즈를 함께 쓸 때도 같은 원인이나 같은 걱정을 반복하지 않는다. 사용자 입력과 관련 없는 렌즈는 억지로 넣지 않는다.",
  phrasingVariationInstruction:
    "번호 질문의 문체는 정중한 '-해 주세요'체로 통일한다. 다만 같은 핵심 명사와 동사를 연속 반복하지 말고, '알려주세요', '짚어주세요', '설명해 주세요', '정리해 주세요', '조언해 주세요'처럼 자연스럽게 변주한다.",
  includeActionTip: true,
  timeHorizonInstruction:
    "질문 목적상 적절하면 최근 3개월, 올해, 다음 분기 같은 시간 축을 1~2개 질문에 자연스럽게 반영한다.",
};

interface BuiltSajuPrompt {
  systemPrompt: string;
  userPrompt: string;
  guardrails: SajuPromptGuardrails;
  expansionGuide: SajuQuestionExpansionGuide;
}

function resolveGuardrails(): SajuPromptGuardrails {
  return {
    outputGoal: SAJU_PROMPT_GUARDRAILS.outputGoal,
    outputFormat: SAJU_PROMPT_GUARDRAILS.outputFormat,
    perspectiveInstruction: SAJU_PROMPT_GUARDRAILS.perspectiveInstruction,
    missingValueInstruction: SAJU_PROMPT_GUARDRAILS.missingValueInstruction,
    interpretationTone: SAJU_PROMPT_GUARDRAILS.interpretationTone,
    prohibitDefinitiveClaims: SAJU_PROMPT_GUARDRAILS.prohibitDefinitiveClaims,
    useSimpleLanguage: SAJU_PROMPT_GUARDRAILS.useSimpleLanguage,
  };
}

function resolveExpansionGuide(): SajuQuestionExpansionGuide {
  return {
    structureInstruction: SAJU_QUESTION_EXPANSION_GUIDE.structureInstruction,
    basicInfoInstruction:
      SAJU_QUESTION_EXPANSION_GUIDE.basicInfoInstruction,
    requiredProfileFieldsInstruction:
      SAJU_QUESTION_EXPANSION_GUIDE.requiredProfileFieldsInstruction,
    sectionSeparationInstruction:
      SAJU_QUESTION_EXPANSION_GUIDE.sectionSeparationInstruction,
    prioritizationInstruction:
      SAJU_QUESTION_EXPANSION_GUIDE.prioritizationInstruction,
    questionLensInstruction:
      SAJU_QUESTION_EXPANSION_GUIDE.questionLensInstruction,
    duplicateAvoidanceInstruction:
      SAJU_QUESTION_EXPANSION_GUIDE.duplicateAvoidanceInstruction,
    phrasingVariationInstruction:
      SAJU_QUESTION_EXPANSION_GUIDE.phrasingVariationInstruction,
    includeActionTip: SAJU_QUESTION_EXPANSION_GUIDE.includeActionTip,
    timeHorizonInstruction:
      SAJU_QUESTION_EXPANSION_GUIDE.timeHorizonInstruction,
  };
}

function hasText(value: string): boolean {
  return value.trim().length > 0;
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

function toStyleInstruction(style: PromptStyle): string {
  if (style === "direct") {
    return "완곡한 표현을 줄이고 핵심 쟁점, 주의점, 선택 기준이 먼저 드러나게 작성한다. 단정은 피한다.";
  }

  if (style === "empathetic") {
    return "현재 감정 상태를 배려하는 문장을 자연스럽게 포함하되, 위로에 치우치지 말고 현실적인 해석과 조언도 함께 묻게 한다.";
  }

  return "장점과 리스크, 기대 포인트와 주의 포인트를 균형 있게 묻게 한다.";
}

function toCalendarLabel(calendarType: CalendarType): string {
  if (calendarType === "lunar") {
    return "음력";
  }

  return "양력";
}

function toGenderLabel(gender: Gender): string {
  if (gender === "male") {
    return "남성";
  }

  if (gender === "female") {
    return "여성";
  }

  if (gender === "other") {
    return "기타";
  }

  return "";
}

function formatBirthDate(profile: BirthProfile): string {
  const birthDate = profile.birthDate.trim();

  if (!birthDate) {
    return "";
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);

  if (!match) {
    return birthDate;
  }

  const [, year, month, day] = match;

  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

function formatBirthTime(profile: BirthProfile): string {
  if (profile.isBirthTimeUnknown) {
    return "모름";
  }

  const birthTime = profile.birthTime.trim();

  if (!birthTime) {
    return "";
  }

  const match = /^(\d{2}):(\d{2})$/.exec(birthTime);

  if (!match) {
    return birthTime;
  }

  const [, hour, minute] = match;

  return `${Number(hour)}시 ${minute}분`;
}

function appendField(
  lines: string[],
  label: string,
  value: string,
): void {
  if (!hasText(value)) {
    return;
  }

  lines.push(`- ${label}: ${value}`);
}

function formatProfile(label: string, profile: BirthProfile): string {
  const lines = [label];

  appendField(lines, "이름", profile.name.trim());
  appendField(lines, "성별", toGenderLabel(profile.gender));
  appendField(lines, "달력 기준", toCalendarLabel(profile.calendarType));
  appendField(lines, "생년월일", formatBirthDate(profile));
  appendField(lines, "출생시간", formatBirthTime(profile));

  return lines.length > 1 ? lines.join("\n") : "";
}

function buildRequiredBasicInfoFacts(
  label: string,
  profile: BirthProfile,
): string {
  const facts: string[] = [];

  if (hasText(profile.name)) {
    facts.push(`이름 ${profile.name.trim()}`);
  }

  facts.push(`달력 기준 ${toCalendarLabel(profile.calendarType)}`);

  const birthDate = formatBirthDate(profile);

  if (hasText(birthDate)) {
    facts.push(`생년월일 ${birthDate}`);
  }

  const birthTime = formatBirthTime(profile);

  if (hasText(birthTime) && birthTime !== "모름") {
    facts.push(`출생시간 ${birthTime}`);
  }

  const gender = toGenderLabel(profile.gender);

  if (hasText(gender)) {
    facts.push(`성별 ${gender}`);
  }

  return facts.length > 0
    ? `- ${label}: ${facts.join(", ")}`
    : "";
}

function toModeLabel(mode: AnalysisMode): string {
  if (mode === "compatibility") {
    return "궁합 분석";
  }

  return "내 사주 분석";
}

function toModeFocusInstruction(mode: AnalysisMode): string {
  if (mode === "compatibility") {
    return "궁합 분석에서는 두 사람의 성향 차이, 감정 표현 방식, 갈등 포인트, 관계 흐름, 관계를 이어갈 때 필요한 태도를 중심으로 자연스럽게 확장한다.";
  }

  return "내 사주 분석에서는 성향, 강점, 현재 흐름, 주의할 점, 실천 가능한 조언을 중심으로 자연스럽게 확장한다.";
}

function toModeQuestionLensInstruction(mode: AnalysisMode): string {
  if (mode === "compatibility") {
    return "궁합 분석에서는 두 사람의 성향 차이, 관계 흐름, 갈등 포인트, 감정 표현 방식, 관계를 이어갈 때 필요한 태도 같은 렌즈를 우선 선택한다.";
  }

  return "내 사주 분석에서는 성향/강점, 현재 흐름, 기회와 리스크, 감정 또는 인간관계의 영향, 선택 기준, 실천 조언 같은 렌즈를 우선 선택한다.";
}

export function buildSajuPrompt(form: SajuQuestionFormData): BuiltSajuPrompt {
  const isCompatibilityMode = form.mode === "compatibility";
  const guardrails = resolveGuardrails();
  const expansionGuide = resolveExpansionGuide();
  const additionalRequest = form.goal.customRequest.trim();

  const systemPrompt = [
    "당신은 사주 해석 질문을 설명하는 사람이 아니라, 사용자가 외부 AI에 바로 붙여 넣을 최종 질문문을 대신 작성하는 편집자입니다.",
    `목표: ${guardrails.outputGoal}`,
    "반드시 지킬 규칙:",
    `- 응답 형식: ${guardrails.outputFormat}`,
    `- 시점 규칙: ${guardrails.perspectiveInstruction}`,
    `- 빈값 처리: ${guardrails.missingValueInstruction}`,
    `- 해석 톤: ${guardrails.interpretationTone}`,
    `- 단정 금지: ${
      guardrails.prohibitDefinitiveClaims
        ? "사실 단정/예언형 표현 금지"
        : "없음"
    }`,
    `- 쉬운 한국어: ${
      guardrails.useSimpleLanguage
        ? "전문용어를 풀어 쓰고 중학생도 이해 가능한 문장 사용"
        : "없음"
    }`,
    `- 문단 구조: ${expansionGuide.structureInstruction}`,
    `- 기본 정보 문장화: ${expansionGuide.basicInfoInstruction}`,
    `- 기본 정보 필수 사실: ${expansionGuide.requiredProfileFieldsInstruction}`,
    `- 섹션 분리: ${expansionGuide.sectionSeparationInstruction}`,
    `- 확장 원칙: ${expansionGuide.prioritizationInstruction}`,
    `- 질문 렌즈: ${expansionGuide.questionLensInstruction}`,
    `- 중복 방지: ${expansionGuide.duplicateAvoidanceInstruction}`,
    `- 표현 다양성: ${expansionGuide.phrasingVariationInstruction}`,
    `- 시간 축: ${expansionGuide.timeHorizonInstruction}`,
    "- 번호 질문은 '중점적으로 알고 싶은 내용' 섹션에서만 사용한다.",
    "- 결과물에는 '대상 사주 정보 요약', '현재 상황 요약', '질문 목적 요약', '추가 확인 질문(선택)' 같은 내부 메타 제목을 넣지 않는다.",
    "스타일 규칙:",
    "- 균형형: 장점과 리스크, 기대 포인트와 주의 포인트를 균형 있게 묻게 한다.",
    "- 직설형: 완곡한 표현을 줄이고 핵심 쟁점과 주의점을 먼저 묻게 한다. 단, 단정은 금지한다.",
    "- 공감형: 현재 감정 상태를 배려하는 문장을 자연스럽게 포함하되, 위로에 치우치지 말고 현실적인 조언도 함께 묻게 한다.",
  ].join("\n");

  const userPrompt = [
    "[서비스 목적]",
    "사용자가 외부 AI에 그대로 붙여 넣어 사용할 최종 질문문 1개를 작성한다.",
    "",
    "[입력 정보]",
    `분석 모드: ${toModeLabel(form.mode)}`,
    formatProfile("내 정보", form.me),
    isCompatibilityMode ? formatProfile("상대방 정보", form.partner) : "",
    "",
    "[기본 정보에 반드시 반영할 사실]",
    buildRequiredBasicInfoFacts("내 정보", form.me),
    isCompatibilityMode
      ? buildRequiredBasicInfoFacts("상대방 정보", form.partner)
      : "",
    `현재 상황: ${form.goal.situation.trim() || "없음"}`,
    `질문 목적: ${form.goal.purpose.trim() || "없음"}`,
    `해석 스타일: ${toStyleLabel(form.goal.style)}`,
    additionalRequest ? `추가 요청: ${additionalRequest}` : "",
    "",
    "[작성 초점]",
    "- 결과물은 설명문이나 보고서가 아니라, 복사해서 바로 쓸 수 있는 완성된 질문문이어야 한다.",
    "- 사용자에게 보이는 섹션 제목은 '기본 정보', '현재 상황', '중점적으로 알고 싶은 내용', '응답 방식'만 사용한다.",
    "- '기본 정보'는 입력값 요약이 아니라 자연스러운 1인칭 문장으로 쓴다. 예: '저는 ...입니다.' 또는 '제 이름은 ...이고, 저는 ...입니다.'",
    "- 아래 '기본 정보에 반드시 반영할 사실'의 항목은 '기본 정보' 문장에서 빠짐없이 1회씩 반영한다.",
    "- 달력 기준과 출생시간이 있으면 '기본 정보'에서 생략하지 않는다.",
    "- '기본 정보'에는 현재 고민이나 요청을 넣지 않고, '현재 상황'에는 프로필 사실을 넣지 않는다.",
    "- '중점적으로 알고 싶은 내용'에는 번호가 붙은 구체 질문 5~6개를 넣는다.",
    "- 각 질문은 서로 다른 분석 렌즈 하나만 담당하게 쓴다.",
    "- 이미 다룬 렌즈를 다른 표현으로 반복하지 않는다.",
    "- 비슷한 질문을 둘로 쪼개지 않는다.",
    "- 갈등/리스크와 감정/소통처럼 인접한 렌즈를 함께 쓸 때도, 같은 원인이나 같은 걱정을 되풀이하지 않는다.",
    "- 질문 문체는 정중한 '-해 주세요'체로 통일한다.",
    "- 같은 핵심 명사와 동사를 연속 반복하지 않는다.",
    "- 사용자 입력과 관련 없는 렌즈는 억지로 넣지 않는다.",
    "- 사용자의 현재 상황과 질문 목적이 앞부분에서 바로 드러나게 쓴다.",
    "- 사용자가 직접 입력한 키워드와 우선순위를 먼저 반영한다.",
    "- 사주 정보는 필요한 만큼만 자연스럽게 녹이고, 비어 있는 정보는 드러내지 않는다.",
    `- 모드별 초점: ${toModeFocusInstruction(form.mode)}`,
    `- 모드별 렌즈 힌트: ${toModeQuestionLensInstruction(form.mode)}`,
    `- 스타일 적용 포인트: ${toStyleInstruction(form.goal.style)}`,
    `- 시간 축 적용 포인트: ${expansionGuide.timeHorizonInstruction}`,
    expansionGuide.includeActionTip
      ? "- '응답 방식' 섹션에서는 현실적인 조언, 주의 포인트, 쉬운 설명을 함께 요청한다."
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    systemPrompt,
    userPrompt,
    guardrails,
    expansionGuide,
  };
}
