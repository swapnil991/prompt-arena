"use client";

import { getModel } from "@/lib/models";
import type { ChatResponse } from "@/lib/openrouter";
import { Copy, CheckCheck, Clock, Zap } from "lucide-react";
import { useState } from "react";

export type CardStatus = "idle" | "loading" | "done" | "error";

interface Props {
  modelId: string;
  status: CardStatus;
  response: ChatResponse | null;
}

export default function ResponseCard({ modelId, status, response }: Props) {
  const [copied, setCopied] = useState(false);
  const model = getModel(modelId);
  const name = model?.name || modelId.split("/").pop() || modelId;
  const color = model?.color || "#64748b";

  const handleCopy = () => {
    if (response?.text) {
      navigator.clipboard.writeText(response.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border transition-all animate-fade-in ${
        status === "done"
          ? "border-[#2d3348] bg-[#1a1d27]"
          : status === "error"
          ? "border-[#3b1320] bg-[#1a1d27]"
          : "border-[#2d3348] bg-[#1a1d27]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2d3348] px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ background: color }}
          />
          <span className="text-sm font-semibold text-[#e1e4e8]">{name}</span>
          {model?.free && (
            <span className="rounded-full bg-[#064e3b] px-1.5 py-0.5 text-[9px] font-bold text-[#34d399]">
              FREE
            </span>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Body */}
      <div
        className={`flex-1 overflow-y-auto p-4 text-[13.5px] leading-relaxed ${
          status === "idle"
            ? "flex min-h-[140px] items-center justify-center text-[#4a5568] italic"
            : status === "loading"
            ? "flex min-h-[140px] items-center justify-center"
            : status === "error"
            ? "text-[#f87171]"
            : "text-[#c9d1d9]"
        }`}
        style={{ maxHeight: 500, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {status === "idle" && "Awaiting prompt..."}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 rounded-full border-2 border-[#60a5fa] border-t-transparent animate-spin-fast" />
            <span className="text-xs text-[#64748b]">Thinking...</span>
          </div>
        )}
        {status === "done" && response?.text}
        {status === "error" && (response?.error || "Unknown error")}
      </div>

      {/* Footer */}
      {(status === "done" || status === "error") && (
        <div className="flex items-center justify-between border-t border-[#2d3348] px-4 py-2">
          <div className="flex items-center gap-3 text-[11px] text-[#64748b]">
            {response?.tokens && (
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {response.tokens.prompt}→{response.tokens.completion} tokens
              </span>
            )}
            {response?.latencyMs && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {(response.latencyMs / 1000).toFixed(1)}s
              </span>
            )}
          </div>
          {response?.text && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded border border-[#2d3348] px-2 py-0.5 text-[11px] text-[#8b95a5] transition hover:border-[#60a5fa] hover:text-[#60a5fa]"
            >
              {copied ? (
                <>
                  <CheckCheck className="h-3 w-3" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: CardStatus }) {
  switch (status) {
    case "idle":
      return (
        <span className="rounded-full bg-[#1e293b] px-2 py-0.5 text-[11px] font-medium text-[#64748b]">
          Waiting
        </span>
      );
    case "loading":
      return (
        <span className="rounded-full bg-[#1e3a5f] px-2 py-0.5 text-[11px] font-medium text-[#60a5fa] animate-pulse-glow">
          Thinking...
        </span>
      );
    case "done":
      return (
        <span className="rounded-full bg-[#064e3b] px-2 py-0.5 text-[11px] font-medium text-[#34d399]">
          Done
        </span>
      );
    case "error":
      return (
        <span className="rounded-full bg-[#3b1320] px-2 py-0.5 text-[11px] font-medium text-[#f87171]">
          Error
        </span>
      );
  }
}
