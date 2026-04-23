import {
  calculateSaju,
  solarToLunar,
} from "ssaju";

import { getKoreanBirthPlaceOption } from "@/shared/config/korean-birth-places";
import {
  parseBirthDateParts,
  parseBirthTimeParts,
} from "@/shared/lib/saju-question-form/birth-date-time";
import type { BirthProfile } from "@/shared/types/saju-question-form";

import type {
  DerivedLunarDate,
  DerivedSajuDate,
  DerivedSajuInterpretationBasis,
  DerivedSajuProfileContext,
} from "./types";

type SsajuResult = ReturnType<typeof calculateSaju>;
type SsajuDaeunItem = SsajuResult["daeun"]["list"][number];
type SsajuSeyunItem = SsajuResult["seyun"][number];
type SsajuWolunItem = SsajuResult["wolun"][number];
type SsajuPillarDetail = SsajuResult["pillarDetails"]["year"];

const BRANCH_RELATION_KEYS = [
  "방합",
  "삼합",
  "반합",
  "육합",
  "충",
  "형",
  "파",
  "해",
  "원진",
  "귀문",
] as const;

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

function parseDate(profile: BirthProfile, profileLabel: string): DerivedSajuDate {
  const { year, month, day } = parseBirthDateParts(profile.birthDate);

  if (!year || !month || !day) {
    throw new SajuProfileCalculationError(
      `${profileLabel}의 생년월일 입력을 확인해 주세요.`,
    );
  }

  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
  };
}

function parseTime(profile: BirthProfile, profileLabel: string) {
  const { hour, minute } = parseBirthTimeParts(profile.birthTime);

  if (!hour || !minute) {
    throw new SajuProfileCalculationError(
      `${profileLabel}의 출생 시간 입력을 확인해 주세요.`,
    );
  }

  return {
    hour: Number(hour),
    minute: Number(minute),
  };
}

function hasKnownBirthTime(profile: BirthProfile): boolean {
  return !profile.isBirthTimeUnknown && hasText(profile.birthTime);
}

function normalizeLunarDate(
  value: ReturnType<typeof solarToLunar>,
): DerivedLunarDate {
  return {
    year: value.year,
    month: value.month,
    day: value.day,
    isLeapMonth: value.isLeapMonth,
  };
}

function toSsajuGender(
  gender: BirthProfile["gender"],
): "남" | "여" | null {
  if (gender === "male") {
    return "남";
  }

  if (gender === "female") {
    return "여";
  }

  return null;
}

function resolveBaseSsajuGender(gender: BirthProfile["gender"]): "남" | "여" {
  return toSsajuGender(gender) ?? "여";
}

function toDayStrengthLabel(
  strength: "strong" | "weak" | "neutral",
): "강" | "약" | "중화" {
  if (strength === "strong") {
    return "강";
  }

  if (strength === "weak") {
    return "약";
  }

  return "중화";
}

function formatPillarHangul(detail: SsajuPillarDetail): string {
  return `${detail.stemKo}${detail.branchKo}`;
}

function formatPillarHanja(detail: SsajuPillarDetail): string {
  return `${detail.stem}${detail.branch}`;
}

function buildRelationshipSignals(result: SsajuResult): string[] {
  const stemSignals = result.stemRelations.map((relation) => relation.desc);
  const branchSignals = BRANCH_RELATION_KEYS.flatMap((key) => {
    const relationGroup = result.branchRelations[key] as
      | Record<string, string>
      | undefined;

    return relationGroup ? Object.values(relationGroup) : [];
  });

  return Array.from(new Set([...stemSignals, ...branchSignals]));
}

function toDaeunItem(item: SsajuDaeunItem | null | undefined) {
  if (!item) {
    return null;
  }

  return {
    ageRange: item.age_range,
    startAge: item.startAge,
    endAge: item.endAge,
    startYear: item.startYear,
    ganzhi: item.ganzhi,
    stemTenGod: item.stemTenGod,
    branchTenGod: item.branchTenGod,
    stage12: item.stage12,
    sal: [...item.sal],
  };
}

function toSeyunItem(item: SsajuSeyunItem | undefined) {
  if (!item) {
    return null;
  }

  return {
    year: item.year,
    ganzhi: item.ganzhi,
    stemTenGod: item.tenGodStem,
    branchTenGod: item.tenGodBranch,
    stage12: item.stage12,
  };
}

function toWolunItem(item: SsajuWolunItem | undefined) {
  if (!item) {
    return null;
  }

  return {
    month: item.month,
    monthName: item.monthName,
    ganzhi: item.ganzhi,
    stemTenGod: item.stemTenGod,
    branchTenGod: item.branchTenGod,
    stage12: item.stage12,
  };
}

function resolveCurrentMonth(now: string): number | null {
  const [datePart] = now.split(" ");
  const [, month] = datePart.split("-");
  const parsedMonth = Number(month);

  return Number.isNaN(parsedMonth) ? null : parsedMonth;
}

function buildInterpretationBasis(
  result: SsajuResult,
  knownBirthTime: boolean,
  hasSupportedGender: boolean,
): DerivedSajuInterpretationBasis | null {
  if (!knownBirthTime || !hasSupportedGender) {
    return null;
  }

  const currentDaeunIndex = result.daeun.current
    ? result.daeun.list.findIndex(
        (item) => item.age_range === result.daeun.current?.age_range,
      )
    : -1;
  const currentYear = result.currentYear;
  const currentMonth = resolveCurrentMonth(result.reference.now);
  const currentSeyun = result.seyun.find((item) => item.year === currentYear);
  const nextSeyun = result.seyun.find((item) => item.year === currentYear + 1);
  const currentWolun =
    currentMonth === null
      ? undefined
      : result.wolun.find((item) => item.month === currentMonth);
  const nextWolun =
    currentMonth === null || currentMonth >= 12
      ? undefined
      : result.wolun.find((item) => item.month === currentMonth + 1);

  return {
    dayMaster: {
      hanja: result.dayStem,
      hangul: result.pillarDetails.day.stemKo,
      element: result.pillarDetails.day.element.stem,
      yinYang: result.pillarDetails.day.yinYang.stem,
    },
    dayStrength: {
      label: toDayStrengthLabel(result.advanced.dayStrength.strength),
      score: result.advanced.dayStrength.score,
    },
    geukguk: result.advanced.geukguk,
    yongsin: [...result.advanced.yongsin],
    fiveElements: {
      목: result.fiveElements.목,
      화: result.fiveElements.화,
      토: result.fiveElements.토,
      금: result.fiveElements.금,
      수: result.fiveElements.수,
    },
    tenGods: {
      year: { ...result.tenGods.year },
      month: { ...result.tenGods.month },
      day: { ...result.tenGods.day },
      hour: result.tenGods.hour ? { ...result.tenGods.hour } : null,
    },
    relationshipSignals: buildRelationshipSignals(result),
    daeun: {
      startAge: result.daeun.startAge,
      current: toDaeunItem(result.daeun.current),
      next:
        currentDaeunIndex >= 0
          ? toDaeunItem(result.daeun.list[currentDaeunIndex + 1])
          : null,
    },
    seyun: {
      currentYear,
      current: toSeyunItem(currentSeyun),
      next: toSeyunItem(nextSeyun),
    },
    wolun: {
      currentMonth,
      current: toWolunItem(currentWolun),
      next: toWolunItem(nextWolun),
    },
  };
}

function buildLlmCompactContext(
  result: SsajuResult,
  knownBirthTime: boolean,
  hasSupportedGender: boolean,
): string | null {
  if (!knownBirthTime || !hasSupportedGender) {
    return null;
  }

  return result.toCompact().trim();
}

function isSsajuInputError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return [
    "invalid solar date",
    "solar year must be between",
    "solar month must be between",
    "solar day must be between",
    "lunar year must be between",
    "lunar month must be between",
    "lunar day must be between",
    "lunar leap month mismatch",
    "invalid lunar day",
    "hour must be an integer",
    "minute must be an integer",
  ].some((message) => error.message.includes(message));
}

export class SajuProfileCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SajuProfileCalculationError";
  }
}

export function deriveSajuProfileContext(
  profile: BirthProfile,
  profileLabel: string,
): DerivedSajuProfileContext {
  const inputDate = parseDate(profile, profileLabel);
  const birthPlace = getKoreanBirthPlaceOption(profile.birthPlaceCode);
  const knownBirthTime = hasKnownBirthTime(profile);
  const baseGender = resolveBaseSsajuGender(profile.gender);
  const hasSupportedGender = toSsajuGender(profile.gender) !== null;

  if (profile.calendarType === "lunar" && profile.isLeapMonth === null) {
    throw new SajuProfileCalculationError(
      `${profileLabel}의 음력 윤달 여부를 선택해 주세요.`,
    );
  }

  if (knownBirthTime && !birthPlace) {
    throw new SajuProfileCalculationError(
      `${profileLabel}의 출생지를 선택해 주세요.`,
    );
  }

  try {
    const time = knownBirthTime
      ? parseTime(profile, profileLabel)
      : { hour: 12, minute: 0 };
    const result = calculateSaju({
      year: inputDate.year,
      month: inputDate.month,
      day: inputDate.day,
      hour: time.hour,
      minute: time.minute,
      gender: baseGender,
      calendar: profile.calendarType,
      leap: profile.isLeapMonth ?? false,
      timezone: "Asia/Seoul",
      longitude: birthPlace?.longitude ?? undefined,
      applyLocalMeanTime: knownBirthTime && birthPlace !== null,
    });
    const { solar } = result.normalized;
    const solarDate: DerivedSajuDate = {
      year: solar.year,
      month: solar.month,
      day: solar.day,
    };
    const lunarDate = normalizeLunarDate(
      solarToLunar(solarDate.year, solarDate.month, solarDate.day),
    );
    const correctedTime = result.normalized.localMeanTime
      ? {
          hour: result.normalized.localMeanTime.hour,
          minute: result.normalized.localMeanTime.minute,
        }
      : null;

    return {
      inputCalendarType: profile.calendarType,
      solarDate,
      lunarDate,
      pillars: {
        year: formatPillarHangul(result.pillarDetails.year),
        month: formatPillarHangul(result.pillarDetails.month),
        day: formatPillarHangul(result.pillarDetails.day),
        hour: knownBirthTime
          ? formatPillarHangul(result.pillarDetails.hour)
          : null,
      },
      pillarsHanja: {
        year: formatPillarHanja(result.pillarDetails.year),
        month: formatPillarHanja(result.pillarDetails.month),
        day: formatPillarHanja(result.pillarDetails.day),
        hour: knownBirthTime ? formatPillarHanja(result.pillarDetails.hour) : null,
      },
      isTimeCorrected: correctedTime !== null,
      correctedTime,
      birthPlaceLabel: birthPlace?.label ?? profile.birthPlace.trim(),
      birthPlaceLongitude: birthPlace?.longitude ?? null,
      interpretationBasis: buildInterpretationBasis(
        result,
        knownBirthTime,
        hasSupportedGender,
      ),
      llmCompactContext: buildLlmCompactContext(
        result,
        knownBirthTime,
        hasSupportedGender,
      ),
    };
  } catch (error) {
    if (isSsajuInputError(error)) {
      throw new SajuProfileCalculationError(
        `${profileLabel}의 음력·윤달 또는 생년월일 입력을 확인해 주세요.`,
      );
    }

    throw error;
  }
}
