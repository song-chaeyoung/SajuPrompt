import { Textarea } from "@/components/ui/textarea";
import type { CopyFeedback } from "@/features/plan-saju-question/model/use-plan-saju-question";

interface GeneratedQuestionPreviewProps {
  generatedQuestion: string;
  copyFeedback: CopyFeedback | null;
}

export function GeneratedQuestionPreview({
  generatedQuestion,
  copyFeedback,
}: GeneratedQuestionPreviewProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-background p-4 md:p-5">
      <h3 className="type-title-sm font-semibold text-foreground">
        생성된 질문문
      </h3>
      <Textarea
        value={generatedQuestion}
        readOnly
        className="min-h-56 leading-relaxed sm:min-h-64"
        placeholder="질문문을 생성하면 여기에 표시됩니다."
      />

      {copyFeedback ? (
        <p
          className={`type-body-sm ${
            copyFeedback.type === "success" ? "text-success" : "text-destructive"
          }`}
        >
          {copyFeedback.message}
        </p>
      ) : null}
    </section>
  );
}
