"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import {
  THEME_DARK_CLASS,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from "@/features/toggle-theme/config/theme";
import { Button } from "@/shared/ui/button";

const THEME_CHANGE_EVENT = "saju-theme-change";

function getAppliedTheme(): ThemePreference {
  return document.documentElement.classList.contains(THEME_DARK_CLASS)
    ? "dark"
    : "light";
}

function applyTheme(theme: ThemePreference) {
  document.documentElement.classList.toggle(
    THEME_DARK_CLASS,
    theme === "dark",
  );
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function subscribeToThemeChange(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToThemeChange,
    getAppliedTheme,
    () => "light",
  );

  const handleToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage failures and keep the in-memory theme.
    }
  };

  const buttonTitle = theme === "dark"
    ? "라이트 모드로 전환"
    : "다크 모드로 전환";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex w-full max-w-5xl justify-end px-4 pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-6 md:px-8 md:pt-[calc(env(safe-area-inset-top)+1.25rem)]">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={buttonTitle}
          aria-pressed={theme === "dark"}
          title={buttonTitle}
          onClick={handleToggle}
          className="pointer-events-auto rounded-full border-border/70 bg-[color-mix(in_oklch,var(--background)_80%,transparent)] text-foreground shadow-[0_16px_32px_color-mix(in_oklch,var(--foreground)_10%,transparent)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_oklch,var(--background)_68%,transparent)]"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          <span className="sr-only">{buttonTitle}</span>
        </Button>
      </div>
    </div>
  );
}
