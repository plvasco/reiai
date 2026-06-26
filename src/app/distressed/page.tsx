"use client";

import { useState } from "react";
import { SAMPLE_DISTRESSED, DISTRESSED_TYPES, getTypeLabel, getTypeIcon } from "@/lib/distressed-data";
import { PRELIMINARY_ZIP_DATA } from "@/lib/preliminary-data";

export default function DistressedPage() {
  const [filterType, setFilterType] = useState("all");
  const [filterZip, setFilterZip] = useState("");
  const [minEquity, setMinEquity] = useState(0);

  // Build a lookup: zip -> medDOM
  const zipDataMap: Record<string, { medDOM: number | null; medPrice: number | null }> = {};
  for (const z of PRELIMINARY_ZIP_DATA) {
    zipDataMap[z.zip] = { medDOM: z.medDOM, medPrice: z.medPrice };
  }

  const filtered = SAMPLE_DISTRESSED.filter((p) => {
    if (filterType !== "all" && p.type !== filterType) return false;
    if (filterZip && !p.zip.includes(filterZip)) return false;
    if ((p.estimatedEquity ?? 0) < minEquity) return false;
    return true;
  }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">🎯 Distressed Properties</h1>
      <p className="text-sm text-[#8b95a9] mb-6">
        Find motivated sellers — pre-foreclosures, NOD filings, tax delinquencies, and absentee owners in your target ZIPs.
        <span className="block mt-1 text-xs">🔒 Full address data requires Pro subscription. Preview data shown.</span>
      </p>

      {/* Filters */}
      <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0]"
          >
            <option value="all">All Types</option>
            {DISTRESSED_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="ZIP..."
            value={filterZip}
            onChange={(e) => setFilterZip(e.target.value)}
            className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm w-24 text-[#e2e8f0] placeholder-[#8b95a9]"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8b95a9]">Min Equity: ${minEquity.toLocaleString()}</span>
            <input
              type="range" min={0} max={100000} step={10000}
              value={minEquity}
              onChange={(e) => setMinEquity(Number(e.target.value))}
              className="w-24 accent-[#06b6d4]"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filtered.map((p) => {
          const zipInfo = zipDataMap[p.zip];
          const dom = zipInfo?.medDOM;
          const price = zipInfo?.medPrice;

          return (
            <div key={p.id} className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 hover:border-[#06b6d4]/30 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(p.type)}</span>
                  <div>
                    <span className="font-bold text-[#e2e8f0]">{p.address}</span>
                    <span className="text-xs text-[#8b95a9] ml-2">{getTypeLabel(p.type)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    p.score && p.score >= 85 ? "bg-[#10b981]/20 text-[#10b981]" :
                    p.score && p.score >= 70 ? "bg-[#f59e0b]/20 text-[#f59e0b]" :
                    "bg-[#8b95a9]/20 text-[#8b95a9]"
                  }`}>
                    Score: {p.score}/100
                  </span>
                  <span className="text-xs bg-[#ef4444]/20 text-[#ef4444] px-2 py-0.5 rounded">
                    {p.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm mb-3">
                <div>
                  <div className="text-xs text-[#8b95a9]">Est. Value</div>
                  <div className="font-bold text-[#06b6d4]">${p.estimatedValue?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">Est. Equity</div>
                  <div className="font-bold text-[#10b981]">${p.estimatedEquity?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">ARV</div>
                  <div className="font-bold">${p.arv?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">Est. Repairs</div>
                  <div className="font-bold text-[#ef4444]">${p.repairCost?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">Potential Profit</div>
                  <div className="font-bold text-[#f59e0b]">
                    ${(((p.arv ?? 0) - (p.estimatedValue ?? 0) - (p.repairCost ?? 0))).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">ZIP medDOM</div>
                  <div className={`font-bold ${dom && dom < 30 ? "text-[#10b981]" : dom && dom > 60 ? "text-[#ef4444]" : ""}`}>
                    {dom ? `${dom}d` : "—"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-[#8b95a9]">
                <span>📍 {p.zip} — {p.submarket}</span>
                <span>🏠 {p.bedrooms}bd / {p.bathrooms}ba / {p.sqft}sqft</span>
                <span>📅 Built: {p.yearBuilt}</span>
                <span>💰 Last Sold: ${p.lastSalePrice?.toLocaleString()} ({p.lastSaleDate})</span>
                <span>
                  📈 ZIP medPrice: <strong className="text-[#e2e8f0]">${price?.toLocaleString()}</strong>
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-[#1e2a45] text-xs text-[#8b95a9]">
                Source: {p.source} | Added: {p.dateAdded}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-10 text-center text-[#8b95a9] text-sm">
            No distressed properties match your filters.
          </div>
        )}
      </div>

      {/* Pro Upsell */}
      <div className="mt-6 bg-gradient-to-r from-[#1a2035] to-[#0b0f1a] border border-[#06b6d4]/30 rounded-xl p-5 text-center">
        <h3 className="font-semibold mb-1">🔓 Unlock 10,000+ Distressed Properties</h3>
        <p className="text-sm text-[#8b95a9] mb-3">
          Get live data from Harris County Clerk records. Filter by ZIP, equity range, and distress type. Export lead lists.
        </p>
        <a
          href="/pricing"
          className="bg-[#06b6d4] text-[#0b0f1a] font-semibold px-6 py-2 rounded-lg text-sm hover:bg-[#0891b2] transition"
        >
          Upgrade for Lead Access
        </a>
      </div>

      {/* Methodology */}
      <div className="mt-4 text-xs text-[#8b95a9] text-center">
        Sample data shown. Full data sourced from Harris County Clerk NOD filings, tax delinquency records, and civil court bankruptcy filings. Updated weekly.
      </div>
    </main>
  );
}
