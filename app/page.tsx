"use client";

import { useState, useRef, useCallback } from "react";
import Header from "@/components/Header";
import ModelSelector from "@/components/ModelSelector";
import ResponseCard, { type CardStatus } from "@/components/ResponseCard";
import ResultCard from "@/components/ResultCard";
import { MODELS, DEFAULT_MODELS, getDisplayName } from "@/lib/models";
import { callModel, type ChatResponse } from "@/lib/openrouter";
import { Send, ChevronDown, ChevronUp, Settings2, Scale, Blend } from "lucide-react";

type PostMode = "judge" | "combine";

const EVAL_MODELS = [
  { id: "openai/gpt-4o-mini", label: "GPT-4o Mini ($0.15/M)" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash ($0.15/M)" },
  { id: "anthropic/claude-3.5-haiku", label: "Claude 3.5 Haiku ($0.80/M)" },
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<Set<string>>(
    new Set(DEFAULT_MODELS)
  );
  const [showModels, setShowModels] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [temperature, setTemperature] = useState(0.7);
  const [evalModelId, setEvalModelId] = useState(EVAL_MODELS[0].id);
  const [postMode, setPostMode] = useState<PostMode>("judge");

  const [statuses, setStatuses] = useState<Record<string, CardStatus>>({});
  const [responses, setResponses] = useState<Record<string, ChatResponse>>({});
  const [resultText, setResultText] = useState<string | null>(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    setResultText(null);
    setResultLoading(false);
    setElapsed(0);

    const initStatuses: Record<string, CardStatus> = {};
    const initResponses: Record<string, ChatResponse> = {};
    models.forEach((id) => {
      initStatuses[id] = "loading";
    });
    setStatuses(initStatuses);
    setResponses(initResponses);

    const start = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 100);

    const results: Record<string, ChatResponse> = {};
    await Promise.all(
      models.map(async (modelId) => {
        const result = await callModel(modelId, prompt.trim(), maxTokens, temperature);
        results[modelId] = result;
        setResponses((prev) => ({ ...prev, [modelId]: result }));
        setStatuses((prev) => ({
          ...prev,
          [modelId]: result.text ? "done" : "error",
        }));
      })
    );

    const successModels = Object.entries(results).filter(([, v]) => v.text);
    if (successModels.length >= 2) {
      setResultLoading(true);
      try {
        const parts = successModels
          .map(([id, v], i) => {
            const name = getDisplayName(id);
            return `--- Response ${String.fromCharCode(65 + i)} (${name}) ---\n${v.text}`;
          })
          .join("\n\n");

        let evalPrompt: string;
        if (postMode === "judge") {
          evalPrompt = `You are an impartial AI response evaluator. Compare these responses to the prompt below and pick the best one. Be concise (3-4 sentences max).\n\nOriginal Prompt: ${prompt.trim()}\n\n${parts}\n\nEvaluate on: accuracy, helpfulness, clarity. Declare a WINNER and briefly explain why.`;
        } else {
          evalPrompt = `You are an expert synthesizer. You have received multiple AI responses to the same prompt. Your job is to combine the best parts of all responses into one single, comprehensive, well-structured answer. Take the strongest points from each, eliminate redundancy, and produce the ideal response.\n\nOriginal Prompt: ${prompt.trim()}\n\n${parts}\n\nNow write the best combined response. Do not mention the individual models or that you are combining responses — just deliver the ideal answer directly.`;
        }

        const evalResult = await callModel(evalModelId, evalPrompt, 2048, 0.3);
        setResultText(evalResult.text || evalResult.error || "Evaluation failed");
      } catch {
        setResultText("Evaluation failed to respond.");
      }
      setResultLoading(false);
    }

    if (timerRef.current) clearInterval(timerRef.current);
    setElapsed(Date.now() - start);
    setIsRunning(false);
  }, [prompt, selectedModels, maxTokens, temperature, evalModelId, postMode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const modelCount = selectedModels.size;
  const gridCols =
    modelCount <= 2
      ? "grid-cols-1 md:grid-cols-2"
      : modelCount === 3
      ? "grid-cols-1 md:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";

  const evalModelName =
    evalModelId.split("/").pop()?.replace(/:free$/, "") || evalModelId;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-5 sm:px-6">
        {/* Prompt Input */}
        <div
          className="rounded-xl p-5 space-y-4"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          <label
            className="block text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            Your Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your prompt... (Enter to send, Shift+Enter for newline)"
            rows={3}
            className="w-full rounded-lg px-4 py-3 text-[15px] outline-none transition resize-y"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />

          {/* Mode Toggle */}
          <div
            className="flex items-center gap-1 rounded-lg p-1 w-fit"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
            }}
          >
            <button
              onClick={() => setPostMode("judge")}
              className="flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold transition"
              style={{
                background: postMode === "judge" ? "var(--toggle-judge-bg)" : "transparent",
                color: postMode === "judge" ? "var(--toggle-judge-text)" : "var(--text-muted)",
              }}
            >
              <Scale className="h-3.5 w-3.5" />
              Judge Best
            </button>
            <button
              onClick={() => setPostMode("combine")}
              className="flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold transition"
              style={{
                background: postMode === "combine" ? "var(--toggle-combine-bg)" : "transparent",
                color: postMode === "combine" ? "var(--toggle-combine-text)" : "var(--text-muted)",
              }}
            >
              <Blend className="h-3.5 w-3.5" />
              Combine All
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSend}
              disabled={isRunning}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              <Send className="h-4 w-4" />
              {isRunning ? "Comparing..." : "Compare Models"}
            </button>

            <button
              onClick={() => setShowModels(!showModels)}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-medium transition hover:opacity-80"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              {showModels ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
              Models ({selectedModels.size})
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-medium transition hover:opacity-80"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              <Settings2 className="h-3.5 w-3.5" />
              Settings
            </button>

            {elapsed !== null && (
              <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
                {(elapsed / 1000).toFixed(1)}s {isRunning ? "" : "total"}
              </span>
            )}
          </div>

          {/* Model Selector (collapsible) */}
          {showModels && (
            <div
              className="animate-fade-in rounded-lg p-4"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
              }}
            >
              <ModelSelector
                selected={selectedModels}
                onToggle={toggleModel}
                onPreset={applyPreset}
              />
            </div>
          )}

          {/* Settings (collapsible) */}
          {showSettings && (
            <div
              className="animate-fade-in flex flex-wrap gap-5 rounded-lg p-4"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <label className="mb-1 block text-[11px]" style={{ color: "var(--text-muted)" }}>
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  min={100}
                  max={8192}
                  className="w-28 rounded-md px-3 py-1.5 text-sm outline-none"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px]" style={{ color: "var(--text-muted)" }}>
                  Temperature
                </label>
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-28 rounded-md px-3 py-1.5 text-sm outline-none"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {postMode === "judge" ? "Judge" : "Combiner"} Model
                </label>
                <select
                  value={evalModelId}
                  onChange={(e) => setEvalModelId(e.target.value)}
                  className="w-56 rounded-md px-3 py-1.5 text-sm outline-none"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  {EVAL_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
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

        {/* Result: Judge or Combine */}
        <ResultCard
          mode={postMode}
          verdict={resultText}
          loading={resultLoading}
          modelName={evalModelName}
        />

        {/* Footer */}
        <footer className="py-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>
          <p>
            Prompt Arena — Open source multi-model comparison tool. Powered by{" "}
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-blue)" }}
              className="hover:underline"
            >
              OpenRouter
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
