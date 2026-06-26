"use client";

import { PRELIMINARY_ZIP_DATA } from "@/lib/preliminary-data";

export default function GentrificationPage() {
  // ZIPs with pre-gentrification catalysts
  const gentrifyingZips = PRELIMINARY_ZIP_DATA.filter((z) =>
    ["77003", "77004", "77011", "77012", "77020", "77051", "77026", "77009"].includes(z.zip)
  ).sort((a, b) => (a.medDOM ?? 999) - (b.medDOM ?? 999));

  const getStage = (dom: number | null) => {
    if (!dom) return { label: "Unknown", color: "text-[#8b95a9]" };
    if (dom < 30) return { label: "🔥 Late Stage — Already Gentrified", color: "text-[#ef4444]" };
    if (dom < 50) return { label: "⚡ Accelerating — Window Closing", color: "text-[#f59e0b]" };
    if (dom < 70) return { label: "📈 Early — Buying Opportunity", color: "text-[#10b981]" };
    return { label: "🌱 Pre-Gentrification — Best Entry", color: "text-[#06b6d4]" };
  };

  const estMonthsTo50 = (dom: number | null) => {
    if (!dom) return null;
    if (dom <= 50) return 0;
    const months = Math.round((dom - 50) / 3); // rough: DOM drops ~3d/mo in gentrifying areas
    return months;
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">⏰ Gentrification Clock</h1>
      <p className="text-sm text-[#8b95a9] mb-6">
        Pre-gentrification ZIPs ranked by how close they are to reaching retail velocity (med DOM &lt; 50d).
        When DOM drops below 50d, the gentrification wave has arrived.
      </p>

      <div className="grid gap-4">
        {gentrifyingZips.map((z) => {
          const stage = getStage(z.medDOM);
          const months = estMonthsTo50(z.medDOM);

          return (
            <div key={z.zip} className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 hover:border-[#06b6d4]/30 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-lg font-bold text-[#06b6d4]">{z.zip}</span>
                  <span className="text-[#8b95a9] text-sm ml-2">{z.submarket}</span>
                </div>
                <span className={`text-xs font-semibold ${stage.color}`}>{stage.label}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-xs text-[#8b95a9]">Med DOM</div>
                  <div className="text-lg font-bold">{z.medDOM}d</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">Med Price</div>
                  <div className="text-lg font-bold">${z.medPrice?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">Est. Months Until 50d DOM</div>
                  <div className={`text-lg font-bold ${months === 0 ? "text-[#ef4444]" : months && months < 6 ? "text-[#f59e0b]" : "text-[#10b981]"}`}>
                    {months === 0 ? "⚠️ NOW" : months ? `~${months}mo` : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">Gross Yield</div>
                  <div className="text-lg font-bold text-[#f59e0b]">{z.grossYield}%</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">Listings</div>
                  <div className="text-lg font-bold">{z.totalListings}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-[#8b95a9] mb-1">
                  <span>Pre-gentrification</span>
                  <span>Retail velocity</span>
                </div>
                <div className="h-2 bg-[#0b0f1a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all bg-gradient-to-r from-[#06b6d4] via-[#10b981] via-[#f59e0b] to-[#ef4444]"
                    style={{ width: z.medDOM ? `${Math.max(0, Math.min(100, (100 - z.medDOM) * 1.2))}%` : "0%" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#8b95a9] mt-1">
                  <span>100d+</span>
                  <span>50d</span>
                  <span>20d</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-[#111827] border border-[#1e2a45] rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-2">🧠 Strategy</h3>
        <ul className="text-sm text-[#8b95a9] space-y-2">
          <li>• <strong className="text-[#06b6d4]">77003 (73d DOM):</strong> Most catalysts in Houston (East River, METRORail, NHHIP). Still ~8mo from retail velocity. <strong>Best entry timing for appreciation plays.</strong></li>
          <li>• <strong className="text-[#10b981]">77020 (27d DOM):</strong> Already at retail velocity. NHHIP catalyst is driving demand. Buy now for cash flow + appreciation.</li>
          <li>• <strong className="text-[#f59e0b]">77004 (67d DOM):</strong> Institutional anchor (TMC3, Ion District) but high inventory (579 listings) keeps DOM elevated. <strong>Watch for inventory absorption.</strong></li>
          <li>• <strong className="text-[#10b981]">77051 (26d DOM):</strong> SH 288 corridor — already fast. Sunnyside is being discovered. <strong>8.4% yield + fast sell-through is rare.</strong></li>
        </ul>
      </div>
    </main>
  );
}
