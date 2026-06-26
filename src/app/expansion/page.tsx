"use client";

import { useState } from "react";
import { EXPANSION_SIGNALS, ExpansionSignal } from "@/lib/expansion-signals";

const TYPE_ICONS: Record<string, string> = {
  subdivision: "🏗️",
  commercial: "🏢",
  infrastructure: "🛣️",
  employer: "🏥",
  rezoning: "📐",
  "permitsurge": "📊",
};

const TYPE_LABELS: Record<string, string> = {
  subdivision: "New Subdivision",
  commercial: "Commercial Development",
  infrastructure: "Infrastructure",
  employer: "Major Employer",
  rezoning: "Rezoning / Infill",
  "permitsurge": "Permit Surge",
};

const STATUS_COLORS: Record<string, string> = {
  "under-construction": "bg-[#06b6d4] text-[#0b0f1a]",
  "planned": "bg-[#f59e0b] text-[#0b0f1a]",
  "approved": "bg-[#8b5cf6] text-white",
  "completed": "bg-[#10b981] text-[#0b0f1a]",
};

export default function ExpansionPage() {
  const [filterZip, setFilterZip] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterImpact, setFilterImpact] = useState("all");

  const filtered = EXPANSION_SIGNALS.filter((s: ExpansionSignal) => {
    if (filterZip && !s.zip.includes(filterZip)) return false;
    if (filterType !== "all" && s.type !== filterType) return false;
    if (filterImpact !== "all" && s.impact !== filterImpact) return false;
    return true;
  }).sort((a: ExpansionSignal, b: ExpansionSignal) => {
    const impactOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    const aImp = impactOrder[a.impact] || 0;
    const bImp = impactOrder[b.impact] || 0;
    if (aImp !== bImp) return aImp - bImp;
    return 0;
  });

  const totalInvestment = EXPANSION_SIGNALS
    .filter((s: ExpansionSignal) => s.investment)
    .reduce((sum: number, s: ExpansionSignal) => {
      const match = s.investment?.match(/[\d.]+/);
      const val = match ? parseFloat(match[0]) : 0;
      const mult = s.investment?.includes("B") ? 1000 : 1;
      return sum + val * mult;
    }, 0);

  const totalJobs = EXPANSION_SIGNALS
    .filter((s: ExpansionSignal) => s.jobs)
    .reduce((sum: number, s: ExpansionSignal) => sum + (s.jobs || 0), 0);

  const totalUnits = EXPANSION_SIGNALS
    .filter((s: ExpansionSignal) => s.units)
    .reduce((sum: number, s: ExpansionSignal) => sum + (s.units || 0), 0);

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">📡 Expansion Signals</h1>
      <p className="text-sm text-[#8b95a9] mb-6">
        Track development activity that predicts future demand — subdivisions, commercial projects, infrastructure, and major employers coming to Houston.
      </p>

      {/* Key Impact Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#06b6d4]">{EXPANSION_SIGNALS.length}</div>
          <div className="text-xs text-[#8b95a9]">Active Signals</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#10b981]">${totalInvestment.toFixed(0)}M+</div>
          <div className="text-xs text-[#8b95a9]">Total Investment</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#f59e0b]">{totalJobs.toLocaleString()}+</div>
          <div className="text-xs text-[#8b95a9]">New Jobs</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#8b5cf6]">{(totalUnits / 1000).toFixed(1)}K+</div>
          <div className="text-xs text-[#8b95a9]">New Housing Units</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Filter by ZIP..."
          value={filterZip}
          onChange={(e) => setFilterZip(e.target.value)}
          className="bg-[#111827] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm w-28 text-[#e2e8f0] placeholder-[#8b95a9]"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-[#111827] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0]"
        >
          <option value="all">All Types</option>
          <option value="subdivision">Subdivisions</option>
          <option value="commercial">Commercial</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="employer">Employers</option>
          <option value="rezoning">Rezoning</option>
          <option value="permitsurge">Permit Surges</option>
        </select>
        <select
          value={filterImpact}
          onChange={(e) => setFilterImpact(e.target.value)}
          className="bg-[#111827] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0]"
        >
          <option value="all">All Impact</option>
          <option value="high">High Impact</option>
          <option value="medium">Medium Impact</option>
          <option value="low">Low Impact</option>
        </select>
      </div>

      {/* Signal Cards */}
      <div className="space-y-3">
        {filtered.map((signal: ExpansionSignal) => (
          <div
            key={signal.id}
            className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 hover:border-[#06b6d4]/30 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{TYPE_ICONS[signal.type]}</span>
                <div>
                  <span className="font-bold text-[#e2e8f0]">{signal.title}</span>
                  <span className="text-xs text-[#8b95a9] ml-2">{TYPE_LABELS[signal.type]}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[signal.status] || "bg-[#1a2035] text-[#8b95a9]"}`}>
                  {signal.status === "under-construction" ? "Under Construction" : signal.status}
                </span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  signal.impact === "high" ? "bg-[#ef4444]/20 text-[#ef4444]" :
                  signal.impact === "medium" ? "bg-[#f59e0b]/20 text-[#f59e0b]" :
                  "bg-[#8b95a9]/20 text-[#8b95a9]"
                }`}>
                  {signal.impact}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#8b95a9] mb-3">{signal.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
              <div>
                <span className="text-[#8b95a9]">📍 ZIP:</span>{" "}
                <strong className="text-[#06b6d4]">{signal.zip}</strong>
                <span className="text-[#8b95a9]"> {signal.submarket}</span>
              </div>
              <div>
                <span className="text-[#8b95a9]">⏱️ Target:</span>{" "}
                <strong>{signal.estimatedCompletion}</strong>
              </div>
              {signal.investment && (
                <div>
                  <span className="text-[#8b95a9]">💰 Investment:</span>{" "}
                  <strong className="text-[#10b981]">{signal.investment}</strong>
                </div>
              )}
              {signal.jobs && (
                <div>
                  <span className="text-[#8b95a9]">👥 New Jobs:</span>{" "}
                  <strong>{signal.jobs.toLocaleString()}</strong>
                </div>
              )}
            </div>

            <details className="mt-2">
              <summary className="text-xs text-[#06b6d4] cursor-pointer">View analysis →</summary>
              <div className="mt-2 text-sm text-[#8b95a9] leading-relaxed border-t border-[#1e2a45] pt-3">
                <p>{signal.details}</p>
                <p className="text-xs text-[#8b95a9] mt-2">Source: {signal.source}</p>
              </div>
            </details>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-10 text-center text-[#8b95a9] text-sm">
            No signals match your filters. Try a broader search.
          </div>
        )}
      </div>

      {/* Methodology */}
      <div className="mt-8 bg-[#111827] border border-[#1e2a45] rounded-xl p-5 text-xs text-[#8b95a9]">
        <strong className="text-[#e2e8f0]">📋 Methodology</strong>
        <p className="mt-1">
          Expansion signals are tracked from public sources: City of Houston building permits, TxDOT project pages, Houston Business Journal, Texas Medical Center announcements, Port Houston authority, county commissioner precincts, and developer press releases. Each signal is verified against at least one public source before inclusion. Updated as new projects are announced.
        </p>
        <p className="mt-1">
          Impact ratings: <strong className="text-[#ef4444]">High</strong> = $500M+ investment or 2,000+ jobs or 1,000+ residential units. <strong className="text-[#f59e0b]">Medium</strong> = $50M-$500M or significant area impact. <strong className="text-[#8b95a9]">Low</strong> = Early stage or small scale.
        </p>
      </div>
    </main>
  );
}
