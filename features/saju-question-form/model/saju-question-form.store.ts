import { create } from "zustand";

import { createDefaultBirthProfile } from "@/entities/saju-profile/model/default-profile";
import { LAST_STEP_INDEX } from "@/shared/config/form-steps";
import type {
  AnalysisMode,
  BirthProfile,
  GenerationStatus,
  GoalInfo,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";

interface SajuQuestionFormStore {
  form: SajuQuestionFormData;
  currentStepIndex: number;
  generatedQuestion: string;
  generationStatus: GenerationStatus;
  generationError: string | null;
  setMode: (mode: AnalysisMode) => void;
  selectModeAndAdvance: (mode: AnalysisMode) => void;
  updateMe: (patch: Partial<BirthProfile>) => void;
  updatePartner: (patch: Partial<BirthProfile>) => void;
  updateGoal: (patch: Partial<GoalInfo>) => void;
  setStep: (stepIndex: number) => void;
  startGeneration: () => void;
  setGenerationSuccess: (question: string) => void;
  setGenerationError: (message: string) => void;
  clearGeneration: () => void;
  nextStep: () => void;
  prevStep: () => void;
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

export const useSajuQuestionFormStore = create<SajuQuestionFormStore>(
  (set) => ({
    form: createInitialForm(),
    currentStepIndex: 0,
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
    selectModeAndAdvance: (mode) => {
      set((state) => ({
        form: {
          ...state.form,
          mode,
        },
        currentStepIndex: Math.min(state.currentStepIndex + 1, LAST_STEP_INDEX),
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
    setStep: (stepIndex) => {
      set({
        currentStepIndex: Math.min(Math.max(stepIndex, 0), LAST_STEP_INDEX),
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
    nextStep: () => {
      set((state) => ({
        currentStepIndex: Math.min(state.currentStepIndex + 1, LAST_STEP_INDEX),
      }));
    },
    prevStep: () => {
      set((state) => ({
        currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
      }));
    },
    reset: () => {
      set({
        form: createInitialForm(),
        currentStepIndex: 0,
        generatedQuestion: "",
        generationStatus: "idle",
        generationError: null,
      });
    },
  }),
);
