"use client";

import { useState, useEffect } from "react";

// ── Types ───────────────────────────────────────────────────────────────

interface ForeclosureRecord {
  doc_id: string;
  county: string;
  sale_date: string;
  file_date: string;
  property_address: string | null;
  trustee: string | null;
  owner_name: string | null;
  loan_amount: string | null;
  pages: number;
  source: string;
}

interface ApiResponse {
  data: ForeclosureRecord[];
  total: number;
  count: number;
}

const COUNTIES = [
  { value: "all", label: "All Counties" },
  { value: "harris", label: "Harris" },
  { value: "fort bend", label: "Fort Bend" },
];

// ── Component ───────────────────────────────────────────────────────────

export default function DistressedPage() {
  const [records, setRecords] = useState<ForeclosureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filterCounty, setFilterCounty] = useState("all");
  const [filterZip, setFilterZip] = useState("");

  useEffect(() => {
    fetchData();
  }, [filterCounty]);

  async function fetchData() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (filterCounty !== "all") params.set("county", filterCounty);
      if (filterZip) params.set("zip", filterZip);

      const res = await fetch(`/api/foreclosure-search?${params}`);
      const json: ApiResponse = await res.json();
      setRecords(json.data);
      setTotal(json.total);
    } catch (e) {
      console.error("Failed to fetch:", e);
    }
    setLoading(false);
  }

  const filtered = filterZip
    ? records.filter((r) => r.property_address?.toLowerCase().includes(filterZip.toLowerCase()))
    : records;

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">🏛️ Foreclosure Filings</h1>
        <span className="text-xs bg-[#06b6d4]/20 text-[#06b6d4] px-3 py-1 rounded-full font-semibold">
          {total} active filings
        </span>
      </div>
      <p className="text-sm text-[#8b95a9] mb-6">
        Live trustee sale notices from Harris and Fort Bend County Clerk records.
        Updated weekly via Hermes automated pipeline.
      </p>

      {/* Filters */}
      <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={filterCounty}
            onChange={(e) => setFilterCounty(e.target.value)}
            className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0]"
          >
            {COUNTIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="ZIP or address..."
            value={filterZip}
            onChange={(e) => setFilterZip(e.target.value)}
            className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm w-48 text-[#e2e8f0] placeholder-[#8b95a9]"
          />
          <button
            onClick={fetchData}
            className="bg-[#06b6d4] text-[#0b0f1a] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#0891b2] transition ml-auto"
          >
            {loading ? "Loading..." : "🔄 Refresh"}
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-10 text-center text-[#8b95a9] text-sm">
          Loading foreclosure data...
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.doc_id}
              className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 hover:border-[#06b6d4]/30 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{r.county === "Fort Bend" ? "🏠" : "📋"}</span>
                  <div>
                    <span className="font-bold text-[#e2e8f0]">
                      {r.property_address || "Address not yet extracted"}
                    </span>
                    <span className="text-xs text-[#8b95a9] ml-2">
                      {r.county} County
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs bg-[#ef4444]/20 text-[#ef4444] px-2 py-0.5 rounded">
                    {r.sale_date ? `Sale: ${r.sale_date}` : "No sale date"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm mb-3">
                {r.owner_name && (
                  <div>
                    <div className="text-xs text-[#8b95a9]">Owner</div>
                    <div className="font-bold text-[#e2e8f0]">{r.owner_name}</div>
                  </div>
                )}
                {r.loan_amount && (
                  <div>
                    <div className="text-xs text-[#8b95a9]">Loan Amount</div>
                    <div className="font-bold text-[#f59e0b]">
                      ${parseInt(r.loan_amount).toLocaleString()}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-[#8b95a9]">Filed</div>
                  <div className="font-bold">{r.file_date || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">Doc ID</div>
                  <div className="font-bold text-xs text-[#8b95a9]">{r.doc_id}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">Pages</div>
                  <div className="font-bold">{r.pages}</div>
                </div>
              </div>

              {r.trustee && (
                <div className="mt-3 pt-3 border-t border-[#1e2a45] text-xs text-[#8b95a9]">
                  Trustee: {r.trustee}
                </div>
              )}

              <div className="mt-2 text-xs text-[#8b95a9]">
                Source: {r.source} | Doc: {r.doc_id}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-10 text-center text-[#8b95a9] text-sm">
              No foreclosure filings match your filters.
            </div>
          )}
        </div>
      )}

      {/* Methodology */}
      <div className="mt-6 bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-2">📊 About This Data</h3>
        <div className="text-xs text-[#8b95a9] space-y-1">
          <p>
            <strong>Sources:</strong> Harris County Clerk Portal (cclerk.hctx.net) and
            Fort Bend County monthly foreclosure PDF.
          </p>
          <p>
            <strong>Update Frequency:</strong> Weekly — every Wednesday at 9 AM CT.
          </p>
          <p>
            <strong>Coverage:</strong> Harris County (706 filings, June 2026) and
            Fort Bend County (96 filings, June–July 2026). Adding more counties.
          </p>
          <p>
            <strong>Data Quality:</strong> Fort Bend records include owner names and
            loan amounts. Harris records need OCR extraction for those fields.
          </p>
          <p>
            <strong>Pipeline:</strong> Automated via Hermes MCP server at
            ~/houston-foreclosure-mcp/.
          </p>
        </div>
      </div>
    </main>
  );
}
