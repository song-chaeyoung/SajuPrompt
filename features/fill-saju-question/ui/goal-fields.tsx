import { useState } from "react";

import {
  CUSTOM_REQUEST_OPTIONS,
  PURPOSE_OPTIONS,
  SITUATION_OPTIONS,
  STYLE_OPTIONS,
} from "@/features/fill-saju-question/config/goal-options";
import type { GoalInfo, PromptStyle } from "@/shared/types/saju-question-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

const CUSTOM_OPTION_VALUE = "__custom__";

type CustomizableGoalField = "situation" | "purpose" | "customRequest";

type CustomModeState = Record<CustomizableGoalField, boolean>;

interface GoalFieldsProps {
  goal: GoalInfo;
  onChange: (patch: Partial<GoalInfo>) => void;
}

interface CustomSelectFieldProps {
  label: string;
  selectPlaceholder: string;
  inputPlaceholder: string;
  value: string;
  options: readonly string[];
  isCustomMode: boolean;
  onValueChange: (value: string) => void;
  onCustomModeChange: (next: boolean) => void;
}

function isCustomOptionValue(value: string, options: readonly string[]) {
  return value.trim().length > 0 && !options.includes(value);
}

function createInitialCustomModes(goal: GoalInfo): CustomModeState {
  return {
    situation: isCustomOptionValue(goal.situation, SITUATION_OPTIONS),
    purpose: isCustomOptionValue(goal.purpose, PURPOSE_OPTIONS),
    customRequest: isCustomOptionValue(
      goal.customRequest,
      CUSTOM_REQUEST_OPTIONS,
    ),
  };
}

function CustomSelectField({
  label,
  selectPlaceholder,
  inputPlaceholder,
  value,
  options,
  isCustomMode,
  onValueChange,
  onCustomModeChange,
}: CustomSelectFieldProps) {
  const handleSelectChange = (nextValue: string) => {
    if (nextValue === CUSTOM_OPTION_VALUE) {
      onCustomModeChange(true);

      if (!isCustomMode) {
        onValueChange("");
      }

      return;
    }

    onCustomModeChange(false);
    onValueChange(nextValue);
  };

  return (
    <div className="space-y-2.5">
      <Label>{label}</Label>
      <Select
        value={isCustomMode ? CUSTOM_OPTION_VALUE : value || undefined}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={selectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
          <SelectItem value={CUSTOM_OPTION_VALUE}>직접 작성하기</SelectItem>
        </SelectContent>
      </Select>

      {isCustomMode ? (
        <Input
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={inputPlaceholder}
        />
      ) : null}
    </div>
  );
}

export function GoalFields({ goal, onChange }: GoalFieldsProps) {
  const [customModes, setCustomModes] = useState<CustomModeState>(() =>
    createInitialCustomModes(goal),
  );

  const setCustomMode = (field: CustomizableGoalField, next: boolean) => {
    setCustomModes((current) =>
      current[field] === next ? current : { ...current, [field]: next },
    );
  };

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-[color-mix(in_oklch,var(--primary)_10%,var(--border)_90%)] bg-[color-mix(in_oklch,var(--background)_96%,var(--card)_4%)] p-4 shadow-[inset_0_1px_0_color-mix(in_oklch,var(--background)_88%,transparent)] md:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-2.25rem] top-[-2.25rem] h-28 w-28 rounded-full bg-[color-mix(in_oklch,var(--primary)_10%,transparent)] blur-3xl"
      />

      <div className="relative space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="h-px w-8 bg-[color-mix(in_oklch,var(--primary)_24%,transparent)]"
            />
            <p className="type-caption font-semibold tracking-[0.06em] text-primary/80">
              질문 설계
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="type-title-sm font-semibold text-foreground">
              질문 목적과 해석 스타일
            </h3>
            <p className="type-body-sm max-w-[36rem] text-muted-foreground">
              현재 상황부터 차분히 고르면 AI에 바로 붙여 넣을 질문 흐름을 더
              자연스럽게 정리할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-x-5 md:gap-y-5">
          <CustomSelectField
            label="현재 상황"
            selectPlaceholder="현재 상황을 선택해 주세요"
            inputPlaceholder="현재 상황을 직접 입력해 주세요"
            value={goal.situation}
            options={SITUATION_OPTIONS}
            isCustomMode={customModes.situation}
            onValueChange={(value) => onChange({ situation: value })}
            onCustomModeChange={(next) => setCustomMode("situation", next)}
          />

          <CustomSelectField
            label="질문 목적"
            selectPlaceholder="질문 목적을 선택해 주세요"
            inputPlaceholder="질문 목적을 직접 입력해 주세요"
            value={goal.purpose}
            options={PURPOSE_OPTIONS}
            isCustomMode={customModes.purpose}
            onValueChange={(value) => onChange({ purpose: value })}
            onCustomModeChange={(next) => setCustomMode("purpose", next)}
          />

          <div className="space-y-2.5">
            <Label>해석 스타일</Label>
            <Select
              value={goal.style}
              onValueChange={(value) =>
                onChange({ style: value as PromptStyle })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="해석 스타일을 선택해 주세요" />
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

          <CustomSelectField
            label="추가 요청사항"
            selectPlaceholder="추가 요청사항을 선택해 주세요"
            inputPlaceholder="추가 요청사항을 직접 입력해 주세요"
            value={goal.customRequest}
            options={CUSTOM_REQUEST_OPTIONS}
            isCustomMode={customModes.customRequest}
            onValueChange={(value) => onChange({ customRequest: value })}
            onCustomModeChange={(next) => setCustomMode("customRequest", next)}
          />
        </div>
      </div>
    </section>
  );
}
