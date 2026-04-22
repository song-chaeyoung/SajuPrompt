import {
  THEME_CHANGE_EVENT,
  THEME_DARK_CLASS,
  type ThemePreference,
} from "@/features/toggle-theme/config/theme";

export function getAppliedTheme(): ThemePreference {
  return document.documentElement.classList.contains(THEME_DARK_CLASS)
    ? "dark"
    : "light";
}

export function applyTheme(theme: ThemePreference) {
  document.documentElement.classList.toggle(
    THEME_DARK_CLASS,
    theme === "dark",
  );
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function subscribeToThemeChange(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}
