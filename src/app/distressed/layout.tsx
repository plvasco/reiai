import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston Foreclosure Filings — Live Harris & Fort Bend County Data",
  description: "Browse 836+ live foreclosure filings across Harris County and Fort Bend County. Filter by ZIP, view owner names, loan amounts, and market days-on-market data. Updated weekly.",
  openGraph: {
    title: "Live Houston Foreclosure Filings | JadeBuzz Analytics",
    description: "836+ active foreclosure filings across Harris & Fort Bend County. Updated weekly.",
  },
};

export default function DistressedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
