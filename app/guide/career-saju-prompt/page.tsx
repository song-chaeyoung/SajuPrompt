import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Sparkles } from "lucide-react";

import { GuideBreadcrumb } from "@/app/guide/_components/guide-breadcrumb";
import { GuideArticleStructuredData } from "@/app/guide/_components/guide-structured-data";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import {
  CAREER_SAJU_PROMPT_GUIDE,
  GUIDE_INDEX_PATH,
} from "@/shared/config/guides";
import { SITE_NAME, SOCIAL_IMAGE } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";

const GUIDE = CAREER_SAJU_PROMPT_GUIDE;

const CAREER_DETAILS = [
  "생년월일과 출생 시간",
  "현재 직무, 업계, 일하는 방식",
  "고민 중인 선택지: 이직, 전직, 사업, 휴식, 공부",
  "결정해야 하는 시기와 현실 제약",
  "원하는 답변 방식: 흐름, 리스크, 준비 순서, 실행 조언",
];

const QUESTION_PATTERNS = [
  {
    title: "선택지를 구체적으로 적습니다",
    description:
      "이직할지 말지만 묻기보다 남는 선택지와 이동하는 선택지를 함께 적어 비교할 수 있게 합니다.",
  },
  {
    title: "현실 조건을 같이 둡니다",
    description:
      "연봉, 업무 강도, 가족 상황, 준비 기간처럼 실제 결정을 바꾸는 조건을 프롬프트에 포함합니다.",
  },
  {
    title: "시기보다 준비 순서를 묻습니다",
    description:
      "좋은 시기만 묻기보다 지금 준비할 것, 피해야 할 결정, 확인할 신호를 함께 요청합니다.",
  },
];

const EXAMPLE_PROMPT = `아래 정보를 바탕으로 직업운과 커리어 선택을 참고해 주세요.

- 생년월일: 1992년 9월 7일
- 출생 시간: 오전 6시 40분
- 달력 기준: 양력
- 현재 상황: 5년 차 마케터이고, 데이터 분석 직무로 전환을 고민 중입니다.
- 선택지: 현 회사에 남아 내부 이동을 준비하거나, 6개월 안에 이직을 시도하려고 합니다.
- 현실 조건: 연봉 하락은 크지 않았으면 하고, 공부 시간은 평일 저녁과 주말에 확보할 수 있습니다.
- 가장 궁금한 점: 올해 커리어 전환을 시작해도 괜찮은지 알고 싶습니다.
- 원하는 답변: 직업운 흐름, 조심할 리스크, 준비 순서, 현실적으로 확인할 체크포인트로 나눠서 알려주세요.

사주 해석은 참고로만 보고 싶습니다. 결정은 현실 조건과 함께 판단할 수 있게 균형 있게 설명해 주세요.`;

const FAQ_ITEMS = [
  {
    question: "이직 시기만 물어봐도 충분한가요?",
    answer:
      "시기만 묻기보다 현재 직무, 선택지, 준비 기간, 연봉이나 생활 조건을 함께 적는 편이 좋습니다. 그래야 답변이 현실적인 비교로 이어집니다.",
  },
  {
    question: "사업운 질문은 어떤 정보를 넣어야 하나요?",
    answer:
      "업종, 준비 단계, 자본 상황, 같이 일할 사람, 가장 걱정되는 리스크를 함께 적어 주세요. 단순한 성공 가능성보다 준비 순서와 주의점을 묻는 것이 유용합니다.",
  },
  {
    question: "직업운과 재물운을 같이 물어봐도 되나요?",
    answer:
      "같이 물을 수 있지만 질문의 중심을 하나로 정해야 합니다. 예를 들어 이직으로 수입이 바뀌는 문제처럼 직업 선택과 돈의 영향이 연결될 때 함께 묻는 방식이 좋습니다.",
  },
  {
    question: "AI 답변을 커리어 결정에 바로 적용해도 되나요?",
    answer:
      "AI 사주 답변은 참고 자료입니다. 실제 결정은 계약 조건, 시장 상황, 건강, 가족 여건, 전문가 조언과 함께 검토하는 것이 안전합니다.",
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

export default function CareerSajuPromptGuidePage() {
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
                CAREER PROMPT
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-[12em] text-[clamp(2.2rem,1.75rem+2.1vw,4.1rem)] font-semibold tracking-[-0.035em] text-foreground [text-wrap:balance] [word-break:keep-all]">
                직업운은 현실 선택지와 함께 물어봐야 답이 선명해집니다
              </h1>
              <p className="type-body max-w-[42rem] text-[color:color-mix(in_oklch,var(--foreground)_72%,var(--muted-foreground)_28%)] sm:text-[1.0625rem]">
                직업운 사주 질문은 “언제 이직할까요?”보다 지금 가진 선택지와
                현실 조건을 함께 적는 편이 좋습니다. AI가 운의 흐름과 실제
                준비 순서를 나눠 볼 수 있도록 직무, 시기, 제약, 원하는 결론을
                같이 정리해 주세요.
              </p>
            </div>

            <p className="type-body-sm text-muted-foreground">
              {SITE_NAME} · 최종 업데이트 {GUIDE.displayDate}
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild size="lg" data-icon="inline-end">
                <Link href={FORM_STEP_PATHS.mode}>
                  직업운 질문 만들기
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
              <BriefcaseBusiness className="size-4" aria-hidden />
              <p className="type-caption font-semibold tracking-[0.08em]">
                먼저 준비할 정보
              </p>
            </div>
            <ul className="space-y-2.5">
              {CAREER_DETAILS.map((item) => (
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
                직업운 질문 예시
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
              커리어 질문에서 피하면 좋은 방식
            </h2>
            <div className="space-y-3 type-body text-muted-foreground">
              <p>
                “올해 이직해도 돼?”처럼 결론만 묻는 질문은 답변이 막연해지기
                쉽습니다. 비교할 선택지와 준비 상태를 함께 적어야 지금 할
                행동이 분명해집니다.
              </p>
              <p>
                직업운 해석은 결정의 참고 자료입니다. 계약, 연봉, 건강,
                가족 상황처럼 실제 리스크를 함께 검토해야 하며, AI 답변에도
                단정 대신 가능성과 확인해야 할 조건을 요청하는 편이 안전합니다.
              </p>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-primary/16 bg-[color-mix(in_oklch,var(--primary)_5%,var(--background)_95%)] p-5">
            <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
              빠르게 만들기
            </p>
            <p className="mt-2 type-body-sm text-muted-foreground">
              직무와 선택지를 입력하면 ChatGPT에 붙여 넣을 직업운 사주 질문
              프롬프트를 정리할 수 있습니다.
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
              직업운 사주 질문을 만들 때 자주 묻는 질문
            </h2>
            <p className="type-body text-muted-foreground">
              커리어 질문은 실제 선택지와 제약을 함께 적을수록 답변이
              구체적입니다. 아래 기준으로 질문 범위를 좁혀 보세요.
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
