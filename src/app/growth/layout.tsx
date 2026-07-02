import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston REI Growth Scores — Gentrification Signals & Market Timing | JadeBuzz Analytics",
  description: "Identify which Houston neighborhoods are heating up before prices spike. Growth potential scores and gentrification timing for 30+ Houston ZIP codes.",
};

export default function GrowthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
