"use client";

export default function PricingPage() {
  const handleSubscribe = async (priceId: string) => {
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

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-[#8b95a9] text-sm">
          The only Houston RE tool with live data, growth scoring, and gentrification timing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Free */}
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-1">Free</h2>
          <p className="text-sm text-[#8b95a9] mb-4">Get started with market data</p>
          <div className="text-3xl font-bold mb-6">$0</div>
          <ul className="space-y-2 text-sm flex-1">
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> ZIP DOM rankings</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Median price & rent data</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Growth potential scores</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Gentrification clock</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Deal filter</li>
            <li className="flex items-center gap-2"><span className="text-[#8b95a9]">✗</span> Deal calculator</li>
            <li className="flex items-center gap-2"><span className="text-[#8b95a9]">✗</span> Gross yield column</li>
            <li className="flex items-center gap-2"><span className="text-[#8b95a9]">✗</span> Export reports</li>
          </ul>
          <div className="mt-6 text-center text-sm text-[#8b95a9] border-t border-[#1e2a45] pt-4">
            Current plan
          </div>
        </div>

        {/* Pro */}
        <div className="bg-gradient-to-b from-[#1a2035] to-[#111827] border border-[#06b6d4]/40 rounded-xl p-6 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#06b6d4] text-[#0b0f1a] text-xs font-bold px-3 py-1 rounded-full">
            BEST VALUE
          </div>
          <h2 className="text-lg font-bold mb-1">Pro</h2>
          <p className="text-sm text-[#8b95a9] mb-4">Full deal analysis toolkit</p>
          <div className="text-3xl font-bold mb-2">$39</div>
          <div className="text-sm text-[#8b95a9] mb-6">per month</div>
          <ul className="space-y-2 text-sm flex-1">
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Everything in Free</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Deal calculator (cash flow, ROI, cap rate, DSCR)</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Gross yield & listing columns</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Property comps & deal scores</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Exportable PDF reports</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Unlimited address lookups</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> SMS market alerts</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Portfolio watchlist</li>
          </ul>
          <button
            onClick={() => handleSubscribe("price_1TmdHYGiR6EnAvzQc40cLOI0")}
            className="w-full bg-[#06b6d4] text-[#0b0f1a] font-semibold py-3 rounded-lg text-sm hover:bg-[#0891b2] transition mt-6"
          >
            Subscribe Now
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10 max-w-xl mx-auto space-y-3">
        <h3 className="font-semibold text-sm text-center mb-4">FAQ</h3>
        {[
          { q: "How is the data updated?", a: "RentCast API pulls live active listing data. Updated every time you load the page." },
          { q: "Can I cancel anytime?", a: "Yes. Cancel from your Stripe dashboard. No contracts." },
          { q: "Is this only for Houston?", a: "Yes — currently Houston-only with 30+ ZIPs. More cities coming based on demand." },
          { q: "What makes this different from BiggerPockets?", a: "BP is a generic calculator. We give you market-level intelligence — which ZIPs are heating up, where to buy before prices spike." },
        ].map((faq, i) => (
          <details key={i} className="bg-[#111827] border border-[#1e2a45] rounded-lg">
            <summary className="px-4 py-3 cursor-pointer text-sm font-medium">{faq.q}</summary>
            <p className="px-4 pb-3 text-sm text-[#8b95a9]">{faq.a}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
