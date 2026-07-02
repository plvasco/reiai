import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston REI Deal Calculator — Cap Rate, DSCR, Cash Flow | JadeBuzz Analytics",
  description: "Free real estate deal calculator for Houston investors. Calculate cap rates, cash-on-cash returns, DSCR, and pro forma cash flow with pre-populated local market data.",
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
