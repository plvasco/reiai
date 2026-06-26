"use client";

import { PRELIMINARY_ZIP_DATA } from "@/lib/preliminary-data";

export default function HeatmapPage() {
  const sorted = [...PRELIMINARY_ZIP_DATA].sort((a, b) => (a.medDOM ?? 999) - (b.medDOM ?? 999));

  const getColor = (val: number | null, type: "dom" | "yield") => {
    if (val === null) return "bg-[#1a2035]";
    if (type === "dom") {
      if (val < 25) return "bg-[#10b981] text-white";
      if (val < 40) return "bg-[#06b6d4]";
      if (val < 60) return "bg-[#f59e0b]";
      return "bg-[#ef4444] text-white";
    }
    if (val > 8) return "bg-[#10b981] text-white";
    if (val > 5) return "bg-[#f59e0b]";
    return "bg-[#ef4444] text-white";
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">🗺️ Market Heat Map</h1>
      <p className="text-sm text-[#8b95a9] mb-6">
        Color-coded ZIP map — darker = faster market (low DOM) or higher yield.
      </p>

      <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-sm mb-4">🔥 Days on Market — Darker = Faster</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {sorted.map((z) => (
            <div
              key={z.zip}
              className={`rounded-xl p-4 text-center ${getColor(z.medDOM, "dom")}`}
            >
              <div className="text-lg font-bold">{z.zip}</div>
              <div className="text-xs opacity-80">{z.medDOM}d</div>
              <div className="text-[10px] mt-1 opacity-60">{z.submarket.split("/")[0].trim()}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-[#8b95a9]">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#10b981]"></span> &lt;25d</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#06b6d4]"></span> 25-40d</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#f59e0b]"></span> 40-60d</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#ef4444]"></span> &gt;60d</span>
        </div>
      </div>

      <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-6">
        <h3 className="font-semibold text-sm mb-4">💰 Gross Yield — Darker = Higher</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[...PRELIMINARY_ZIP_DATA].sort((a, b) => (b.grossYield ?? 0) - (a.grossYield ?? 0)).map((z) => (
            <div
              key={z.zip}
              className={`rounded-xl p-4 text-center ${getColor(z.grossYield, "yield")}`}
            >
              <div className="text-lg font-bold">{z.zip}</div>
              <div className="text-xs opacity-80">{z.grossYield}%</div>
              <div className="text-[10px] mt-1 opacity-60">{z.submarket.split("/")[0].trim()}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-[#8b95a9]">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#10b981]"></span> &gt;8%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#f59e0b]"></span> 5-8%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#ef4444]"></span> &lt;5%</span>
        </div>
      </div>

      <div className="mt-6 text-xs text-[#8b95a9] text-center">
        Data from RentCast (Jun 26, 2026). Heat map updates automatically when new data loads.
      </div>
    </main>
  );
}
