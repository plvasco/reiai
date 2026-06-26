"use client";

import { useState } from "react";

export default function AlertsPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [watchZips, setWatchZips] = useState<string[]>(["77003", "77020", "77033"]);

  const handleSubscribe = async () => {
    if (!email) return;
    setSubscribed(true);
  };

  const toggleZip = (zip: string) => {
    setWatchZips((prev) =>
      prev.includes(zip) ? prev.filter((z) => z !== zip) : [...prev, zip]
    );
  };

  const allZips = ["77003", "77004", "77011", "77012", "77020", "77026", "77033", "77051", "77041", "77040", "77009", "77044"];

  return (
    <main className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">🔔 Market Alerts</h1>
      <p className="text-sm text-[#8b95a9] mb-6">
        Get notified when key metrics change in your target ZIP codes.
      </p>

      {/* Email Signup */}
      <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-sm mb-3">📧 Email Notifications</h3>
        {subscribed ? (
          <div className="text-[#10b981] text-sm">✅ You&apos;re subscribed! We&apos;ll send alerts to <strong>{email}</strong></div>
        ) : (
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-4 py-2.5 text-sm text-[#e2e8f0] placeholder-[#8b95a9]"
            />
            <button
              onClick={handleSubscribe}
              className="bg-[#06b6d4] text-[#0b0f1a] font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-[#0891b2] transition"
            >
              Subscribe
            </button>
          </div>
        )}
      </div>

      {/* Watchlist */}
      <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-sm mb-3">📌 Watchlist Zips</h3>
        <p className="text-xs text-[#8b95a9] mb-3">Select ZIPs you want to monitor. We&apos;ll alert you on DOM drops, price changes, and yield shifts.</p>
        <div className="flex flex-wrap gap-2">
          {allZips.map((zip) => (
            <button
              key={zip}
              onClick={() => toggleZip(zip)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition ${
                watchZips.includes(zip)
                  ? "bg-[#06b6d4]/10 border-[#06b6d4] text-[#06b6d4]"
                  : "bg-[#0b0f1a] border-[#1e2a45] text-[#8b95a9] hover:text-[#e2e8f0]"
              }`}
            >
              {zip}
            </button>
          ))}
        </div>
        <div className="text-xs text-[#8b95a9] mt-3">{watchZips.length} ZIPs selected</div>
      </div>

      {/* Alert Type */}
      <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-3">⚡ Alert Triggers</h3>
        <div className="space-y-3 text-sm">
          {[
            { label: "DOM drops below 50d", desc: "Gentrification wave has arrived", zip: "77003" },
            { label: "DOM drops by 20% in one month", desc: "Velocity accelerating fast", zip: "77020" },
            { label: "New listings spike 50%+", desc: "Supply shock — potential opportunity", zip: "77033" },
            { label: "Price drops below $200K", desc: "Entry point opened", zip: "77026" },
          ].map((alert, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-[#1e2a45] last:border-0">
              <input type="checkbox" defaultChecked className="accent-[#06b6d4]" />
              <div className="flex-1">
                <div className="text-[#e2e8f0]">{alert.label}</div>
                <div className="text-xs text-[#8b95a9]">{alert.desc} — {alert.zip}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-[#8b95a9]">
          {subscribed
            ? "✅ Alerts are active. You'll get email notifications when triggers fire."
            : "🔒 Subscribe with your email above to activate alerts."}
        </div>
      </div>

      {/* Pro upsell */}
      <div className="mt-6 text-xs text-[#8b95a9] text-center border-t border-[#1e2a45] pt-4">
        Pro members get SMS alerts, unlimited watchlist slots, and daily DOM change summaries.
      </div>
    </main>
  );
}
