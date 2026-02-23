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
  // Free models — verified from openrouter.ai/collections/free-models (Feb 2026)
  { id: "meta-llama/llama-4-maverick:free", name: "Llama 4 Maverick", provider: "Meta", price: "FREE", color: "#8b5cf6", free: true, preset: ["free", "budget"] },
  { id: "meta-llama/llama-4-scout:free", name: "Llama 4 Scout", provider: "Meta", price: "FREE", color: "#8b5cf6", free: true, preset: ["free"] },
  { id: "deepseek/deepseek-r1-0528:free", name: "DeepSeek R1", provider: "DeepSeek", price: "FREE", color: "#38bdf8", free: true, preset: ["free", "budget"] },
  { id: "moonshotai/kimi-vl-a3b-thinking:free", name: "Kimi-VL Thinking", provider: "Moonshot", price: "FREE", color: "#e879f9", free: true, preset: ["free"] },
  { id: "mistralai/mistral-small-3.1-24b-instruct:free", name: "Mistral Small 3.1", provider: "Mistral", price: "FREE", color: "#f472b6", free: true, preset: ["free", "budget"] },
  { id: "nvidia/llama-3.1-nemotron-nano-8b-v1:free", name: "Nemotron Nano 8B", provider: "NVIDIA", price: "FREE", color: "#76b900", free: true, preset: ["free"] },
  { id: "qwen/qwen-2.5-vl-3b-instruct:free", name: "Qwen 2.5 VL", provider: "Qwen", price: "FREE", color: "#fb923c", free: true, preset: ["free"] },
  { id: "deepseek/deepseek-v3-base:free", name: "DeepSeek V3 Base", provider: "DeepSeek", price: "FREE", color: "#38bdf8", free: true, preset: ["free", "budget"] },
  { id: "openrouter/optimus-alpha", name: "Optimus Alpha", provider: "OpenRouter", price: "FREE", color: "#22d3ee", free: true, preset: ["free"] },
  { id: "openrouter/quasar-alpha", name: "Quasar Alpha", provider: "OpenRouter", price: "FREE", color: "#22d3ee", free: true, preset: ["free"] },

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
