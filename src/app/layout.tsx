import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { SubscriptionProvider } from "@/lib/SubscriptionContext";

export const metadata: Metadata = {
  title: "Vasco Analytics — Houston RE Intelligence",
  description: "Live ZIP-level market data, property analysis, and deal finding for Houston real estate investors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0b0f1a] text-[#e2e8f0]">
        <SubscriptionProvider>
          <Nav />
          {children}
        </SubscriptionProvider>
      </body>
    </html>
  );
}
