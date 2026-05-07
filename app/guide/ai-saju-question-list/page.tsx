import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, ListChecks, Sparkles } from "lucide-react";

import { GuideBreadcrumb } from "@/app/guide/_components/guide-breadcrumb";
import { RelatedGuideLinks } from "@/app/guide/_components/related-guide-links";
import { GuideArticleStructuredData } from "@/app/guide/_components/guide-structured-data";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import {
  AI_SAJU_QUESTION_LIST_GUIDE,
  CHATGPT_SAJU_HOW_TO_GUIDE,
  GUIDE_INDEX_PATH,
} from "@/shared/config/guides";
import { SITE_NAME, SOCIAL_IMAGE } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";

const GUIDE = AI_SAJU_QUESTION_LIST_GUIDE;

const QUESTION_GROUPS = [
  {
    title: "기본 사주 질문",
    description:
      "처음 AI에게 사주를 물어볼 때는 생년월일, 출생 시간, 달력 기준, 현재 고민을 함께 적는 질문이 좋습니다.",
    prompts: [
      "아래 생년월일과 출생 시간을 바탕으로 올해 전체 흐름, 조심할 점, 지금 준비하면 좋은 일을 나눠서 설명해 주세요.",
      "사주를 참고해 제 성향의 강점과 반복되기 쉬운 고민 패턴을 알려주세요. 단정하지 말고 가능성과 주의점을 함께 설명해 주세요.",
      "올해 중요한 선택을 앞두고 있습니다. 사주 흐름을 참고하되 현실적으로 확인해야 할 조건도 함께 정리해 주세요.",
    ],
  },
  {
    title: "연애운 사주 질문",
    description:
      "연애운은 상대 정보보다 현재 관계 상태와 가장 궁금한 장면을 구체적으로 적을수록 답변이 선명합니다.",
    prompts: [
      "현재 썸을 타는 중입니다. 연애운 흐름, 상대와 대화할 때 조심할 점, 내가 먼저 할 수 있는 행동을 알려주세요.",
      "이별 후 재회를 고민하고 있습니다. 관계 흐름, 연락을 조심해야 할 시기, 다시 대화한다면 어떤 태도가 좋을지 알려주세요.",
      "장기 연애 중 결혼을 고민하고 있습니다. 관계에서 강점과 부딪히기 쉬운 지점, 현실적으로 대화해야 할 주제를 나눠 주세요.",
    ],
  },
  {
    title: "궁합 사주 질문",
    description:
      "궁합은 두 사람의 정보와 현재 관계 맥락을 함께 적어야 단순한 좋고 나쁨보다 실용적인 답변을 받을 수 있습니다.",
    prompts: [
      "두 사람의 생년월일과 현재 관계를 바탕으로 궁합의 장점, 부딪히기 쉬운 지점, 대화할 때 조심할 점을 알려주세요.",
      "상대의 출생 시간은 모릅니다. 가능한 범위에서 관계 흐름과 서로 보완할 수 있는 부분을 중심으로 설명해 주세요.",
      "결혼을 고민하는 관계입니다. 궁합을 참고하되 생활 방식, 돈 관리, 감정 표현에서 확인해야 할 현실 조건도 함께 알려주세요.",
    ],
  },
  {
    title: "직업운과 이직운 사주 질문",
    description:
      "직업운은 운의 흐름만 묻기보다 현재 직무, 선택지, 준비 기간, 현실 제약을 같이 적는 편이 좋습니다.",
    prompts: [
      "이직을 고민하는 상황에서 직업운 흐름, 리스크, 준비 순서, 현실적으로 확인할 체크포인트를 나눠 주세요.",
      "현재 직무를 유지할지 다른 분야로 전환할지 고민입니다. 사주 흐름과 현실적인 준비 순서를 함께 비교해 주세요.",
      "사업을 준비하고 있습니다. 사업운의 가능성과 조심할 리스크, 지금 점검해야 할 자금과 협업 조건을 알려주세요.",
    ],
  },
  {
    title: "재물운 사주 질문",
    description:
      "재물운 질문은 막연한 수입 예측보다 돈을 모으는 습관, 지출 리스크, 준비해야 할 선택지를 묻는 편이 안전합니다.",
    prompts: [
      "올해 돈을 모으거나 지출을 줄이고 싶은 상황에서 재물운 흐름, 조심할 소비 패턴, 현실적인 관리 방법을 나눠 주세요.",
      "투자나 큰 지출을 고민 중입니다. 사주를 참고하되 무리하지 않기 위해 확인해야 할 조건과 피해야 할 판단을 알려주세요.",
      "수입을 늘리고 싶은 상황입니다. 재물운 흐름과 함께 지금 강화하면 좋은 일 습관이나 협상 포인트를 정리해 주세요.",
    ],
  },
  {
    title: "출생 시간을 모를 때 쓰는 질문",
    description:
      "출생 시간을 모를 때는 모른다고 명시하고, 확정적인 풀이보다 가능한 흐름과 현실 조언을 요청하는 편이 좋습니다.",
    prompts: [
      "출생 시간은 모릅니다. 생년월일과 현재 고민을 바탕으로 가능한 흐름과 주의점을 중심으로 설명해 주세요.",
      "시간 정보가 없어서 사주 해석이 달라질 수 있다는 점을 전제로, 단정하지 말고 여러 가능성을 나눠 알려주세요.",
      "정확한 사주 풀이보다 현재 고민을 정리하는 참고 자료로 보고 싶습니다. 현실적으로 확인할 행동과 선택지를 함께 알려주세요.",
    ],
  },
];

const QUALITY_CHECKS = [
  {
    title: "정보를 먼저 적기",
    description:
      "생년월일, 출생 시간, 양력/음력, 출생지를 알고 있는 만큼 적어야 질문의 전제가 분명합니다.",
  },
  {
    title: "주제를 하나로 좁히기",
    description:
      "연애운, 궁합, 직업운, 재물운을 한 번에 묻기보다 가장 중요한 질문 하나부터 시작합니다.",
  },
  {
    title: "답변 형식을 요청하기",
    description:
      "전체 흐름, 조심할 점, 지금 할 수 있는 행동처럼 원하는 답변 구조를 같이 적으면 더 실용적입니다.",
  },
];

const FAQ_ITEMS = [
  {
    question: "AI 사주 질문 리스트는 그대로 복사해 써도 되나요?",
    answer:
      "그대로 복사해도 되지만 생년월일, 출생 시간, 현재 고민처럼 본인 상황을 넣어 바꾸는 편이 좋습니다. 질문이 구체적일수록 답변도 더 실용적으로 정리됩니다.",
  },
  {
    question: "ChatGPT, Gemini, Claude에 같은 질문을 써도 되나요?",
    answer:
      "가능합니다. 다만 각 AI의 답변 방식이 다르므로 같은 질문을 쓰더라도 답변을 참고용으로 비교하고, 중요한 결정은 현실 조건과 함께 판단해야 합니다.",
  },
  {
    question: "사주 질문은 몇 개까지 한 번에 넣는 것이 좋나요?",
    answer:
      "처음에는 하나의 주제와 두세 개의 세부 요청으로 좁히는 편이 좋습니다. 질문이 너무 많으면 답변이 넓어지고 핵심 조언이 흐려질 수 있습니다.",
  },
  {
    question: "출생 시간을 모르면 AI 사주 질문을 하면 안 되나요?",
    answer:
      "질문할 수 있습니다. 다만 출생 시간을 모른다고 적고, 확정적인 풀이보다 가능한 흐름과 주의점 중심으로 설명해 달라고 요청하는 것이 안전합니다.",
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

export default function AiSajuQuestionListGuidePage() {
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
                QUESTION LIST
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-[12em] text-[clamp(2.2rem,1.75rem+2.1vw,4.1rem)] font-semibold tracking-[-0.035em] text-foreground [text-wrap:balance] [word-break:keep-all]">
                AI 사주 질문 리스트를 상황별로 골라 쓰세요
              </h1>
              <p className="type-body max-w-[42rem] text-[color:color-mix(in_oklch,var(--foreground)_72%,var(--muted-foreground)_28%)] sm:text-[1.0625rem]">
                AI 사주 질문 리스트를 찾는다면 먼저 궁금한 주제를 하나로
                좁히는 것이 좋습니다. 아래 예시는 ChatGPT, Gemini, Claude에
                바로 붙여 넣기 좋도록 기본 사주, 연애운, 궁합, 직업운,
                재물운, 출생 시간 미상 상황으로 나눠 정리했습니다.
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
                <Link href={CHATGPT_SAJU_HOW_TO_GUIDE.path}>
                  챗지피티로 사주 보는 법
                </Link>
              </Button>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border/75 bg-[color-mix(in_oklch,var(--card)_94%,var(--background)_6%)] p-5 shadow-[0_18px_45px_color-mix(in_oklch,var(--foreground)_4%,transparent)]">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <ClipboardList className="size-4" aria-hidden />
              <p className="type-caption font-semibold tracking-[0.08em]">
                질문을 고르는 기준
              </p>
            </div>
            <ul className="space-y-2.5">
              {QUALITY_CHECKS.map((item) => (
                <li key={item.title} className="flex gap-2.5 type-body-sm">
                  <ListChecks
                    className="mt-1 size-4 shrink-0 text-[color:color-mix(in_oklch,var(--primary)_72%,var(--accent)_28%)]"
                    aria-hidden
                  />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </aside>
        </header>

        <section className="grid gap-4">
          {QUESTION_GROUPS.map((group, index) => (
            <section
              key={group.title}
              className="rounded-[1.75rem] border border-border/75 bg-[color-mix(in_oklch,var(--background)_76%,var(--card)_24%)] p-5 sm:p-7"
            >
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
                    LIST {index + 1}
                  </p>
                  <h2 className="mt-2 type-title-md font-semibold text-foreground">
                    {group.title}
                  </h2>
                  <p className="mt-2 type-body-sm text-muted-foreground">
                    {group.description}
                  </p>
                </div>
                <Sparkles
                  className="hidden size-5 text-[color:color-mix(in_oklch,var(--primary)_62%,var(--accent)_38%)] sm:block"
                  aria-hidden
                />
              </div>

              <ol className="grid gap-3">
                {group.prompts.map((prompt, promptIndex) => (
                  <li
                    key={prompt}
                    className="rounded-[1.25rem] border border-border/70 bg-[color-mix(in_oklch,var(--card)_92%,var(--background)_8%)] p-4"
                  >
                    <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
                      질문 {promptIndex + 1}
                    </p>
                    <p className="mt-2 type-body-sm text-foreground">
                      {prompt}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-[minmax(0,1fr)_20rem] md:items-start">
          <div className="space-y-4">
            <h2 className="type-title-md font-semibold text-foreground">
              질문 리스트를 그대로 쓰기보다 내 상황을 넣어 바꾸세요
            </h2>
            <div className="space-y-3 type-body text-muted-foreground">
              <p>
                AI 사주 질문은 예시 문장을 그대로 복사하는 것보다 현재 고민과
                선택지를 넣어 바꿀 때 더 유용합니다. “연애운 알려줘”보다
                “최근 연락이 줄어든 상황에서 먼저 대화해도 괜찮을지 알고
                싶습니다”처럼 장면을 적어 주세요.
              </p>
              <p>
                사주와 AI 답변은 참고 자료입니다. 중요한 선택은 실제 조건,
                건강, 돈, 관계 상황, 전문가 조언과 함께 검토하는 편이
                안전합니다.
              </p>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-primary/16 bg-[color-mix(in_oklch,var(--primary)_5%,var(--background)_95%)] p-5">
            <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
              자동으로 정리하기
            </p>
            <p className="mt-2 type-body-sm text-muted-foreground">
              생년월일과 고민을 입력하면 위 질문 구조에 맞춰 AI에 붙여 넣을
              사주 질문문을 바로 만들 수 있습니다.
            </p>
            <Button asChild className="mt-4 w-full" data-icon="inline-end">
              <Link href={FORM_STEP_PATHS.mode}>
                질문문 생성 시작
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
              AI 사주 질문 리스트를 쓸 때 자주 묻는 질문
            </h2>
            <p className="type-body text-muted-foreground">
              질문 리스트는 시작점입니다. 내 정보와 고민을 더할수록 답변도
              더 구체적으로 정리됩니다.
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
            href={CHATGPT_SAJU_HOW_TO_GUIDE.path}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            챗지피티로 사주 보는 법
          </Link>
        </footer>
      </article>
    </main>
  );
}
