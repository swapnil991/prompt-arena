"use client";

import { useState } from "react";
import { Eye, EyeOff, Key } from "lucide-react";

interface Props {
  apiKey: string;
  onChange: (key: string) => void;
}

export default function ApiKeyInput({ apiKey, onChange }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#334155] bg-[#1e293b] px-4 py-3 flex-wrap">
      <Key className="h-4 w-4 text-[#64748b] shrink-0" />
      <label className="text-sm font-semibold text-[#94a3b8] shrink-0">
        OpenRouter API Key
      </label>
      <div className="relative flex-1 min-w-[250px]">
        <input
          type={visible ? "text" : "password"}
          value={apiKey}
          onChange={(e) => onChange(e.target.value)}
          placeholder="sk-or-v1-..."
          className="w-full rounded-md border border-[#334155] bg-[#0f172a] px-3 py-2 pr-10 font-mono text-sm text-[#e1e4e8] outline-none transition focus:border-[#60a5fa]"
        />
        <button
          onClick={() => setVisible(!visible)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#e1e4e8] transition"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <a
        href="https://openrouter.ai/keys"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-[#60a5fa] hover:underline shrink-0"
      >
        Get free key →
      </a>
    </div>
  );
}
