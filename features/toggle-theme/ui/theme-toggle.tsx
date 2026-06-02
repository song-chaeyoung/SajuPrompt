import { MoonIcon, SunIcon } from "lucide-react";

import {
  getThemeToggleScript,
  THEME_TOGGLE_ID,
} from "@/features/toggle-theme/config/theme";

export function ThemeToggle() {
  const themeToggleScript = getThemeToggleScript();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex w-full max-w-5xl justify-end px-4 pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-6 md:px-8 md:pt-[calc(env(safe-area-inset-top)+1.25rem)]">
        <button
          id={THEME_TOGGLE_ID}
          type="button"
          aria-label="다크 모드로 전환"
          aria-pressed="false"
          title="다크 모드로 전환"
          className="pointer-events-auto inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-[color-mix(in_oklch,var(--background)_80%,transparent)] text-foreground shadow-[0_16px_32px_color-mix(in_oklch,var(--foreground)_10%,transparent)] backdrop-blur-md transition-colors outline-none select-none hover:bg-secondary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px supports-[backdrop-filter]:bg-[color-mix(in_oklch,var(--background)_68%,transparent)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          <MoonIcon className="dark:hidden" aria-hidden />
          <SunIcon className="hidden dark:block" aria-hidden />
          <span className="sr-only">테마 전환</span>
        </button>
      </div>
      <script dangerouslySetInnerHTML={{ __html: themeToggleScript }} />
    </div>
  );
}
