export type ThemePreference = "light" | "dark";

export const THEME_STORAGE_KEY = "saju-theme";
export const THEME_DARK_CLASS = "dark";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";
export const THEME_CHANGE_EVENT = "saju-theme-change";
export const THEME_TOGGLE_ID = "saju-theme-toggle";

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

export function getThemeToggleScript() {
  const buttonId = JSON.stringify(THEME_TOGGLE_ID);
  const storageKey = JSON.stringify(THEME_STORAGE_KEY);
  const darkClass = JSON.stringify(THEME_DARK_CLASS);
  const changeEvent = JSON.stringify(THEME_CHANGE_EVENT);
  const lightLabel = JSON.stringify("라이트 모드로 전환");
  const darkLabel = JSON.stringify("다크 모드로 전환");

  return `(function(){var button=document.getElementById(${buttonId});if(!button)return;var root=document.documentElement;function current(){return root.classList.contains(${darkClass})?"dark":"light"}function sync(){var isDark=current()==="dark";var label=isDark?${lightLabel}:${darkLabel};button.setAttribute("aria-pressed",String(isDark));button.setAttribute("aria-label",label);button.title=label}button.addEventListener("click",function(){var next=current()==="dark"?"light":"dark";root.classList.toggle(${darkClass},next==="dark");try{window.localStorage.setItem(${storageKey},next)}catch(error){}window.dispatchEvent(new Event(${changeEvent}));sync()});sync();})();`;
}
