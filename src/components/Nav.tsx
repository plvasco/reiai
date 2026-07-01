"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Nav() {
  const path = usePathname();
  const [showFeedback, setShowFeedback] = useState(false);
  const [fbName, setFbName] = useState("");
  const [fbEmail, setFbEmail] = useState("");
  const [fbMessage, setFbMessage] = useState("");
  const [fbType, setFbType] = useState("bug");
  const [fbSent, setFbSent] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("jadebuzz_email") || localStorage.getItem("vasco_email") || "";
    setFbEmail(stored);
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbMessage.trim()) return;
    setFbLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fbName || "Anonymous",
          email: fbEmail || "anonymous@beta.com",
          type: fbType,
          message: fbMessage,
        }),
      });
      setFbSent(true);
    } catch {}
    setFbLoading(false);
  };

  const links = [
    { href: "/", label: "Dashboard", icon: "📊" },
    { href: "/lookup", label: "Lookup", icon: "🔍" },
    { href: "/calculator", label: "Calculator", icon: "🧮" },
    { href: "/filter", label: "Filter", icon: "🎯" },
    { href: "/growth", label: "Growth", icon: "📈" },
    { href: "/expansion", label: "Signals", icon: "📡" },
    { href: "/distressed", label: "Distressed", icon: "🎯" },
    { href: "/gentrification", label: "Gentrification", icon: "⏰" },
    { href: "/heatmap", label: "Heat Map", icon: "🗺️" },
    { href: "/alerts", label: "Alerts", icon: "🔔" },
  ];

  return (
    <>
      <nav className="border-b border-[#1e2a45] bg-[#0b0f1a]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <Link href="/" className="text-[#06b6d4] font-bold text-sm">JadeBuzz Analytics</Link>
          <div className="flex gap-1 overflow-x-auto items-center">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition ${
                  path === l.href
                    ? "bg-[#06b6d4]/10 text-[#06b6d4]"
                    : "text-[#8b95a9] hover:text-[#e2e8f0]"
                }`}
              >
                {l.icon} {l.label}
              </Link>
            ))}
            <button
              onClick={() => setShowFeedback(true)}
              className="ml-2 px-3 py-1.5 rounded-lg text-xs bg-[#f59e0b]/10 text-[#f59e0b] hover:bg-[#f59e0b]/20 transition whitespace-nowrap"
            >
              💬 Feedback
            </button>
          </div>
        </div>
      </nav>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4">
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">💬 Send Feedback</h3>
              <button onClick={() => { setShowFeedback(false); setFbSent(false); }} className="text-[#8b95a9] hover:text-[#e2e8f0] text-lg">✕</button>
            </div>

            {fbSent ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">🙏</div>
                <p className="text-sm text-[#e2e8f0]">Thanks for the feedback!</p>
                <p className="text-xs text-[#8b95a9] mt-1">It goes directly to the founder.</p>
                <button
                  onClick={() => { setShowFeedback(false); setFbSent(false); setFbMessage(""); }}
                  className="mt-4 text-[#06b6d4] text-sm hover:underline"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <div>
                  <label className="text-xs text-[#8b95a9] block mb-1">Type</label>
                  <select
                    value={fbType}
                    onChange={(e) => setFbType(e.target.value)}
                    className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0]"
                  >
                    <option value="bug">🐛 Bug report</option>
                    <option value="feature">💡 Feature request</option>
                    <option value="data">📊 Data issue</option>
                    <option value="general">💬 General feedback</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#8b95a9] block mb-1">Your name (optional)</label>
                  <input
                    type="text"
                    value={fbName}
                    onChange={(e) => setFbName(e.target.value)}
                    placeholder="Name"
                    className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0] placeholder-[#8b95a9]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8b95a9] block mb-1">Your email</label>
                  <input
                    type="email"
                    value={fbEmail}
                    onChange={(e) => setFbEmail(e.target.value)}
                    placeholder="email"
                    required
                    className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0] placeholder-[#8b95a9]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8b95a9] block mb-1">Message</label>
                  <textarea
                    value={fbMessage}
                    onChange={(e) => setFbMessage(e.target.value)}
                    placeholder="What's working? What's missing? What broke?"
                    required
                    rows={4}
                    className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0] placeholder-[#8b95a9] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={fbLoading || !fbMessage.trim()}
                  className="w-full bg-[#06b6d4] text-[#0b0f1a] font-semibold py-2.5 rounded-lg text-sm hover:bg-[#0891b2] transition disabled:opacity-50"
                >
                  {fbLoading ? "Sending..." : "Send Feedback"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
