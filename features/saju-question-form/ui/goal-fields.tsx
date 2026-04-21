import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CUSTOM_REQUEST_OPTIONS,
  PURPOSE_OPTIONS,
  SITUATION_OPTIONS,
  STYLE_OPTIONS,
} from "@/features/saju-question-form/config/goal-options";
import type { GoalInfo, PromptStyle } from "@/shared/types/saju-question-form";

interface GoalFieldsProps {
  goal: GoalInfo;
  onChange: (patch: Partial<GoalInfo>) => void;
}

export function GoalFields({ goal, onChange }: GoalFieldsProps) {
  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <h3 className="text-base font-semibold text-zinc-900">
        질문 목적과 해석 스타일
      </h3>

      <div className="space-y-1">
        <Label>현재 상황</Label>
        <Select
          value={goal.situation || undefined}
          onValueChange={(value) => onChange({ situation: value })}
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
          value={goal.purpose || undefined}
          onValueChange={(value) => onChange({ purpose: value })}
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
          value={goal.style}
          onValueChange={(value) => onChange({ style: value as PromptStyle })}
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
          value={goal.customRequest || undefined}
          onValueChange={(value) => onChange({ customRequest: value })}
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
  );
}
