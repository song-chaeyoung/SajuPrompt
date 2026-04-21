import { SajuQuestionPlanner } from "@/widgets/saju-question-planner/ui/saju-question-planner";

export function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 md:px-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-zinc-500">
          AI SAJU QUESTION DESIGNER
        </p>
        <h1 className="text-2xl font-semibold text-zinc-900 md:text-3xl">
          Saju Prompt Intake Draft
        </h1>
        <p className="text-sm text-zinc-600">
          Analysis mode, birth data, intent, and style are managed in a global
          store.
        </p>
      </header>
      <SajuQuestionPlanner />
    </main>
  );
}
