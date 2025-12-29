// for light/dark mode
export type Theme = "light" | "dark";

const THEME_KEY = "bs-theme";

export const getStoredTheme = (): Theme => {
  return (localStorage.getItem(THEME_KEY) as Theme) || "light";
};

export const setTheme = (theme: Theme) => {
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
};