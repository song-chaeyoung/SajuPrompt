import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  HelpCircle,
  Sparkles,
} from "lucide-react";

import { GuideBreadcrumb } from "@/app/guide/_components/guide-breadcrumb";
import { GuideArticleStructuredData } from "@/app/guide/_components/guide-structured-data";
import { RelatedGuideLinks } from "@/app/guide/_components/related-guide-links";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import {
  AI_SAJU_QUESTION_LIST_GUIDE,
  COMPATIBILITY_SAJU_QUESTION_EXAMPLES_GUIDE,
  GUIDE_INDEX_PATH,
  UNKNOWN_BIRTH_TIME_SAJU_QUESTION_GUIDE,
} from "@/shared/config/guides";
import { SITE_NAME, SOCIAL_IMAGE } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";

const GUIDE = UNKNOWN_BIRTH_TIME_SAJU_QUESTION_GUIDE;

const UNKNOWN_TIME_RULES = [
  "출생시간은 모른다고 먼저 적기",
  "시간을 추측해서 넣지 않기",
  "확정 풀이보다 가능성과 주의점 중심으로 요청하기",
  "현재 고민, 선택지, 반복되는 문제를 자세히 쓰기",
  "중요한 결정은 현실 조건과 함께 판단하기",
];

const QUESTION_PATTERNS = [
  {
    title: "생년월일만 있을 때",
    description:
      "시간 정보가 없어서 사주 구조가 달라질 수 있음을 전제로 깔고, 가능한 흐름과 현실 조언을 중심으로 묻습니다.",
    prompt:
      "출생시간은 모릅니다. 생년월일은 양력 1994년 5월 12일입니다. 올해 이직 고민을 참고하고 싶으니 확정적으로 말하지 말고 가능한 흐름, 조심할 점, 현실적으로 확인할 조건을 나눠서 알려주세요.",
  },
  {
    title: "오전/오후 정도만 알 때",
    description:
      "정확한 시각이 아니라 대략적인 범위만 안다면 그 범위를 그대로 쓰고 답변도 범위 기반으로 요청합니다.",
    prompt:
      "정확한 출생시간은 모르고 오전에 태어난 것으로만 알고 있습니다. 생년월일과 현재 고민을 바탕으로 달라질 수 있는 가능성을 나눠 설명하고, 단정적인 결론보다 참고할 흐름과 행동 조언을 알려주세요.",
  },
  {
    title: "상대 출생시간만 모를 때",
    description:
      "궁합이나 관계 질문에서는 상대 시간 미상을 분명히 적고, 관계 맥락과 대화 조언을 더 자세히 요청합니다.",
    prompt:
      "제 출생시간은 알고 있지만 상대의 출생시간은 모릅니다. 두 사람의 생년월일과 현재 관계를 참고해 궁합의 장점, 부딪히기 쉬운 지점, 대화할 때 조심할 점을 가능한 범위에서 알려주세요.",
  },
];

const ANSWER_REQUESTS = [
  {
    title: "가능성으로 말해 달라고 쓰기",
    description:
      "출생시간이 없으면 해석 전제가 달라질 수 있으므로 “가능한 흐름”과 “주의점”이라는 표현을 넣습니다.",
  },
  {
    title: "현실 체크포인트를 같이 묻기",
    description:
      "운세만 묻지 말고 지금 확인할 조건, 선택 전 점검할 기준, 피해야 할 판단을 함께 요청합니다.",
  },
  {
    title: "주제를 하나로 좁히기",
    description:
      "연애, 궁합, 직업, 재물 중 가장 급한 질문 하나를 먼저 고르면 답변이 덜 흩어집니다.",
  },
];

const FAQ_ITEMS = [
  {
    question: "출생시간을 모르면 AI 사주 질문을 하면 안 되나요?",
    answer:
      "질문할 수 있습니다. 다만 출생시간을 모른다고 명확히 적고, 확정적인 풀이보다 가능한 흐름과 주의점 중심으로 설명해 달라고 요청하는 것이 좋습니다.",
  },
  {
    question: "대략적인 시간이라도 넣는 편이 좋나요?",
    answer:
      "정확하지 않은 시간을 확정값처럼 넣기보다 “오전으로 알고 있습니다”, “밤에 태어난 것 같습니다”처럼 불확실성을 함께 적는 편이 안전합니다.",
  },
  {
    question: "출생시간이 없으면 어떤 정보를 더 적어야 하나요?",
    answer:
      "현재 고민, 선택지, 반복되는 문제, 원하는 답변 형식을 자세히 적으면 시간 정보가 부족해도 더 실용적인 답변을 받을 수 있습니다.",
  },
  {
    question: "궁합에서 상대 출생시간을 몰라도 되나요?",
    answer:
      "가능합니다. 상대 출생시간을 모른다고 적고, 궁합의 좋고 나쁨보다 관계 흐름, 갈등 지점, 대화 조언 중심으로 물어보는 편이 좋습니다.",
  },
];

export const metadata: Metadata = {
  title: GUIDE.title,
  description: GUIDE.description,
  alternates: {
    canonical: GUIDE.path,
  },
  openGraph: {
    title: GUIDE.title,
    description: GUIDE.description,
    url: GUIDE.path,
    type: "article",
    images: [SOCIAL_IMAGE],
  },
};

export default function UnknownBirthTimeSajuQuestionGuidePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 md:px-8 md:py-12">
      <GuideArticleStructuredData guide={GUIDE} faqItems={FAQ_ITEMS} />
      <GuideBreadcrumb currentTitle={GUIDE.title} />

      <article className="mx-auto w-full max-w-4xl">
        <header className="grid gap-8 pb-10 md:grid-cols-[minmax(0,1fr)_18rem] md:items-end md:pb-14">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-7 bg-primary/35" />
              <span className="type-caption font-semibold tracking-[0.18em] text-primary/80">
                UNKNOWN TIME
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-[12em] text-[clamp(2.2rem,1.75rem+2.1vw,4.1rem)] font-semibold tracking-[-0.035em] text-foreground [text-wrap:balance] [word-break:keep-all]">
                출생시간 모를 때 사주 질문은 모른다고 쓰는 것부터 시작합니다
              </h1>
              <p className="type-body max-w-[42rem] text-[color:color-mix(in_oklch,var(--foreground)_72%,var(--muted-foreground)_28%)] sm:text-[1.0625rem]">
                출생시간 모를 때 사주 질문은 시간을 추측해서 넣기보다
                “출생시간은 모릅니다”라고 명시하는 편이 좋습니다. 대신
                생년월일, 현재 고민, 원하는 답변 형식을 자세히 적어 가능한
                흐름과 현실적인 주의점을 중심으로 물어보세요.
              </p>
            </div>

            <p className="type-body-sm text-muted-foreground">
              {SITE_NAME} · 최종 업데이트 {GUIDE.displayDate}
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild size="lg" data-icon="inline-end">
                <Link href={FORM_STEP_PATHS.mode}>
                  AI 사주 질문 만들기
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={AI_SAJU_QUESTION_LIST_GUIDE.path}>
                  질문 리스트 보기
                </Link>
              </Button>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border/75 bg-[color-mix(in_oklch,var(--card)_94%,var(--background)_6%)] p-5 shadow-[0_18px_45px_color-mix(in_oklch,var(--foreground)_4%,transparent)]">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <Clock3 className="size-4" aria-hidden />
              <p className="type-caption font-semibold tracking-[0.08em]">
                먼저 적을 기준
              </p>
            </div>
            <ul className="space-y-2.5">
              {UNKNOWN_TIME_RULES.map((item) => (
                <li key={item} className="flex gap-2.5 type-body-sm">
                  <CheckCircle2
                    className="mt-1 size-4 shrink-0 text-[color:color-mix(in_oklch,var(--primary)_72%,var(--accent)_28%)]"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </header>

        <section className="grid gap-4">
          {QUESTION_PATTERNS.map((pattern, index) => (
            <section
              key={pattern.title}
              className="rounded-[1.75rem] border border-border/75 bg-[color-mix(in_oklch,var(--background)_76%,var(--card)_24%)] p-5 sm:p-7"
            >
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
                    CASE {index + 1}
                  </p>
                  <h2 className="mt-2 type-title-md font-semibold text-foreground">
                    {pattern.title}
                  </h2>
                  <p className="mt-2 type-body-sm text-muted-foreground">
                    {pattern.description}
                  </p>
                </div>
                <Sparkles
                  className="hidden size-5 text-[color:color-mix(in_oklch,var(--primary)_62%,var(--accent)_38%)] sm:block"
                  aria-hidden
                />
              </div>

              <p className="rounded-[1.25rem] border border-border/70 bg-[color-mix(in_oklch,var(--card)_92%,var(--background)_8%)] p-4 type-body-sm text-foreground">
                {pattern.prompt}
              </p>
            </section>
          ))}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-[minmax(0,1fr)_20rem] md:items-start">
          <div className="space-y-4">
            <h2 className="type-title-md font-semibold text-foreground">
              확정 풀이보다 답변 범위를 정해 주세요
            </h2>
            <div className="space-y-3 type-body text-muted-foreground">
              <p>
                출생시간이 없으면 시주와 일부 해석 전제가 달라질 수 있습니다.
                그래서 “정확히 맞춰 주세요”보다 “가능한 경향과 주의점을 나눠
                주세요”처럼 답변 범위를 정해 주는 편이 안전합니다.
              </p>
              <p>
                궁합을 물어볼 때 상대의 출생시간만 모른다면{" "}
                <Link
                  href={COMPATIBILITY_SAJU_QUESTION_EXAMPLES_GUIDE.path}
                  className="font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  궁합 사주 질문 예시
                </Link>
                를 참고해 관계 상태와 대화 조언까지 함께 적어 보세요.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {ANSWER_REQUESTS.map((item) => (
              <section
                key={item.title}
                className="rounded-[1.25rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_76%,var(--card)_24%)] p-5"
              >
                <h3 className="type-title-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 type-body-sm text-muted-foreground">
                  {item.description}
                </p>
              </section>
            ))}
          </div>
        </section>

        <RelatedGuideLinks currentPath={GUIDE.path} />

        <section className="mt-10 border-t border-border/70 pt-8">
          <div className="max-w-2xl space-y-3">
            <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
              FAQ
            </p>
            <h2 className="type-title-md font-semibold text-foreground">
              출생시간 모를 때 자주 묻는 질문
            </h2>
            <p className="type-body text-muted-foreground">
              모르는 정보를 억지로 채우기보다 불확실성을 표시하면 AI 답변의
              전제가 더 분명해집니다.
            </p>
          </div>

          <dl className="mt-6 grid gap-4">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.question}
                className="rounded-[1.25rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_76%,var(--card)_24%)] p-5"
              >
                <dt className="flex gap-2 type-title-sm font-semibold text-foreground">
                  <HelpCircle
                    className="mt-1 size-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span>{item.question}</span>
                </dt>
                <dd className="mt-2 type-body-sm text-muted-foreground">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/70 pt-5 type-body-sm text-muted-foreground">
          <Link
            href="/"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            홈
          </Link>
          <span aria-hidden>·</span>
          <Link
            href={GUIDE_INDEX_PATH}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            가이드
          </Link>
          <span aria-hidden>·</span>
          <Link
            href={AI_SAJU_QUESTION_LIST_GUIDE.path}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            AI 사주 질문 리스트
          </Link>
        </footer>
      </article>
    </main>
  );
}
