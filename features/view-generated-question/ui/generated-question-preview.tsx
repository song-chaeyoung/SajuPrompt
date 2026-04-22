import { cn } from "@/lib/utils";
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
    <section className="space-y-5 rounded-[1.75rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_95%,var(--card)_5%)] p-4 md:p-6">
      <div className="space-y-1.5">
        <p className="type-caption font-semibold tracking-[0.06em] text-primary/80">
          최종 문안
        </p>
        <h3 className="type-title-sm font-semibold text-foreground">
          생성된 질문문
        </h3>
        <p className="type-body-sm max-w-[36rem] text-muted-foreground">
          복사하기를 누르면 바로 외부 AI에 붙여넣을 수 있는 문장으로 정리됩니다.
        </p>
      </div>
      <Textarea
        value={generatedQuestion}
        readOnly
        className="min-h-60 leading-relaxed sm:min-h-72"
        placeholder="질문문을 생성하면 여기에 표시됩니다."
      />

      {copyFeedback ? (
        <p
          className={cn(
            "inline-flex rounded-full px-3 py-1.5 type-body-sm font-medium",
            copyFeedback.type === "success"
              ? "bg-success/12 text-success"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {copyFeedback.message}
        </p>
      ) : null}
    </section>
  );
}
