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

export interface DerivedSajuDayMaster {
  hanja: string;
  hangul: string;
  element: string;
  yinYang: string;
}

export interface DerivedSajuDayStrength {
  label: "강" | "약" | "중화";
  score: number;
}

export interface DerivedSajuFiveElements {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

export interface DerivedSajuTenGod {
  stem: string;
  branch: string;
}

export interface DerivedSajuTenGods {
  year: DerivedSajuTenGod;
  month: DerivedSajuTenGod;
  day: DerivedSajuTenGod;
  hour: DerivedSajuTenGod | null;
}

export interface DerivedSajuDaeunItem {
  ageRange: string;
  startAge: number;
  endAge: number;
  startYear: number;
  ganzhi: string;
  stemTenGod: string;
  branchTenGod: string;
  stage12: string;
  sal: string[];
}

export interface DerivedSajuSeyunItem {
  year: number;
  ganzhi: string;
  stemTenGod: string;
  branchTenGod: string;
  stage12: string;
}

export interface DerivedSajuWolunItem {
  month: number;
  monthName: string;
  ganzhi: string;
  stemTenGod: string;
  branchTenGod: string;
  stage12: string;
}

export interface DerivedSajuInterpretationBasis {
  dayMaster: DerivedSajuDayMaster;
  dayStrength: DerivedSajuDayStrength;
  geukguk: string;
  yongsin: string[];
  fiveElements: DerivedSajuFiveElements;
  tenGods: DerivedSajuTenGods;
  relationshipSignals: string[];
  daeun: {
    startAge: number;
    current: DerivedSajuDaeunItem | null;
    next: DerivedSajuDaeunItem | null;
  };
  seyun: {
    currentYear: number;
    current: DerivedSajuSeyunItem | null;
    next: DerivedSajuSeyunItem | null;
  };
  wolun: {
    currentMonth: number | null;
    current: DerivedSajuWolunItem | null;
    next: DerivedSajuWolunItem | null;
  };
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
  interpretationBasis: DerivedSajuInterpretationBasis | null;
  llmCompactContext: string | null;
}

export interface DerivedSajuPromptContext {
  me: DerivedSajuProfileContext;
  partner: DerivedSajuProfileContext | null;
}
