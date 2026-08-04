"use client";

import Link from "next/link";

/**
 * JadeBuzz — marketing / landing page.
 * Served at jadebuzz.com root. Explains the products and drives
 * visitors to the right destination:
 *   - Investors  -> dashboard.jadebuzz.com  (REI Dashboard)
 *   - Developers -> api.jadebuzz.com        (Deal API)
 *   - Sellers    -> offers.jadebuzz.com     (Get a cash offer)
 */
export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-[#e2e8f0]">
      {/* Nav */}
      <header className="border-b border-[#1e2a45]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-lg font-bold tracking-tight">JadeBuzz Analytics</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-[#94a3b8]">
            <a href="https://dashboard.jadebuzz.com" className="hover:text-[#06b6d4]">Dashboard</a>
            <a href="https://api.jadebuzz.com/docs" className="hover:text-[#06b6d4]">API</a>
            <a href="https://offers.jadebuzz.com" className="hover:text-[#06b6d4]">Sell Your House</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-[#06b6d4] font-semibold tracking-widest text-xs uppercase mb-4">
          Houston Real Estate Intelligence
        </p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Find Distressed Deals Before<br />Your Competition Does
        </h1>
        <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto mb-10">
          JadeBuzz surfaces 229,000+ Houston properties, out-of-state owners,
          foreclosure filings, and real market trends — packaged for investors,
          developers, and home sellers.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://dashboard.jadebuzz.com"
            className="bg-[#06b6d4] text-[#0b0f1a] font-semibold px-8 py-3 rounded-lg hover:bg-[#0891b2] transition"
          >
            Explore the Dashboard →
          </a>
          <a
            href="https://offers.jadebuzz.com"
            className="bg-[#10b981] text-[#0b0f1a] font-semibold px-8 py-3 rounded-lg hover:bg-[#059669] transition"
          >
            Sell Your House — Cash Offer
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            ["229K+", "Properties Tracked"],
            ["32", "Houston ZIPs"],
            ["4,322", "Out-of-State Owner Flags"],
            ["54K", "Flip Candidates"],
          ].map(([num, label]) => (
            <div key={label} className="bg-[#111827] border border-[#1e2a45] rounded-xl p-6">
              <div className="text-3xl font-bold text-[#06b6d4]">{num}</div>
              <div className="text-sm text-[#94a3b8] mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Built for the Houston Market</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Dashboard */}
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-8">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Investor Dashboard</h3>
            <p className="text-[#94a3b8] text-sm mb-6">
              Browse distressed properties, ZIP market data, foreclosures, and growth
              signals. Built for Houston — not a national AVM.
            </p>
            <a href="https://dashboard.jadebuzz.com" className="text-[#06b6d4] font-semibold text-sm">
              For Investors →
            </a>
          </div>

          {/* API */}
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-8">
            <div className="text-3xl mb-4">🔌</div>
            <h3 className="text-xl font-bold mb-2">Deal Analysis API</h3>
            <p className="text-[#94a3b8] text-sm mb-6">
              Programmatic access to parcel data, comps, flip math, and lead scores.
              Query any Houston address and get a full deal analysis.
            </p>
            <a href="https://api.jadebuzz.com/docs" className="text-[#06b6d4] font-semibold text-sm">
              For Developers →
            </a>
          </div>

          {/* Seller */}
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-8">
            <div className="text-3xl mb-4">🏠</div>
            <h3 className="text-xl font-bold mb-2">Sell Your House</h3>
            <p className="text-[#94a3b8] text-sm mb-6">
              Own a house in Houston? Get a fair cash offer. No repairs, no realtors,
              close on your timeline.
            </p>
            <a href="https://offers.jadebuzz.com" className="text-[#10b981] font-semibold text-sm">
              Get a Cash Offer →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20 text-center">
        <div className="bg-[#111827] border border-[#1e2a45] rounded-2xl p-12">
          <h2 className="text-2xl font-bold mb-4">Get Started With JadeBuzz</h2>
          <p className="text-[#94a3b8] mb-8">
            Whether you're investing in Houston's distressed market or selling your
            property — we have the data and the tools.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://dashboard.jadebuzz.com" className="bg-[#06b6d4] text-[#0b0f1a] font-semibold px-8 py-3 rounded-lg hover:bg-[#0891b2] transition">
              Start Investing
            </a>
            <a href="https://offers.jadebuzz.com" className="bg-[#10b981] text-[#0b0f1a] font-semibold px-8 py-3 rounded-lg hover:bg-[#059669] transition">
              Sell Your House
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e2a45]">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-[#5a6577]">
          JadeBuzz Analytics · Houston, TX · jadebuzz.com
        </div>
      </footer>
    </main>
  );
}
