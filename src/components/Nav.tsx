"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const path = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: "📊" },
    { href: "/lookup", label: "Lookup", icon: "🔍" },
    { href: "/calculator", label: "Calculator", icon: "🧮" },
    { href: "/filter", label: "Filter", icon: "🎯" },
    { href: "/growth", label: "Growth", icon: "📈" },
    { href: "/expansion", label: "Signals", icon: "📡" },
    { href: "/distressed", label: "Distressed", icon: "🎯" },
    { href: "/gentrification", label: "Gentrification", icon: "⏰" },
    { href: "/heatmap", label: "Heat Map", icon: "🗺️" },
    { href: "/alerts", label: "Alerts", icon: "🔔" },
  ];

  return (
    <nav className="border-b border-[#1e2a45] bg-[#0b0f1a]/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <Link href="/" className="text-[#06b6d4] font-bold text-sm">Vasco Analytics</Link>
        <div className="flex gap-1 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition ${
                path === l.href
                  ? "bg-[#06b6d4]/10 text-[#06b6d4]"
                  : "text-[#8b95a9] hover:text-[#e2e8f0]"
              }`}
            >
              {l.icon} {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
