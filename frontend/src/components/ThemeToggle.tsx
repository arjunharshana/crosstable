import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    return savedTheme === "dark" || (!savedTheme && prefersDark);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-primary transition-colors flex items-center justify-center"
      aria-label="Toggle Dark Mode"
      title="Toggle Dark Mode"
    >
      <span className="material-symbols-outlined text-xl">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
