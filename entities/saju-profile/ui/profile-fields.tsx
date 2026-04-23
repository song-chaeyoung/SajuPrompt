import { useMemo } from "react";

import {
  GENDER_OPTIONS,
  HOUR_OPTIONS,
  KOREAN_BIRTH_PLACE_OPTIONS,
  MINUTE_OPTIONS,
  MONTH_OPTIONS,
  YEAR_OPTIONS,
} from "@/entities/saju-profile/config/birth-profile-options";
import { getKoreanBirthPlaceOption } from "@/shared/config/korean-birth-places";
import {
  getMaxDay,
  parseBirthDateParts,
  parseBirthTimeParts,
} from "@/shared/lib/saju-question-form/birth-date-time";
import { cn } from "@/shared/lib/utils";
import type { BirthProfile } from "@/shared/types/saju-question-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

interface ProfileFieldsProps {
  title: string;
  profile: BirthProfile;
  onChange: (patch: Partial<BirthProfile>) => void;
}

interface SelectionFieldProps {
  checked: boolean;
  description: string;
  label: string;
  name?: string;
  onChange: (checked: boolean) => void;
  type: "checkbox" | "radio";
}

function SelectionField({
  checked,
  description,
  label,
  name,
  onChange,
  type,
}: SelectionFieldProps) {
  return (
    <label
      className={cn(
        "group flex min-h-11 cursor-pointer items-start gap-3 rounded-[1.125rem] border px-3.5 py-3 transition-colors",
        checked
          ? "border-primary/18 bg-[color-mix(in_oklch,var(--primary)_5%,var(--background)_95%)] shadow-[0_14px_30px_color-mix(in_oklch,var(--primary)_8%,transparent)]"
          : "border-border/75 bg-[color-mix(in_oklch,var(--background)_94%,var(--muted)_6%)] hover:border-primary/10 hover:bg-[color-mix(in_oklch,var(--background)_92%,var(--primary)_3%)]",
      )}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
        className="mt-1 size-4 accent-[var(--primary)]"
      />
      <span className="space-y-0.5">
        <span className="type-body-sm block font-semibold text-foreground">
          {label}
        </span>
        <span className="block text-[0.8125rem] leading-5 text-muted-foreground">
          {description}
        </span>
      </span>
    </label>
  );
}

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

export function ProfileFields({
  title,
  profile,
  onChange,
}: ProfileFieldsProps) {
  const fieldIdPrefix = title.replace(/\s+/g, "-").toLowerCase();
  const {
    year: birthYear,
    month: birthMonth,
    day: birthDay,
  } = parseBirthDateParts(profile.birthDate);
  const { hour: birthHour, minute: birthMinute } = parseBirthTimeParts(
    profile.birthTime,
  );
  const normalizedBirthMinute = MINUTE_OPTIONS.includes(birthMinute)
    ? birthMinute
    : "";
  const hasKnownBirthTime =
    !profile.isBirthTimeUnknown && hasText(profile.birthTime);

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
    const normalizedDay = nextDay && Number(nextDay) <= maxDay ? nextDay : "01";

    onChange({ birthDate: `${nextYear}-${nextMonth}-${normalizedDay}` });
  };

  const updateBirthTime = (nextHour: string, nextMinute: string) => {
    onChange({ birthTime: `${nextHour}:${nextMinute}` });
  };

  const handleBirthPlaceChange = (value: string) => {
    const nextBirthPlace = getKoreanBirthPlaceOption(
      value as BirthProfile["birthPlaceCode"],
    );

    if (!nextBirthPlace) {
      return;
    }

    onChange({
      birthPlaceCode: nextBirthPlace.code,
      birthPlace: nextBirthPlace.label,
    });
  };

  const handleCalendarTypeChange = (calendarType: BirthProfile["calendarType"]) => {
    onChange({
      calendarType,
      isLeapMonth: calendarType === "lunar" ? profile.isLeapMonth : null,
    });
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
              기본 프로필
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="type-title-sm font-semibold text-foreground">
              {title}
            </h3>
            <p className="type-body-sm max-w-[36rem] text-muted-foreground">
              이름, 성별, 생년월일을 먼저 입력해 주세요. 출생지는 대한민국
              광역자치단체 기준으로 선택하고, 음력이라면 윤달 여부도 함께
              정해 주세요.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-x-5 md:gap-y-5">
          <div className="space-y-2.5">
            <Label htmlFor={`${fieldIdPrefix}-name`}>이름</Label>
            <Input
              id={`${fieldIdPrefix}-name`}
              value={profile.name}
              onChange={(event) => onChange({ name: event.target.value })}
              placeholder="이름"
            />
          </div>

          <div className="space-y-2.5">
            <Label>성별</Label>
            <Select
              value={profile.gender}
              onValueChange={(value) =>
                onChange({ gender: value as BirthProfile["gender"] })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="성별을 선택해 주세요" />
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

          <div className="space-y-2.5 sm:col-span-2">
            <Label>출생지</Label>
            <Select
              value={profile.birthPlaceCode || undefined}
              onValueChange={handleBirthPlaceChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="대한민국 광역자치단체를 선택해 주세요" />
              </SelectTrigger>
              <SelectContent>
                {KOREAN_BIRTH_PLACE_OPTIONS.map((option) => (
                  <SelectItem key={option.code} value={option.code}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="type-body-sm text-muted-foreground">
              출생 시간을 입력한 경우에는 시간 보정을 위해 출생지를 함께
              선택해 주세요.
            </p>
          </div>

          <div className="space-y-2.5 sm:col-span-2">
            <Label>생년월일</Label>
            <div className="grid gap-3 min-[380px]:grid-cols-3">
              <Select
                value={birthYear || undefined}
                onValueChange={(value) =>
                  updateBirthDate(value, birthMonth || "01", birthDay || "01")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="연도" />
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
        </div>

        <div className="space-y-4 rounded-[1.5rem] border border-[color-mix(in_oklch,var(--primary)_8%,var(--border)_92%)] bg-[color-mix(in_oklch,var(--background)_90%,var(--muted)_10%)] p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="h-px w-6 bg-[color-mix(in_oklch,var(--primary)_16%,transparent)]"
              />
              <p className="type-caption font-semibold tracking-[0.05em] text-muted-foreground">
                보조 정보
              </p>
            </div>
            <p className="type-body-sm max-w-[34rem] text-muted-foreground">
              출생 시간은 시주와 시간 보정에 직접 연결됩니다. 시간을 알면
              시각과 출생지를 함께 입력해 주시고, 모르면 시간 없이도 먼저
              진행할 수 있습니다.
            </p>
          </div>

          <div className="space-y-2.5">
            <Label>출생 시간</Label>
            <div
              className={cn(
                "grid gap-3 min-[380px]:grid-cols-2",
                profile.isBirthTimeUnknown ? "opacity-70" : undefined,
              )}
            >
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

          <div className="space-y-2.5">
            <Label>달력 기준</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectionField
                type="radio"
                name={`${fieldIdPrefix}-calendar`}
                checked={profile.calendarType === "solar"}
                label="양력"
                description="일반적인 생일 기준으로 입력합니다."
                onChange={() => handleCalendarTypeChange("solar")}
              />

              <SelectionField
                type="radio"
                name={`${fieldIdPrefix}-calendar`}
                checked={profile.calendarType === "lunar"}
                label="음력"
                description="음력 생일 기준으로 입력합니다."
                onChange={() => handleCalendarTypeChange("lunar")}
              />
            </div>
          </div>

          {profile.calendarType === "lunar" ? (
            <div className="space-y-2.5">
              <Label>음력 월 구분</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectionField
                  type="radio"
                  name={`${fieldIdPrefix}-lunar-leap`}
                  checked={profile.isLeapMonth === false}
                  label="일반 음력"
                  description="윤달이 아닌 일반 음력 생일입니다."
                  onChange={() => onChange({ isLeapMonth: false })}
                />

                <SelectionField
                  type="radio"
                  name={`${fieldIdPrefix}-lunar-leap`}
                  checked={profile.isLeapMonth === true}
                  label="윤달"
                  description="윤달에 해당하는 음력 생일입니다."
                  onChange={() => onChange({ isLeapMonth: true })}
                />
              </div>
              <p className="type-body-sm text-muted-foreground">
                음력 생일이라면 일반 음력인지 윤달인지 꼭 선택해 주세요.
              </p>
            </div>
          ) : null}

          <SelectionField
            type="checkbox"
            checked={profile.isBirthTimeUnknown}
            label="출생 시간을 모름"
            description="시간을 모르면 시·분 선택 없이 현재 정보만으로 진행합니다."
            onChange={(checked) =>
              onChange({
                isBirthTimeUnknown: checked,
                birthTime: checked ? "" : profile.birthTime,
              })
            }
          />

          {hasKnownBirthTime && !profile.birthPlaceCode ? (
            <p className="type-body-sm text-muted-foreground">
              출생 시간을 입력한 경우에는 시간 보정을 위해 출생지도 함께
              선택해 주세요.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
