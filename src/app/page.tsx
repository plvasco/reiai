"use client";

import { useState, useEffect } from "react";
import { ZipData } from "@/lib/types";
import { PRELIMINARY_ZIP_DATA } from "@/lib/preliminary-data";

export default function DashboardPage() {
  const [data, setData] = useState<ZipData[]>(PRELIMINARY_ZIP_DATA);
  const [loading, setLoading] = useState(true);
  const [usingLive, setUsingLive] = useState(false);
  const [sortKey, setSortKey] = useState<keyof ZipData>("medDOM");
  const [sortAsc, setSortAsc] = useState(true);
  const [subscription, setSubscription] = useState<"free" | "paid">("free");

  useEffect(() => {
    fetch("/api/market-data")
      .then((r) => r.json())
      .then((d) => {
        if (d.data && d.data.length > 0) {
          setData(d.data);
          setUsingLive(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey] ?? 0;
    const bv = b[sortKey] ?? 0;
    return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  const toggleSort = (key: keyof ZipData) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(key === "medDOM"); }
  };

  const handleSubscribe = async () => {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "price_1TmdHYGiR6EnAvzQc40cLOI0";
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      window.open("https://buy.stripe.com/test_3cs4iH1pyaNKe1m000", "_blank");
    }
  };

  const SortIcon = ({ col }: { col: keyof ZipData }) => (
    <span className="ml-1 opacity-50">{sortKey === col ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-[#e2e8f0]">
      {/* Header */}
      <header className="border-b border-[#1e2a45] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#06b6d4]">📊 Dashboard</h1>
            <p className="text-xs text-[#8b95a9]">Houston ZIP-level market data</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2 py-1 rounded bg-[#1a2035] text-[#f59e0b] border border-[#f59e0b]/30">
              {subscription === "free" ? "FREE TIER" : "PRO"}
            </span>
            <a
              href="/pricing"
              className="bg-[#06b6d4] text-[#0b0f1a] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#0891b2] transition"
            >
              Upgrade $39/mo
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Foreclosure Beta Banner */}
        <a
          href="/distressed"
          className="block mb-6 bg-gradient-to-r from-[#ef4444]/10 via-[#111827] to-[#06b6d4]/10 border border-[#ef4444]/30 hover:border-[#ef4444]/60 rounded-xl p-4 transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] mr-2">NEW</span>
              <span className="font-semibold text-sm">🏛️ 836 Live Foreclosure Filings</span>
              <p className="text-xs text-[#8b95a9] mt-1">
                Harris & Fort Bend County — owner names, loan amounts, market DOM — updated weekly
              </p>
            </div>
            <span className="text-[#06b6d4] text-sm font-semibold shrink-0">View →</span>
          </div>
        </a>

        {/* Live Status */}
        <div className="flex items-center gap-2 mb-6">
          <span className={`w-2 h-2 rounded-full ${usingLive ? 'bg-[#10b981] animate-pulse' : 'bg-[#f59e0b]'} `} />
          <span className="text-sm text-[#8b95a9]">
            {usingLive ? "Live data from RentCast API" : "Preliminary data (loading live...)"}
          </span>
          <span className="text-xs text-[#8b95a9] ml-auto">
            {usingLive ? `Updated ${new Date().toLocaleDateString()}` : "Snapshot: Jun 26, 2026"}
          </span>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="ZIP Codes Tracked"
            value={data.length.toString()}
            color="text-[#06b6d4]"
          />
          <MetricCard
            label="Fastest med DOM"
            value={data.length ? `${Math.min(...data.filter(d => d.medDOM).map(d => d.medDOM!))}d` : "—"}
            color="text-[#10b981]"
          />
          <MetricCard
            label="Highest Yield"
            value={data.length ? `${Math.max(...data.filter(d => d.grossYield).map(d => d.grossYield!))}%` : "—"}
            color="text-[#f59e0b]"
          />
          <MetricCard
            label="Lowest Entry Price"
            value={data.length ? `$${Math.min(...data.filter(d => d.medPrice).map(d => d.medPrice!)).toLocaleString()}` : "—"}
            color="text-[#8b5cf6]"
          />
        </div>

        {/* Main Table */}
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2a45] flex items-center justify-between">
            <h2 className="font-semibold text-sm">🔥 ZIP Code Market Rankings</h2>
            <input
              type="text"
              placeholder="Filter ZIP..."
              className="bg-[#0b0f1a] border border-[#1e2a45] rounded px-3 py-1.5 text-xs w-40 text-[#e2e8f0] placeholder-[#8b95a9]"
            />
          </div>
          {data.length === 0 ? (
            <div className="p-12 text-center text-[#8b95a9]">No data available</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e2a45] text-[#8b95a9] text-xs uppercase">
                    <Th onClick={() => toggleSort("zip")}>ZIP <SortIcon col="zip" /></Th>
                    <Th>Submarket</Th>
                    <Th onClick={() => toggleSort("medDOM")}>Med DOM <SortIcon col="medDOM" /></Th>
                    <Th onClick={() => toggleSort("medPrice")}>Med Price <SortIcon col="medPrice" /></Th>
                    <Th onClick={() => toggleSort("medPPS")}>$/sqft <SortIcon col="medPPS" /></Th>
                    <Th onClick={() => toggleSort("medRent")}>Med Rent <SortIcon col="medRent" /></Th>
                    <Th onClick={() => toggleSort("grossYield")}>
                      Gross Yield
                      <SortIcon col="grossYield" />
                    </Th>
                    <Th onClick={() => toggleSort("totalListings")}>
                      Listings
                      <SortIcon col="totalListings" />
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((z) => (
                    <tr
                      key={z.zip}
                      className="border-b border-[#1e2a45] hover:bg-[#1a2035]/50 transition"
                    >
                      <td className="px-4 py-3 font-semibold text-[#06b6d4]">{z.zip}</td>
                      <td className="px-4 py-3 text-[#8b95a9]">{z.submarket}</td>
                      <td className="px-4 py-3">
                        <span className={`font-mono ${z.medDOM && z.medDOM < 30 ? "text-[#10b981]" : z.medDOM && z.medDOM > 60 ? "text-[#ef4444]" : "text-[#e2e8f0]"}`}>
                          {z.medDOM ?? "—"}d
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {z.medPrice ? `$${z.medPrice.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-[#8b95a9]">
                        {z.medPPS ? `$${z.medPPS}` : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {z.medRent ? `$${z.medRent.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <span className="text-[#f59e0b]">{z.grossYield}%</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[#8b95a9]">
                        {z.totalListings?.toLocaleString() ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Freemium CTA */}
        {subscription === "free" && (
          <div className="mt-8 bg-gradient-to-r from-[#1a2035] to-[#0b0f1a] border border-[#06b6d4]/30 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">🔓 Unlock Full Data</h3>
            <p className="text-sm text-[#8b95a9] mb-4">
              Get gross yields, listing volumes, ZIP-to-ZIP comparisons, heat maps, and exportable reports.
            </p>
            <a
              href="/pricing"
              className="bg-[#06b6d4] text-[#0b0f1a] font-semibold px-6 py-3 rounded-lg hover:bg-[#0891b2] transition"
            >
              Subscribe — $39/mo
            </a>
          </div>
        )}

        {/* Data Source Footer */}
        <div className="mt-8 text-xs text-[#8b95a9] border-t border-[#1e2a45] pt-4 text-center">
          Data from <strong className="text-[#06b6d4]">RentCast API</strong> and{" "}
          <strong className="text-[#06b6d4]">Realtor.com Economic Research</strong>.
          Updated daily. Prices and DOM are for active listings only.
        </div>
      </main>
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-[#8b95a9] mt-1">{label}</div>
    </div>
  );
}

function Th({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <th
      className={`px-4 py-3 text-left font-medium ${onClick ? "cursor-pointer hover:text-[#06b6d4]" : ""}`}
      onClick={onClick}
    >
      {children}
    </th>
  );
}
