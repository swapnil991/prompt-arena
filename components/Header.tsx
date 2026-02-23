"use client";

import { Swords } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header
      className="border-b"
      style={{
        background: "var(--bg-header)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7]">
          <Swords className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
              Prompt Arena
            </span>
          </h1>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Compare AI models side-by-side — powered by OpenRouter
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 text-xs transition hover:opacity-80"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            Get API Key
          </a>
          <a
            href="https://github.com/swapnil991/prompt-arena"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 text-xs transition hover:opacity-80"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
