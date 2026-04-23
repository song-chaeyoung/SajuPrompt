import type { BirthProfile } from "@/shared/types/saju-question-form";

export function createDefaultBirthProfile(name = ""): BirthProfile {
  return {
    name,
    birthPlace: "",
    calendarType: "solar",
    birthDate: "",
    birthTime: "",
    isBirthTimeUnknown: false,
    gender: "unknown",
  };
}
