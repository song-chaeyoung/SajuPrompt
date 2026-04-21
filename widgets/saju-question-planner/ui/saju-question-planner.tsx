"use client";

import { useSajuQuestionFormStore } from "@/features/saju-question-form/model/saju-question-form.store";
import { FORM_STEPS } from "@/shared/config/form-steps";
import type {
  AnalysisMode,
  BirthProfile,
  PromptStyle,
} from "@/shared/types/saju-question-form";

const STEP_LABELS: Record<(typeof FORM_STEPS)[number], string> = {
  mode: "Analysis Mode",
  saju: "Birth Profile",
  goal: "Context and Goal",
  style: "Response Style",
  review: "Review",
};

const STYLE_OPTIONS: { value: PromptStyle; label: string }[] = [
  { value: "balanced", label: "Balanced" },
  { value: "direct", label: "Direct" },
  { value: "empathetic", label: "Empathetic" },
];

const GENDER_OPTIONS: { value: BirthProfile["gender"]; label: string }[] = [
  { value: "unknown", label: "Unknown" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
];

function ProfileFields({
  title,
  profile,
  onChange,
}: {
  title: string;
  profile: BirthProfile;
  onChange: (patch: Partial<BirthProfile>) => void;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-zinc-700">
          <span>Name</span>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            value={profile.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder="Name"
          />
        </label>
        <label className="space-y-1 text-sm text-zinc-700">
          <span>Gender</span>
          <select
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            value={profile.gender}
            onChange={(event) =>
              onChange({
                gender: event.target.value as BirthProfile["gender"],
              })
            }
          >
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm text-zinc-700">
          <span>Birth Date</span>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            type="date"
            value={profile.birthDate}
            onChange={(event) => onChange({ birthDate: event.target.value })}
          />
        </label>
        <label className="space-y-1 text-sm text-zinc-700">
          <span>Birth Time</span>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            type="time"
            value={profile.birthTime}
            onChange={(event) => onChange({ birthTime: event.target.value })}
            disabled={profile.isBirthTimeUnknown}
          />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-700">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`${title}-calendar`}
            checked={profile.calendarType === "solar"}
            onChange={() => onChange({ calendarType: "solar" })}
          />
          <span>Solar</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`${title}-calendar`}
            checked={profile.calendarType === "lunar"}
            onChange={() => onChange({ calendarType: "lunar" })}
          />
          <span>Lunar</span>
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
          <span>Birth time unknown</span>
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
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
        isActive
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-500"
      }`}
    >
      <p className="text-sm font-semibold">{label}</p>
      <p className={`text-xs ${isActive ? "text-zinc-100" : "text-zinc-500"}`}>
        {description}
      </p>
    </button>
  );
}

export function SajuQuestionPlanner() {
  const {
    form,
    currentStepIndex,
    setMode,
    updateMe,
    updatePartner,
    updateGoal,
    nextStep,
    prevStep,
    reset,
  } = useSajuQuestionFormStore();

  const currentStep = FORM_STEPS[currentStepIndex];

  return (
    <section className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Step {currentStepIndex + 1} / {FORM_STEPS.length}
        </p>
        <h2 className="text-lg font-semibold text-zinc-900">
          {STEP_LABELS[currentStep]}
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <ModeButton
          value="self"
          activeMode={form.mode}
          label="Self Analysis"
          description="Design prompts from a single profile."
          onSelect={setMode}
        />
        <ModeButton
          value="compatibility"
          activeMode={form.mode}
          label="Compatibility"
          description="Design prompts using two profiles."
          onSelect={setMode}
        />
      </div>

      <ProfileFields title="My Profile" profile={form.me} onChange={updateMe} />

      {form.mode === "compatibility" ? (
        <ProfileFields
          title="Partner Profile"
          profile={form.partner}
          onChange={updatePartner}
        />
      ) : null}

      <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
        <h3 className="text-base font-semibold text-zinc-900">
          Prompt Goal and Style
        </h3>
        <label className="block space-y-1 text-sm text-zinc-700">
          <span>Current Situation</span>
          <textarea
            className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2"
            value={form.goal.situation}
            onChange={(event) => updateGoal({ situation: event.target.value })}
            placeholder="Example: I am considering a job change this year."
          />
        </label>
        <label className="block space-y-1 text-sm text-zinc-700">
          <span>Question Goal</span>
          <textarea
            className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2"
            value={form.goal.purpose}
            onChange={(event) => updateGoal({ purpose: event.target.value })}
            placeholder="Example: I want guidance on career vs finance focus."
          />
        </label>
        <label className="block space-y-1 text-sm text-zinc-700">
          <span>Response Style</span>
          <select
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            value={form.goal.style}
            onChange={(event) =>
              updateGoal({ style: event.target.value as PromptStyle })
            }
          >
            {STYLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1 text-sm text-zinc-700">
          <span>Extra Requirements</span>
          <textarea
            className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2"
            value={form.goal.customRequest}
            onChange={(event) =>
              updateGoal({ customRequest: event.target.value })
            }
            placeholder="Example: Avoid vague wording and focus on actionable advice."
          />
        </label>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={prevStep}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white"
        >
          Next
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
