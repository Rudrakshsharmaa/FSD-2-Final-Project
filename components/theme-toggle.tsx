"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "campuspulse-theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = window.localStorage.getItem(THEME_KEY) === "dark";
    document.documentElement.classList.toggle("dark", dark);
    const frame = window.requestAnimationFrame(() => setIsDark(dark));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggle() {
    const dark = !isDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="rounded-full border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
