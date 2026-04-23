import { create } from "zustand";

import { createDefaultBirthProfile } from "@/entities/saju-profile/model/default-profile";
import type {
  AnalysisMode,
  BirthProfile,
  GenerationStatus,
  GoalInfo,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";

interface SajuQuestionPlannerStore {
  form: SajuQuestionFormData;
  generatedQuestion: string;
  generationStatus: GenerationStatus;
  generationError: string | null;
  setMode: (mode: AnalysisMode) => void;
  updateMe: (patch: Partial<BirthProfile>) => void;
  updatePartner: (patch: Partial<BirthProfile>) => void;
  updateGoal: (patch: Partial<GoalInfo>) => void;
  startGeneration: () => void;
  setGenerationSuccess: (question: string) => void;
  setGenerationError: (message: string) => void;
  clearGenerationError: () => void;
  clearGeneration: () => void;
  reset: () => void;
}

const createInitialForm = (): SajuQuestionFormData => ({
  mode: "self",
  me: createDefaultBirthProfile(""),
  partner: createDefaultBirthProfile(""),
  goal: {
    situation: "",
    situationInputMode: "preset",
    purpose: "",
    purposeInputMode: "preset",
    style: "balanced",
    customRequest: "",
    customRequestInputMode: "preset",
  },
});

export const useSajuQuestionPlannerStore = create<SajuQuestionPlannerStore>(
  (set) => ({
    form: createInitialForm(),
    generatedQuestion: "",
    generationStatus: "idle",
    generationError: null,
    setMode: (mode) => {
      set((state) => ({
        form: {
          ...state.form,
          mode,
        },
      }));
    },
    updateMe: (patch) => {
      set((state) => ({
        form: {
          ...state.form,
          me: {
            ...state.form.me,
            ...patch,
          },
        },
      }));
    },
    updatePartner: (patch) => {
      set((state) => ({
        form: {
          ...state.form,
          partner: {
            ...state.form.partner,
            ...patch,
          },
        },
      }));
    },
    updateGoal: (patch) => {
      set((state) => ({
        form: {
          ...state.form,
          goal: {
            ...state.form.goal,
            ...patch,
          },
        },
      }));
    },
    startGeneration: () => {
      set({
        generatedQuestion: "",
        generationStatus: "loading",
        generationError: null,
      });
    },
    setGenerationSuccess: (question) => {
      set({
        generatedQuestion: question,
        generationStatus: "success",
        generationError: null,
      });
    },
    setGenerationError: (message) => {
      set({
        generationStatus: "error",
        generationError: message,
      });
    },
    clearGenerationError: () => {
      set((state) => ({
        generationStatus:
          state.generationStatus === "error" ? "idle" : state.generationStatus,
        generationError: null,
      }));
    },
    clearGeneration: () => {
      set({
        generatedQuestion: "",
        generationStatus: "idle",
        generationError: null,
      });
    },
    reset: () => {
      set({
        form: createInitialForm(),
        generatedQuestion: "",
        generationStatus: "idle",
        generationError: null,
      });
    },
  }),
);
