"use client";

import { useState, useEffect } from "react";

export default function BetaGate({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"landing" | "dashboard">("landing");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already accessed in this session
    const authed = sessionStorage.getItem("jadebuzz_access");

    // Public pages that bypass the gate
    const publicPaths = ["/pricing", "/privacy", "/terms", "/deletion"];
    const isPublic = publicPaths.includes(window.location.pathname);

    if (authed === "true" || isPublic) setStep("dashboard");
  }, []);

  function handleGetAccess(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);

    // Store email for future reference + capture lead
    localStorage.setItem("jadebuzz_email", email.trim());
    if (name.trim()) localStorage.setItem("jadebuzz_name", name.trim());

    // Fire-and-forget: send email to a webhook or mailto
    fetch("/api/capture-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), name: name.trim(), source: "landing-page" }),
    }).catch(() => {});

    // Grant access
    sessionStorage.setItem("jadebuzz_access", "true");
    setLoading(false);
    setStep("dashboard");
  }

  if (step === "dashboard") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🏛️</div>
          <h1 className="text-2xl font-bold text-[#e2e8f0]">
            Houston RE Intelligence
          </h1>
          <p className="text-[#8b95a9] text-sm mt-2 max-w-sm mx-auto">
            Live ZIP-level market data, foreclosure filings, deal analysis, and
            growth scoring — built for Houston investors.
          </p>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { icon: "🔥", label: "30+ ZIPs Tracked", desc: "med DOM, prices, rents, yields" },
            { icon: "🏛️", label: "836+ Foreclosures", desc: "live Harris & Fort Bend filings" },
            { icon: "📊", label: "Deal Calculator", desc: "cap rate, DSCR, cash flow" },
            { icon: "📈", label: "Growth Scores", desc: "gentrification timing & signals" },
          ].map((item, i) => (
            <div key={i} className="bg-[#111827] border border-[#1e2a45] rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-xs font-semibold text-[#e2e8f0]">{item.label}</div>
              <div className="text-[10px] text-[#8b95a9] mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Email Capture */}
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-6">
          <h2 className="font-semibold text-[#e2e8f0] mb-1">
            Get Free Access
          </h2>
          <p className="text-xs text-[#8b95a9] mb-5">
            Enter your email to start evaluating Houston deals immediately.
          </p>

          <form onSubmit={handleGetAccess} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2.5 text-sm text-[#e2e8f0] placeholder-[#8b95a9] focus:outline-none focus:border-[#06b6d4]"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2.5 text-sm text-[#e2e8f0] placeholder-[#8b95a9] focus:outline-none focus:border-[#06b6d4]"
            />
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-[#06b6d4] text-[#0b0f1a] font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-[#0891b2] transition disabled:opacity-50"
            >
              {loading ? "One moment..." : "Access Dashboard — Free"}
            </button>
          </form>

          <p className="text-xs text-[#5a6577] text-center mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-[#5a6577]">
          <span>📍 Houston, TX</span>
          <span>⚡ Updated weekly</span>
          <span>🔒 Your data is private</span>
        </div>

        {/* Footer */}
        <p className="text-xs text-[#5a6577] text-center mt-6">
          JadeBuzz Analytics — Beta v0.1 ·{" "}
          <a href="/privacy" className="text-[#8b95a9] hover:underline">
            Privacy
          </a>{" "}
          ·{" "}
          <a href="/terms" className="text-[#8b95a9] hover:underline">
            Terms
          </a>
        </p>
      </div>
    </div>

    {/* SEO Body Content — Indexable, keyword-rich */}
    <div className="bg-[#0b0f1a] border-t border-[#1e2a45] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-[#e2e8f0] text-center mb-8">
          Houston Real Estate Investing Dashboard
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5">
            <h3 className="font-semibold text-[#06b6d4] text-sm mb-2">📊 ZIP Market Intelligence</h3>
            <p className="text-xs text-[#8b95a9] leading-relaxed">
              Track 30+ Houston ZIP codes by median days on market, median price, price per sq ft, 
              median rent, gross yield, and active listings. Sort, filter, and compare submarkets 
              to find the best investment opportunities in Katy, Sugar Land, Pearland, The Woodlands, 
              and inner-loop Houston.
            </p>
          </div>
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5">
            <h3 className="font-semibold text-[#06b6d4] text-sm mb-2">🏛️ Live Foreclosure Filings</h3>
            <p className="text-xs text-[#8b95a9] leading-relaxed">
              Access 836+ live foreclosure filings across Harris County and Fort Bend County. 
              Filter by ZIP code, view owner names, loan amounts, and estimated market values. 
              Updated weekly from county clerk records — catch distressed deals before they hit the MLS.
            </p>
          </div>
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5">
            <h3 className="font-semibold text-[#06b6d4] text-sm mb-2">🧮 Deal Analysis Calculator</h3>
            <p className="text-xs text-[#8b95a9] leading-relaxed">
              Run the numbers on any Houston property. Calculate cap rates, cash-on-cash returns, 
              DSCR, pro forma cash flow, and BRRRR potential. Pre-populated with local market 
              data — no more guessing expenses from national averages.
            </p>
          </div>
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5">
            <h3 className="font-semibold text-[#06b6d4] text-sm mb-2">📈 Growth & Gentrification Signals</h3>
            <p className="text-xs text-[#8b95a9] leading-relaxed">
              Identify which Houston submarkets are heating up before prices reflect it. 
              Our growth potential scores and gentrification clock surface neighborhoods with 
              improving demographics, new infrastructure, and rising rents — so you can buy 
              before the spike, not after.
            </p>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-[#e2e8f0] text-sm mb-3">Built for Houston — Unlike the Others</h3>
          <div className="text-xs text-[#8b95a9] space-y-2">
            <p>PropStream and DealMachine are built for national markets. Texas is a non-disclosure state — sale prices aren&apos;t public record, so their automated valuations are unreliable here.</p>
            <p>JadeBuzz gives you Houston-specific data: MUD tax calculations, parcel-level flood risk, community-verified comps, and deed restriction awareness that no national tool provides.</p>
            <p>If you&apos;re investing in Houston, use a tool built for Houston.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-center text-[#e2e8f0] mb-4">Frequently Asked Questions</h3>
          {[
            { q: "How is the data updated?", a: "ZIP market data is pulled live from the RentCast API. Foreclosure filings are scraped from Harris County and Fort Bend County clerk records, updated weekly every Wednesday." },
            { q: "What makes this different from BiggerPockets or PropStream?", a: "BiggerPockets is a generic calculator. PropStream is national. JadeBuzz is Houston-specific — we surface MUD taxes, flood risk, and community-verified comps that no national tool provides." },
            { q: "Who is this for?", a: "Houston fix-and-flip investors, buy-and-hold landlords, wholesalers, and small multifamily investors who need accurate local data without paying for national tools that don't work well in Texas." },
            { q: "Can I cancel anytime?", a: "Yes. Cancel from your Stripe dashboard. No contracts, no lock-in." },
          ].map((faq, i) => (
            <details key={i} className="bg-[#111827] border border-[#1e2a45] rounded-lg">
              <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-[#e2e8f0]">{faq.q}</summary>
              <p className="px-4 pb-3 text-sm text-[#8b95a9]">{faq.a}</p>
            </details>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs text-[#5a6577] text-center mt-10">
          JadeBuzz Analytics — Beta v0.1 · Data updated weekly · Houston, TX
        </p>
      </div>
    </div>
  );
}
