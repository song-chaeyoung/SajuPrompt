import {
  CUSTOM_REQUEST_OPTIONS,
  PURPOSE_OPTIONS,
  SITUATION_OPTIONS,
  STYLE_OPTIONS,
} from "@/features/fill-saju-question/config/goal-options";
import type {
  GoalInfo,
  GoalInputMode,
  PromptStyle,
} from "@/shared/types/saju-question-form";
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

interface GoalFieldsProps {
  goal: GoalInfo;
  onChange: (patch: Partial<GoalInfo>) => void;
}

interface CustomSelectFieldProps {
  label: string;
  selectPlaceholder: string;
  inputPlaceholder: string;
  value: string;
  mode: GoalInputMode;
  options: readonly string[];
  onChange: (next: { value: string; mode: GoalInputMode }) => void;
}

function CustomSelectField({
  label,
  selectPlaceholder,
  inputPlaceholder,
  value,
  mode,
  options,
  onChange,
}: CustomSelectFieldProps) {
  const handleSelectChange = (nextValue: string) => {
    if (nextValue === CUSTOM_OPTION_VALUE) {
      onChange({ mode: "custom", value: "" });
      return;
    }

    onChange({ mode: "preset", value: nextValue });
  };

  return (
    <div className="space-y-2.5">
      <Label>{label}</Label>
      <Select
        value={mode === "custom" ? CUSTOM_OPTION_VALUE : value || undefined}
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

      {mode === "custom" ? (
        <Input
          value={value}
          onChange={(event) =>
            onChange({ mode: "custom", value: event.target.value })
          }
          placeholder={inputPlaceholder}
        />
      ) : null}
    </div>
  );
}

export function GoalFields({ goal, onChange }: GoalFieldsProps) {
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
              현재 상황부터 차분히 고르면 AI에 바로 붙여 넣을 질문 흐름까지
              자연스럽게 정리해드립니다.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-x-5 md:gap-y-5">
          <CustomSelectField
            label="현재 상황"
            selectPlaceholder="현재 상황을 선택해 주세요"
            inputPlaceholder="현재 상황을 직접 입력해 주세요"
            value={goal.situation}
            mode={goal.situationInputMode}
            options={SITUATION_OPTIONS}
            onChange={({ mode: nextMode, value: nextValue }) =>
              onChange({
                situation: nextValue,
                situationInputMode: nextMode,
              })
            }
          />

          <CustomSelectField
            label="질문 목적"
            selectPlaceholder="질문 목적을 선택해 주세요"
            inputPlaceholder="질문 목적을 직접 입력해 주세요"
            value={goal.purpose}
            mode={goal.purposeInputMode}
            options={PURPOSE_OPTIONS}
            onChange={({ mode: nextMode, value: nextValue }) =>
              onChange({
                purpose: nextValue,
                purposeInputMode: nextMode,
              })
            }
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
            mode={goal.customRequestInputMode}
            options={CUSTOM_REQUEST_OPTIONS}
            onChange={({ mode: nextMode, value: nextValue }) =>
              onChange({
                customRequest: nextValue,
                customRequestInputMode: nextMode,
              })
            }
          />
        </div>
      </div>
    </section>
  );
}
