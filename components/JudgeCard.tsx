"use client";

import { Scale } from "lucide-react";

interface Props {
  verdict: string | null;
  loading: boolean;
  judgeModel: string;
}

export default function JudgeCard({ verdict, loading, judgeModel }: Props) {
  if (!verdict && !loading) return null;

  const modelName = judgeModel.split("/").pop()?.replace(/:free$/, "") || judgeModel;

  return (
    <div className="animate-fade-in rounded-xl border border-[#4c1d95] bg-gradient-to-r from-[#1a1b2e] to-[#1e2235] p-5">
      <div className="mb-3 flex items-center gap-2">
        <Scale className="h-4 w-4 text-[#a78bfa]" />
        <h3 className="text-sm font-semibold text-[#a78bfa]">AI Judge Verdict</h3>
        <span className="text-[11px] text-[#64748b]">({modelName})</span>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#64748b]">
          <div className="h-4 w-4 rounded-full border-2 border-[#a78bfa] border-t-transparent animate-spin-fast" />
          Evaluating responses...
        </div>
      ) : (
        <p className="text-[13.5px] leading-relaxed text-[#c9d1d9] whitespace-pre-wrap">
          {verdict}
        </p>
      )}
    </div>
  );
}
