"use client";

import { MODELS, type Model } from "@/lib/models";
import { Check } from "lucide-react";

interface Props {
  selected: Set<string>;
  onToggle: (id: string) => void;
  onPreset: (preset: string) => void;
}

const PRESETS = [
  { key: "free", label: "Free Only", color: "text-[#34d399]" },
  { key: "budget", label: "Budget Mix", color: "text-[#60a5fa]" },
  { key: "flagship", label: "Flagships", color: "text-[#f472b6]" },
  { key: "all", label: "All", color: "text-[#8b95a5]" },
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
      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
        isSelected
          ? "border-[#60a5fa] bg-[#1e293b]"
          : "border-[#2d3348] bg-[#1a1d27] hover:border-[#4a5568]"
      }`}
    >
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
          isSelected
            ? "border-[#60a5fa] bg-[#60a5fa]"
            : "border-[#4a5568] bg-transparent"
        }`}
      >
        {isSelected && <Check className="h-3 w-3 text-white" />}
      </div>
      <div
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: model.color }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[#e1e4e8] truncate">
          {model.name}
        </div>
        <div className="text-[11px] text-[#64748b]">{model.provider}</div>
      </div>
      <div className="shrink-0">
        {model.free ? (
          <span className="rounded-full bg-[#064e3b] px-2 py-0.5 text-[10px] font-bold text-[#34d399]">
            FREE
          </span>
        ) : (
          <span className="text-[11px] text-[#34d399]">{model.price}</span>
        )}
      </div>
    </button>
  );
}

export default function ModelSelector({ selected, onToggle, onPreset }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8b95a5]">
          Presets:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => onPreset(p.key)}
            className={`rounded-md border border-[#2d3348] px-3 py-1 text-xs font-medium transition hover:border-[#4a5568] ${p.color}`}
          >
            {p.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#64748b]">
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
