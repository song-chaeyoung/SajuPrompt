"use client";

import { useMemo } from "react";

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
} from "@/shared/types/saju-question-form";

const YEAR_START = 1900;
const CURRENT_YEAR = new Date().getFullYear();

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
};

const STYLE_OPTIONS: { value: PromptStyle; label: string }[] = [
  { value: "balanced", label: "균형형" },
  { value: "direct", label: "직설형" },
  { value: "empathetic", label: "공감형" },
];

const GENDER_OPTIONS: { value: BirthProfile["gender"]; label: string }[] = [
  { value: "unknown", label: "선택 안 함" },
  { value: "female", label: "여성" },
  { value: "male", label: "남성" },
  { value: "other", label: "기타" },
];

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
    selectModeAndAdvance,
    updateMe,
    updatePartner,
    updateGoal,
    nextStep,
    prevStep,
    reset,
  } = useSajuQuestionFormStore();

  const currentStep = FORM_STEPS[currentStepIndex];

  const handleModeSelect = (mode: AnalysisMode) => {
    selectModeAndAdvance(mode);
  };

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
      ) : (
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
              <Label htmlFor="goal-situation">현재 상황</Label>
              <Textarea
                id="goal-situation"
                className="min-h-20"
                value={form.goal.situation}
                onChange={(event) => updateGoal({ situation: event.target.value })}
                placeholder="예: 올해 이직을 고민하고 있어요."
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="goal-purpose">질문 목적</Label>
              <Textarea
                id="goal-purpose"
                className="min-h-20"
                value={form.goal.purpose}
                onChange={(event) => updateGoal({ purpose: event.target.value })}
                placeholder="예: 연애운과 커리어운 중 어디에 집중할지 알고 싶어요."
              />
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
              <Label htmlFor="goal-custom-request">추가 요청사항</Label>
              <Textarea
                id="goal-custom-request"
                className="min-h-24"
                value={form.goal.customRequest}
                onChange={(event) =>
                  updateGoal({ customRequest: event.target.value })
                }
                placeholder="예: 모호한 표현은 줄이고 실천 가능한 조언 위주로 작성해 주세요."
              />
            </div>

            <section className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <h4 className="text-sm font-semibold text-zinc-900">
                프롬프트 제약 설정
              </h4>

              <div className="space-y-1">
                <Label htmlFor="goal-required-sections">필수 포함 항목 고정</Label>
                <Textarea
                  id="goal-required-sections"
                  className="min-h-24"
                  value={form.goal.requiredSections}
                  onChange={(event) =>
                    updateGoal({ requiredSections: event.target.value })
                  }
                  placeholder={"예:\n대상 사주 정보 요약\n현재 상황 요약\n질문 목적 요약"}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="goal-response-format">응답 형식 고정</Label>
                <Textarea
                  id="goal-response-format"
                  className="min-h-16"
                  value={form.goal.responseFormat}
                  onChange={(event) =>
                    updateGoal({ responseFormat: event.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="goal-analysis-purpose">분석 목적 고정</Label>
                <Textarea
                  id="goal-analysis-purpose"
                  className="min-h-16"
                  value={form.goal.analysisPurpose}
                  onChange={(event) =>
                    updateGoal({ analysisPurpose: event.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="goal-interpretation-tone">해석 톤 고정</Label>
                <Textarea
                  id="goal-interpretation-tone"
                  className="min-h-16"
                  value={form.goal.interpretationTone}
                  onChange={(event) =>
                    updateGoal({ interpretationTone: event.target.value })
                  }
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={form.goal.prohibitDefinitiveClaims}
                  onChange={(event) =>
                    updateGoal({
                      prohibitDefinitiveClaims: event.target.checked,
                    })
                  }
                />
                <span>단정 금지 여부 고정</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={form.goal.useSimpleLanguage}
                  onChange={(event) =>
                    updateGoal({ useSimpleLanguage: event.target.checked })
                  }
                />
                <span>쉬운 설명 여부 고정</span>
              </label>
            </section>
          </section>
        </>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" onClick={prevStep}>
          이전
        </Button>
        <Button type="button" onClick={nextStep}>
          다음
        </Button>
        <Button type="button" variant="outline" onClick={reset}>
          초기화
        </Button>
      </div>
    </section>
  );
}
