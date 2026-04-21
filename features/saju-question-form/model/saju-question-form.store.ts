import { create } from "zustand";

import { createDefaultBirthProfile } from "@/entities/saju-profile/model/default-profile";
import { LAST_STEP_INDEX } from "@/shared/config/form-steps";
import type {
  AnalysisMode,
  BirthProfile,
  GoalInfo,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";

interface SajuQuestionFormStore {
  form: SajuQuestionFormData;
  currentStepIndex: number;
  setMode: (mode: AnalysisMode) => void;
  updateMe: (patch: Partial<BirthProfile>) => void;
  updatePartner: (patch: Partial<BirthProfile>) => void;
  updateGoal: (patch: Partial<GoalInfo>) => void;
  setStep: (stepIndex: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const createInitialForm = (): SajuQuestionFormData => ({
  mode: "self",
  me: createDefaultBirthProfile("Me"),
  partner: createDefaultBirthProfile("Partner"),
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
    setStep: (stepIndex) => {
      set({
        currentStepIndex: Math.min(Math.max(stepIndex, 0), LAST_STEP_INDEX),
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
      });
    },
  }),
);
