import type { BirthProfile } from "@/shared/types/saju-question-form";

export function createDefaultBirthProfile(name = ""): BirthProfile {
  return {
    name,
    calendarType: "solar",
    birthDate: "",
    birthTime: "",
    isBirthTimeUnknown: false,
    gender: "unknown",
  };
}
