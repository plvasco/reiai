import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { Analytics } from "@vercel/analytics/next";
import { SubscriptionProvider } from "@/lib/SubscriptionContext";
import BetaGate from "@/components/BetaGate";

export const metadata: Metadata = {
  title: {
    default: "JadeBuzz Analytics — Houston RE Intelligence Dashboard | REI Deal Analysis",
    template: "%s | JadeBuzz Analytics",
  },
  description: "Houston residential real estate investing dashboard. Pull live ZIP-level market data, analyze multifamily & SFR deals, track distressed and off-market opportunities. Built for Texas investors.",
  keywords: [
    "Houston real estate investing",
    "REI deal dashboard",
    "Houston multifamily comps",
    "Houston market data",
    "real estate investment analysis tool",
    "Houston foreclosure data",
    "Texas real estate investor tools",
    "distressed property tracker Houston",
    "off-market real estate Houston",
    "REI deal analysis software",
  ],
  authors: [{ name: "JadeBuzz Analytics" }],
  creator: "JadeBuzz Analytics",
  publisher: "JadeBuzz Analytics",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "JadeBuzz Analytics",
    title: "JadeBuzz Analytics — Houston RE Intelligence Dashboard",
    description: "Live ZIP-level market data, property analysis, and deal finding for Houston real estate investors. Track distressed assets, analyze cap rates, and find off-market opportunities.",
    url: "https://www.jadebuzz.com",
    images: [
      {
        url: "https://www.jadebuzz.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "JadeBuzz Analytics — Houston RE Intelligence Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@VascoPietto",
    creator: "@VascoPietto",
    title: "JadeBuzz Analytics — Houston RE Intelligence Dashboard",
    description: "Live ZIP-level market data, property analysis, and deal finding for Houston real estate investors.",
    images: ["https://www.jadebuzz.com/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "facebook-domain-verification": "ugdw5lg3lg81j7ot50riofr7eb8hf1",
    "google-site-verification": "X1BhC1KWgt39v4dvT0hmWPaJBVz3phDVfsBHmyIGRzQ",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="facebook-domain-verification" content="ugdw5lg3lg81j7ot50riofr7eb8hf1" />
        <meta name="google-site-verification" content="X1BhC1KWgt39v4dvT0hmWPaJBVz3phDVfsBHmyIGRzQ" />
      </head>
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
