import { ProfileFields } from "@/entities/saju-profile/ui/profile-fields";
import { GoalFields } from "@/features/saju-question-form/ui/goal-fields";
import type {
  BirthProfile,
  GoalInfo,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";

interface SajuStepProps {
  form: SajuQuestionFormData;
  onUpdateMe: (patch: Partial<BirthProfile>) => void;
  onUpdatePartner: (patch: Partial<BirthProfile>) => void;
  onUpdateGoal: (patch: Partial<GoalInfo>) => void;
}

export function SajuStep({
  form,
  onUpdateMe,
  onUpdatePartner,
  onUpdateGoal,
}: SajuStepProps) {
  return (
    <div className="space-y-6 md:space-y-7">
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
