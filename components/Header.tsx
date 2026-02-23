"use client";

import { Swords } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-[#2d3348] bg-gradient-to-r from-[#1a1b2e] to-[#16213e]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6]">
          <Swords className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#60a5fa] via-[#a78bfa] to-[#f472b6] bg-clip-text text-transparent">
              Prompt Arena
            </span>
          </h1>
          <p className="text-xs text-[#8b95a5]">
            Compare AI models side-by-side — powered by OpenRouter
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[#2d3348] px-3 py-1.5 text-xs text-[#8b95a5] transition hover:border-[#60a5fa] hover:text-[#60a5fa]"
          >
            Get API Key
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[#2d3348] px-3 py-1.5 text-xs text-[#8b95a5] transition hover:border-[#60a5fa] hover:text-[#60a5fa]"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
