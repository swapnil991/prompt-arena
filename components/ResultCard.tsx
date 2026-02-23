"use client";

import { Scale, Blend, Copy, CheckCheck } from "lucide-react";
import { useState } from "react";

interface Props {
  mode: "judge" | "combine";
  verdict: string | null;
  loading: boolean;
  modelName: string;
}

export default function ResultCard({ mode, verdict, loading, modelName }: Props) {
  const [copied, setCopied] = useState(false);

  if (!verdict && !loading) return null;

  const isJudge = mode === "judge";
  const Icon = isJudge ? Scale : Blend;
  const title = isJudge ? "AI Judge Verdict" : "Combined Response";
  const accentColor = isJudge ? "#a78bfa" : "#34d399";
  const borderColor = isJudge ? "#4c1d95" : "#064e3b";
  const loadingText = isJudge ? "Evaluating responses..." : "Synthesizing best answer...";

  const handleCopy = () => {
    if (verdict) {
      navigator.clipboard.writeText(verdict);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="animate-fade-in rounded-xl border bg-gradient-to-r from-[#1a1b2e] to-[#1e2235] p-5"
      style={{ borderColor }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: accentColor }} />
        <h3 className="text-sm font-semibold" style={{ color: accentColor }}>
          {title}
        </h3>
        <span className="text-[11px] text-[#64748b]">({modelName})</span>
        {verdict && (
          <button
            onClick={handleCopy}
            className="ml-auto flex items-center gap-1 rounded border border-[#2d3348] px-2 py-0.5 text-[11px] text-[#8b95a5] transition hover:border-[#60a5fa] hover:text-[#60a5fa]"
          >
            {copied ? (
              <><CheckCheck className="h-3 w-3" /> Copied</>
            ) : (
              <><Copy className="h-3 w-3" /> Copy</>
            )}
          </button>
        )}
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#64748b]">
          <div
            className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin-fast"
            style={{ borderColor: accentColor, borderTopColor: "transparent" }}
          />
          {loadingText}
        </div>
      ) : (
        <p className="text-[13.5px] leading-relaxed text-[#c9d1d9] whitespace-pre-wrap">
          {verdict}
        </p>
      )}
    </div>
  );
}
