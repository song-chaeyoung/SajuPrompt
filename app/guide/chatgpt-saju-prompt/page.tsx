import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, Sparkles } from "lucide-react";

import { GuideBreadcrumb } from "@/app/guide/_components/guide-breadcrumb";
import { GuideArticleStructuredData } from "@/app/guide/_components/guide-structured-data";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import {
  CHATGPT_SAJU_PROMPT_GUIDE,
  GUIDE_INDEX_PATH,
} from "@/shared/config/guides";
import { SITE_NAME } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";

const GUIDE = CHATGPT_SAJU_PROMPT_GUIDE;
const PRIVACY_PATH = "/privacy";

const REQUIRED_DETAILS = [
  "생년월일과 출생 시간",
  "양력/음력 여부와 윤달 여부",
  "태어난 지역 또는 시간 보정에 필요한 단서",
  "지금 가장 궁금한 주제",
  "원하는 답변 스타일과 깊이",
];

const PROMPT_STEPS = [
  {
    title: "정보를 먼저 정리합니다",
    description:
      "AI가 사주 구조를 추정할 수 있도록 날짜, 시간, 지역, 달력 기준을 한 번에 적습니다.",
  },
  {
    title: "질문 목적을 좁힙니다",
    description:
      "직업, 관계, 연애, 재물, 건강처럼 한 번에 하나의 주제를 중심으로 묻습니다.",
  },
  {
    title: "답변 형식을 지정합니다",
    description:
      "전체 흐름, 주의할 시기, 실행 조언처럼 받고 싶은 결과 형태를 분명히 씁니다.",
  },
];

const FAQ_ITEMS = [
  {
    question: "ChatGPT 사주 질문은 생년월일만 있어도 되나요?",
    answer:
      "생년월일만으로도 간단한 흐름 질문은 가능하지만, 출생 시간과 양력/음력 기준이 빠지면 사주 구조가 달라질 수 있습니다. 정확도를 높이려면 출생 시간, 달력 기준, 출생 지역까지 함께 적는 편이 좋습니다.",
  },
  {
    question: "AI 사주 질문 프롬프트와 사주 풀이 도우미는 무엇이 다른가요?",
    answer:
      "이 도구는 사주 풀이를 단정적으로 대신 제공하기보다 ChatGPT, Gemini, Claude가 답하기 쉬운 질문문을 정리합니다. 사용자의 고민 맥락과 원하는 답변 형식을 프롬프트로 바꾸는 데 초점을 둡니다.",
  },
  {
    question: "연애운, 직업운, 궁합 질문은 한 번에 물어봐도 되나요?",
    answer:
      "한 번에 여러 주제를 묻기보다 연애운, 직업운, 궁합처럼 주제를 나눠 묻는 편이 답변이 선명합니다. 먼저 가장 중요한 고민 하나를 정하고, 추가 질문은 별도 프롬프트로 이어가는 것이 좋습니다.",
  },
  {
    question: "사주 답변을 그대로 믿어도 되나요?",
    answer:
      "사주와 운세 해석은 참고용으로 보는 편이 안전합니다. 중요한 결정은 현실적인 조건, 전문가 조언, 본인의 판단을 함께 놓고 검토해야 하며, AI 답변에는 가능성과 주의점을 함께 요청하는 것이 좋습니다.",
  },
];

const EXAMPLE_PROMPT = `아래 정보를 바탕으로 사주를 참고해 지금의 고민을 해석해 주세요.

- 생년월일: 1994년 5월 12일
- 출생 시간: 오전 8시 20분
- 달력 기준: 양력
- 출생지: 서울
- 현재 고민: 이직을 준비해도 되는 시기인지 알고 싶습니다.
- 원하는 답변: 직업운 중심으로 전체 흐름, 조심할 점, 지금 할 수 있는 실행 조언을 나눠서 알려주세요.

단정적으로 말하기보다 가능성과 주의점을 균형 있게 설명해 주세요.`;

export const metadata: Metadata = {
  title: GUIDE.title,
  description: GUIDE.description,
  alternates: {
    canonical: GUIDE.path,
  },
  openGraph: {
    title: GUIDE.title,
    description:
      "생년월일, 출생 시간, 고민 맥락을 정리해 AI가 답하기 쉬운 사주 질문 프롬프트를 만드는 방법입니다.",
    url: GUIDE.path,
    type: "article",
  },
};

export default function ChatGptSajuPromptGuidePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 md:px-8 md:py-12">
      <GuideArticleStructuredData guide={GUIDE} />
      <GuideBreadcrumb currentTitle={GUIDE.title} />

      <article className="mx-auto w-full max-w-4xl">
        <header className="grid gap-8 pb-10 md:grid-cols-[minmax(0,1fr)_18rem] md:items-end md:pb-14">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-7 bg-primary/35" />
              <span className="type-caption font-semibold tracking-[0.18em] text-primary/80">
                GUIDE
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-[12em] text-[clamp(2.2rem,1.75rem+2.1vw,4.1rem)] font-semibold tracking-[-0.035em] text-foreground [text-wrap:balance] [word-break:keep-all]">
                ChatGPT에 사주를 물어볼 때 필요한 질문 구조
              </h1>
              <p className="type-body max-w-[42rem] text-[color:color-mix(in_oklch,var(--foreground)_72%,var(--muted-foreground)_28%)] sm:text-[1.0625rem]">
                ChatGPT 사주 질문은 생년월일만 던지는 것보다 출생 시간,
                달력 기준, 현재 고민, 원하는 답변 방식을 함께 적는 편이
                좋습니다. 프롬프트가 구체적일수록 답변도 상황에 맞게
                정리됩니다.
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
                <Link href={GUIDE_INDEX_PATH}>가이드 목록</Link>
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
          {PROMPT_STEPS.map((step, index) => (
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
                EXAMPLE PROMPT
              </p>
              <h2 className="mt-2 type-title-md font-semibold text-foreground">
                바로 활용할 수 있는 질문 예시
              </h2>
            </div>
            <Sparkles
              className="hidden size-5 text-[color:color-mix(in_oklch,var(--primary)_62%,var(--accent)_38%)] sm:block"
              aria-hidden
            />
          </div>

          <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-[1.25rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_86%,var(--card)_14%)] p-4 type-body-sm text-foreground [word-break:keep-all]">
            {EXAMPLE_PROMPT}
          </pre>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-[minmax(0,1fr)_20rem] md:items-start">
          <div className="space-y-4">
            <h2 className="type-title-md font-semibold text-foreground">
              질문을 더 좋게 만드는 기준
            </h2>
            <div className="space-y-3 type-body text-muted-foreground">
              <p>
                좋은 질문은 사주 정보와 고민 맥락을 함께 제공합니다. 예를
                들어 “올해 운세 봐줘”보다 “이직을 준비 중인데 직업운과
                조심할 시기를 알려줘”처럼 목적을 좁히면 답변이 더 실용적으로
                정리됩니다.
              </p>
              <p>
                사주 해석은 절대적인 결론이 아니라 참고 자료로 다루는 편이
                안전합니다. 질문문에도 단정 대신 가능성, 주의점, 실행 조언을
                균형 있게 요청하는 문장을 넣는 것이 좋습니다.
              </p>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-primary/16 bg-[color-mix(in_oklch,var(--primary)_5%,var(--background)_95%)] p-5">
            <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
              빠르게 만들기
            </p>
            <p className="mt-2 type-body-sm text-muted-foreground">
              생년월일과 고민을 입력하면 위 구조에 맞춰 ChatGPT에 붙여 넣을
              사주 질문 프롬프트를 자동으로 정리합니다.
            </p>
            <Button asChild className="mt-4 w-full" data-icon="inline-end">
              <Link href={FORM_STEP_PATHS.mode}>
                질문문 생성 시작
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </section>

        <section className="mt-10 border-t border-border/70 pt-8">
          <div className="max-w-2xl space-y-3">
            <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
              FAQ
            </p>
            <h2 className="type-title-md font-semibold text-foreground">
              ChatGPT 사주 질문을 만들 때 자주 묻는 질문
            </h2>
            <p className="type-body text-muted-foreground">
              사주 질문 프롬프트는 입력 정보와 질문 목적이 분명할수록
              유용합니다. 아래 기준을 참고하면 AI 사주 질문을 더 안전하고
              구체적으로 정리할 수 있습니다.
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

          <p className="mt-4 type-body-sm text-muted-foreground">
            생년월일, 출생 시간, 고민 내용처럼 개인 정보가 포함될 수 있는
            입력은{" "}
            <Link
              href={PRIVACY_PATH}
              className="font-semibold text-foreground underline-offset-4 hover:underline"
            >
              개인정보 처리 안내
            </Link>
            에서 사용 범위를 확인한 뒤 입력해 주세요.
          </p>
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
            href={PRIVACY_PATH}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            개인정보 처리 안내
          </Link>
        </footer>
      </article>
    </main>
  );
}
