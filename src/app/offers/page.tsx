"use client";

import { useState } from "react";
import Script from "next/script";

const FB_PIXEL_ID = "1491096296115165";

export default function OffersPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [timeline, setTimeline] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  // Meta Pixel base code (loaded once)
  const pixelScript = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${FB_PIXEL_ID}');
    fbq('track', 'PageView');`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !consent) return;
    setLoading(true);

    const ok = (() => {
      try {
        return fetch("/api/capture-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: `${phone.trim()}@sms.capture`,
            source: "offers-page",
            phone: phone.trim(),
            address: address.trim(),
            timeline,
            consent: true,
            consent_at: new Date().toISOString(),
          }),
        }).then((r) => r.ok);
      } catch {
        return Promise.resolve(false);
      }
    })();

    setSubmitted(true);
    setLoading(false);

    // Fire the SubmitLead conversion event after the lead is captured
    const captured = await ok.catch(() => false);
    if (captured && typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "SubmitLead", { currency: "USD", value: 0 });
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-[#111827] border border-[#1e2a45] rounded-xl p-8">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-[#e2e8f0] mb-2">Thanks, {name}!</h1>
          <p className="text-sm text-[#8b95a9] mb-6">
            We&apos;ll text you within 24 hours with your cash offer. 
            Watch for a message from (832) XXX-XXXX.
          </p>
          <p className="text-xs text-[#5a6577]">
            In a hurry? Call or text us directly at (832) XXX-XXXX.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4">
      {/* Meta Pixel load */}
      <Script id="meta-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: pixelScript }} />
      <div className="max-w-md w-full">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏠</div>
          <h1 className="text-xl font-bold text-[#e2e8f0]">
            Sell Your Houston House — Cash Offer
          </h1>
          <p className="text-sm text-[#8b95a9] mt-2">
            No repairs. No realtors. Close on your timeline.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[#8b95a9] block mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full name"
                className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2.5 text-sm text-[#e2e8f0] placeholder-[#5a6577] focus:outline-none focus:border-[#06b6d4]"
              />
            </div>

            <div>
              <label className="text-xs text-[#8b95a9] block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="(832) 555-1234"
                className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2.5 text-sm text-[#e2e8f0] placeholder-[#5a6577] focus:outline-none focus:border-[#06b6d4]"
              />
            </div>

            <div>
              <label className="text-xs text-[#8b95a9] block mb-1">Property Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="1234 Main St, Houston, TX 770XX"
                className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2.5 text-sm text-[#e2e8f0] placeholder-[#5a6577] focus:outline-none focus:border-[#06b6d4]"
              />
            </div>

            <div>
              <label className="text-xs text-[#8b95a9] block mb-1">Your Timeline</label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2.5 text-sm text-[#e2e8f0] focus:outline-none focus:border-[#06b6d4]"
              >
                <option value="">Select timing...</option>
                <option value="asap">ASAP — Need to sell now</option>
                <option value="1-3mo">1-3 months</option>
                <option value="3-6mo">3-6 months</option>
                <option value="exploring">Just exploring options</option>
              </select>
            </div>

            {/* TCPA Consent */}
            <div>
              <label className="flex items-start gap-2 text-xs text-[#8b95a9] cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 rounded border-[#1e2a45] bg-[#0b0f1a] accent-[#06b6d4] shrink-0"
                />
                <span>
                  By providing my phone number, I consent to receive calls and SMS
                  texts — including via autodialed technology — from JadeBuzz about
                  my property. Msg &amp; data rates may apply. Reply{" "}
                  <strong>STOP</strong> to opt out. I have read the{" "}
                  <a href="https://jadebuzz.com/privacy" className="text-[#06b6d4] underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim() || !phone.trim() || !address.trim() || !consent}
              className="w-full bg-[#06b6d4] text-[#0b0f1a] font-semibold px-4 py-3 rounded-lg text-sm hover:bg-[#0891b2] transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Get My Cash Offer"}
            </button>
          </form>

          <p className="text-xs text-[#5a6577] text-center mt-4">
            No obligation. No spam. We&apos;ll text you within 24 hours.
          </p>
        </div>

        {/* Trust Signals */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-[#5a6577]">
          <span>🔒 100% Confidential</span>
          <span>⚡ Cash in 7-14 Days</span>
          <span>📱 We Text, Not Spam</span>
        </div>
      </div>
    </div>
  );
}
