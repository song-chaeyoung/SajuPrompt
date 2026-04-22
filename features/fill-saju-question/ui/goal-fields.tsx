import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  CUSTOM_REQUEST_OPTIONS,
  PURPOSE_OPTIONS,
  SITUATION_OPTIONS,
  STYLE_OPTIONS,
} from "@/features/fill-saju-question/config/goal-options";
import type { GoalInfo, PromptStyle } from "@/shared/types/saju-question-form";

interface GoalFieldsProps {
  goal: GoalInfo;
  onChange: (patch: Partial<GoalInfo>) => void;
}

export function GoalFields({ goal, onChange }: GoalFieldsProps) {
  return (
    <section className="space-y-6 rounded-[1.75rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_95%,var(--card)_5%)] p-4 md:p-6">
      <div className="space-y-2">
        <p className="type-caption font-semibold tracking-[0.06em] text-primary/80">
          질문 설계
        </p>
        <div className="space-y-1.5">
          <h3 className="type-title-sm font-semibold text-foreground">
            질문 목적과 해석 스타일
          </h3>
          <p className="type-body-sm max-w-[36rem] text-muted-foreground">
            현재 상황부터 차례로 고르면 AI에 전달할 질문 흐름을 더 자연스럽게
            정리할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:gap-x-5 md:gap-y-5">
        <div className="space-y-2.5">
          <Label>현재 상황</Label>
          <Select
            value={goal.situation || undefined}
            onValueChange={(value) => onChange({ situation: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="현재 상황을 선택해 주세요" />
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

        <div className="space-y-2.5">
          <Label>질문 목적</Label>
          <Select
            value={goal.purpose || undefined}
            onValueChange={(value) => onChange({ purpose: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="질문 목적을 선택해 주세요" />
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

        <div className="space-y-2.5">
          <Label>해석 스타일</Label>
          <Select
            value={goal.style}
            onValueChange={(value) => onChange({ style: value as PromptStyle })}
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

        <div className="space-y-2.5">
          <Label>추가 요청사항</Label>
          <Select
            value={goal.customRequest || undefined}
            onValueChange={(value) => onChange({ customRequest: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="추가 요청사항을 선택해 주세요" />
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
      </div>
    </section>
  );
}
