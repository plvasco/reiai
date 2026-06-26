"use client";

import { useState } from "react";
import { ZipData } from "@/lib/types";
import { PRELIMINARY_ZIP_DATA } from "@/lib/preliminary-data";

export default function LookupPage() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subscription, setSubscription] = useState<"free" | "paid">("free");

  const handleLookup = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/property-lookup?address=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Failed to look up address. Try again.");
    }
    setLoading(false);
  };

  const zipFromAddress = address.match(/\b7\d{4}\b/)?.[0] || "";
  const zipData = PRELIMINARY_ZIP_DATA.find((z) => z.zip === zipFromAddress);

  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">🔍 Property Lookup</h1>
      <p className="text-sm text-[#8b95a9] mb-6">
        Enter any Houston address to get rent estimate, market data, and comparable analysis.
      </p>

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="1234 Main St, Houston, TX 77002"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLookup()}
          className="flex-1 bg-[#111827] border border-[#1e2a45] rounded-lg px-4 py-3 text-sm text-[#e2e8f0] placeholder-[#8b95a9]"
        />
        <button
          onClick={handleLookup}
          disabled={loading}
          className="bg-[#06b6d4] text-[#0b0f1a] font-semibold px-6 py-3 rounded-lg text-sm hover:bg-[#0891b2] transition disabled:opacity-50"
        >
          {loading ? "..." : "Look Up"}
        </button>
      </div>

      {/* ZIP Context */}
      {zipData && !result && (
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4 mb-4">
          <div className="text-xs text-[#8b95a9] mb-2">📍 This address is in ZIP <strong className="text-[#06b6d4]">{zipData.zip}</strong> — {zipData.submarket}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-[#8b95a9]">Med DOM:</span> <strong>{zipData.medDOM}d</strong></div>
            <div><span className="text-[#8b95a9]">Med Price:</span> <strong>${zipData.medPrice?.toLocaleString()}</strong></div>
            <div><span className="text-[#8b95a9]">Med Rent:</span> <strong>${zipData.medRent}/mo</strong></div>
            <div><span className="text-[#8b95a9]">Yield:</span> <strong className="text-[#f59e0b]">{zipData.grossYield}%</strong></div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl p-4 text-sm text-[#ef4444] mb-4">{error}</div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Property Card */}
          <div className="bg-[#111827] border border-[#06b6d4]/30 rounded-xl p-5">
            <h2 className="font-semibold text-lg mb-1">{result.address || address}</h2>
            <p className="text-xs text-[#8b95a9] mb-4">RentCast property estimate</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ResultCard label="Rent Estimate" value={result.rentEstimate ? `$${result.rentEstimate}/mo` : "—"} color="text-[#10b981]" />
              <ResultCard label="Value Estimate" value={result.valueEstimate ? `$${result.valueEstimate.toLocaleString()}` : "—"} color="text-[#06b6d4]" />
              <ResultCard label="$/sqft" value={result.pricePerSqFt ? `$${result.pricePerSqFt}` : "—"} color="text-[#e2e8f0]" />
              <ResultCard label="Gross Yield" value={result.grossYield ? `${result.grossYield}%` : "—"} color={result.grossYield && result.grossYield > 8 ? "text-[#f59e0b]" : "text-[#8b95a9]"} />
            </div>
          </div>

          {/* Nearby Comps */}
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5">
            <h3 className="font-semibold mb-1 text-sm">Nearby Comparables</h3>
            <p className="text-xs text-[#8b95a9] mb-3">RentCast similar properties within 0.5mi</p>
            {result.comps && result.comps.length > 0 ? (
              <div className="space-y-2 text-sm">
                {result.comps.map((c: any, i: number) => (
                  <div key={i} className="flex justify-between py-2 border-b border-[#1e2a45] last:border-0">
                    <span className="text-[#8b95a9]">{c.address}</span>
                    <span className="font-mono">
                      {c.bedrooms}bd | {c.bathrooms}ba | {c.sqft}sqft | ${c.rent}/mo
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#8b95a9]">
                {subscription === "free" ? "🔒 Subscribe to see comps." : "No comps found."}
              </p>
            )}
          </div>

          {/* Deal Score */}
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5">
            <h3 className="font-semibold mb-3 text-sm">Deal Score</h3>
            {subscription === "free" ? (
              <p className="text-sm text-[#8b95a9]">🔒 Subscribe to get a buy/hold/pass recommendation with cash flow analysis.</p>
            ) : (
              <div className="text-sm">
                <p className="text-[#10b981] text-lg font-bold mb-1">
                  {result.grossYield && result.grossYield > 8 ? "🟢 Strong Buy" : result.grossYield && result.grossYield > 5 ? "🟡 Hold" : "🔴 Pass"}
                </p>
                <p className="text-[#8b95a9]">Based on yield, ZIP-level DOM, and appreciation trends.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pro CTA */}
      {subscription === "free" && result && (
        <div className="mt-6 bg-gradient-to-r from-[#1a2035] to-[#0b0f1a] border border-[#06b6d4]/30 rounded-xl p-5 text-center">
          <h3 className="font-semibold mb-1">🔓 Unlock Full Analysis</h3>
          <p className="text-sm text-[#8b95a9] mb-3">Get unlimited lookups, comps, deal scores, and exportable reports.</p>
          <button className="bg-[#06b6d4] text-[#0b0f1a] font-semibold px-6 py-2 rounded-lg text-sm hover:bg-[#0891b2] transition" onClick={() => window.open("https://buy.stripe.com/test_3cs4iH1pyaNKe1m000", "_blank")}>
            Subscribe — $39/mo
          </button>
        </div>
      )}
    </main>
  );
}

function ResultCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="text-xs text-[#8b95a9]">{label}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}
