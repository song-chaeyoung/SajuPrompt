import {
  InvalidDateError,
  OutOfRangeError,
  calculateSaju,
  calculateSajuSimple,
  lunarToSolar,
  solarToLunar,
} from "@fullstackfamily/manseryeok";
import { calculateSaju as calculateDetailedSaju } from "ssaju";

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
      `${profileLabel}의 출생 시간을 확인해 주세요.`,
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
    year: value.lunar.year,
    month: value.lunar.month,
    day: value.lunar.day,
    isLeapMonth: value.lunar.isLeapMonth,
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

function buildRelationshipSignals(
  result: ReturnType<typeof calculateDetailedSaju>,
): string[] {
  const stemSignals = result.stemRelations.map((relation) => relation.desc);
  const branchSignals = BRANCH_RELATION_KEYS.flatMap((key) => {
    const relationGroup = result.branchRelations[key] as Record<
      string,
      string
    > | null;

    if (!relationGroup) {
      return [];
    }

    return Object.values(relationGroup);
  });

  return Array.from(new Set([...stemSignals, ...branchSignals]));
}

function toDaeunItem(
  item: ReturnType<typeof calculateDetailedSaju>["daeun"]["current"],
) {
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

function toSeyunItem(
  item: ReturnType<typeof calculateDetailedSaju>["seyun"][number] | undefined,
) {
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

function toWolunItem(
  item: ReturnType<typeof calculateDetailedSaju>["wolun"][number] | undefined,
) {
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
  profile: BirthProfile,
  birthPlaceLongitude: number | null,
): DerivedSajuInterpretationBasis | null {
  const knownBirthTime = hasKnownBirthTime(profile);
  const ssajuGender = toSsajuGender(profile.gender);

  if (!knownBirthTime || !ssajuGender) {
    return null;
  }

  const { year, month, day } = parseBirthDateParts(profile.birthDate);
  const { hour, minute } = parseBirthTimeParts(profile.birthTime);

  if (!year || !month || !day || !hour || !minute) {
    return null;
  }

  const result = calculateDetailedSaju({
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    gender: ssajuGender,
    calendar: profile.calendarType,
    leap: profile.isLeapMonth ?? false,
    timezone: "Asia/Seoul",
    longitude: birthPlaceLongitude ?? undefined,
    applyLocalMeanTime: birthPlaceLongitude !== null,
  });

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
      hour: { ...result.tenGods.hour },
    },
    relationshipSignals: buildRelationshipSignals(result),
    daeun: {
      startAge: result.daeun.startAge,
      current: toDaeunItem(result.daeun.current),
      next:
        currentDaeunIndex >= 0
          ? toDaeunItem(result.daeun.list[currentDaeunIndex + 1] ?? null)
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
    const solarDate =
      profile.calendarType === "solar"
        ? inputDate
        : lunarToSolar(
            inputDate.year,
            inputDate.month,
            inputDate.day,
            profile.isLeapMonth ?? false,
          ).solar;
    const lunarResult = solarToLunar(
      solarDate.year,
      solarDate.month,
      solarDate.day,
    );

    const saju = knownBirthTime
      ? (() => {
          const { hour, minute } = parseTime(profile, profileLabel);

          return calculateSaju(
            solarDate.year,
            solarDate.month,
            solarDate.day,
            hour,
            minute,
            {
              longitude: birthPlace?.longitude ?? 127,
              applyTimeCorrection: true,
            },
          );
        })()
      : calculateSajuSimple(solarDate.year, solarDate.month, solarDate.day);

    return {
      inputCalendarType: profile.calendarType,
      solarDate,
      lunarDate: normalizeLunarDate(lunarResult),
      pillars: {
        year: saju.yearPillar,
        month: saju.monthPillar,
        day: saju.dayPillar,
        hour: saju.hourPillar,
      },
      pillarsHanja: {
        year: saju.yearPillarHanja,
        month: saju.monthPillarHanja,
        day: saju.dayPillarHanja,
        hour: saju.hourPillarHanja,
      },
      isTimeCorrected: saju.isTimeCorrected,
      correctedTime: saju.correctedTime ?? null,
      birthPlaceLabel: birthPlace?.label ?? profile.birthPlace.trim(),
      birthPlaceLongitude: birthPlace?.longitude ?? null,
      interpretationBasis: buildInterpretationBasis(
        profile,
        birthPlace?.longitude ?? null,
      ),
    };
  } catch (error) {
    if (error instanceof InvalidDateError || error instanceof OutOfRangeError) {
      throw new SajuProfileCalculationError(
        `${profileLabel}의 음력·윤달 또는 생년월일 입력을 확인해 주세요.`,
      );
    }

    throw error;
  }
}
