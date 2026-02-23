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
  const accentColor = isJudge ? "var(--toggle-judge-text)" : "var(--toggle-combine-text)";
  const borderColor = isJudge ? "var(--result-border-judge)" : "var(--result-border-combine)";
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
      className="animate-fade-in rounded-xl p-5"
      style={{
        background: "var(--bg-result)",
        border: `1px solid ${borderColor}`,
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: accentColor }} />
        <h3 className="text-sm font-semibold" style={{ color: accentColor }}>
          {title}
        </h3>
        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          ({modelName})
        </span>
        {verdict && (
          <button
            onClick={handleCopy}
            className="ml-auto flex items-center gap-1 rounded px-2 py-0.5 text-[11px] transition hover:opacity-80"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
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
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
          <div
            className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin-fast"
            style={{ borderColor: accentColor, borderTopColor: "transparent" }}
          />
          {loadingText}
        </div>
      ) : (
        <p
          className="text-[13.5px] leading-relaxed whitespace-pre-wrap"
          style={{ color: "var(--text-body)" }}
        >
          {verdict}
        </p>
      )}
    </div>
  );
}
