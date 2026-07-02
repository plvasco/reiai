import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston Heat Map — REI Market Data by ZIP Code | JadeBuzz Analytics",
  description: "Visual heat maps of Houston real estate market data by ZIP code. Compare median days on market, prices, rents, and gross yields across 30+ Houston submarkets.",
};

export default function HeatmapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
