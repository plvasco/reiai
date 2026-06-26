import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Houston RE Intelligence — Vasco Analytics",
  description: "Live ZIP-level market data for Houston real estate investors. DOM, prices, yields, and trends.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
