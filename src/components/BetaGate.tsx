"use client";

import { useState, useEffect } from "react";

export default function BetaGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if already authorized in this session
    const authed = sessionStorage.getItem("beta_authorized");
    if (authed === "true") setAuthorized(true);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === "vasco2026") {
      sessionStorage.setItem("beta_authorized", "true");
      setAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  }

  if (authorized) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏛️</div>
          <h1 className="text-xl font-bold text-[#e2e8f0]">Vasco Analytics</h1>
          <p className="text-sm text-[#8b95a9] mt-1">
            Houston RE Intelligence — Beta Access
          </p>
        </div>

        {/* Beta Gate */}
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-6">
          <h2 className="font-semibold text-[#e2e8f0] mb-1">Beta Testing</h2>
          <p className="text-xs text-[#8b95a9] mb-4">
            Enter your beta access password to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Beta password..."
              className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0] placeholder-[#8b95a9] focus:outline-none focus:border-[#06b6d4]"
              autoFocus
            />
            {error && (
              <p className="text-xs text-[#ef4444]">Incorrect password. Try again.</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#06b6d4] text-[#0b0f1a] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#0891b2] transition"
            >
              Enter Beta
            </button>
          </form>

          <p className="text-xs text-[#8b95a9] mt-4 text-center">
            Not a beta tester?{" "}
            <a href="/pricing" className="text-[#06b6d4] hover:underline">
              Subscribe here
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-[#5a6577] text-center mt-6">
          Vasco Analytics — Beta v0.1 · Data updated weekly
        </p>
      </div>
    </div>
  );
}
