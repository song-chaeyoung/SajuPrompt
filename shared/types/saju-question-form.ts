export type AnalysisMode = "self" | "compatibility";

export type CalendarType = "solar" | "lunar";

export type Gender = "male" | "female" | "other" | "unknown";

export type PromptStyle = "balanced" | "direct" | "empathetic";

export type FormStep = "mode" | "saju" | "result";

export type GenerationStatus =
  | "idle"
  | "queued"
  | "loading"
  | "success"
  | "error";

export interface BirthProfile {
  name: string;
  calendarType: CalendarType;
  birthDate: string;
  birthTime: string;
  isBirthTimeUnknown: boolean;
  gender: Gender;
}

export interface GoalInfo {
  situation: string;
  purpose: string;
  style: PromptStyle;
  customRequest: string;
}

export interface SajuQuestionFormData {
  mode: AnalysisMode;
  me: BirthProfile;
  partner: BirthProfile;
  goal: GoalInfo;
}
