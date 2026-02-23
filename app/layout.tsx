import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt Arena — Multi-Model AI Comparison",
  description:
    "Compare AI model responses side-by-side. Send one prompt to GPT-4o, Claude, Gemini, Llama, and more — powered by OpenRouter.",
  openGraph: {
    title: "Prompt Arena",
    description: "Compare AI responses side-by-side from multiple models",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.remove("dark")}else{document.documentElement.classList.add("dark")}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
