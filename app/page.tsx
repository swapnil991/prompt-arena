"use client";

import { useState, useRef, useCallback } from "react";
import Header from "@/components/Header";
import ModelSelector from "@/components/ModelSelector";
import ResponseCard, { type CardStatus } from "@/components/ResponseCard";
import JudgeCard from "@/components/JudgeCard";
import { MODELS, DEFAULT_MODELS, getDisplayName } from "@/lib/models";
import { callModel, type ChatResponse } from "@/lib/openrouter";
import { Send, ChevronDown, ChevronUp, Settings2 } from "lucide-react";

const JUDGE_MODELS = [
  { id: "mistralai/mistral-small-3.1-24b-instruct:free", label: "Mistral Small 3.1 (free)" },
  { id: "google/gemma-3-27b-it:free", label: "Gemma 3 27B (free)" },
  { id: "none", label: "No judge" },
];

export default function Home() {
  // State
  const [prompt, setPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<Set<string>>(
    new Set(DEFAULT_MODELS)
  );
  const [showModels, setShowModels] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [temperature, setTemperature] = useState(0.7);
  const [judgeModelId, setJudgeModelId] = useState(JUDGE_MODELS[0].id);

  // Response state
  const [statuses, setStatuses] = useState<Record<string, CardStatus>>({});
  const [responses, setResponses] = useState<Record<string, ChatResponse>>({});
  const [judgeVerdict, setJudgeVerdict] = useState<string | null>(null);
  const [judgeLoading, setJudgeLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handlers
  const toggleModel = useCallback((id: string) => {
    setSelectedModels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const applyPreset = useCallback((preset: string) => {
    if (preset === "all") {
      setSelectedModels(new Set(MODELS.map((m) => m.id)));
    } else {
      setSelectedModels(
        new Set(MODELS.filter((m) => m.preset.includes(preset)).map((m) => m.id))
      );
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!prompt.trim()) return;
    if (selectedModels.size < 2) {
      alert("Select at least 2 models to compare.");
      return;
    }

    const models = [...selectedModels];
    setIsRunning(true);
    setJudgeVerdict(null);
    setJudgeLoading(false);
    setElapsed(0);

    // Init statuses
    const initStatuses: Record<string, CardStatus> = {};
    const initResponses: Record<string, ChatResponse> = {};
    models.forEach((id) => {
      initStatuses[id] = "loading";
    });
    setStatuses(initStatuses);
    setResponses(initResponses);

    // Timer
    const start = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 100);

    // Fire all in parallel
    const results: Record<string, ChatResponse> = {};
    await Promise.all(
      models.map(async (modelId) => {
        const result = await callModel(
          modelId,
          prompt.trim(),
          maxTokens,
          temperature
        );
        results[modelId] = result;
        // Update incrementally
        setResponses((prev) => ({ ...prev, [modelId]: result }));
        setStatuses((prev) => ({
          ...prev,
          [modelId]: result.text ? "done" : "error",
        }));
      })
    );

    // Judge
    const successModels = Object.entries(results).filter(([, v]) => v.text);
    if (judgeModelId !== "none" && successModels.length >= 2) {
      setJudgeLoading(true);
      try {
        const parts = successModels
          .map(([id, v], i) => {
            const name = getDisplayName(id);
            return `--- Response ${String.fromCharCode(65 + i)} (${name}) ---\n${v.text}`;
          })
          .join("\n\n");

        const judgePrompt = `You are an impartial AI response evaluator. Compare these responses to the prompt below and pick the best one. Be concise (3-4 sentences max).\n\nOriginal Prompt: ${prompt.trim()}\n\n${parts}\n\nEvaluate on: accuracy, helpfulness, clarity. Declare a WINNER and briefly explain why.`;

        const judgeResult = await callModel(judgeModelId, judgePrompt, 512, 0.2);
        setJudgeVerdict(judgeResult.text || judgeResult.error || "Judge failed");
      } catch {
        setJudgeVerdict("Judge failed to respond.");
      }
      setJudgeLoading(false);
    }

    // Done
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsed(Date.now() - start);
    setIsRunning(false);
  }, [prompt, selectedModels, maxTokens, temperature, judgeModelId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Grid columns
  const modelCount = selectedModels.size;
  const gridCols =
    modelCount <= 2
      ? "grid-cols-1 md:grid-cols-2"
      : modelCount === 3
      ? "grid-cols-1 md:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-5 sm:px-6">
        {/* Prompt Input */}
        <div className="rounded-xl border border-[#2d3348] bg-[#1a1d27] p-5 space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#8b95a5]">
            Your Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your prompt... (Enter to send, Shift+Enter for newline)"
            rows={3}
            className="w-full rounded-lg border border-[#2d3348] bg-[#12141c] px-4 py-3 text-[15px] text-[#e1e4e8] outline-none transition placeholder:text-[#4a5568] focus:border-[#60a5fa] resize-y"
          />

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSend}
              disabled={isRunning}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
              {isRunning ? "Comparing..." : "Compare Models"}
            </button>

            <button
              onClick={() => setShowModels(!showModels)}
              className="flex items-center gap-1.5 rounded-lg border border-[#2d3348] px-4 py-2.5 text-xs font-medium text-[#8b95a5] transition hover:border-[#4a5568]"
            >
              {showModels ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              Models ({selectedModels.size})
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1.5 rounded-lg border border-[#2d3348] px-4 py-2.5 text-xs font-medium text-[#8b95a5] transition hover:border-[#4a5568]"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Settings
            </button>

            {elapsed !== null && (
              <span className="ml-auto text-xs text-[#64748b]">
                {(elapsed / 1000).toFixed(1)}s {isRunning ? "" : "total"}
              </span>
            )}
          </div>

          {/* Model Selector (collapsible) */}
          {showModels && (
            <div className="animate-fade-in rounded-lg border border-[#2d3348] bg-[#12141c] p-4">
              <ModelSelector
                selected={selectedModels}
                onToggle={toggleModel}
                onPreset={applyPreset}
              />
            </div>
          )}

          {/* Settings (collapsible) */}
          {showSettings && (
            <div className="animate-fade-in flex flex-wrap gap-5 rounded-lg border border-[#2d3348] bg-[#12141c] p-4">
              <div>
                <label className="mb-1 block text-[11px] text-[#64748b]">Max Tokens</label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  min={100}
                  max={8192}
                  className="w-28 rounded-md border border-[#2d3348] bg-[#1a1d27] px-3 py-1.5 text-sm text-[#e1e4e8] outline-none focus:border-[#60a5fa]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[#64748b]">Temperature</label>
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-28 rounded-md border border-[#2d3348] bg-[#1a1d27] px-3 py-1.5 text-sm text-[#e1e4e8] outline-none focus:border-[#60a5fa]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[#64748b]">Judge Model</label>
                <select
                  value={judgeModelId}
                  onChange={(e) => setJudgeModelId(e.target.value)}
                  className="w-48 rounded-md border border-[#2d3348] bg-[#1a1d27] px-3 py-1.5 text-sm text-[#e1e4e8] outline-none focus:border-[#60a5fa]"
                >
                  {JUDGE_MODELS.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Response Cards */}
        {Object.keys(statuses).length > 0 && (
          <div className={`grid gap-4 ${gridCols}`}>
            {[...selectedModels].map((modelId) => (
              <ResponseCard
                key={modelId}
                modelId={modelId}
                status={statuses[modelId] || "idle"}
                response={responses[modelId] || null}
              />
            ))}
          </div>
        )}

        {/* Judge */}
        <JudgeCard
          verdict={judgeVerdict}
          loading={judgeLoading}
          judgeModel={judgeModelId}
        />

        {/* Footer */}
        <footer className="py-8 text-center text-xs text-[#4a5568]">
          <p>
            Prompt Arena — Open source multi-model comparison tool.
            Powered by{" "}
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#60a5fa] hover:underline"
            >
              OpenRouter
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
