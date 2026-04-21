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
  selectModeAndAdvance: (mode: AnalysisMode) => void;
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
  me: createDefaultBirthProfile("나"),
  partner: createDefaultBirthProfile("상대방"),
  goal: {
    situation: "",
    purpose: "",
    style: "balanced",
    customRequest: "",
    requiredSections: [
      "대상 사주 정보 요약",
      "현재 상황 요약",
      "질문 목적 요약",
      "질문문 본문",
      "추가 확인 질문(선택)",
    ].join("\n"),
    responseFormat:
      "항목 제목을 유지한 구조화된 텍스트 형식으로만 응답한다. JSON, 마크다운 테이블, 코드블록은 사용하지 않는다.",
    analysisPurpose:
      "사용자가 다른 AI에 붙여 넣어 사주 해석을 요청할 수 있도록, 질문문 초안을 설계하는 것이 유일한 목적이다.",
    interpretationTone:
      "명확하고 차분한 조언형 톤을 유지한다. 자극적 표현이나 공포 유도 표현은 금지한다.",
    prohibitDefinitiveClaims: true,
    useSimpleLanguage: true,
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
