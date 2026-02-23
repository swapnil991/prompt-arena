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

export async function callOpenRouter(
  apiKey: string,
  model: string,
  prompt: string,
  maxTokens: number,
  temperature: number
): Promise<ChatResponse> {
  const start = Date.now();

  try {
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": typeof window !== "undefined" ? window.location.href : "https://prompt-arena.vercel.app",
        "X-Title": "Prompt Arena",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    const latencyMs = Date.now() - start;

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return {
        text: null,
        error: err.error?.message || `HTTP ${resp.status}`,
        tokens: null,
        latencyMs,
      };
    }

    const data = await resp.json();
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
