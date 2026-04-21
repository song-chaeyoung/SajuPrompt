import { useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GENDER_OPTIONS,
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  MONTH_OPTIONS,
  YEAR_OPTIONS,
} from "@/entities/saju-profile/config/birth-profile-options";
import {
  getMaxDay,
  parseBirthDateParts,
  parseBirthTimeParts,
} from "@/shared/lib/saju-question-form/birth-date-time";
import type { BirthProfile } from "@/shared/types/saju-question-form";

interface ProfileFieldsProps {
  title: string;
  profile: BirthProfile;
  onChange: (patch: Partial<BirthProfile>) => void;
}

export function ProfileFields({ title, profile, onChange }: ProfileFieldsProps) {
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
    <section className="space-y-5 rounded-2xl border border-border bg-background p-4 md:p-5">
      <h3 className="type-title-sm font-semibold text-foreground">{title}</h3>

      <div className="grid gap-4 sm:grid-cols-2 md:gap-x-5 md:gap-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${fieldIdPrefix}-name`}>이름</Label>
          <Input
            id={`${fieldIdPrefix}-name`}
            value={profile.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder="이름"
          />
        </div>

        <div className="space-y-2">
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

        <div className="space-y-2 sm:col-span-2">
          <Label>생년월일</Label>
          <div className="grid gap-2 min-[380px]:grid-cols-3">
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

        <div className="space-y-2 sm:col-span-2">
          <Label>출생 시간</Label>
          <div className="grid gap-2 min-[380px]:grid-cols-2">
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

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl bg-muted/45 px-3 py-2.5 type-body-sm text-muted-foreground">
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
