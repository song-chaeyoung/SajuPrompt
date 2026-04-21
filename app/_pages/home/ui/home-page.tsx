import { SajuQuestionPlanner } from "@/widgets/saju-question-planner/ui/saju-question-planner";

export function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 md:px-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-zinc-500">AI 사주 질문 설계기</p>
        <h1 className="text-2xl font-semibold text-zinc-900 md:text-3xl">
          사주 질문 입력 초안
        </h1>
        <p className="text-sm text-zinc-600">
          분석 모드, 사주 정보, 질문 의도와 스타일을 전역 스토어에서 관리합니다.
        </p>
      </header>
      <SajuQuestionPlanner />
    </main>
  );
}
