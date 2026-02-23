"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.add("theme-transition");
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 400);
  };

  if (!mounted) return <div className="h-9 w-9" />;

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:scale-105 active:scale-95"
      style={{
        background: dark ? "rgba(129,140,248,0.12)" : "rgba(99,102,241,0.08)",
        border: `1px solid var(--border)`,
      }}
    >
      {dark ? (
        <Sun className="h-4 w-4 transition-transform group-hover:rotate-45" style={{ color: "var(--accent-blue)" }} />
      ) : (
        <Moon className="h-4 w-4 transition-transform group-hover:-rotate-12" style={{ color: "var(--accent-purple)" }} />
      )}
    </button>
  );
}
