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
  queueGeneration: () => void;
  startGeneration: () => void;
  setGenerationSuccess: (question: string) => void;
  setGenerationError: (message: string) => void;
  clearGeneration: () => void;
  reset: () => void;
}

const createInitialForm = (): SajuQuestionFormData => ({
  mode: "self",
  me: createDefaultBirthProfile("나"),
  partner: createDefaultBirthProfile("상대방"),
  goal: {
    situation: "",
    purpose: "",
    style: "balanced",
    customRequest: "",
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
    queueGeneration: () => {
      set({
        generatedQuestion: "",
        generationStatus: "queued",
        generationError: null,
      });
    },
    startGeneration: () => {
      set({
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
