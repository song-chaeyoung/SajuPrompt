"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSajuQuestionFormStore } from "@/features/saju-question-form/model/saju-question-form.store";
import { FORM_STEPS } from "@/shared/config/form-steps";
import type {
  AnalysisMode,
  BirthProfile,
  PromptStyle,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";

const YEAR_START = 1900;
const CURRENT_YEAR = new Date().getFullYear();
const RESULT_STEP_INDEX = FORM_STEPS.indexOf("result");
const SAJU_STEP_INDEX = FORM_STEPS.indexOf("saju");

const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - YEAR_START + 1 },
  (_, index) => String(CURRENT_YEAR - index),
);

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0"),
);

const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, index) =>
  String(index * 5).padStart(2, "0"),
);

const STEP_LABELS: Record<(typeof FORM_STEPS)[number], string> = {
  mode: "분석 모드",
  saju: "사주 정보",
  result: "결과 확인",
};

const STYLE_OPTIONS: { value: PromptStyle; label: string }[] = [
  { value: "balanced", label: "균형형" },
  { value: "direct", label: "직설형" },
  { value: "empathetic", label: "공감형" },
];

const SITUATION_OPTIONS = [
  "이직/진로를 고민 중이에요",
  "연애/관계 방향이 궁금해요",
  "재물/소비 흐름을 점검하고 싶어요",
  "올해 운세 흐름을 알고 싶어요",
  "대인관계 스트레스가 있어요",
];

const PURPOSE_OPTIONS = [
  "전체 성향과 강점을 알고 싶어요",
  "연애운 중심으로 보고 싶어요",
  "직업/재물운 중심으로 보고 싶어요",
  "올해 주의할 시기를 알고 싶어요",
  "실천 가능한 조언을 받고 싶어요",
];

const CUSTOM_REQUEST_OPTIONS = [
  "핵심만 짧고 명확하게",
  "현실 조언을 더 구체적으로",
  "감정선과 관계 해석 중심으로",
  "긍정/주의 포인트를 균형 있게",
];

const GENDER_OPTIONS: { value: BirthProfile["gender"]; label: string }[] = [
  { value: "unknown", label: "선택 안 함" },
  { value: "female", label: "여성" },
  { value: "male", label: "남성" },
  { value: "other", label: "기타" },
];

type GenerationResponse = {
  question?: string;
  message?: string;
};

type CopyFeedback = {
  type: "success" | "error";
  message: string;
};

function parseBirthDateParts(date: string) {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return { year: "", month: "", day: "" };
  }

  return { year: match[1], month: match[2], day: match[3] };
}

function parseBirthTimeParts(time: string) {
  const match = time.match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    return { hour: "", minute: "" };
  }

  return { hour: match[1], minute: match[2] };
}

function getMaxDay(year: string, month: string) {
  if (!year || !month) {
    return 31;
  }

  return new Date(Number(year), Number(month), 0).getDate();
}

function hasCoreRequiredFields(form: SajuQuestionFormData): boolean {
  if (!form.me.birthDate || !form.goal.situation || !form.goal.purpose) {
    return false;
  }

  if (form.mode === "compatibility" && !form.partner.birthDate) {
    return false;
  }

  return true;
}

function ProfileFields({
  title,
  profile,
  onChange,
}: {
  title: string;
  profile: BirthProfile;
  onChange: (patch: Partial<BirthProfile>) => void;
}) {
  const fieldIdPrefix = title.replace(/\s+/g, "-").toLowerCase();
  const { year: birthYear, month: birthMonth, day: birthDay } =
    parseBirthDateParts(profile.birthDate);
  const { hour: birthHour, minute: birthMinute } = parseBirthTimeParts(
    profile.birthTime,
  );
  const normalizedBirthMinute = MINUTE_OPTIONS.includes(birthMinute)
    ? birthMinute
    : "";

  const dayOptions = useMemo(() => {
    const maxDay = getMaxDay(birthYear, birthMonth);

    return Array.from({ length: maxDay }, (_, index) =>
      String(index + 1).padStart(2, "0"),
    );
  }, [birthMonth, birthYear]);

  const updateBirthDate = (
    nextYear: string,
    nextMonth: string,
    nextDay: string,
  ) => {
    const maxDay = getMaxDay(nextYear, nextMonth);
    const normalizedDay =
      nextDay && Number(nextDay) <= maxDay ? nextDay : "01";

    onChange({ birthDate: `${nextYear}-${nextMonth}-${normalizedDay}` });
  };

  const updateBirthTime = (nextHour: string, nextMinute: string) => {
    onChange({ birthTime: `${nextHour}:${nextMinute}` });
  };

  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor={`${fieldIdPrefix}-name`}>이름</Label>
          <Input
            id={`${fieldIdPrefix}-name`}
            value={profile.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder="이름"
          />
        </div>

        <div className="space-y-1">
          <Label>성별</Label>
          <Select
            value={profile.gender}
            onValueChange={(value) =>
              onChange({ gender: value as BirthProfile["gender"] })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="성별을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>생년월일</Label>
          <div className="grid grid-cols-3 gap-2">
            <Select
              value={birthYear || undefined}
              onValueChange={(value) =>
                updateBirthDate(value, birthMonth || "01", birthDay || "01")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="년" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}년
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={birthMonth || undefined}
              onValueChange={(value) =>
                birthYear
                  ? updateBirthDate(birthYear, value, birthDay || "01")
                  : undefined
              }
              disabled={!birthYear}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="월" />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {Number(month)}월
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={birthDay || undefined}
              onValueChange={(value) =>
                birthYear && birthMonth
                  ? updateBirthDate(birthYear, birthMonth, value)
                  : undefined
              }
              disabled={!birthYear || !birthMonth}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="일" />
              </SelectTrigger>
              <SelectContent>
                {dayOptions.map((day) => (
                  <SelectItem key={day} value={day}>
                    {Number(day)}일
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label>출생 시간</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={birthHour || undefined}
              onValueChange={(value) =>
                updateBirthTime(value, normalizedBirthMinute || "00")
              }
              disabled={profile.isBirthTimeUnknown}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="시" />
              </SelectTrigger>
              <SelectContent>
                {HOUR_OPTIONS.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}시
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={normalizedBirthMinute || undefined}
              onValueChange={(value) =>
                birthHour ? updateBirthTime(birthHour, value) : undefined
              }
              disabled={profile.isBirthTimeUnknown || !birthHour}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="분" />
              </SelectTrigger>
              <SelectContent>
                {MINUTE_OPTIONS.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}분
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-700">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`${fieldIdPrefix}-calendar`}
            checked={profile.calendarType === "solar"}
            onChange={() => onChange({ calendarType: "solar" })}
          />
          <span>양력</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`${fieldIdPrefix}-calendar`}
            checked={profile.calendarType === "lunar"}
            onChange={() => onChange({ calendarType: "lunar" })}
          />
          <span>음력</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={profile.isBirthTimeUnknown}
            onChange={(event) =>
              onChange({
                isBirthTimeUnknown: event.target.checked,
                birthTime: event.target.checked ? "" : profile.birthTime,
              })
            }
          />
          <span>출생 시간을 모름</span>
        </label>
      </div>
    </section>
  );
}

function ModeButton({
  value,
  activeMode,
  label,
  description,
  onSelect,
}: {
  value: AnalysisMode;
  activeMode: AnalysisMode;
  label: string;
  description: string;
  onSelect: (mode: AnalysisMode) => void;
}) {
  const isActive = activeMode === value;

  return (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      onClick={() => onSelect(value)}
      className="h-auto w-full items-start px-4 py-3 text-left"
    >
      <span className="text-sm font-semibold">{label}</span>
      <span className={`text-xs ${isActive ? "text-zinc-100" : "text-zinc-500"}`}>
        {description}
      </span>
    </Button>
  );
}

export function SajuQuestionPlanner() {
  const {
    form,
    currentStepIndex,
    generatedQuestion,
    generationStatus,
    generationError,
    selectModeAndAdvance,
    updateMe,
    updatePartner,
    updateGoal,
    setStep,
    startGeneration,
    setGenerationSuccess,
    setGenerationError,
    clearGeneration,
    prevStep,
    reset,
  } = useSajuQuestionFormStore();
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback | null>(null);

  const currentStep = FORM_STEPS[currentStepIndex];
  const isGenerating = generationStatus === "loading";

  const handleModeSelect = (mode: AnalysisMode) => {
    selectModeAndAdvance(mode);
  };

  const handleGenerateQuestion = useCallback(async () => {
    if (!hasCoreRequiredFields(form)) {
      setGenerationError("생년월일, 현재 상황, 질문 목적을 먼저 입력해 주세요.");
      return;
    }

    startGeneration();

    try {
      const response = await fetch("/api/saju-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ form }),
      });

      const body = (await response.json().catch(() => null)) as
        | GenerationResponse
        | null;

      if (!response.ok) {
        throw new Error(body?.message ?? "질문문 생성 중 오류가 발생했습니다.");
      }

      const question = body?.question?.trim();

      if (!question) {
        throw new Error("생성된 질문문이 비어 있습니다. 다시 시도해 주세요.");
      }

      setGenerationSuccess(question);
      setCopyFeedback(null);
      setStep(RESULT_STEP_INDEX);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "질문문 생성 중 오류가 발생했습니다.";

      setGenerationError(message);
    }
  }, [
    form,
    setGenerationError,
    setGenerationSuccess,
    setStep,
    startGeneration,
  ]);

  const handleCopyQuestion = useCallback(async () => {
    if (!generatedQuestion) {
      setCopyFeedback({
        type: "error",
        message: "복사할 질문문이 없습니다.",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedQuestion);
      setCopyFeedback({
        type: "success",
        message: "질문문이 클립보드에 복사되었습니다.",
      });
    } catch {
      setCopyFeedback({
        type: "error",
        message: "복사에 실패했습니다. 브라우저 권한을 확인해 주세요.",
      });
    }
  }, [generatedQuestion]);

  const handleResetToStart = useCallback(() => {
    reset();
    clearGeneration();
    setStep(0);
    setCopyFeedback(null);
  }, [clearGeneration, reset, setStep]);

  useEffect(() => {
    if (!copyFeedback) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopyFeedback(null);
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copyFeedback]);

  return (
    <section className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-wide text-zinc-500">
          단계 {currentStepIndex + 1} / {FORM_STEPS.length}
        </p>
        <h2 className="text-lg font-semibold text-zinc-900">
          {STEP_LABELS[currentStep]}
        </h2>
      </div>

      {currentStep === "mode" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <ModeButton
            value="self"
            activeMode={form.mode}
            label="내 사주 분석"
            description="내 사주 정보 기반으로 질문문을 설계합니다."
            onSelect={handleModeSelect}
          />
          <ModeButton
            value="compatibility"
            activeMode={form.mode}
            label="궁합 분석"
            description="내 정보와 상대방 정보를 함께 사용합니다."
            onSelect={handleModeSelect}
          />
        </div>
      ) : null}

      {currentStep === "saju" ? (
        <>
          <ProfileFields title="내 정보" profile={form.me} onChange={updateMe} />

          {form.mode === "compatibility" ? (
            <ProfileFields
              title="상대방 정보"
              profile={form.partner}
              onChange={updatePartner}
            />
          ) : null}

          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
            <h3 className="text-base font-semibold text-zinc-900">
              질문 목적과 해석 스타일
            </h3>

            <div className="space-y-1">
              <Label>현재 상황</Label>
              <Select
                value={form.goal.situation || undefined}
                onValueChange={(value) => updateGoal({ situation: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="현재 상황을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {SITUATION_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>질문 목적</Label>
              <Select
                value={form.goal.purpose || undefined}
                onValueChange={(value) => updateGoal({ purpose: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="질문 목적을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {PURPOSE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>해석 스타일</Label>
              <Select
                value={form.goal.style}
                onValueChange={(value) =>
                  updateGoal({ style: value as PromptStyle })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="해석 스타일을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>추가 요청사항</Label>
              <Select
                value={form.goal.customRequest || undefined}
                onValueChange={(value) => updateGoal({ customRequest: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="추가 요청사항을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOM_REQUEST_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>
        </>
      ) : null}

      {currentStep === "result" ? (
        <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
          <h3 className="text-base font-semibold text-zinc-900">생성된 질문문</h3>
          <Textarea
            value={generatedQuestion}
            readOnly
            className="min-h-64 leading-relaxed"
            placeholder="질문문을 생성하면 이곳에 표시됩니다."
          />

          {copyFeedback ? (
            <p
              className={`text-sm ${
                copyFeedback.type === "success" ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {copyFeedback.message}
            </p>
          ) : null}
        </section>
      ) : null}

      {generationError ? (
        <p className="text-sm text-red-600">{generationError}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {currentStep !== "result" ? (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStepIndex === 0 || isGenerating}
          >
            이전
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={handleCopyQuestion}>
            복사하기
          </Button>
        )}

        {currentStep === "mode" ? (
          <Button type="button" onClick={() => setStep(SAJU_STEP_INDEX)}>
            다음
          </Button>
        ) : null}

        {currentStep === "saju" ? (
          <Button type="button" onClick={handleGenerateQuestion} disabled={isGenerating}>
            {isGenerating ? "질문문 생성 중..." : "질문문 생성"}
          </Button>
        ) : null}

        {currentStep === "result" ? (
          <>
            <Button type="button" onClick={handleGenerateQuestion} disabled={isGenerating}>
              {isGenerating ? "다시 생성 중..." : "다시 생성"}
            </Button>
            <Button type="button" variant="outline" onClick={handleResetToStart}>
              처음부터 다시 하기
            </Button>
          </>
        ) : (
          <Button type="button" variant="outline" onClick={handleResetToStart}>
            초기화
          </Button>
        )}
      </div>
    </section>
  );
}
