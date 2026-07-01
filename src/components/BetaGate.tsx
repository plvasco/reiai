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
  );
}
