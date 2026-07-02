import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — JadeBuzz Analytics | Houston REI Dashboard Plans",
  description: "Free and Pro plans for Houston real estate investors. Pro at $39/mo unlocks live foreclosures, deal calculator, gross yields, and unlimited address lookups.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
