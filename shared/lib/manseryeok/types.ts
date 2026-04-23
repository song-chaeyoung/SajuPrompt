import type { CalendarType } from "@/shared/types/saju-question-form";

export interface DerivedSajuDate {
  year: number;
  month: number;
  day: number;
}

export interface DerivedLunarDate extends DerivedSajuDate {
  isLeapMonth: boolean;
}

export interface DerivedSajuPillars {
  year: string;
  month: string;
  day: string;
  hour: string | null;
}

export interface DerivedSajuPillarsHanja {
  year: string;
  month: string;
  day: string;
  hour: string | null;
}

export interface DerivedSajuProfileContext {
  inputCalendarType: CalendarType;
  solarDate: DerivedSajuDate;
  lunarDate: DerivedLunarDate;
  pillars: DerivedSajuPillars;
  pillarsHanja: DerivedSajuPillarsHanja;
  isTimeCorrected: boolean;
  correctedTime: {
    hour: number;
    minute: number;
  } | null;
  birthPlaceLabel: string;
  birthPlaceLongitude: number | null;
}

export interface DerivedSajuPromptContext {
  me: DerivedSajuProfileContext;
  partner: DerivedSajuProfileContext | null;
}
