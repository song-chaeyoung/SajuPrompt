import { SajuQuestionPlanner } from "@/widgets/saju-question-planner/ui/saju-question-planner";

export function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 md:gap-10 md:px-8 md:py-10">
      <header className="space-y-4">
        <p className="type-caption font-semibold tracking-[0.02em] text-primary">
          AI 사주 질문 설계기
        </p>
        <h1 className="type-title-lg max-w-[18ch] font-semibold text-foreground">
          사주 질문 입력 초안
        </h1>
        <p className="type-body max-w-[60ch] text-muted-foreground">
          분석 모드와 사주 정보를 선택하면, 원하는 스타일의 질문문 초안을 빠르게 만들 수 있습니다.
        </p>
      </header>
      <SajuQuestionPlanner />
    </main>
  );
}
