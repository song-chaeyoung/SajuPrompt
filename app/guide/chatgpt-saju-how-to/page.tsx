import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, CheckCircle2, ClipboardList, Sparkles } from "lucide-react";

import { GuideBreadcrumb } from "@/app/guide/_components/guide-breadcrumb";
import { RelatedGuideLinks } from "@/app/guide/_components/related-guide-links";
import { GuideArticleStructuredData } from "@/app/guide/_components/guide-structured-data";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import {
  CHATGPT_SAJU_HOW_TO_GUIDE,
  CHATGPT_SAJU_PROMPT_GUIDE,
  COMPATIBILITY_SAJU_QUESTION_EXAMPLES_GUIDE,
  GUIDE_INDEX_PATH,
  UNKNOWN_BIRTH_TIME_SAJU_QUESTION_GUIDE,
} from "@/shared/config/guides";
import { SITE_NAME, SOCIAL_IMAGE } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";

const GUIDE = CHATGPT_SAJU_HOW_TO_GUIDE;

const REQUIRED_DETAILS = [
  "본인의 생년월일",
  "출생 시간과 출생지",
  "양력/음력 여부와 윤달 여부",
  "지금 가장 궁금한 고민 하나",
  "원하는 답변 방식: 흐름, 주의점, 실행 조언",
];

const HOW_TO_STEPS = [
  {
    title: "기본 정보를 한 번에 씁니다",
    description:
      "생년월일, 출생 시간, 출생지, 양력/음력 기준을 먼저 정리해야 ChatGPT가 사주 질문의 전제를 이해하기 쉽습니다.",
  },
  {
    title: "질문 주제를 하나로 좁힙니다",
    description:
      "전체운, 연애운, 궁합, 직업운처럼 한 번에 하나의 주제로 묻는 편이 답변이 덜 흩어집니다.",
  },
  {
    title: "답변 형식을 요청합니다",
    description:
      "전체 흐름, 조심할 점, 지금 할 수 있는 행동처럼 원하는 답변 구조를 같이 적습니다.",
  },
];

const QUESTION_EXAMPLES = [
  {
    title: "기본 사주 질문",
    prompt:
      "아래 생년월일과 출생 시간을 바탕으로 올해 전체 흐름, 조심할 점, 지금 준비하면 좋은 일을 나눠서 설명해 주세요.",
  },
  {
    title: "연애운 질문",
    prompt:
      "현재 관계 상황을 참고해 연애운 흐름, 대화할 때 조심할 점, 내가 먼저 할 수 있는 행동을 알려주세요.",
  },
  {
    title: "직업운 질문",
    prompt:
      "이직을 고민하는 상황에서 직업운 흐름, 리스크, 준비 순서, 현실적으로 확인할 체크포인트를 나눠 주세요.",
  },
  {
    title: "궁합 질문",
    prompt:
      "두 사람의 생년월일과 현재 관계를 바탕으로 궁합의 장점, 부딪히기 쉬운 지점, 대화할 때 조심할 점을 알려주세요.",
  },
  {
    title: "재물운 질문",
    prompt:
      "올해 돈을 모으거나 지출을 줄이고 싶은 상황에서 재물운 흐름, 조심할 소비 패턴, 현실적인 관리 방법을 나눠 주세요.",
  },
  {
    title: "올해운 질문",
    prompt:
      "올해 전체 운의 흐름을 일, 관계, 돈, 건강 관리 관점으로 나누고 특히 조심할 시기와 준비할 일을 설명해 주세요.",
  },
];

const UNKNOWN_TIME_GUIDELINES = [
  {
    title: "모른다고 먼저 적기",
    description:
      "출생 시간을 추측해서 넣기보다 “출생 시간은 모릅니다”라고 적어야 답변 전제가 분명해집니다.",
  },
  {
    title: "확정 표현을 피하게 하기",
    description:
      "시간이 없으면 사주 구조가 달라질 수 있으므로 가능성, 경향, 주의점 중심으로 설명해 달라고 요청합니다.",
  },
  {
    title: "현실 맥락을 더 자세히 쓰기",
    description:
      "현재 고민, 선택지, 반복되는 문제를 구체적으로 적으면 출생 시간이 없어도 답변을 더 실용적으로 받을 수 있습니다.",
  },
];

const QUESTION_COMPARISONS = [
  {
    bad: "사주 봐줘.",
    good: "1994년 5월 12일 오전 8시 20분, 양력, 서울 출생입니다. 올해 이직을 고민 중인데 직업운 흐름과 조심할 점, 지금 준비할 일을 나눠서 알려주세요.",
  },
  {
    bad: "연애운 어때?",
    good: "현재 썸을 타는 중이고 연락 빈도가 불안정합니다. 연애운 흐름, 상대와 대화할 때 조심할 표현, 내가 먼저 할 수 있는 행동을 알려주세요.",
  },
  {
    bad: "돈 많이 벌 수 있어?",
    good: "올해 저축을 늘리고 싶은 상황입니다. 재물운 흐름, 지출에서 조심할 점, 현실적으로 점검할 습관을 함께 알려주세요.",
  },
];

const FAQ_ITEMS = [
  {
    question: "챗지피티로 사주를 볼 때 생년월일만 입력해도 되나요?",
    answer:
      "간단한 질문은 가능하지만 출생 시간, 양력/음력 기준, 출생지가 빠지면 해석의 전제가 흐려질 수 있습니다. 알고 있는 정보와 모르는 정보를 함께 적는 편이 좋습니다.",
  },
  {
    question: "출생 시간을 모르면 어떻게 질문해야 하나요?",
    answer:
      "출생 시간을 모른다고 명확히 적고, 답변에는 확정적인 해석보다 가능한 흐름과 주의점을 중심으로 설명해 달라고 요청하는 것이 좋습니다.",
  },
  {
    question: "연애운, 궁합, 직업운을 한 번에 물어봐도 되나요?",
    answer:
      "한 번에 모두 묻기보다 가장 중요한 주제 하나부터 질문하는 편이 답변이 선명합니다. 추가 주제는 별도 질문으로 이어가면 좋습니다.",
  },
  {
    question: "ChatGPT 사주 답변을 그대로 믿어도 되나요?",
    answer:
      "사주와 AI 답변은 참고 자료로 보는 것이 안전합니다. 중요한 결정은 현실 조건, 전문가 조언, 본인의 판단과 함께 검토해야 합니다.",
  },
];

const BASIC_PROMPT = `아래 정보를 바탕으로 사주를 참고해 지금의 고민을 정리해 주세요.

- 생년월일: 1994년 5월 12일
- 출생 시간: 오전 8시 20분
- 달력 기준: 양력
- 출생지: 서울
- 현재 고민: 올해 이직을 준비해도 되는지 알고 싶습니다.
- 원하는 답변: 전체 흐름, 조심할 점, 지금 준비하면 좋은 일을 나눠서 알려주세요.

단정적으로 말하기보다 가능성과 주의점을 균형 있게 설명해 주세요.`;

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

export default function ChatGptSajuHowToGuidePage() {
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
                CHATGPT HOW TO
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-[12em] text-[clamp(2.2rem,1.75rem+2.1vw,4.1rem)] font-semibold tracking-[-0.035em] text-foreground [text-wrap:balance] [word-break:keep-all]">
                챗지피티로 사주 보는 법은 질문 정리부터 시작합니다
              </h1>
              <p className="type-body max-w-[42rem] text-[color:color-mix(in_oklch,var(--foreground)_72%,var(--muted-foreground)_28%)] sm:text-[1.0625rem]">
                챗지피티로 사주보는 법을 찾는다면 먼저 생년월일, 출생
                시간, 달력 기준, 지금의 고민을 한 번에 정리해야 합니다.
                질문이 구체적일수록 ChatGPT도 사주 흐름과 현실적인 조언을
                더 나눠서 답하기 쉽습니다.
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
                <Link href={CHATGPT_SAJU_PROMPT_GUIDE.path}>
                  프롬프트 작성법 보기
                </Link>
              </Button>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border/75 bg-[color-mix(in_oklch,var(--card)_94%,var(--background)_6%)] p-5 shadow-[0_18px_45px_color-mix(in_oklch,var(--foreground)_4%,transparent)]">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <ClipboardList className="size-4" aria-hidden />
              <p className="type-caption font-semibold tracking-[0.08em]">
                먼저 준비할 정보
              </p>
            </div>
            <ul className="space-y-2.5">
              {REQUIRED_DETAILS.map((item) => (
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

        <div className="grid gap-5 md:grid-cols-3">
          {HOW_TO_STEPS.map((step, index) => (
            <section
              key={step.title}
              className="rounded-[1.35rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_72%,var(--card)_28%)] p-5"
            >
              <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
                STEP {index + 1}
              </p>
              <h2 className="mt-3 type-title-sm font-semibold text-foreground">
                {step.title}
              </h2>
              <p className="mt-2 type-body-sm text-muted-foreground">
                {step.description}
              </p>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-[1.75rem] border border-border/75 bg-[color-mix(in_oklch,var(--card)_94%,var(--background)_6%)] p-5 shadow-[0_22px_54px_color-mix(in_oklch,var(--foreground)_4%,transparent)] sm:p-7">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
                COPY PROMPT
              </p>
              <h2 className="mt-2 type-title-md font-semibold text-foreground">
                챗지피티에 바로 넣을 기본 질문 예시
              </h2>
            </div>
            <Sparkles
              className="hidden size-5 text-[color:color-mix(in_oklch,var(--primary)_62%,var(--accent)_38%)] sm:block"
              aria-hidden
            />
          </div>

          <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-[1.25rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_86%,var(--card)_14%)] p-4 type-body-sm text-foreground [word-break:keep-all]">
            {BASIC_PROMPT}
          </pre>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-[minmax(0,1fr)_20rem] md:items-start">
          <div className="space-y-4">
            <h2 className="type-title-md font-semibold text-foreground">
              출생 시간을 모를 때는 이렇게 물어보세요
            </h2>
            <div className="space-y-3 type-body text-muted-foreground">
              <p>
                챗지피티로 사주를 볼 때 출생 시간을 모른다면 억지로 시간을
                추측하지 않는 편이 좋습니다. 대신 모르는 정보를 분명히 적고,
                답변도 확정적인 사주 풀이보다 가능한 흐름과 주의점 중심으로
                요청하세요.
              </p>
              <p>
                예를 들어 “출생 시간은 모르지만 생년월일은 양력 1994년 5월
                12일입니다. 올해 직업운을 참고하고 싶으니 가능한 경향과
                현실적으로 확인할 점을 나눠 주세요.”처럼 적으면 됩니다.
                더 자세한 예시는{" "}
                <Link
                  href={UNKNOWN_BIRTH_TIME_SAJU_QUESTION_GUIDE.path}
                  className="font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  출생시간 모를 때 사주 질문
                </Link>
                에서 확인할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {UNKNOWN_TIME_GUIDELINES.map((item) => (
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

        <section className="mt-8 rounded-[1.75rem] border border-border/75 bg-[color-mix(in_oklch,var(--background)_78%,var(--card)_22%)] p-5 sm:p-7">
          <div className="max-w-2xl space-y-3">
            <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
              BETTER QUESTION
            </p>
            <h2 className="type-title-md font-semibold text-foreground">
              나쁜 질문보다 좋은 질문은 맥락이 들어갑니다
            </h2>
            <p className="type-body text-muted-foreground">
              ChatGPT 사주 질문은 짧게 던질수록 답변도 막연해지기 쉽습니다.
              생년월일, 현재 상황, 알고 싶은 주제, 원하는 답변 형식을 함께
              적으면 바로 활용할 수 있는 답변에 가까워집니다.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {QUESTION_COMPARISONS.map((comparison) => (
              <section
                key={comparison.bad}
                className="grid gap-3 rounded-[1.25rem] border border-border/70 bg-[color-mix(in_oklch,var(--card)_92%,var(--background)_8%)] p-4 sm:grid-cols-2"
              >
                <div>
                  <p className="type-caption font-semibold tracking-[0.08em] text-muted-foreground">
                    아쉬운 질문
                  </p>
                  <p className="mt-2 type-body-sm text-muted-foreground">
                    {comparison.bad}
                  </p>
                </div>
                <div>
                  <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
                    더 좋은 질문
                  </p>
                  <p className="mt-2 type-body-sm text-foreground">
                    {comparison.good}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-[minmax(0,1fr)_20rem] md:items-start">
          <div className="space-y-4">
            <h2 className="type-title-md font-semibold text-foreground">
              상황별로 이렇게 나눠 물어보세요
            </h2>
            <div className="grid gap-3">
              {QUESTION_EXAMPLES.map((example) => (
                <section
                  key={example.title}
                  className="rounded-[1.25rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_76%,var(--card)_24%)] p-5"
                >
                  <h3 className="type-title-sm font-semibold text-foreground">
                    {example.title}
                  </h3>
                  <p className="mt-2 type-body-sm text-muted-foreground">
                    {example.prompt}
                  </p>
                </section>
              ))}
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-primary/16 bg-[color-mix(in_oklch,var(--primary)_5%,var(--background)_95%)] p-5">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <BookOpenText className="size-4" aria-hidden />
              <p className="type-caption font-semibold tracking-[0.08em]">
                더 구체적으로
              </p>
            </div>
            <p className="type-body-sm text-muted-foreground">
              질문문을 더 길고 정확하게 다듬고 싶다면 ChatGPT 사주 질문
              프롬프트 작성법에서 정보 순서와 답변 형식을 더 자세히 확인할 수
              있습니다. 궁합만 따로 묻고 싶다면 궁합 사주 질문 예시도 함께
              참고해 보세요.
            </p>
            <div className="mt-4 grid gap-2">
              <Button asChild className="w-full" data-icon="inline-end">
                <Link href={CHATGPT_SAJU_PROMPT_GUIDE.path}>
                  프롬프트 작성법 보기
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild className="w-full" variant="secondary">
                <Link href={COMPATIBILITY_SAJU_QUESTION_EXAMPLES_GUIDE.path}>
                  궁합 질문 예시 보기
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <RelatedGuideLinks currentPath={GUIDE.path} />

        <section className="mt-10 border-t border-border/70 pt-8">
          <div className="max-w-2xl space-y-3">
            <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
              FAQ
            </p>
            <h2 className="type-title-md font-semibold text-foreground">
              챗지피티로 사주를 볼 때 자주 묻는 질문
            </h2>
            <p className="type-body text-muted-foreground">
              ChatGPT 사주 답변은 입력한 정보와 질문 방식에 따라 달라집니다.
              아래 기준을 참고해 질문 범위를 좁혀 보세요.
            </p>
          </div>

          <dl className="mt-6 grid gap-4">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.question}
                className="rounded-[1.25rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_76%,var(--card)_24%)] p-5"
              >
                <dt className="type-title-sm font-semibold text-foreground">
                  {item.question}
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
            href={CHATGPT_SAJU_PROMPT_GUIDE.path}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            ChatGPT 사주 질문 프롬프트 작성법
          </Link>
        </footer>
      </article>
    </main>
  );
}
