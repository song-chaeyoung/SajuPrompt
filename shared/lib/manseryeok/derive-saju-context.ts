import {
  InvalidDateError,
  OutOfRangeError,
  calculateSaju,
  calculateSajuSimple,
  lunarToSolar,
  solarToLunar,
} from "@fullstackfamily/manseryeok";

import { getKoreanBirthPlaceOption } from "@/shared/config/korean-birth-places";
import {
  parseBirthDateParts,
  parseBirthTimeParts,
} from "@/shared/lib/saju-question-form/birth-date-time";
import type { BirthProfile } from "@/shared/types/saju-question-form";

import type {
  DerivedLunarDate,
  DerivedSajuDate,
  DerivedSajuProfileContext,
} from "./types";

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
