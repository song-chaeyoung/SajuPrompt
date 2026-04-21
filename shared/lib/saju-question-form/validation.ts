import type { SajuQuestionFormData } from "@/shared/types/saju-question-form";

export function hasCoreRequiredFields(form: SajuQuestionFormData): boolean {
  if (!form.me.birthDate || !form.goal.situation || !form.goal.purpose) {
    return false;
  }

  if (form.mode === "compatibility" && !form.partner.birthDate) {
    return false;
  }

  return true;
}
