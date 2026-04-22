import { ProfileFields } from "@/entities/saju-profile/ui/profile-fields";
import { GoalFields } from "@/features/fill-saju-question/ui/goal-fields";
import type {
  BirthProfile,
  GoalInfo,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";

interface SajuQuestionFieldsProps {
  form: SajuQuestionFormData;
  onUpdateMe: (patch: Partial<BirthProfile>) => void;
  onUpdatePartner: (patch: Partial<BirthProfile>) => void;
  onUpdateGoal: (patch: Partial<GoalInfo>) => void;
}

export function SajuQuestionFields({
  form,
  onUpdateMe,
  onUpdatePartner,
  onUpdateGoal,
}: SajuQuestionFieldsProps) {
  return (
    <div className="space-y-7 md:space-y-8">
      <ProfileFields title="내 정보" profile={form.me} onChange={onUpdateMe} />

      {form.mode === "compatibility" ? (
        <ProfileFields
          title="상대방 정보"
          profile={form.partner}
          onChange={onUpdatePartner}
        />
      ) : null}

      <GoalFields goal={form.goal} onChange={onUpdateGoal} />
    </div>
  );
}
