import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, RefreshCw, ShieldCheck } from "lucide-react";

import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import { PRIVACY_PATH } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";

const PRIVACY_POINTS = [
  {
    icon: ShieldCheck,
    title: "질문문 생성 목적",
    description:
      "입력값은 사용자가 복사해 사용할 AI 사주 질문 프롬프트를 만드는 데 사용됩니다.",
  },
  {
    icon: Database,
    title: "서비스 DB 저장 없음",
    description:
      "현재 코드 기준으로 입력값과 생성 결과를 별도 데이터베이스에 저장하는 로직은 없습니다.",
  },
  {
    icon: RefreshCw,
    title: "초기화 가능",
    description:
      "처음부터 다시 시작하면 브라우저 화면에 남은 입력값과 생성 결과가 초기화됩니다.",
  },
];

export const metadata: Metadata = {
  title: "개인정보 처리 안내",
  description:
    "사주질문지에서 생년월일, 출생 시간, 고민 맥락을 질문문 생성에 어떻게 사용하는지 안내합니다.",
  alternates: {
    canonical: PRIVACY_PATH,
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 md:px-8 md:py-12">
      <article className="mx-auto w-full max-w-4xl">
        <header className="pb-9 md:pb-12">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-7 bg-primary/35" />
            <span className="type-caption font-semibold tracking-[0.18em] text-primary/80">
              PRIVACY
            </span>
          </div>

          <div className="mt-5 max-w-[45rem] space-y-4">
            <h1 className="text-[clamp(2.2rem,1.75rem+2.1vw,4rem)] font-semibold tracking-[-0.035em] text-foreground [text-wrap:balance] [word-break:keep-all]">
              입력한 사주 정보가 어떻게 쓰이는지 안내드립니다
            </h1>
            <p className="type-body text-[color:color-mix(in_oklch,var(--foreground)_72%,var(--muted-foreground)_28%)] sm:text-[1.0625rem]">
              사주질문지는 사주풀이 결과를 저장하거나 판매하는 서비스가
              아닙니다. 생년월일, 출생 시간, 출생지, 고민 맥락은 AI에게 더
              정확히 물어볼 질문문을 만들기 위한 입력값으로 사용됩니다.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {PRIVACY_POINTS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-[1.35rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_72%,var(--card)_28%)] p-5"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-full border border-primary/16 bg-[color-mix(in_oklch,var(--primary)_6%,var(--background)_94%)] text-primary">
                <Icon className="size-4" aria-hidden />
              </div>
              <h2 className="type-title-sm font-semibold text-foreground">
                {title}
              </h2>
              <p className="mt-2 type-body-sm text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[1.75rem] border border-border/75 bg-[color-mix(in_oklch,var(--card)_94%,var(--background)_6%)] p-5 shadow-[0_22px_54px_color-mix(in_oklch,var(--foreground)_4%,transparent)] sm:p-7">
          <div className="space-y-7">
            <div className="space-y-3">
              <h2 className="type-title-md font-semibold text-foreground">
                입력되는 정보
              </h2>
              <p className="type-body text-muted-foreground">
                사용자는 이름, 성별, 생년월일, 출생 시간, 출생지, 달력 기준,
                현재 상황, 질문 목적, 추가 요청사항을 입력할 수 있습니다.
                궁합 모드에서는 상대방의 생년월일과 출생 관련 정보도 함께
                입력할 수 있습니다.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="type-title-md font-semibold text-foreground">
                서버와 외부 API에서의 사용
              </h2>
              <p className="type-body text-muted-foreground">
                입력값은 질문문 생성을 위해 서버의 `/api/saju-question`
                요청으로 전달됩니다. 서버는 사주 구조를 계산한 뒤 OpenAI
                API에 질문문 생성을 요청합니다. 현재 코드 기준으로 이 과정에서
                입력값이나 생성 결과를 별도 데이터베이스에 저장하지 않습니다.
                다만 외부 AI 제공자는 자체 정책에 따라 입력값이나 생성 결과를
                로그 또는 보관할 수 있으므로 해당 제공자의 이용약관과 개인정보
                처리방침을 확인해 주세요.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="type-title-md font-semibold text-foreground">
                브라우저에서의 보관
              </h2>
              <p className="type-body text-muted-foreground">
                입력 중인 값과 생성된 질문문은 화면 상태 관리를 위해
                브라우저 메모리에 유지됩니다. 현재 store 구현은 영구 저장용
                `localStorage` persistence를 사용하지 않으며, 처음부터 다시
                시작하면 화면 상태가 초기화됩니다.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="type-title-md font-semibold text-foreground">
                해석 결과와 책임 범위
              </h2>
              <p className="type-body text-muted-foreground">
                사주질문지는 사주풀이 자체를 확정적으로 제공하지 않습니다.
                생성된 문장은 사용자가 ChatGPT, Gemini, Claude 같은 외부 AI에
                더 명확히 질문하기 위한 참고용 프롬프트입니다.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-3 rounded-[1.35rem] border border-primary/16 bg-[color-mix(in_oklch,var(--primary)_5%,var(--background)_95%)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-body-sm text-muted-foreground">
            입력 전에 정보 사용 범위를 확인하셨다면 바로 질문문 생성을 시작할
            수 있습니다.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild data-icon="inline-end">
              <Link href={FORM_STEP_PATHS.mode}>
                질문문 만들기
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">홈으로</Link>
            </Button>
          </div>
        </footer>
      </article>
    </main>
  );
}
