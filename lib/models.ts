export interface Model {
  id: string;
  name: string;
  provider: string;
  price: string;
  color: string;
  free: boolean;
  preset: string[];
}

export const MODELS: Model[] = [
  // Free models (verified active on OpenRouter — Feb 2026)
  { id: "google/gemma-3-27b-it:free", name: "Gemma 3 27B", provider: "Google", price: "FREE", color: "#3b82f6", free: true, preset: ["free", "budget"] },
  { id: "qwen/qwen3-coder:free", name: "Qwen 3 Coder", provider: "Qwen", price: "FREE", color: "#fb923c", free: true, preset: ["free", "budget"] },
  { id: "qwen/qwen3-next-80b-a3b-instruct:free", name: "Qwen 3 Next 80B", provider: "Qwen", price: "FREE", color: "#fb923c", free: true, preset: ["free", "budget"] },
  { id: "deepseek/deepseek-r1-0528:free", name: "DeepSeek R1", provider: "DeepSeek", price: "FREE", color: "#38bdf8", free: true, preset: ["free", "budget"] },
  { id: "nvidia/nemotron-3-nano-30b-a3b:free", name: "Nemotron 3 Nano 30B", provider: "NVIDIA", price: "FREE", color: "#76b900", free: true, preset: ["free"] },
  { id: "stepfun/step-3.5-flash:free", name: "Step 3.5 Flash", provider: "StepFun", price: "FREE", color: "#22d3ee", free: true, preset: ["free"] },
  { id: "openai/gpt-oss-120b:free", name: "GPT-OSS 120B", provider: "OpenAI", price: "FREE", color: "#10b981", free: true, preset: ["free"] },
  { id: "z-ai/glm-4.5-air:free", name: "GLM 4.5 Air", provider: "Zhipu AI", price: "FREE", color: "#e879f9", free: true, preset: ["free"] },

  // Budget paid models
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", price: "$0.15/M in", color: "#10b981", free: false, preset: ["budget"] },
  { id: "anthropic/claude-3.5-haiku", name: "Claude 3.5 Haiku", provider: "Anthropic", price: "$0.80/M in", color: "#f59e0b", free: false, preset: ["budget"] },
  { id: "deepseek/deepseek-chat", name: "DeepSeek V3", provider: "DeepSeek", price: "$0.27/M in", color: "#38bdf8", free: false, preset: [] },

  // Flagship paid models
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI", price: "$2.50/M in", color: "#10b981", free: false, preset: ["flagship"] },
  { id: "anthropic/claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic", price: "$3.00/M in", color: "#f59e0b", free: false, preset: ["flagship"] },
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", price: "$0.15/M in", color: "#3b82f6", free: false, preset: ["flagship"] },
  { id: "mistralai/mistral-large-latest", name: "Mistral Large", provider: "Mistral", price: "$2.00/M in", color: "#f472b6", free: false, preset: ["flagship"] },
];

export const DEFAULT_MODELS = MODELS.filter((m) => m.preset.includes("budget")).map((m) => m.id);

export function getModel(id: string): Model | undefined {
  return MODELS.find((m) => m.id === id);
}

export function getDisplayName(id: string): string {
  return getModel(id)?.name || id.split("/").pop()?.replace(/:free$/, "") || id;
}
