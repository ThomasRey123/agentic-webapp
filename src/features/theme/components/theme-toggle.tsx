"use client";

import { useEffect, useSyncExternalStore } from "react";
import styles from "./theme-toggle.module.css";

type Theme = "light" | "dark";
const eventName = "theme-change";

function currentTheme(): Theme {
  try {
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Browser storage can be unavailable; the theme still works for this page.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(callback: () => void) {
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  window.addEventListener(eventName, callback);
  window.addEventListener("storage", callback);
  media?.addEventListener("change", callback);
  return () => {
    window.removeEventListener(eventName, callback);
    window.removeEventListener("storage", callback);
    media?.removeEventListener("change", callback);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => null);

  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggle() {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // Keep the page usable when storage is blocked.
    }
    window.dispatchEvent(new Event(eventName));
  }

  return (
    <button className={styles.toggle} type="button" onClick={toggle} aria-label="Theme wechseln">
      {theme === "dark" ? "☀ Helles Design" : "☾ Dunkles Design"}
    </button>
  );
}
