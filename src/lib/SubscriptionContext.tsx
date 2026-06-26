"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type SubscriptionTier = "free" | "pro" | "loading";

interface SubscriptionContextType {
  tier: SubscriptionTier;
  email: string | null;
  checkAccess: (feature: string) => boolean;
  showUpgrade: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  tier: "free",
  email: null,
  checkAccess: () => false,
  showUpgrade: () => {},
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for existing subscription
    const stored = localStorage.getItem("vasco_subscription");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.tier === "pro" && data.expires > Date.now()) {
          setTier("pro");
          setEmail(data.email);
          return;
        }
      } catch {}
    }
    setTier("free");
  }, []);

  // Pro features that are gated
  const proFeatures = [
    "deal-score",
    "comps",
    "unlimited-lookups",
    "export-pdf",
    "sms-alerts",
    "portfolio-watchlist",
    "batch-lookup",
    "yield-column",
    "listings-column",
  ];

  const checkAccess = (feature: string): boolean => {
    if (tier === "pro") return true;
    return !proFeatures.includes(feature);
  };

  const showUpgrade = () => {
    const subButton = document.getElementById("subscribe-button");
    if (subButton) subButton.scrollIntoView({ behavior: "smooth" });
  };

  // Listen for successful checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      // Simulate pro unlock for now — in production, verify via API
      localStorage.setItem(
        "vasco_subscription",
        JSON.stringify({
          tier: "pro",
          email: localStorage.getItem("vasco_email") || "subscriber@email.com",
          expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        })
      );
      setTier("pro");
      // Clean URL
      window.history.replaceState({}, "", "/");
    }
  }, []);

  if (tier === "loading") {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
        <div className="text-[#06b6d4] text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <SubscriptionContext.Provider value={{ tier, email, checkAccess, showUpgrade }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
