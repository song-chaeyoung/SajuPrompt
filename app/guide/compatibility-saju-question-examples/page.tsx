import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  HelpCircle,
  ListChecks,
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
  LOVE_SAJU_PROMPT_GUIDE,
  UNKNOWN_BIRTH_TIME_SAJU_QUESTION_GUIDE,
} from "@/shared/config/guides";
import { SITE_NAME, SOCIAL_IMAGE } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";

const GUIDE = COMPATIBILITY_SAJU_QUESTION_EXAMPLES_GUIDE;

const COMPATIBILITY_DETAILS = [
  "두 사람의 생년월일과 알고 있는 출생 시간",
  "양력/음력 여부와 윤달 여부",
  "현재 관계 상태: 썸, 연애, 재회, 결혼 고민",
  "가장 알고 싶은 궁합 질문 하나",
  "원하는 답변 방식: 장점, 갈등 지점, 대화 조언",
];

const QUESTION_EXAMPLES = [
  {
    title: "썸 단계 궁합 질문",
    description:
      "상대 마음을 단정해 달라고 묻기보다 관계를 이어갈 때 조심할 대화 방식과 속도를 함께 요청합니다.",
    prompt:
      "두 사람의 생년월일과 현재 썸 단계 상황을 바탕으로 궁합의 장점, 서로 조심하면 좋은 표현, 관계를 천천히 이어갈 때 확인할 신호를 알려주세요.",
  },
  {
    title: "연애 중 궁합 질문",
    description:
      "현재 갈등 장면을 넣으면 궁합의 좋고 나쁨보다 반복되는 부딪힘을 다루는 조언을 받을 수 있습니다.",
    prompt:
      "현재 연애 중이고 생활 리듬과 연락 빈도에서 자주 부딪힙니다. 두 사람의 궁합에서 강점, 갈등이 생기기 쉬운 지점, 대화할 때 조심할 점을 나눠 주세요.",
  },
  {
    title: "재회 고민 궁합 질문",
    description:
      "재회 가능성만 묻기보다 다시 대화한다면 피해야 할 행동과 현실적으로 확인할 조건을 함께 묻습니다.",
    prompt:
      "이별 후 재회를 고민하고 있습니다. 두 사람의 사주 궁합을 참고하되, 다시 연락할 때 조심할 점, 반복될 수 있는 갈등, 현실적으로 확인해야 할 조건을 알려주세요.",
  },
  {
    title: "결혼 고민 궁합 질문",
    description:
      "결혼 고민은 감정 궁합뿐 아니라 생활 방식, 돈 관리, 가족 관계처럼 현실 조건을 함께 넣는 편이 좋습니다.",
    prompt:
      "결혼을 고민하는 관계입니다. 궁합의 장점과 부딪히기 쉬운 부분을 설명하고, 생활 방식, 돈 관리, 감정 표현에서 미리 대화해야 할 주제를 정리해 주세요.",
  },
];

const QUESTION_RULES = [
  {
    title: "두 사람 정보를 나란히 쓰기",
    description:
      "본인과 상대 정보를 구분해 적으면 AI가 누구의 정보인지 헷갈리지 않습니다.",
  },
  {
    title: "좋다/나쁘다보다 장면을 묻기",
    description:
      "궁합 점수보다 대화 방식, 갈등 지점, 관계 속도를 묻는 편이 더 실용적입니다.",
  },
  {
    title: "모르는 출생시간은 모른다고 쓰기",
    description:
      "상대 출생시간을 모르면 추측하지 말고 가능한 범위에서 설명해 달라고 요청합니다.",
  },
];

const FAQ_ITEMS = [
  {
    question: "궁합 사주 질문에는 어떤 정보를 넣어야 하나요?",
    answer:
      "두 사람의 생년월일, 알고 있는 출생 시간, 양력/음력 기준, 현재 관계 상태, 가장 궁금한 질문 하나를 함께 적는 편이 좋습니다.",
  },
  {
    question: "상대 출생시간을 몰라도 궁합 질문을 할 수 있나요?",
    answer:
      "가능합니다. 상대 출생시간을 모른다고 적고, 확정적인 풀이보다 관계 흐름과 대화 조언 중심으로 설명해 달라고 요청하세요.",
  },
  {
    question: "궁합이 좋은지 나쁜지만 물어봐도 되나요?",
    answer:
      "가능하지만 답변이 막연해질 수 있습니다. 장점, 부딪히기 쉬운 지점, 서로 조심할 표현처럼 행동으로 옮길 수 있는 항목을 함께 묻는 편이 좋습니다.",
  },
  {
    question: "연애운 질문과 궁합 질문은 어떻게 다른가요?",
    answer:
      "연애운 질문은 본인의 관계 흐름에 초점을 두고, 궁합 질문은 두 사람의 상호작용과 갈등 패턴을 함께 보는 데 초점을 둡니다.",
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

export default function CompatibilitySajuQuestionExamplesGuidePage() {
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
                COMPATIBILITY
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-[12em] text-[clamp(2.2rem,1.75rem+2.1vw,4.1rem)] font-semibold tracking-[-0.035em] text-foreground [text-wrap:balance] [word-break:keep-all]">
                궁합 사주 질문 예시는 관계 상태를 함께 적을 때 더 선명합니다
              </h1>
              <p className="type-body max-w-[42rem] text-[color:color-mix(in_oklch,var(--foreground)_72%,var(--muted-foreground)_28%)] sm:text-[1.0625rem]">
                궁합 사주 질문 예시는 두 사람의 정보만 넣는 것보다 현재
                관계 상태를 함께 적어야 유용합니다. 썸, 연애, 재회, 결혼
                고민 중 어디에 가까운지 밝히고 장점, 갈등 지점, 대화 조언을
                나눠 달라고 요청해 보세요.
              </p>
            </div>

            <p className="type-body-sm text-muted-foreground">
              {SITE_NAME} · 최종 업데이트 {GUIDE.displayDate}
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild size="lg" data-icon="inline-end">
                <Link href={FORM_STEP_PATHS.mode}>
                  궁합 질문 만들기
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={LOVE_SAJU_PROMPT_GUIDE.path}>
                  연애운 질문 보기
                </Link>
              </Button>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border/75 bg-[color-mix(in_oklch,var(--card)_94%,var(--background)_6%)] p-5 shadow-[0_18px_45px_color-mix(in_oklch,var(--foreground)_4%,transparent)]">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <HeartHandshake className="size-4" aria-hidden />
              <p className="type-caption font-semibold tracking-[0.08em]">
                먼저 준비할 정보
              </p>
            </div>
            <ul className="space-y-2.5">
              {COMPATIBILITY_DETAILS.map((item) => (
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
          {QUESTION_EXAMPLES.map((example, index) => (
            <section
              key={example.title}
              className="rounded-[1.75rem] border border-border/75 bg-[color-mix(in_oklch,var(--background)_76%,var(--card)_24%)] p-5 sm:p-7"
            >
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
                    EXAMPLE {index + 1}
                  </p>
                  <h2 className="mt-2 type-title-md font-semibold text-foreground">
                    {example.title}
                  </h2>
                  <p className="mt-2 type-body-sm text-muted-foreground">
                    {example.description}
                  </p>
                </div>
                <Sparkles
                  className="hidden size-5 text-[color:color-mix(in_oklch,var(--primary)_62%,var(--accent)_38%)] sm:block"
                  aria-hidden
                />
              </div>

              <p className="rounded-[1.25rem] border border-border/70 bg-[color-mix(in_oklch,var(--card)_92%,var(--background)_8%)] p-4 type-body-sm text-foreground">
                {example.prompt}
              </p>
            </section>
          ))}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-[minmax(0,1fr)_20rem] md:items-start">
          <div className="space-y-4">
            <h2 className="type-title-md font-semibold text-foreground">
              궁합은 결론보다 관계 행동을 묻는 편이 좋습니다
            </h2>
            <div className="space-y-3 type-body text-muted-foreground">
              <p>
                “우리 궁합 좋아?”처럼 묻는 질문은 답변이 단정적으로 흐르기
                쉽습니다. 대신 어떤 장점이 있고, 어디에서 부딪히기 쉬우며,
                실제 대화에서는 무엇을 조심해야 하는지 물어보세요.
              </p>
              <p>
                상대의 출생시간을 모른다면{" "}
                <Link
                  href={UNKNOWN_BIRTH_TIME_SAJU_QUESTION_GUIDE.path}
                  className="font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  출생시간 모를 때 사주 질문
                </Link>
                을 참고해 모르는 정보를 명확히 표시하면 됩니다.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {QUESTION_RULES.map((item) => (
              <section
                key={item.title}
                className="rounded-[1.25rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_76%,var(--card)_24%)] p-5"
              >
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <ListChecks className="size-4" aria-hidden />
                  <h3 className="type-title-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="type-body-sm text-muted-foreground">
                  {item.description}
                </p>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[1.35rem] border border-primary/16 bg-[color-mix(in_oklch,var(--primary)_5%,var(--background)_95%)] p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_16rem] md:items-center">
            <div className="space-y-2">
              <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
                QUESTION LIST
              </p>
              <h2 className="type-title-sm font-semibold text-foreground">
                다른 주제의 질문 예시도 함께 비교하세요
              </h2>
              <p className="type-body-sm text-muted-foreground">
                궁합 외에 연애운, 직업운, 재물운 질문까지 한 번에 보고 싶다면
                AI 사주 질문 리스트에서 상황별 예시를 이어서 확인할 수
                있습니다.
              </p>
            </div>
            <Button asChild className="w-full" data-icon="inline-end">
              <Link href={AI_SAJU_QUESTION_LIST_GUIDE.path}>
                질문 리스트 보기
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </section>

        <RelatedGuideLinks currentPath={GUIDE.path} />

        <section className="mt-10 border-t border-border/70 pt-8">
          <div className="max-w-2xl space-y-3">
            <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
              FAQ
            </p>
            <h2 className="type-title-md font-semibold text-foreground">
              궁합 사주 질문을 쓸 때 자주 묻는 질문
            </h2>
            <p className="type-body text-muted-foreground">
              궁합 질문은 두 사람의 정보와 관계 맥락을 함께 적을수록 답변이
              더 실용적으로 정리됩니다.
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
            href={LOVE_SAJU_PROMPT_GUIDE.path}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            연애운 사주 질문
          </Link>
        </footer>
      </article>
    </main>
  );
}
