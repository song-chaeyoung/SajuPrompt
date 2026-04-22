import { Sparkles } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface GeneratedQuestionPreviewProps {
  generatedQuestion: string;
  className?: string;
}

export function GeneratedQuestionPreview({
  generatedQuestion,
  className,
}: GeneratedQuestionPreviewProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[1.9rem] border border-border/75 bg-[color-mix(in_oklch,var(--card)_97%,var(--background)_3%)] shadow-[0_24px_64px_color-mix(in_oklch,var(--primary)_10%,transparent)] dark:border-border/90 dark:bg-[color-mix(in_oklch,var(--card)_94%,var(--background)_6%)]",
        className,
      )}
    >
      <div className="border-b border-border/70 px-5 py-4 dark:border-border/90 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--primary)_10%,var(--background)_90%)] text-primary dark:bg-[color-mix(in_oklch,var(--primary)_16%,var(--background)_84%)]">
            <Sparkles className="size-4" aria-hidden />
          </span>

          <div>
            <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
              생성된 질문문
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="min-h-60 select-text whitespace-pre-wrap break-keep text-[0.98rem] leading-8 text-[color:color-mix(in_oklch,var(--foreground)_84%,var(--muted-foreground)_16%)] sm:min-h-72">
          {generatedQuestion}
        </div>
      </div>
    </section>
  );
}
