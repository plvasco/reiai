"use client";

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-[#8b95a9] mb-6">Last updated: June 29, 2026</p>

      <div className="space-y-6 text-sm text-[#e2e8f0] leading-relaxed">
        <section>
          <h2 className="font-semibold text-base mb-2">1. Acceptance of Terms</h2>
          <p className="text-[#8b95a9]">
            By using JadeBuzz Analytics, you agree to these Terms of Service.
            If you do not agree, do not use the service.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">2. Service Description</h2>
          <p className="text-[#8b95a9]">
            JadeBuzz Analytics provides Houston real estate market data, foreclosure filings,
            and property analysis tools. Data is sourced from public records and third-party APIs.
            We strive for accuracy but do not guarantee completeness or timeliness.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">3. Not Financial Advice</h2>
          <p className="text-[#8b95a9]">
            The data and analysis provided are for informational purposes only.
            They do not constitute financial, legal, or investment advice.
            Always conduct your own due diligence before making real estate decisions.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">4. User Accounts</h2>
          <p className="text-[#8b95a9]">
            You are responsible for maintaining the confidentiality of your beta access password.
            Accounts are for individual use only.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">5. Limitation of Liability</h2>
          <p className="text-[#8b95a9]">
            JadeBuzz Analytics is provided "as is" without warranties of any kind.
            We are not liable for any damages arising from your use of the service.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">6. Changes</h2>
          <p className="text-[#8b95a9]">
            We reserve the right to update these terms at any time. Users will be notified
            of material changes via email or in-app notice.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">7. Contact</h2>
          <p className="text-[#8b95a9]">
            Questions? Email us at pietto.vasco@gmail.com
          </p>
        </section>
      </div>
    </main>
  );
}
