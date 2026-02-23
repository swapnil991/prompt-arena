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
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash", provider: "Google", price: "FREE", color: "#3b82f6", free: true, preset: ["free", "budget"] },
  { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama 3.1 8B", provider: "Meta", price: "FREE", color: "#8b5cf6", free: true, preset: ["free", "budget"] },
  { id: "microsoft/phi-3-medium-128k-instruct:free", name: "Phi-3 Medium", provider: "Microsoft", price: "FREE", color: "#22d3ee", free: true, preset: ["free"] },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", price: "$0.15/M in", color: "#10b981", free: false, preset: ["budget"] },
  { id: "anthropic/claude-3.5-haiku", name: "Claude 3.5 Haiku", provider: "Anthropic", price: "$0.80/M in", color: "#f59e0b", free: false, preset: ["budget"] },
  { id: "deepseek/deepseek-chat", name: "DeepSeek V3", provider: "DeepSeek", price: "$0.27/M in", color: "#38bdf8", free: false, preset: ["budget"] },
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI", price: "$2.50/M in", color: "#10b981", free: false, preset: ["flagship"] },
  { id: "anthropic/claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic", price: "$3.00/M in", color: "#f59e0b", free: false, preset: ["flagship"] },
  { id: "google/gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google", price: "$1.25/M in", color: "#3b82f6", free: false, preset: ["flagship"] },
  { id: "mistralai/mistral-large-latest", name: "Mistral Large", provider: "Mistral", price: "$2.00/M in", color: "#f472b6", free: false, preset: ["flagship"] },
  { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B", provider: "Alibaba", price: "$0.35/M in", color: "#fb923c", free: false, preset: [] },
  { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B", provider: "Meta", price: "$0.52/M in", color: "#8b5cf6", free: false, preset: [] },
];

export const DEFAULT_MODELS = MODELS.filter((m) => m.preset.includes("budget")).map((m) => m.id);

export function getModel(id: string): Model | undefined {
  return MODELS.find((m) => m.id === id);
}

export function getDisplayName(id: string): string {
  return getModel(id)?.name || id.split("/").pop()?.replace(/:free$/, "") || id;
}
