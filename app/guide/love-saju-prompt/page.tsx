import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, HeartHandshake, Sparkles } from "lucide-react";

import { GuideBreadcrumb } from "@/app/guide/_components/guide-breadcrumb";
import { GuideArticleStructuredData } from "@/app/guide/_components/guide-structured-data";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import {
  GUIDE_INDEX_PATH,
  LOVE_SAJU_PROMPT_GUIDE,
} from "@/shared/config/guides";
import { SITE_NAME, SOCIAL_IMAGE } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";

const GUIDE = LOVE_SAJU_PROMPT_GUIDE;

const RELATIONSHIP_DETAILS = [
  "본인 생년월일과 출생 시간",
  "상대가 있다면 상대의 생년월일과 알고 있는 출생 정보",
  "현재 관계 상태: 썸, 연애, 이별, 재회 고민, 결혼 고민",
  "가장 알고 싶은 질문 하나",
  "원하는 답변 방식: 흐름, 주의점, 대화 조언, 시기 참고",
];

const QUESTION_PATTERNS = [
  {
    title: "상황을 먼저 고정합니다",
    description:
      "상대와의 관계가 시작 전인지, 연애 중인지, 재회를 고민하는지에 따라 질문의 초점이 달라집니다.",
  },
  {
    title: "궁금한 지점을 하나로 좁힙니다",
    description:
      "상대 마음, 관계 흐름, 갈등 원인, 결혼 가능성처럼 한 번에 하나의 주제로 묻는 편이 좋습니다.",
  },
  {
    title: "현실 행동 조언을 요청합니다",
    description:
      "운세 해석만 요청하기보다 대화 방식, 조심할 표현, 지금 할 수 있는 선택지를 함께 물어봅니다.",
  },
];

const EXAMPLE_PROMPT = `아래 정보를 바탕으로 연애운과 관계 흐름을 참고해 주세요.

- 본인 생년월일: 1996년 3월 18일
- 본인 출생 시간: 오후 2시 10분
- 달력 기준: 양력
- 상대 생년월일: 1995년 11월 4일
- 상대 출생 시간: 모름
- 현재 관계: 썸을 타는 중이지만 연락 빈도가 들쑥날쑥합니다.
- 가장 궁금한 점: 이 관계를 천천히 이어가도 괜찮은지 알고 싶습니다.
- 원하는 답변: 관계 흐름, 조심할 점, 먼저 대화를 꺼낼 때 좋은 방식으로 나눠서 알려주세요.

사주 해석은 참고로만 보고 싶습니다. 단정하지 말고 가능성과 주의점을 균형 있게 설명해 주세요.`;

const FAQ_ITEMS = [
  {
    question: "상대의 출생 시간을 몰라도 연애운 질문을 만들 수 있나요?",
    answer:
      "가능합니다. 상대 출생 시간을 모르면 모른다고 적고, 대신 현재 관계 상태와 반복되는 갈등, 알고 싶은 질문을 구체적으로 적는 편이 좋습니다.",
  },
  {
    question: "연애운과 궁합을 한 번에 물어봐도 되나요?",
    answer:
      "한 번에 묻기보다는 먼저 현재 관계의 흐름을 묻고, 그다음 궁합이나 결혼 가능성처럼 세부 주제로 나누면 답변이 더 선명해집니다.",
  },
  {
    question: "재회 고민은 어떻게 적어야 하나요?",
    answer:
      "이별 시점, 연락 빈도, 갈등 원인, 본인이 원하는 결론을 함께 적어야 합니다. 단순히 재회 가능성만 묻기보다 주의할 행동과 기다릴 신호를 같이 요청하는 것이 좋습니다.",
  },
  {
    question: "AI 답변을 그대로 믿어도 되나요?",
    answer:
      "사주와 AI 답변은 참고 자료로 보는 것이 안전합니다. 중요한 관계 결정은 실제 대화, 상대의 행동, 본인의 기준을 함께 놓고 판단해야 합니다.",
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

export default function LoveSajuPromptGuidePage() {
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
                LOVE PROMPT
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-[12em] text-[clamp(2.2rem,1.75rem+2.1vw,4.1rem)] font-semibold tracking-[-0.035em] text-foreground [text-wrap:balance] [word-break:keep-all]">
                연애운을 물어볼 때는 관계 상태부터 분명히 적습니다
              </h1>
              <p className="type-body max-w-[42rem] text-[color:color-mix(in_oklch,var(--foreground)_72%,var(--muted-foreground)_28%)] sm:text-[1.0625rem]">
                연애운 사주 질문은 상대 정보보다 현재 관계 맥락이 중요합니다.
                썸, 연애, 이별, 재회, 결혼 고민 중 어디에 가까운지 먼저
                정리하면 AI가 관계 흐름과 현실적인 대화 조언을 더 잘 나눠서
                답할 수 있습니다.
              </p>
            </div>

            <p className="type-body-sm text-muted-foreground">
              {SITE_NAME} · 최종 업데이트 {GUIDE.displayDate}
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild size="lg" data-icon="inline-end">
                <Link href={FORM_STEP_PATHS.mode}>
                  연애운 질문 만들기
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
              <HeartHandshake className="size-4" aria-hidden />
              <p className="type-caption font-semibold tracking-[0.08em]">
                먼저 준비할 정보
              </p>
            </div>
            <ul className="space-y-2.5">
              {RELATIONSHIP_DETAILS.map((item) => (
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
          {QUESTION_PATTERNS.map((pattern, index) => (
            <section
              key={pattern.title}
              className="rounded-[1.35rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_72%,var(--card)_28%)] p-5"
            >
              <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
                POINT {index + 1}
              </p>
              <h2 className="mt-3 type-title-sm font-semibold text-foreground">
                {pattern.title}
              </h2>
              <p className="mt-2 type-body-sm text-muted-foreground">
                {pattern.description}
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
                연애운 질문 예시
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
              답변을 더 실용적으로 만드는 질문 방식
            </h2>
            <div className="space-y-3 type-body text-muted-foreground">
              <p>
                “그 사람과 잘 될까요?”처럼 넓게 묻기보다 “최근 연락이 줄어든
                상황에서 내가 먼저 대화해도 괜찮을까요?”처럼 장면을 적으면
                답변이 더 구체적입니다.
              </p>
              <p>
                상대의 출생 시간을 모른다면 모른다고 적어도 됩니다. 대신
                현재 관계의 흐름, 반복되는 갈등, 본인이 원하는 결론을 함께
                적어 해석의 기준을 분명히 두는 편이 좋습니다.
              </p>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-primary/16 bg-[color-mix(in_oklch,var(--primary)_5%,var(--background)_95%)] p-5">
            <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
              빠르게 만들기
            </p>
            <p className="mt-2 type-body-sm text-muted-foreground">
              관계 상태와 고민을 입력하면 ChatGPT에 붙여 넣을 연애운 사주
              질문 프롬프트를 정리할 수 있습니다.
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
              연애운 사주 질문을 만들 때 자주 묻는 질문
            </h2>
            <p className="type-body text-muted-foreground">
              관계 질문은 상대 정보보다 현재 상황과 궁금한 초점이 중요합니다.
              아래 기준을 참고해 한 번에 하나의 질문으로 좁혀 보세요.
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
      </article>
    </main>
  );
}
