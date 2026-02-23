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
      className="flex flex-col overflow-hidden rounded-xl transition-all animate-fade-in"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${status === "error" ? "var(--accent-red)" : "var(--border)"}`,
        boxShadow: "var(--shadow)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ background: color }}
          />
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {name}
          </span>
          {model?.free && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
              style={{
                background: "var(--free-bg)",
                color: "var(--free-text)",
              }}
            >
              FREE
            </span>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Body */}
      <div
        className="flex-1 overflow-y-auto p-4 text-[13.5px] leading-relaxed"
        style={{
          maxHeight: 500,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color:
            status === "idle"
              ? "var(--text-muted)"
              : status === "error"
              ? "var(--accent-red)"
              : "var(--text-body)",
          fontStyle: status === "idle" ? "italic" : "normal",
          ...(status === "loading" || status === "idle"
            ? {
                display: "flex",
                minHeight: 140,
                alignItems: "center",
                justifyContent: "center",
              }
            : {}),
        }}
      >
        {status === "idle" && "Awaiting prompt..."}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-2">
            <div
              className="h-5 w-5 rounded-full border-2 border-t-transparent animate-spin-fast"
              style={{ borderColor: "var(--accent-blue)", borderTopColor: "transparent" }}
            />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Thinking...
            </span>
          </div>
        )}
        {status === "done" && response?.text}
        {status === "error" && (response?.error || "Unknown error")}
      </div>

      {/* Footer */}
      {(status === "done" || status === "error") && (
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--text-muted)" }}>
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
              className="flex items-center gap-1 rounded px-2 py-0.5 text-[11px] transition hover:opacity-80"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
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
  const styles: Record<CardStatus, { bg: string; color: string; label: string }> = {
    idle: { bg: "var(--badge-waiting-bg)", color: "var(--badge-waiting-text)", label: "Waiting" },
    loading: { bg: "var(--badge-loading-bg)", color: "var(--badge-loading-text)", label: "Thinking..." },
    done: { bg: "var(--badge-done-bg)", color: "var(--badge-done-text)", label: "Done" },
    error: { bg: "var(--badge-error-bg)", color: "var(--badge-error-text)", label: "Error" },
  };
  const s = styles[status];
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
        status === "loading" ? "animate-pulse-glow" : ""
      }`}
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}
