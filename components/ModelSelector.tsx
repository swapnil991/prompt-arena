"use client";

import { MODELS, type Model } from "@/lib/models";
import { Check } from "lucide-react";

interface Props {
  selected: Set<string>;
  onToggle: (id: string) => void;
  onPreset: (preset: string) => void;
}

const PRESETS = [
  { key: "free", label: "Free Only", cssColor: "var(--accent-green)" },
  { key: "budget", label: "Budget Mix", cssColor: "var(--accent-blue)" },
  { key: "flagship", label: "Flagships", cssColor: "var(--accent-pink)" },
  { key: "all", label: "All", cssColor: "var(--text-secondary)" },
];

function ModelChip({
  model,
  isSelected,
  onToggle,
}: {
  model: Model;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all"
      style={{
        border: `1px solid ${isSelected ? "var(--chip-selected-border)" : "var(--border)"}`,
        background: isSelected ? "var(--chip-selected-bg)" : "var(--bg-card)",
      }}
    >
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded border transition"
        style={{
          borderColor: isSelected ? "var(--checkbox-active)" : "var(--text-muted)",
          background: isSelected ? "var(--checkbox-active)" : "transparent",
        }}
      >
        {isSelected && <Check className="h-3 w-3 text-white" />}
      </div>
      <div
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: model.color }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
          {model.name}
        </div>
        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {model.provider}
        </div>
      </div>
      <div className="shrink-0">
        {model.free ? (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ background: "var(--free-bg)", color: "var(--free-text)" }}
          >
            FREE
          </span>
        ) : (
          <span className="text-[11px]" style={{ color: "var(--accent-green)" }}>
            {model.price}
          </span>
        )}
      </div>
    </button>
  );
}

export default function ModelSelector({ selected, onToggle, onPreset }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-secondary)" }}
        >
          Presets:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => onPreset(p.key)}
            className="rounded-md px-3 py-1 text-xs font-medium transition hover:opacity-80"
            style={{
              border: "1px solid var(--border)",
              color: p.cssColor,
            }}
          >
            {p.label}
          </button>
        ))}
        <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
          {selected.size} model{selected.size !== 1 ? "s" : ""} selected
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {MODELS.map((m) => (
          <ModelChip
            key={m.id}
            model={m}
            isSelected={selected.has(m.id)}
            onToggle={() => onToggle(m.id)}
          />
        ))}
      </div>
    </div>
  );
}
