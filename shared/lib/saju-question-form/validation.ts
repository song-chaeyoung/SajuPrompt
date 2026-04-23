import type { SajuQuestionFormData } from "@/shared/types/saju-question-form";

export function hasCoreRequiredFields(form: SajuQuestionFormData): boolean {
  if (
    !form.me.birthDate ||
    !form.me.birthPlace.trim() ||
    !form.goal.situation ||
    !form.goal.purpose
  ) {
    return false;
  }

  if (
    form.mode === "compatibility" &&
    (!form.partner.birthDate || !form.partner.birthPlace.trim())
  ) {
    return false;
  }

  return true;
}
