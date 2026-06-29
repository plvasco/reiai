import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import BetaGate from "@/components/BetaGate";
import { Analytics } from "@vercel/analytics/next";
import { SubscriptionProvider } from "@/lib/SubscriptionContext";

export const metadata: Metadata = {
  title: "JadeBuzz Analytics — Houston RE Intelligence",
  description: "Live ZIP-level market data, property analysis, and deal finding for Houston real estate investors.",
  other: {
    "facebook-domain-verification": "ugdw5lg3lg81j7ot50riofr7eb8hf1",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0b0f1a] text-[#e2e8f0]">
        <BetaGate>
          <SubscriptionProvider>
            <Nav />
            {children}
          </SubscriptionProvider>
        </BetaGate>
        <Analytics />
      </body>
    </html>
  );
}
