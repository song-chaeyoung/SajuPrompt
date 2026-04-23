import { KOREAN_BIRTH_PLACE_OPTIONS } from "@/shared/config/korean-birth-places";
import type { BirthProfile } from "@/shared/types/saju-question-form";

const YEAR_START = 1900;
const CURRENT_YEAR = new Date().getFullYear();

export const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - YEAR_START + 1 },
  (_, index) => String(CURRENT_YEAR - index),
);

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);

export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0"),
);

export const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, index) =>
  String(index * 5).padStart(2, "0"),
);

export const GENDER_OPTIONS: { value: BirthProfile["gender"]; label: string }[] =
  [
    { value: "unknown", label: "선택 안 함" },
    { value: "female", label: "여성" },
    { value: "male", label: "남성" },
    { value: "other", label: "기타" },
  ];

export { KOREAN_BIRTH_PLACE_OPTIONS };
