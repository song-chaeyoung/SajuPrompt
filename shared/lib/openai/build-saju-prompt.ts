import type {
  AnalysisMode,
  BirthProfile,
  Gender,
  PromptStyle,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";
import type {
  DerivedSajuProfileContext,
  DerivedSajuPromptContext,
} from "@/shared/lib/manseryeok/types";

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
    "사용자가 ChatGPT, Gemini, Claude 같은 외부 AI에 그대로 붙여 넣을 수 있는 최종 질문문 1개만 작성한다.",
  outputFormat:
    "응답은 하나의 완성된 질문문만 작성한다. 사용자에게 보이는 섹션 제목은 '기본 정보', '현재 상황', '중점적으로 묻고 싶은 내용', '응답 방식'만 사용한다. JSON, 표, 코드 블록은 사용하지 않는다.",
  perspectiveInstruction:
    "결과물은 사용자가 직접 말하는 1인칭 시점으로 작성하고, 설명문이나 해설 문단을 덧붙이지 않는다.",
  missingValueInstruction:
    "사용자가 입력하지 않은 정보는 추측하지 않는다. 빈 값은 억지로 표시하지 말고 자연스럽게 생략한다.",
  interpretationTone:
    "복사해서 바로 붙여 넣을 수 있는 질문문답게 간결하지만 충분히 구체적으로 쓴다. 단정적 예언이나 공포 조장은 피한다.",
  prohibitDefinitiveClaims: true,
  useSimpleLanguage: true,
};

export const SAJU_QUESTION_EXPANSION_GUIDE: SajuQuestionExpansionGuide = {
  structureInstruction:
    "최종 결과물은 '기본 정보', '현재 상황', '중점적으로 묻고 싶은 내용', '응답 방식' 순서로 구성한다.",
  basicInfoInstruction:
    "'기본 정보'는 먼저 1~2문장 자연어 소개로 시작하고, 필요하면 그 아래에 짧은 기술 사실 라인을 덧붙여 계산 정보를 정리한다.",
  requiredProfileFieldsInstruction:
    "기본 정보에는 입력 달력 기준, 양력일과 음력일, 년주·월주·일주·시주, 시간 보정 적용 여부와 보정 시각, 출생시간 미상 여부를 빠짐없이 반영한다.",
  sectionSeparationInstruction:
    "'기본 정보'에는 사실 정리만 넣고, 현재 고민과 요청은 각각 '현재 상황'과 '응답 방식'에 분리한다.",
  prioritizationInstruction:
    "현재 상황과 질문 목적을 가장 우선하고, 사주 정보는 그 목적을 더 정확하게 전달하는 범위에서 사용한다.",
  questionLensInstruction:
    "번호 질문은 서로 다른 분석 관점으로 확장한다. 예를 들면 성향과 강점, 현재 흐름, 기회와 리스크, 관계와 감정, 선택 기준, 실천 조언을 나눠서 묻는다.",
  duplicateAvoidanceInstruction:
    "서로 비슷한 걱정을 표현만 바꿔 반복하지 않는다. 관련 없는 렌즈는 억지로 끼워 넣지 않는다.",
  phrasingVariationInstruction:
    "번호 질문은 모두 '-해 주세요'체를 유지하되, 같은 동사와 명사를 반복하지 않고 표현을 자연스럽게 변주한다.",
  includeActionTip: true,
  timeHorizonInstruction:
    "질문 목적과 관련되면 최근 3개월, 올해, 다음 분기처럼 시간축을 1~2개 질문에 자연스럽게 반영한다.",
};

interface BuiltSajuPrompt {
  systemPrompt: string;
  userPrompt: string;
  guardrails: SajuPromptGuardrails;
  expansionGuide: SajuQuestionExpansionGuide;
}

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

function resolveGuardrails(): SajuPromptGuardrails {
  return { ...SAJU_PROMPT_GUARDRAILS };
}

function resolveExpansionGuide(): SajuQuestionExpansionGuide {
  return { ...SAJU_QUESTION_EXPANSION_GUIDE };
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
    return "핵심과 주의점이 먼저 드러나게 쓰고, 지나치게 돌려 말하지 않는다.";
  }

  if (style === "empathetic") {
    return "지금의 감정 상태를 배려하는 문장을 포함하되, 현실적인 조언과 분석을 함께 요청한다.";
  }

  return "장점과 리스크, 기회와 주의점을 균형 있게 다뤄 달라고 요청한다.";
}

function toInputCalendarLabel(profile: BirthProfile): string {
  if (profile.calendarType === "lunar") {
    if (profile.isLeapMonth === true) {
      return "음력(윤달)";
    }

    if (profile.isLeapMonth === false) {
      return "음력(평달)";
    }

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

function formatInputDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

  if (!match) {
    return value.trim();
  }

  const [, year, month, day] = match;
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

function formatDate(value: {
  year: number;
  month: number;
  day: number;
}): string {
  return `${value.year}년 ${value.month}월 ${value.day}일`;
}

function formatTimeValue(hour: number, minute: number): string {
  return `${hour}시 ${String(minute).padStart(2, "0")}분`;
}

function formatBirthTime(profile: BirthProfile): string {
  if (profile.isBirthTimeUnknown || !hasText(profile.birthTime)) {
    return "";
  }

  const match = /^(\d{2}):(\d{2})$/.exec(profile.birthTime.trim());

  if (!match) {
    return profile.birthTime.trim();
  }

  const [, hour, minute] = match;
  return `${Number(hour)}시 ${minute}분`;
}

function formatPillar(
  hangul: string | null,
  hanja: string | null,
): string {
  if (!hangul) {
    return "없음";
  }

  return hanja ? `${hangul}(${hanja})` : hangul;
}

function appendField(lines: string[], label: string, value: string): void {
  if (!hasText(value)) {
    return;
  }

  lines.push(`- ${label}: ${value}`);
}

function formatProfile(label: string, profile: BirthProfile): string {
  const lines = [label];

  appendField(lines, "이름", profile.name.trim());
  appendField(lines, "출생지", profile.birthPlace.trim());
  appendField(lines, "성별", toGenderLabel(profile.gender));
  appendField(lines, "입력 달력 기준", toInputCalendarLabel(profile));
  appendField(lines, "생년월일", formatInputDate(profile.birthDate));
  appendField(lines, "출생시간", formatBirthTime(profile));

  if (profile.calendarType === "lunar" && profile.isLeapMonth !== null) {
    appendField(
      lines,
      "윤달 여부",
      profile.isLeapMonth ? "윤달" : "일반 음력",
    );
  }

  return lines.length > 1 ? lines.join("\n") : "";
}

function buildRequiredBasicInfoFacts(
  label: string,
  profile: BirthProfile,
  derived: DerivedSajuProfileContext,
): string {
  const lines: string[] = [];
  const birthTime = formatBirthTime(profile);

  lines.push(
    `- ${label}: 입력 달력 기준은 ${toInputCalendarLabel(profile)}이다.`,
  );
  lines.push(
    `- ${label}: 양력일은 ${formatDate(derived.solarDate)}이고, 음력일은 ${formatDate(derived.lunarDate)}${derived.lunarDate.isLeapMonth ? " (윤달)" : ""}이다.`,
  );
  lines.push(
    `- ${label}: 년주는 ${formatPillar(derived.pillars.year, derived.pillarsHanja.year)}, 월주는 ${formatPillar(derived.pillars.month, derived.pillarsHanja.month)}, 일주는 ${formatPillar(derived.pillars.day, derived.pillarsHanja.day)}이다.`,
  );

  if (derived.pillars.hour) {
    lines.push(
      `- ${label}: 시주는 ${formatPillar(derived.pillars.hour, derived.pillarsHanja.hour)}이다.`,
    );
  } else {
    lines.push(`- ${label}: 출생시간 정보가 없어서 시주는 없다.`);
  }

  if (hasText(derived.birthPlaceLabel)) {
    const correctionMessage = derived.isTimeCorrected
      ? `시간 보정이 적용되었고 보정 시각은 ${formatTimeValue(
          derived.correctedTime?.hour ?? 0,
          derived.correctedTime?.minute ?? 0,
        )}이다.`
      : birthTime
        ? "시간 보정은 적용하지 않았다."
        : "출생시간이 없어 시간 보정은 적용하지 않았다.";

    lines.push(
      `- ${label}: 출생지는 ${derived.birthPlaceLabel}이며 ${correctionMessage}`,
    );
  } else if (birthTime) {
    lines.push(
      `- ${label}: 출생시간은 ${birthTime}이고 출생지 기반 시간 보정 여부도 함께 반영한다.`,
    );
  }

  return lines.join("\n");
}

function toModeLabel(mode: AnalysisMode): string {
  return mode === "compatibility" ? "궁합 분석" : "내 사주 분석";
}

function toModeFocusInstruction(mode: AnalysisMode): string {
  if (mode === "compatibility") {
    return "궁합 분석에서는 서로의 성향 차이, 감정 표현 방식, 갈등 지점, 관계 흐름과 유지 포인트를 중심으로 질문을 확장한다.";
  }

  return "내 사주 분석에서는 성향, 강점, 현재 흐름, 주의점, 선택 기준, 실천 조언을 중심으로 질문을 확장한다.";
}

function toModeQuestionLensInstruction(mode: AnalysisMode): string {
  if (mode === "compatibility") {
    return "궁합 분석에서는 관계 흐름, 감정 소통, 갈등 원인, 서로 다른 강점과 보완점 같은 렌즈를 우선 사용한다.";
  }

  return "내 사주 분석에서는 성향과 강점, 현재 흐름, 기회와 리스크, 감정과 인간관계, 선택 기준, 실천 조언 렌즈를 우선 사용한다.";
}

export function buildSajuPrompt(
  form: SajuQuestionFormData,
  derived: DerivedSajuPromptContext,
): BuiltSajuPrompt {
  const isCompatibilityMode = form.mode === "compatibility";
  const guardrails = resolveGuardrails();
  const expansionGuide = resolveExpansionGuide();
  const additionalRequest = form.goal.customRequest.trim();

  const systemPrompt = [
    "당신은 사주 해석 질문문을 설계하는 편집자다.",
    `목표: ${guardrails.outputGoal}`,
    "반드시 지킬 규칙:",
    `- 출력 형식: ${guardrails.outputFormat}`,
    `- 시점 규칙: ${guardrails.perspectiveInstruction}`,
    `- 빈값 처리: ${guardrails.missingValueInstruction}`,
    `- 톤: ${guardrails.interpretationTone}`,
    `- 확정적 예언 금지: ${
      guardrails.prohibitDefinitiveClaims ? "예" : "아니오"
    }`,
    `- 쉬운 언어 사용: ${guardrails.useSimpleLanguage ? "예" : "아니오"}`,
    `- 구조: ${expansionGuide.structureInstruction}`,
    `- 기본 정보 작성법: ${expansionGuide.basicInfoInstruction}`,
    `- 기본 정보 필수 반영 사항: ${expansionGuide.requiredProfileFieldsInstruction}`,
    `- 섹션 분리 원칙: ${expansionGuide.sectionSeparationInstruction}`,
    `- 질문 확장 우선순위: ${expansionGuide.prioritizationInstruction}`,
    `- 질문 렌즈: ${expansionGuide.questionLensInstruction}`,
    `- 중복 방지: ${expansionGuide.duplicateAvoidanceInstruction}`,
    `- 문체 변주: ${expansionGuide.phrasingVariationInstruction}`,
    `- 시간축 반영: ${expansionGuide.timeHorizonInstruction}`,
    "- 번호 질문은 반드시 '중점적으로 묻고 싶은 내용' 섹션 안에만 둔다.",
    "- 사용자에게 보이는 새 섹션 제목을 추가하지 않는다.",
    "- '기본 정보' 섹션은 자연어 소개 뒤에 짧은 기술 사실 라인을 붙여도 된다.",
    "- 계산 정보는 숨기지 말고 기본 정보 섹션 안에 분명하게 드러낸다.",
  ].join("\n");

  const userPrompt = [
    "[서비스 목적]",
    "사용자가 외부 AI에 그대로 붙여 넣을 수 있는 최종 질문문 1개를 작성한다.",
    "",
    "[입력 정보]",
    `분석 모드: ${toModeLabel(form.mode)}`,
    formatProfile("나 정보", form.me),
    isCompatibilityMode ? formatProfile("상대방 정보", form.partner) : "",
    "",
    "[기본 정보에 반드시 반영할 계산 사실]",
    buildRequiredBasicInfoFacts("나 정보", form.me, derived.me),
    isCompatibilityMode && derived.partner
      ? buildRequiredBasicInfoFacts(
          "상대방 정보",
          form.partner,
          derived.partner,
        )
      : "",
    `현재 상황: ${form.goal.situation.trim() || "없음"}`,
    `질문 목적: ${form.goal.purpose.trim() || "없음"}`,
    `원하는 응답 톤: ${toStyleLabel(form.goal.style)}`,
    additionalRequest ? `추가 요청: ${additionalRequest}` : "",
    "",
    "[작성 초점]",
    "- 결과물은 설명문이 아니라 복사해서 바로 붙여 넣을 수 있는 완성형 질문문이어야 한다.",
    "- 사용자에게 보이는 섹션 제목은 '기본 정보', '현재 상황', '중점적으로 묻고 싶은 내용', '응답 방식'만 사용한다.",
    "- '기본 정보'는 먼저 1인칭 자연어 소개로 쓰고, 그 아래에 계산된 기술 사실 라인을 덧붙여도 된다.",
    "- 위의 '기본 정보에 반드시 반영할 계산 사실'은 기본 정보 섹션에 빠짐없이 반영한다.",
    "- 양력일과 음력일, 년주·월주·일주·시주, 시간 보정 여부와 보정 시각은 숨기지 않는다.",
    "- 출생시간이 없으면 시주가 없다는 점을 분명하게 적는다.",
    "- '현재 상황'에는 고민과 맥락만 쓰고, 기술적인 사주 정보 나열은 넣지 않는다.",
    "- '중점적으로 묻고 싶은 내용'에는 번호가 붙은 구체적인 질문 5~6개를 넣는다.",
    "- 각 질문은 서로 다른 분석 렌즈를 사용하고, 같은 걱정을 표현만 바꿔 반복하지 않는다.",
    "- 질문 문체는 모두 '-해 주세요'체를 유지한다.",
    "- 사용자의 현재 상황과 질문 목적이 질문 5~6개 안에서 바로 드러나야 한다.",
    `- 모드별 초점: ${toModeFocusInstruction(form.mode)}`,
    `- 모드별 렌즈 힌트: ${toModeQuestionLensInstruction(form.mode)}`,
    `- 스타일 적용: ${toStyleInstruction(form.goal.style)}`,
    `- 시간축 적용: ${expansionGuide.timeHorizonInstruction}`,
    expansionGuide.includeActionTip
      ? "- '응답 방식'에는 현실적인 조언, 주의 포인트, 쉬운 설명, 바로 적용할 행동 제안을 요청한다."
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
