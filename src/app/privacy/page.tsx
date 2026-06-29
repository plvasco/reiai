"use client";

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-[#8b95a9] mb-6">Last updated: June 29, 2026</p>

      <div className="space-y-6 text-sm text-[#e2e8f0] leading-relaxed">
        <section>
          <h2 className="font-semibold text-base mb-2">1. Information We Collect</h2>
          <p className="text-[#8b95a9]">
            When you use JadeBuzz Analytics, we collect:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-[#8b95a9]">
            <li>Email address (if you subscribe or request beta access)</li>
            <li>ZIP codes and property addresses you search for</li>
            <li>Anonymous usage data via Vercel Analytics (page views, referrer, browser type, country)</li>
            <li>Stripe payment data (handled entirely by Stripe — we never see your payment details)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">2. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1 text-[#8b95a9]">
            <li>To provide market data, foreclosure filings, and property analysis</li>
            <li>To improve our products and user experience</li>
            <li>To send occasional product updates (opt-out anytime)</li>
            <li>We never sell your personal data to third parties</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">3. Data Sources</h2>
          <p className="text-[#8b95a9]">
            Our foreclosure and market data comes from public county clerk records
            (Harris County, Fort Bend County), RentCast API, and Realtor.com Economic Research.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">4. Data Retention</h2>
          <p className="text-[#8b95a9]">
            We retain your personal data only as long as necessary to provide our service.
            You may request deletion at any time.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">5. Contact</h2>
          <p className="text-[#8b95a9]">
            Questions? Email us at pietto.vasco@gmail.com
          </p>
        </section>
      </div>
    </main>
  );
}
