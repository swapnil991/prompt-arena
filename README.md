# Prompt Arena

Compare AI model responses side-by-side. Send one prompt to multiple models (GPT-4o, Claude, Gemini, Llama, DeepSeek, and more) and see which one gives the best answer.

**Live Demo:** [prompt-arena.vercel.app](https://prompt-arena.vercel.app)

## Features

- **12+ AI models** from OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, and more
- **Side-by-side comparison** with parallel API calls
- **Free models included** — Gemini Flash, Llama 3.1, Phi-3 (no cost)
- **AI Judge** — automatic evaluation using a free model
- **Token usage & latency** tracking per response
- **Preset groups** — Free Only, Budget Mix, Flagships
- **Zero backend** — runs entirely in your browser via OpenRouter
- **Your API key stays local** — never sent to any server except OpenRouter

## Getting Started

1. Get a free API key at [openrouter.ai/keys](https://openrouter.ai/keys)
2. Visit the app and paste your key
3. Type a prompt, select models, and compare

## Development

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/prompt-arena)

Or manually:

```bash
npm i -g vercel
vercel
```

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript**
- **Tailwind CSS v4**
- **OpenRouter API** (unified access to 200+ AI models)
- **Lucide React** icons

## License

MIT
