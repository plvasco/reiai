"use client";

import { useState } from "react";
import { PRELIMINARY_ZIP_DATA } from "@/lib/preliminary-data";

export default function FilterPage() {
  const [maxPrice, setMaxPrice] = useState(400000);
  const [minYield, setMinYield] = useState(5);
  const [maxDOM, setMaxDOM] = useState(60);
  const [subscription, setSubscription] = useState<"free" | "paid">("free");

  const filtered = PRELIMINARY_ZIP_DATA.filter((z) => {
    const p = z.medPrice ?? 999999;
    const y = z.grossYield ?? 0;
    const d = z.medDOM ?? 999;
    return p <= maxPrice && y >= minYield && d <= maxDOM;
  }).sort((a, b) => (b.grossYield ?? 0) - (a.grossYield ?? 0));

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">🎯 Deal Filter</h1>
      <p className="text-sm text-[#8b95a9] mb-6">
        Find ZIP codes matching your investment criteria. Results ranked by gross yield.
      </p>

      {/* Filters */}
      <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs text-[#8b95a9] block mb-2">Max Price: ${maxPrice.toLocaleString()}</label>
            <input type="range" min={100000} max={600000} step={25000} value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#06b6d4]" />
            <div className="flex justify-between text-xs text-[#8b95a9] mt-1">
              <span>$100K</span><span>$600K</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-[#8b95a9] block mb-2">Min Gross Yield: {minYield}%</label>
            <input type="range" min={0} max={12} step={0.5} value={minYield}
              onChange={(e) => setMinYield(Number(e.target.value))}
              className="w-full accent-[#06b6d4]" />
            <div className="flex justify-between text-xs text-[#8b95a9] mt-1">
              <span>0%</span><span>12%</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-[#8b95a9] block mb-2">Max Days on Market: {maxDOM}d</label>
            <input type="range" min={10} max={120} step={5} value={maxDOM}
              onChange={(e) => setMaxDOM(Number(e.target.value))}
              className="w-full accent-[#06b6d4]" />
            <div className="flex justify-between text-xs text-[#8b95a9] mt-1">
              <span>10d</span><span>120d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="text-sm text-[#8b95a9] mb-3">
        {filtered.length} ZIP{filtered.length !== 1 ? "s" : ""} match your criteria
      </div>

      <div className="bg-[#111827] border border-[#1e2a45] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2a45] text-[#8b95a9] text-xs uppercase">
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">ZIP</th>
                <th className="px-4 py-3 text-left">Submarket</th>
                <th className="px-4 py-3 text-left">Med Price</th>
                <th className="px-4 py-3 text-left">Med DOM</th>
                <th className="px-4 py-3 text-left">Gross Yield</th>
                <th className="px-4 py-3 text-left">Signal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((z, i) => (
                <tr key={z.zip} className="border-b border-[#1e2a45] hover:bg-[#1a2035]/50 transition">
                  <td className="px-4 py-3 font-mono text-[#8b95a9]">#{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-[#06b6d4]">{z.zip}</td>
                  <td className="px-4 py-3 text-[#8b95a9]">{z.submarket}</td>
                  <td className="px-4 py-3 font-mono">${z.medPrice?.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono">
                    <span className={z.medDOM && z.medDOM < 30 ? "text-[#10b981]" : z.medDOM && z.medDOM > 60 ? "text-[#ef4444]" : ""}>
                      {z.medDOM}d
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[#f59e0b] font-bold">{z.grossYield}%</td>
                  <td className="px-4 py-3 text-xs">
                    {z.grossYield && z.grossYield > 8 ? (
                      <span className="text-[#10b981]">🟢 Strong Buy</span>
                    ) : z.grossYield && z.grossYield > 5 ? (
                      <span className="text-[#f59e0b]">🟡 Moderate</span>
                    ) : (
                      <span className="text-[#ef4444]">🔴 Low Yield</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-[#8b95a9]">No ZIPs match your criteria. Try loosening your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-xs text-[#8b95a9] text-center">
        Data from RentCast (Jun 26, 2026). Yields calculated as annual rent ÷ median price.
      </div>
    </main>
  );
}
