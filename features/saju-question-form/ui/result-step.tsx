import { Textarea } from "@/components/ui/textarea";
import type { CopyFeedback } from "@/features/saju-question-form/model/use-saju-question-planner";

interface ResultStepProps {
  generatedQuestion: string;
  copyFeedback: CopyFeedback | null;
}

export function ResultStep({ generatedQuestion, copyFeedback }: ResultStepProps) {
  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <h3 className="text-base font-semibold text-zinc-900">생성된 질문문</h3>
      <Textarea
        value={generatedQuestion}
        readOnly
        className="min-h-64 leading-relaxed"
        placeholder="질문문을 생성하면 여기에 표시됩니다."
      />

      {copyFeedback ? (
        <p
          className={`text-sm ${
            copyFeedback.type === "success" ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {copyFeedback.message}
        </p>
      ) : null}
    </section>
  );
}
