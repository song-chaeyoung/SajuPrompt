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
  detailPreference: string;
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
  responseContractInstruction: string;
  includeActionTip: boolean;
  timeHorizonInstruction: string;
}

interface BuiltSajuPrompt {
  systemPrompt: string;
  userPrompt: string;
  guardrails: SajuPromptGuardrails;
  expansionGuide: SajuQuestionExpansionGuide;
}

interface TopicLensProfile {
  id: "relationship" | "career_money" | "emotion" | "family" | "health";
  label: string;
  keywords: string[];
  lensInstruction: string;
  focusInstruction: string;
  responseLines: string[];
}

export const SAJU_PROMPT_GUARDRAILS: SajuPromptGuardrails = {
  outputGoal:
    "사용자가 ChatGPT, Gemini, Claude 같은 외부 AI에 그대로 붙여 넣을 수 있는 최종 질문문 1개만 작성한다.",
  outputFormat:
    "응답은 하나의 완성된 질문문만 작성한다. 사용자에게 보이는 섹션 제목은 '기본 정보', '현재 상황', '중점적으로 묻고 싶은 내용', '응답 방식'만 사용한다. JSON, 표, 코드 블록은 사용하지 않는다.",
  perspectiveInstruction:
    "결과물은 사용자가 직접 말하는 1인칭 시점으로 작성하고, 설명문이나 별도의 해설 문단을 덧붙이지 않는다.",
  missingValueInstruction:
    "사용자가 입력하지 않은 정보는 추측하지 않는다. 빈 값은 억지로 표시하지 말고 자연스럽게 생략한다.",
  interpretationTone:
    "복사해서 바로 붙여 넣을 수 있는 질문문답게 자연스럽고 실전적으로 쓴다. 단정적인 예언이나 공포 조장은 피한다.",
  detailPreference:
    "짧게 요약하는 것보다 외부 AI가 맥락을 충분히 읽고 자세히 답하게 만드는 쪽을 우선한다. 다만 같은 사실을 다른 표현으로 반복하지 않는다.",
  prohibitDefinitiveClaims: true,
  useSimpleLanguage: true,
};

export const SAJU_QUESTION_EXPANSION_GUIDE: SajuQuestionExpansionGuide = {
  structureInstruction:
    "최종 결과물은 '기본 정보', '현재 상황', '중점적으로 묻고 싶은 내용', '응답 방식' 순서로 구성한다.",
  basicInfoInstruction:
    "'기본 정보'는 먼저 1~2문장 자연어 소개로 시작하고, 그 아래에 외부 AI가 해석에 바로 쓸 수 있는 기술 사실 라인을 덧붙인다.",
  requiredProfileFieldsInstruction:
    "기본 정보에는 입력 달력 기준, 양력일과 음력일, 년주·월주·일주·시주, 시간 보정 적용 여부와 보정 시각, 출생시간 미상 여부를 빠짐없이 반영한다.",
  sectionSeparationInstruction:
    "'기본 정보'에는 사실 정리만 넣고, 고민과 질문 의도는 각각 '현재 상황'과 '응답 방식'으로 분리한다.",
  prioritizationInstruction:
    "현재 상황과 질문 목적을 가장 우선하고, 사주 정보는 그 목적을 더 정확하게 전달하는 재료로 사용한다.",
  questionLensInstruction:
    "번호 질문은 서로 다른 분석 관점으로 확장한다. 예를 들면 성향과 강점, 현재 흐름, 기회와 리스크, 관계와 감정, 선택 기준, 실천 조언을 나눠서 묻는다.",
  duplicateAvoidanceInstruction:
    "비슷한 걱정을 표현만 바꿔 반복하지 않는다. 관련 없는 렌즈는 억지로 끼워 넣지 않는다.",
  phrasingVariationInstruction:
    "번호 질문은 모두 '-해 주세요'체를 유지하되, '알려 주세요'만 반복하지 말고 '짚어 주세요', '정리해 주세요', '분석해 주세요', '비교해 주세요', '제안해 주세요'처럼 표현을 자연스럽게 변주한다.",
  responseContractInstruction:
    "'응답 방식' 섹션에는 외부 AI가 전체 흐름 요약, 질문별 상세 답변, 해석 이유 설명, 좋은 점과 주의점 분리, 바로 적용할 행동 제안까지 하도록 구체적으로 요청한다.",
  includeActionTip: true,
  timeHorizonInstruction:
    "질문 목적과 관련되면 최근 3개월, 올해, 다음 분기처럼 시간축을 1~2개 질문에 자연스럽게 반영한다.",
};

const TOPIC_LENS_PROFILES: TopicLensProfile[] = [
  {
    id: "relationship",
    label: "연애·관계",
    keywords: [
      "연애",
      "사랑",
      "썸",
      "재회",
      "이별",
      "호감",
      "관계",
      "대인",
      "인간관계",
      "결혼",
      "배우자",
      "소개팅",
    ],
    lensInstruction:
      "연애·관계 주제라면 관계 흐름, 끌림의 방식, 감정 표현, 거리 조절, 갈등 패턴, 잘 맞는 관계 방식 같은 렌즈를 우선 검토한다.",
    focusInstruction:
      "연애·관계 맥락이 분명하면 질문 5~6개 중 일부는 관계 흐름, 감정 표현 방식, 갈등 또는 거리 조절, 관계를 발전시키는 행동에 우선 배분한다. 다만 입력과 맞지 않으면 억지로 넣지 않는다.",
    responseLines: [
      "- 연애·관계 주제라면 상대와의 상호작용, 감정 소통, 관계를 이어 가는 방식까지 함께 설명해 달라고 요청한다.",
      "- 단순히 운의 좋고 나쁨만 말하지 말고, 어떤 태도와 행동이 관계를 더 안정적으로 만드는지도 구체적으로 알려 달라고 요청한다.",
    ],
  },
  {
    id: "career_money",
    label: "직업·재물",
    keywords: [
      "직업",
      "이직",
      "취업",
      "진로",
      "커리어",
      "직장",
      "업무",
      "사업",
      "재물",
      "돈",
      "금전",
      "수입",
      "소비",
      "투자",
      "경제",
    ],
    lensInstruction:
      "직업·재물 주제라면 현실 흐름, 기회와 리스크, 선택 기준, 실행 전략, 소비나 관리 패턴 같은 렌즈를 우선 검토한다.",
    focusInstruction:
      "직업·재물 맥락이 분명하면 질문 5~6개 중 일부는 흐름, 리스크, 판단 기준, 실천 전략에 우선 배분한다. 다만 입력과 맞지 않으면 억지로 넣지 않는다.",
    responseLines: [
      "- 직업·재물 주제라면 추상적인 조언보다 판단 기준, 우선순위, 실행 순서를 더 구체적으로 알려 달라고 요청한다.",
      "- 흐름 설명만 하지 말고 손실을 줄이기 위한 관리 포인트와 현실적인 행동 전략도 함께 제시해 달라고 요청한다.",
    ],
  },
  {
    id: "emotion",
    label: "감정·스트레스",
    keywords: [
      "불안",
      "스트레스",
      "감정",
      "마음",
      "우울",
      "멘탈",
      "번아웃",
      "지침",
      "걱정",
      "예민",
    ],
    lensInstruction:
      "감정·스트레스 주제라면 심리 패턴, 흔들리는 시기, 감정 표현 방식, 안정화를 돕는 생활 리듬과 행동 같은 렌즈를 우선 검토한다.",
    focusInstruction:
      "감정·스트레스 맥락이 분명하면 질문 일부는 심리 패턴, 흔들리는 원인, 안정화 행동, 대인관계에서의 감정 표현 문제에 우선 배분한다. 다만 입력과 맞지 않으면 억지로 넣지 않는다.",
    responseLines: [
      "- 감정·스트레스 주제라면 불안 요인을 단순 진단으로 끝내지 말고 완화에 도움이 되는 행동과 점검 포인트를 함께 제시해 달라고 요청한다.",
      "- 정서적 배려를 유지하되 현실적으로 끊어야 할 패턴과 관리해야 할 습관도 분명하게 알려 달라고 요청한다.",
    ],
  },
  {
    id: "family",
    label: "가족·가정",
    keywords: [
      "가족",
      "부모",
      "자녀",
      "형제",
      "부부",
      "가정",
      "집안",
    ],
    lensInstruction:
      "가족·가정 주제라면 역할 기대, 정서적 거리, 갈등 패턴, 책임 분배, 관계 회복 방식 같은 렌즈를 우선 검토한다.",
    focusInstruction:
      "가족·가정 맥락이 분명하면 질문 일부는 갈등 원인, 거리 조절, 역할 기준, 관계 회복 행동에 우선 배분한다. 다만 입력과 맞지 않으면 억지로 넣지 않는다.",
    responseLines: [
      "- 가족·가정 주제라면 누가 옳은지만 가르기보다 관계를 유지하거나 경계를 세우는 현실적인 기준을 함께 알려 달라고 요청한다.",
    ],
  },
  {
    id: "health",
    label: "건강·컨디션",
    keywords: [
      "건강",
      "몸",
      "체력",
      "컨디션",
      "질병",
      "회복",
      "수면",
      "피로",
    ],
    lensInstruction:
      "건강·컨디션 주제라면 무리하기 쉬운 패턴, 생활 리듬, 회복 포인트, 주의해야 할 시기 같은 렌즈를 우선 검토한다.",
    focusInstruction:
      "건강·컨디션 맥락이 분명하면 질문 일부는 생활 리듬, 무리하기 쉬운 지점, 회복을 돕는 관리 포인트에 우선 배분한다. 다만 입력과 맞지 않으면 억지로 넣지 않는다.",
    responseLines: [
      "- 건강·컨디션 주제라면 막연한 조심 수준이 아니라 생활 패턴과 관리 포인트를 실천 가능한 단위로 알려 달라고 요청한다.",
    ],
  },
];

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
    return "핵심, 리스크, 판단 포인트가 먼저 드러나게 쓰고 지나치게 돌려 말하지 않는다.";
  }

  if (style === "empathetic") {
    return "지금의 감정 상태를 배려하는 문장을 포함하되, 위로만 하지 말고 현실적인 분석과 조언을 함께 요청한다.";
  }

  return "장점과 리스크, 기회와 주의점을 균형 있게 함께 다뤄 달라고 요청한다.";
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

function formatPillar(hangul: string | null, hanja: string | null): string {
  if (!hangul) {
    return "없음";
  }

  return hanja ? `${hangul}(${hanja})` : hangul;
}

function formatFiveElementsSummary(
  fiveElements: NonNullable<
    DerivedSajuProfileContext["interpretationBasis"]
  >["fiveElements"],
): string {
  return `목${fiveElements.목} 화${fiveElements.화} 토${fiveElements.토} 금${fiveElements.금} 수${fiveElements.수}`;
}

function formatTenGodSummary(
  tenGods: NonNullable<
    DerivedSajuProfileContext["interpretationBasis"]
  >["tenGods"],
): string {
  const parts = [
    `년주 ${tenGods.year.stem}/${tenGods.year.branch}`,
    `월주 ${tenGods.month.stem}/${tenGods.month.branch}`,
    `일주 ${tenGods.day.stem}/${tenGods.day.branch}`,
  ];

  if (tenGods.hour) {
    parts.push(`시주 ${tenGods.hour.stem}/${tenGods.hour.branch}`);
  }

  return parts.join(", ");
}

function formatRelationshipSignalsSummary(
  relationshipSignals: NonNullable<
    DerivedSajuProfileContext["interpretationBasis"]
  >["relationshipSignals"],
): string {
  return relationshipSignals.slice(0, 6).join(", ");
}

function formatDaeunSummary(
  interpretationBasis: NonNullable<
    DerivedSajuProfileContext["interpretationBasis"]
  >,
): string {
  const { current, next, startAge } = interpretationBasis.daeun;

  if (!current) {
    return `${startAge}세에 시작한다.`;
  }

  const nextSummary = next
    ? ` 다음 대운은 ${next.ganzhi}(${next.startAge}~${next.endAge}세)이다.`
    : "";

  return `${startAge}세에 시작했고, 현재 대운은 ${current.ganzhi}(${current.startAge}~${current.endAge}세, ${current.stemTenGod}/${current.branchTenGod}, ${current.stage12})이다.${nextSummary}`;
}

function formatSeyunSummary(
  interpretationBasis: NonNullable<
    DerivedSajuProfileContext["interpretationBasis"]
  >,
): string {
  const { current, next, currentYear } = interpretationBasis.seyun;

  if (!current) {
    return "";
  }

  const nextSummary = next
    ? ` 내년은 ${next.ganzhi}(${next.stemTenGod}/${next.branchTenGod}, ${next.stage12})이다.`
    : "";

  return `올해 ${currentYear}년 세운은 ${current.ganzhi}(${current.stemTenGod}/${current.branchTenGod}, ${current.stage12})이다.${nextSummary}`;
}

function formatWolunSummary(
  interpretationBasis: NonNullable<
    DerivedSajuProfileContext["interpretationBasis"]
  >,
): string {
  const { currentMonth, current, next } = interpretationBasis.wolun;

  if (!currentMonth || !current) {
    return "";
  }

  const nextSummary = next
    ? ` 다음 달 ${next.month}월은 ${next.ganzhi}(${next.stemTenGod}/${next.branchTenGod}, ${next.stage12})이다.`
    : "";

  return `이번 달 ${currentMonth}월 운은 ${current.ganzhi}(${current.stemTenGod}/${current.branchTenGod}, ${current.stage12})이다.${nextSummary}`;
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
    if (derived.isTimeCorrected && derived.correctedTime) {
      lines.push(
        `- ${label}: 출생지는 ${derived.birthPlaceLabel}이며 시간 보정이 적용되었고, 보정 시각은 ${formatTimeValue(derived.correctedTime.hour, derived.correctedTime.minute)}이다.`,
      );
    } else {
      lines.push(
        `- ${label}: 출생지는 ${derived.birthPlaceLabel}이며 시간 보정은 적용하지 않았다.`,
      );
    }
  }

  if (derived.interpretationBasis) {
    const basis = derived.interpretationBasis;
    const relationshipSignals = formatRelationshipSignalsSummary(
      basis.relationshipSignals,
    );
    const seyunSummary = formatSeyunSummary(basis);
    const wolunSummary = formatWolunSummary(basis);

    lines.push(
      `- ${label}: 일간은 ${basis.dayMaster.hanja}(${basis.dayMaster.hangul}${basis.dayMaster.element}, ${basis.dayMaster.yinYang})이고, 강약은 ${basis.dayStrength.label}(${basis.dayStrength.score}), 격국은 ${basis.geukguk}, 용신은 ${basis.yongsin.join(", ") || "-"}이다.`,
    );
    lines.push(
      `- ${label}: 오행 분포는 ${formatFiveElementsSummary(basis.fiveElements)}이고, 십성은 ${formatTenGodSummary(basis.tenGods)}이다.`,
    );

    if (relationshipSignals) {
      lines.push(`- ${label}: 합충형파 등 관계 신호는 ${relationshipSignals}이다.`);
    }

    lines.push(`- ${label}: 대운은 ${formatDaeunSummary(basis)}`);

    if (seyunSummary) {
      lines.push(`- ${label}: ${seyunSummary}`);
    }

    if (wolunSummary) {
      lines.push(`- ${label}: ${wolunSummary}`);
    }
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

  return "내 사주 분석에서는 성향, 강점, 현재 흐름, 기회와 리스크, 선택 기준, 실천 조언을 중심으로 질문을 확장한다.";
}

function toModeQuestionLensInstruction(mode: AnalysisMode): string {
  if (mode === "compatibility") {
    return "궁합 분석에서는 관계 흐름, 감정 소통, 갈등 원인, 서로 다른 강점과 보완점 같은 렌즈를 우선 사용한다.";
  }

  return "내 사주 분석에서는 성향과 강점, 현재 흐름, 기회와 리스크, 감정과 인간관계, 선택 기준, 실천 조언 렌즈를 우선 사용한다.";
}

function buildDetailedResponseRequest(style: PromptStyle): string[] {
  const base = [
    "- '응답 방식'에는 먼저 전체 흐름을 짧게 요약한 뒤, 각 번호 질문을 순서대로 자세히 답해 달라고 요청한다.",
    "- 각 항목마다 왜 그렇게 해석하는지 사주 정보와 현재 상황을 연결해서 설명해 달라고 요청한다.",
    "- 가능하면 일간, 강약, 격국, 용신, 오행, 십성, 합충형파, 대운·세운·월운 같은 사주 구조를 먼저 근거로 사용해 달라고 요청한다.",
    "- 각 항목마다 좋은 점과 주의할 점, 기회와 리스크를 나누어 설명해 달라고 요청한다.",
    "- 추상적인 표현보다 바로 적용할 수 있는 판단 기준, 행동 예시, 점검 포인트를 구체적으로 알려 달라고 요청한다.",
    "- 단정적으로 예언하기보다 가능성과 조건, 변수와 전제까지 함께 설명해 달라고 요청한다.",
  ];

  if (style === "direct") {
    base.push(
      "- 불필요한 완곡어법을 줄이고 핵심 판단, 우선순위, 리스크를 먼저 짚어 달라고 요청한다.",
    );
  } else if (style === "empathetic") {
    base.push(
      "- 정서적 부담을 고려한 말투를 유지하되, 실질적인 행동 조언과 현실 판단은 분명하게 제시해 달라고 요청한다.",
    );
  } else {
    base.push(
      "- 장점과 가능성만 강조하지 말고, 현실적인 주의점과 관리 포인트도 균형 있게 다뤄 달라고 요청한다.",
    );
  }

  return base;
}

function countKeywordHits(source: string, keywords: string[]): number {
  return keywords.reduce((count, keyword) => {
    return source.includes(keyword) ? count + 1 : count;
  }, 0);
}

function resolveTopicLensProfiles(form: SajuQuestionFormData): TopicLensProfile[] {
  const source = [
    form.goal.situation,
    form.goal.purpose,
    form.goal.customRequest,
  ]
    .join(" ")
    .toLowerCase();

  const scored = TOPIC_LENS_PROFILES.map((profile, index) => ({
    profile,
    index,
    score: countKeywordHits(source, profile.keywords),
  }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.index - right.index;
    })
    .slice(0, 2)
    .map((entry) => entry.profile);

  if (form.mode === "compatibility") {
    const hasRelationshipProfile = scored.some(
      (profile) => profile.id === "relationship",
    );

    if (!hasRelationshipProfile) {
      return [
        TOPIC_LENS_PROFILES.find((profile) => profile.id === "relationship")!,
        ...scored.slice(0, 1),
      ];
    }
  }

  return scored;
}

function buildTopicLensSummary(profiles: TopicLensProfile[]): string {
  if (!profiles.length) {
    return "특정 주제가 강하게 드러나지 않으면 기본 렌즈 우선순위를 따른다.";
  }

  return profiles.map((profile) => profile.lensInstruction).join(" ");
}

function buildTopicFocusSummary(profiles: TopicLensProfile[]): string {
  if (!profiles.length) {
    return "특정 주제가 강하게 드러나지 않으면 현재 상황과 질문 목적에 가장 직접적으로 연결되는 렌즈를 우선 선택한다.";
  }

  return profiles.map((profile) => profile.focusInstruction).join(" ");
}

function buildTopicResponseLines(profiles: TopicLensProfile[]): string[] {
  return profiles.flatMap((profile) => profile.responseLines);
}

function buildDetectedTopicLabel(profiles: TopicLensProfile[]): string {
  if (!profiles.length) {
    return "일반";
  }

  return profiles.map((profile) => profile.label).join(", ");
}

export function buildSajuPrompt(
  form: SajuQuestionFormData,
  derived: DerivedSajuPromptContext,
): BuiltSajuPrompt {
  const isCompatibilityMode = form.mode === "compatibility";
  const guardrails = resolveGuardrails();
  const expansionGuide = resolveExpansionGuide();
  const additionalRequest = form.goal.customRequest.trim();
  const topicProfiles = resolveTopicLensProfiles(form);
  const topicLensSummary = buildTopicLensSummary(topicProfiles);
  const topicFocusSummary = buildTopicFocusSummary(topicProfiles);
  const topicResponseLines = buildTopicResponseLines(topicProfiles);

  const systemPrompt = [
    "당신은 사주 해석 질문문을 설계하는 편집자다.",
    `목표: ${guardrails.outputGoal}`,
    "반드시 지킬 규칙:",
    `- 출력 형식: ${guardrails.outputFormat}`,
    `- 시점 규칙: ${guardrails.perspectiveInstruction}`,
    `- 빈값 처리: ${guardrails.missingValueInstruction}`,
    `- 톤: ${guardrails.interpretationTone}`,
    `- 길이 정책: ${guardrails.detailPreference}`,
    `- 확정적 예언 금지: ${
      guardrails.prohibitDefinitiveClaims ? "예" : "아니오"
    }`,
    `- 쉬운 언어 사용: ${guardrails.useSimpleLanguage ? "예" : "아니오"}`,
    `- 구조: ${expansionGuide.structureInstruction}`,
    `- 기본 정보 작성법: ${expansionGuide.basicInfoInstruction}`,
    `- 기본 정보 필수 반영 사항: ${expansionGuide.requiredProfileFieldsInstruction}`,
    `- 섹션 분리 원칙: ${expansionGuide.sectionSeparationInstruction}`,
    `- 질문 확장 우선순위: ${expansionGuide.prioritizationInstruction}`,
    `- 기본 질문 렌즈: ${expansionGuide.questionLensInstruction}`,
    `- 입력 주제 우선 렌즈: ${topicLensSummary}`,
    `- 중복 방지: ${expansionGuide.duplicateAvoidanceInstruction}`,
    `- 문체 변주: ${expansionGuide.phrasingVariationInstruction}`,
    `- 응답 계약: ${expansionGuide.responseContractInstruction}`,
    `- 시간축 반영: ${expansionGuide.timeHorizonInstruction}`,
    "- 번호 질문은 반드시 '중점적으로 묻고 싶은 내용' 섹션 안에만 둔다.",
    "- 사용자에게 보이는 새 섹션 제목을 추가하지 않는다.",
    "- 계산 정보는 줄이지 말고 기본 정보 섹션 안에 분명하게 드러낸다.",
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
    `감지된 주제: ${buildDetectedTopicLabel(topicProfiles)}`,
    "",
    "[작성 초점]",
    "- 결과물은 설명문이 아니라 복사해서 바로 붙여 넣을 수 있는 완성형 질문문이어야 한다.",
    "- 짧게 끝내기보다 외부 AI가 충분한 맥락을 읽고 자세히 답하게 만드는 쪽을 우선한다.",
    "- 다만 같은 사실을 다른 말로 되풀이하지는 않는다.",
    "- 사용자에게 보이는 섹션 제목은 '기본 정보', '현재 상황', '중점적으로 묻고 싶은 내용', '응답 방식'만 사용한다.",
    "- '기본 정보'는 1인칭 자연어 소개 뒤에 계산된 기술 사실 라인을 붙여도 된다.",
    "- 위의 '기본 정보에 반드시 반영할 계산 사실'은 기본 정보 섹션에 빠짐없이 반영한다.",
    "- 양력일과 음력일, 년주·월주·일주·시주, 시간 보정 여부와 보정 시각은 숨기지 않는다.",
    "- 출생시간이 없으면 시주가 없다는 점을 분명하게 적는다.",
    "- '현재 상황'에는 고민과 맥락만 쓰고, 기술적인 사주 정보 나열은 넣지 않는다.",
    "- '중점적으로 묻고 싶은 내용'에는 번호가 붙은 구체적인 질문 5~6개를 넣는다.",
    "- 각 질문은 서로 다른 분석 렌즈를 사용하고, 같은 걱정을 표현만 바꿔 반복하지 않는다.",
    "- 질문 문체는 모두 '-해 주세요'체를 유지하되, 같은 동사를 반복하지 않고 자연스럽게 변주한다.",
    "- 사용자의 현재 상황과 질문 목적이 질문 5~6개 안에서 바로 드러나야 한다.",
    `- 모드별 초점: ${toModeFocusInstruction(form.mode)}`,
    `- 모드별 렌즈 힌트: ${toModeQuestionLensInstruction(form.mode)}`,
    `- 입력 주제 렌즈 우선순위: ${topicLensSummary}`,
    `- 입력 주제 질문 배분 원칙: ${topicFocusSummary}`,
    `- 스타일 적용: ${toStyleInstruction(form.goal.style)}`,
    `- 시간축 적용: ${expansionGuide.timeHorizonInstruction}`,
    ...buildDetailedResponseRequest(form.goal.style),
    ...topicResponseLines,
    expansionGuide.includeActionTip
      ? "- '응답 방식'에는 현실적인 조언, 주의 포인트, 쉬운 설명, 바로 적용할 행동 제안을 포함해 달라고 요청한다."
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
