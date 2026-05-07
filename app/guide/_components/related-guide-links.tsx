import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { GUIDE_PAGES } from "@/shared/config/guides";

type RelatedGuideLinksProps = {
  currentPath: string;
};

export function RelatedGuideLinks({ currentPath }: RelatedGuideLinksProps) {
  const relatedGuides = GUIDE_PAGES.filter((guide) => guide.path !== currentPath);

  if (relatedGuides.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 border-t border-border/70 pt-8">
      <div className="max-w-2xl space-y-3">
        <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
          RELATED GUIDES
        </p>
        <h2 className="type-title-md font-semibold text-foreground">
          함께 보면 좋은 사주 질문 가이드
        </h2>
        <p className="type-body text-muted-foreground">
          검색 목적에 맞는 질문 예시를 이어서 보면 AI에게 물어볼 내용을 더
          구체적으로 정리할 수 있습니다.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {relatedGuides.map((guide) => (
          <Link
            key={guide.path}
            href={guide.path}
            className="group rounded-[1.25rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_76%,var(--card)_24%)] p-5 transition-colors hover:border-primary/28 hover:bg-[color-mix(in_oklch,var(--primary)_5%,var(--background)_95%)]"
          >
            <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
              {guide.primaryKeyword}
            </p>
            <h3 className="mt-2 type-title-sm font-semibold text-foreground">
              {guide.title}
            </h3>
            <p className="mt-2 type-body-sm text-muted-foreground">
              {guide.excerpt}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 type-body-sm font-semibold text-foreground underline-offset-4 group-hover:underline">
              가이드 읽기
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
