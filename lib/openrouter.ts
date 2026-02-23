export interface ChatResponse {
  text: string | null;
  error: string | null;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  } | null;
  latencyMs: number;
}

export async function callModel(
  model: string,
  prompt: string,
  maxTokens: number,
  temperature: number
): Promise<ChatResponse> {
  const start = Date.now();

  try {
    const resp = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, maxTokens, temperature }),
    });

    const latencyMs = Date.now() - start;
    const data = await resp.json();

    if (!resp.ok) {
      return {
        text: null,
        error: data.error || `HTTP ${resp.status}`,
        tokens: null,
        latencyMs,
      };
    }

    const text = data.choices?.[0]?.message?.content;

    return {
      text: text || null,
      error: text ? null : "Empty response from model",
      tokens: data.usage
        ? {
            prompt: data.usage.prompt_tokens || 0,
            completion: data.usage.completion_tokens || 0,
            total: data.usage.total_tokens || 0,
          }
        : null,
      latencyMs,
    };
  } catch (e) {
    return {
      text: null,
      error: e instanceof Error ? e.message : "Unknown error",
      tokens: null,
      latencyMs: Date.now() - start,
    };
  }
}
