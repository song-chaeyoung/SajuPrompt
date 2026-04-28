import { Gowun_Batang } from "next/font/google";
import Link from "next/link";
import { BookOpenText } from "lucide-react";

import { FORM_STEP_PATHS } from "@/shared/config/form-steps";
import { GUIDE_INDEX_PATH } from "@/shared/config/guides";
import { Button } from "@/shared/ui/button";
import { HeroOrbitOrnament } from "@/shared/ui/hero-orbit-ornament";
import {
  FLOW_STEPS,
  HERO_BADGES,
} from "@/widgets/saju-question-intro/config/intro-content";

const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

const PRIVACY_NOTE =
  "입력하신 정보는 질문문 생성에만 사용되며, 저장되거나 다른 용도로 사용되지 않습니다";
const PRIVACY_PATH = "/privacy";

function PrivacyNoteText() {
  const breakIndex = PRIVACY_NOTE.indexOf(",");

  if (breakIndex === -1) {
    return PRIVACY_NOTE;
  }

  const leadingText = PRIVACY_NOTE.slice(0, breakIndex + 1);
  const trailingText = PRIVACY_NOTE.slice(breakIndex + 1).trimStart();

  return (
    <>
      {leadingText}
      <br className="sm:hidden" />
      <span className="hidden sm:inline"> </span>
      {trailingText}
    </>
  );
}

export function SajuQuestionIntro() {
  return (
    <>
      <section className="pb-[calc(11rem+env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top)+1.25rem)] sm:pb-12 sm:pt-[calc(env(safe-area-inset-top)+5.25rem)]">
        <div className="relative mx-auto w-full max-w-4xl">
          <div className="relative overflow-hidden rounded-[2.25rem] border border-border/70 bg-[color-mix(in_oklch,var(--card)_96%,var(--background)_4%)] px-5 py-5 shadow-[0_26px_70px_color-mix(in_oklch,var(--primary)_8%,transparent)] dark:border-border/90 sm:px-8 sm:py-7 md:px-10 md:py-8">
            <div
              aria-hidden
              className="pointer-events-none absolute right-[-4.5rem] top-[-2.5rem] h-52 w-52 rounded-full bg-[var(--hero-halo)] blur-[88px] sm:right-[-3rem] sm:top-[-3rem] sm:h-72 sm:w-72"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-[-6.5rem] left-[-3.5rem] h-56 w-56 rounded-full bg-[color-mix(in_oklch,var(--primary)_12%,transparent)] blur-[110px] sm:h-72 sm:w-72"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute right-[-2rem] top-10 h-60 w-60 sm:right-[-1rem] sm:top-4 sm:h-80 sm:w-80"
            >
              <HeroOrbitOrnament className="hero-ornament-reveal" />
            </div>

            <span
              aria-hidden
              className="pointer-events-none absolute left-[12%] top-[18%] size-1.5 rounded-full bg-[var(--hero-dust)]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute right-[22%] top-[24%] size-1 rounded-full bg-[var(--hero-dust)]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-[44%] top-[12%] size-1 rounded-full bg-[var(--hero-dust)]"
            />

            <div className="relative flex flex-col gap-6">
              <div className="max-w-[40rem] space-y-3.5">
                <div
                  className="hero-enter inline-flex items-center gap-3"
                  style={{ animationDelay: "40ms" }}
                >
                  <span className="h-px w-7 bg-primary/35" />
                  <span className="type-caption font-semibold tracking-[0.18em] text-primary/80">
                    AI SAJU QUESTION DESIGNER
                  </span>
                </div>

                <div className="space-y-3.5">
                  <h1
                    className={`${gowunBatang.className} hero-enter max-w-[11em] text-[clamp(2.45rem,2.05rem+2vw,4.4rem)] font-bold leading-[1.18] tracking-[-0.02em] text-foreground [text-wrap:balance] [word-break:keep-all]`}
                    style={{ animationDelay: "120ms" }}
                  >
                    사주를 더 잘 보고, AI에게 바로 물을 질문을 만듭니다
                  </h1>

                  <p
                    className="hero-enter type-body max-w-[33rem] text-[color:color-mix(in_oklch,var(--foreground)_72%,var(--muted-foreground)_28%)] sm:text-[1.0625rem]"
                    style={{ animationDelay: "200ms" }}
                  >
                    생년월일과 지금의 고민을 정리하면, ChatGPT, Gemini,
                    Claude에 붙여 넣을 AI 사주 질문 프롬프트로 차분하게
                    다듬어 드립니다.
                  </p>
                  <p
                    className="hero-enter type-body-sm max-w-[33rem] text-muted-foreground"
                    style={{ animationDelay: "240ms" }}
                  >
                    사주 풀이를 대신하지 않고, AI에게 더 정확히 물어볼 질문을
                    준비하는 도우미입니다.
                  </p>
                </div>
              </div>

              <ul className="grid gap-3 sm:grid-cols-3">
                {HERO_BADGES.map((badge, index) => (
                  <li
                    key={badge.title}
                    className="hero-enter rounded-[1.35rem] border border-border/70 bg-[color-mix(in_oklch,var(--background)_65%,var(--card)_35%)] px-4 py-4 shadow-[0_14px_32px_color-mix(in_oklch,var(--foreground)_4%,transparent)] backdrop-blur-[2px] dark:border-border/85 dark:bg-[color-mix(in_oklch,var(--card)_88%,var(--background)_12%)]"
                    style={{ animationDelay: `${280 + index * 70}ms` }}
                  >
                    <p className="type-caption font-semibold tracking-[0.08em] text-primary/85">
                      {badge.title}
                    </p>
                    <p className="mt-2 type-body-sm text-muted-foreground">
                      {badge.description}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="hidden items-center gap-4 sm:flex">
                <div className="flex flex-col gap-2 sm:min-w-[15rem]">
                  <Button asChild size="lg">
                    <Link href={FORM_STEP_PATHS.mode} scroll={true}>
                      AI 사주 질문 만들기
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    data-icon="inline-start"
                  >
                    <Link href={GUIDE_INDEX_PATH}>
                      <BookOpenText className="size-3.5" aria-hidden />
                      사주 질문 가이드 보기
                    </Link>
                  </Button>
                </div>

                <div className="max-w-[25rem] space-y-1.5">
                  <p className="type-body-sm text-muted-foreground">
                    질문문을 생성한 뒤 복사해서 ChatGPT, Gemini, Claude에 바로
                    붙여 넣을 수 있습니다.
                  </p>
                  <p className="type-caption text-[color:color-mix(in_oklch,var(--foreground)_58%,var(--muted-foreground)_42%)]">
                    <PrivacyNoteText />
                    {" "}
                    <Link
                      href={PRIVACY_PATH}
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      자세히 보기
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[1.9rem] border border-border/70 bg-[color-mix(in_oklch,var(--card)_94%,var(--background)_6%)] px-4 py-4 shadow-[0_22px_50px_color-mix(in_oklch,var(--foreground)_4%,transparent)] dark:border-border/90 dark:bg-[color-mix(in_oklch,var(--card)_96%,var(--background)_4%)] sm:px-6 sm:py-5">
            <div className="mb-3 flex items-center gap-3 sm:mb-4">
              <span className="h-px flex-1 bg-[color-mix(in_oklch,var(--primary)_18%,transparent)]" />
              <span className="type-caption font-semibold tracking-[0.08em] text-primary/75">
                HOW IT FLOWS
              </span>
              <span className="h-px flex-1 bg-[color-mix(in_oklch,var(--primary)_18%,transparent)]" />
            </div>

            <ol className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              {FLOW_STEPS.map((item) => (
                <li
                  key={item.step}
                  className="rounded-[1.35rem] border border-border/65 bg-[color-mix(in_oklch,var(--background)_78%,var(--card)_22%)] px-4 py-4 dark:border-border/85 dark:bg-[color-mix(in_oklch,var(--background)_24%,var(--card)_76%)]"
                >
                  <p className="type-caption font-semibold tracking-[0.08em] text-primary/80">
                    {item.step}
                  </p>
                  <p className="mt-2 type-body font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1.5 type-body-sm text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:hidden">
        <div className="mx-auto w-full max-w-4xl rounded-[1.5rem] border border-border/70 bg-[color-mix(in_oklch,var(--card)_94%,var(--background)_6%)] p-3 shadow-[0_22px_50px_color-mix(in_oklch,var(--foreground)_10%,transparent)] backdrop-blur-[10px]">
          <p className="mb-2 px-2 text-center type-caption text-[color:color-mix(in_oklch,var(--foreground)_58%,var(--muted-foreground)_42%)] ">
            <PrivacyNoteText />
            {" "}
            <Link
              href={PRIVACY_PATH}
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              자세히 보기
            </Link>
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild size="lg" className="w-full">
              <Link href={FORM_STEP_PATHS.mode} scroll={true}>
                AI 사주 질문 만들기
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="ghost"
              data-icon="inline-start"
              className="w-full"
            >
              <Link href={GUIDE_INDEX_PATH}>
                <BookOpenText className="size-3.5" aria-hidden />
                사주 질문 가이드 보기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
