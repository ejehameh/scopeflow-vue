import { ref, watchEffect } from "vue";

const STORAGE_KEY = "scopeflow-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const theme = ref(getInitialTheme());

watchEffect(() => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme.value === "dark");
  localStorage.setItem(STORAGE_KEY, theme.value);
});

export function useTheme() {
  function toggle() {
    theme.value = theme.value === "light" ? "dark" : "light";
  }
  return { theme, toggle };
}
