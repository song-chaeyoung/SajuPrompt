export type ThemePreference = "light" | "dark";

export const THEME_STORAGE_KEY = "saju-theme";
export const THEME_DARK_CLASS = "dark";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";
export const THEME_CHANGE_EVENT = "saju-theme-change";

export function isThemePreference(
  value: string | null,
): value is ThemePreference {
  return value === "light" || value === "dark";
}

export function getThemeInitializationScript() {
  const storageKey = JSON.stringify(THEME_STORAGE_KEY);
  const darkClass = JSON.stringify(THEME_DARK_CLASS);
  const mediaQuery = JSON.stringify(THEME_MEDIA_QUERY);

  return `(function(){var root=document.documentElement;var prefersDark=typeof window.matchMedia==="function"&&window.matchMedia(${mediaQuery}).matches;try{var stored=window.localStorage.getItem(${storageKey});var theme=stored==="light"||stored==="dark"?stored:(prefersDark?"dark":"light");root.classList.toggle(${darkClass},theme==="dark");}catch(error){root.classList.toggle(${darkClass},prefersDark);}})();`;
}
