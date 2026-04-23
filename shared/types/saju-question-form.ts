export type AnalysisMode = "self" | "compatibility";

export type CalendarType = "solar" | "lunar";

export type Gender = "male" | "female" | "other" | "unknown";

export type PromptStyle = "balanced" | "direct" | "empathetic";

export type GoalInputMode = "preset" | "custom";

export type FormStep = "mode" | "saju" | "result";

export type GenerationStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

export interface BirthProfile {
  name: string;
  // Raw user-entered birthplace text. It is not normalized yet.
  birthPlace: string;
  calendarType: CalendarType;
  birthDate: string;
  birthTime: string;
  isBirthTimeUnknown: boolean;
  gender: Gender;
}

export interface GoalInfo {
  situation: string;
  situationInputMode: GoalInputMode;
  purpose: string;
  purposeInputMode: GoalInputMode;
  style: PromptStyle;
  customRequest: string;
  customRequestInputMode: GoalInputMode;
}

export interface SajuQuestionFormData {
  mode: AnalysisMode;
  me: BirthProfile;
  partner: BirthProfile;
  goal: GoalInfo;
}
