"use client";

import { useSyncExternalStore } from "react";

import type { ThemePreference } from "@/features/toggle-theme/config/theme";
import {
  getAppliedTheme,
  subscribeToThemeChange,
} from "@/features/toggle-theme/lib/theme-store";
import { Toaster } from "@/shared/ui/sonner";

export function ThemeToaster() {
  const theme = useSyncExternalStore<ThemePreference>(
    subscribeToThemeChange,
    getAppliedTheme,
    () => "light",
  );

  return <Toaster theme={theme} />;
}
