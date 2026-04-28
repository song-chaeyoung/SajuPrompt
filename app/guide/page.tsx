import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, Compass } from "lucide-react";

import { GuideBreadcrumb } from "@/app/guide/_components/guide-breadcrumb";
import { GuideIndexStructuredData } from "@/app/guide/_components/guide-structured-data";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import {
  GUIDE_INDEX_DESCRIPTION,
  GUIDE_INDEX_PATH,
  GUIDE_INDEX_TITLE,
  GUIDE_PAGES,
} from "@/shared/config/guides";
import { Button } from "@/shared/ui/button";

export const metadata: Metadata = {
  title: GUIDE_INDEX_TITLE,
  description: GUIDE_INDEX_DESCRIPTION,
  alternates: {
    canonical: GUIDE_INDEX_PATH,
  },
  openGraph: {
    title: GUIDE_INDEX_TITLE,
    description: GUIDE_INDEX_DESCRIPTION,
    url: GUIDE_INDEX_PATH,
    type: "website",
  },
};

export default function GuideIndexPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 md:px-8 md:py-12">
      <GuideIndexStructuredData />
      <GuideBreadcrumb />

      <header className="grid gap-8 pb-10 md:grid-cols-[minmax(0,1fr)_22rem] md:items-end md:pb-14">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-7 bg-primary/35" />
            <span className="type-caption font-semibold tracking-[0.18em] text-primary/80">
              GUIDE INDEX
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="max-w-[13em] text-[clamp(2.25rem,1.8rem+2vw,4rem)] font-semibold tracking-[-0.035em] text-foreground [text-wrap:balance] [word-break:keep-all]">
              AI에게 사주를 더 정확하게 물어보는 방법
            </h1>
            <p className="type-body max-w-[45rem] text-[color:color-mix(in_oklch,var(--foreground)_72%,var(--muted-foreground)_28%)] sm:text-[1.0625rem]">
              사주 질문은 생년월일만 적는 것보다 출생 시간, 달력 기준,
              현재 고민, 원하는 답변 형식을 함께 정리할수록 유용합니다.
              상황별 가이드를 참고해 ChatGPT, Gemini, Claude에 붙여 넣을
              질문문을 더 선명하게 만들어 보세요.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild size="lg" data-icon="inline-end">
              <Link href={FORM_STEP_PATHS.mode}>
                AI 사주 질문 만들기
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        </div>

        <aside className="rounded-[1.5rem] border border-border/75 bg-[color-mix(in_oklch,var(--card)_94%,var(--background)_6%)] p-5 shadow-[0_18px_45px_color-mix(in_oklch,var(--foreground)_4%,transparent)]">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <Compass className="size-4" aria-hidden />
            <p className="type-caption font-semibold tracking-[0.08em]">
              읽는 순서
            </p>
          </div>
          <ol className="space-y-3">
            {GUIDE_PAGES.map((guide, index) => (
              <li key={guide.path} className="flex gap-3 type-body-sm">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-[0.75rem] font-semibold text-primary">
                  {index + 1}
                </span>
                <span>
                  <span className="font-semibold text-foreground">
                    {guide.shortTitle}
                  </span>
                  <span className="mt-1 block text-muted-foreground">
                    {guide.intent}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </aside>
      </header>

      <section className="grid gap-5 md:grid-cols-3" aria-label="가이드 목록">
        {GUIDE_PAGES.map((guide) => (
          <article
            key={guide.path}
            className="flex min-h-[18rem] flex-col rounded-[1.35rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_74%,var(--card)_26%)] p-5"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <BookOpenText
                className="size-5 text-[color:color-mix(in_oklch,var(--primary)_68%,var(--accent)_32%)]"
                aria-hidden
              />
              <span className="type-caption font-semibold text-primary/80">
                {guide.primaryKeyword}
              </span>
            </div>

            <h2 className="type-title-md font-semibold text-foreground [word-break:keep-all]">
              {guide.title}
            </h2>
            <p className="mt-3 type-body-sm text-muted-foreground">
              {guide.excerpt}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {guide.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/70 px-3 py-1 text-[0.78rem] font-semibold text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              href={guide.path}
              className="mt-auto inline-flex items-center gap-2 pt-6 type-body-sm font-semibold text-foreground underline-offset-4 hover:underline"
            >
              가이드 읽기
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-10 border-t border-border/70 pt-8">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_20rem] md:items-center">
          <div className="space-y-3">
            <h2 className="type-title-md font-semibold text-foreground">
              바로 질문문을 만들고 싶다면
            </h2>
            <p className="type-body text-muted-foreground">
              가이드를 읽기 전에도 생년월일과 고민을 입력하면 AI가 답하기 쉬운
              질문 프롬프트를 자동으로 정리할 수 있습니다.
            </p>
          </div>
          <Button asChild className="w-full" data-icon="inline-end">
            <Link href={FORM_STEP_PATHS.mode}>
              질문문 생성 시작
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
