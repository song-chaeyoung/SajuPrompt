import type {
  BirthProfile,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

export function hasKnownBirthTime(profile: BirthProfile): boolean {
  return !profile.isBirthTimeUnknown && hasText(profile.birthTime);
}

function hasRequiredBirthProfileFields(profile: BirthProfile): boolean {
  if (!hasText(profile.birthDate)) {
    return false;
  }

  if (profile.calendarType === "lunar" && profile.isLeapMonth === null) {
    return false;
  }

  if (hasKnownBirthTime(profile) && !hasText(profile.birthPlaceCode)) {
    return false;
  }

  return true;
}

export function hasCoreRequiredFields(form: SajuQuestionFormData): boolean {
  if (
    !hasRequiredBirthProfileFields(form.me) ||
    !hasText(form.goal.situation) ||
    !hasText(form.goal.purpose)
  ) {
    return false;
  }

  if (
    form.mode === "compatibility" &&
    !hasRequiredBirthProfileFields(form.partner)
  ) {
    return false;
  }

  return true;
}
