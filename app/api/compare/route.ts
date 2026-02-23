import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Simple in-memory rate limiter (per deployment instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // max requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  // Check API key is configured
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "Server API key not configured" },
      { status: 500 }
    );
  }

  // Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  // Parse request
  let body: {
    model: string;
    prompt: string;
    maxTokens?: number;
    temperature?: number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { model, prompt, maxTokens = 1024, temperature = 0.7 } = body;

  if (!model || !prompt) {
    return NextResponse.json(
      { error: "Missing 'model' or 'prompt'" },
      { status: 400 }
    );
  }

  // Cap tokens to prevent abuse
  const safeMaxTokens = Math.min(Math.max(maxTokens, 100), 2048);

  // Proxy to OpenRouter
  try {
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://prompt-arena.vercel.app",
        "X-Title": "Prompt Arena",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: safeMaxTokens,
        temperature,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return NextResponse.json(
        { error: data.error?.message || `OpenRouter returned ${resp.status}` },
        { status: resp.status }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to reach OpenRouter" },
      { status: 502 }
    );
  }
}
