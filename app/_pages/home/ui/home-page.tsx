import { SajuQuestionPlanner } from "@/widgets/saju-question-planner/ui/saju-question-planner";

export function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 md:px-8 md:py-8">
      <SajuQuestionPlanner />
    </main>
  );
}
