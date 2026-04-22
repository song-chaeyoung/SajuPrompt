"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";
import { FORM_STEP_PATHS } from "@/shared/config/form-steps";

export function SajuQuestionIntro() {
  const router = useRouter();

  const handleStart = () => {
    router.push(FORM_STEP_PATHS.mode, { scroll: false });
  };

  return (
    <>
      <section className="pb-[calc(9.5rem+env(safe-area-inset-bottom))] pt-2 sm:pb-20 sm:pt-6">
        <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-border/70 bg-[color-mix(in_oklch,var(--card)_94%,var(--background)_6%)] px-5 py-7 shadow-[0_24px_60px_color-mix(in_oklch,var(--primary)_8%,transparent)] sm:px-8 sm:py-9">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-auto right-[-4rem] top-[-5rem] h-44 w-44 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[-4rem] left-[-3rem] h-40 w-40 rounded-full bg-accent/20 blur-3xl"
          />

          <div className="relative space-y-8">
            <div className="space-y-4">
              <p className="type-caption font-semibold tracking-[0.08em] text-primary/85">
                AI 사주 질문 설계기
              </p>
              <div className="space-y-3.5">
                <h1 className="type-title-lg max-w-[16ch] font-semibold text-foreground sm:max-w-[15ch]">
                  시작하면 단계별 입력 화면만 보이도록 구성했습니다.
                </h1>
                <p className="type-body max-w-[34rem] text-muted-foreground">
                  처음에는 설명만 간단히 확인하고, 시작 후에는 현재 입력해야 할
                  내용에만 집중해서 볼 수 있도록 흐름을 나눴습니다.
                </p>
              </div>
            </div>

            <ol className="grid gap-4 border-t border-border/70 pt-4 sm:grid-cols-3 sm:gap-5 sm:pt-6">
              <li className="space-y-2 border-b border-border/60 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
                <p className="type-caption font-semibold tracking-[0.06em] text-primary/85">
                  STEP 1
                </p>
                <p className="type-body font-semibold text-foreground">
                  분석 모드 선택
                </p>
                <p className="type-body-sm text-muted-foreground">
                  내 사주 분석인지, 궁합 분석인지 먼저 고릅니다.
                </p>
              </li>
              <li className="space-y-2 border-b border-border/60 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
                <p className="type-caption font-semibold tracking-[0.06em] text-primary/85">
                  STEP 2
                </p>
                <p className="type-body font-semibold text-foreground">
                  사주 정보 입력
                </p>
                <p className="type-body-sm text-muted-foreground">
                  필요한 기본 정보와 질문 목적을 한 번에 정리합니다.
                </p>
              </li>
              <li className="space-y-2">
                <p className="type-caption font-semibold tracking-[0.06em] text-primary/85">
                  STEP 3
                </p>
                <p className="type-body font-semibold text-foreground">
                  질문문 확인
                </p>
                <p className="type-body-sm text-muted-foreground">
                  완성된 질문문을 바로 복사해서 AI에 붙여넣을 수 있습니다.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:px-6 md:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <Button
            type="button"
            size="lg"
            onClick={handleStart}
            className="w-full rounded-[1.125rem] shadow-[0_16px_32px_color-mix(in_oklch,var(--primary)_20%,transparent)]"
          >
            시작하기
          </Button>
        </div>
      </div>
    </>
  );
}
