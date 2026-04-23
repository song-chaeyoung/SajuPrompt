import type { BirthProfile } from "@/shared/types/saju-question-form";

export function createDefaultBirthProfile(name = ""): BirthProfile {
  return {
    name,
    birthPlaceCode: "",
    birthPlace: "",
    calendarType: "solar",
    birthDate: "",
    isLeapMonth: null,
    birthTime: "",
    isBirthTimeUnknown: false,
    gender: "unknown",
  };
}
