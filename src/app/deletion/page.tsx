"use client";

import { useState } from "react";

export default function DeletionPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Send deletion request email
    window.location.href = `mailto:pietto.vasco@gmail.com?subject=Data Deletion Request&body=Email: ${encodeURIComponent(email)}%0D%0A%0D%0APlease delete all data associated with this email address.`;
    setSubmitted(true);
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">User Data Deletion</h1>
      <p className="text-sm text-[#8b95a9] mb-8">
        Request deletion of your personal data from JadeBuzz Analytics.
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <div>
            <label className="text-xs text-[#8b95a9] block mb-1">
              Email associated with your account
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0]"
              placeholder="you@email.com"
            />
          </div>
          <button
            type="submit"
            className="bg-[#ef4444] text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#dc2626] transition"
          >
            Request Deletion
          </button>
          <p className="text-xs text-[#5a6577]">
            We will process your request within 30 days. You will receive a
            confirmation email once complete.
          </p>
        </form>
      ) : (
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-6">
          <p className="font-semibold text-[#10b981]">✅ Request Submitted</p>
          <p className="text-sm text-[#8b95a9] mt-2">
            A deletion request email has been opened in your email client.
            Send it to complete the process. We'll respond within 30 days.
          </p>
        </div>
      )}

      <div className="mt-8 text-xs text-[#5a6577]">
        <p>You can also email us directly: pietto.vasco@gmail.com</p>
        <p className="mt-1">We will delete all stored data associated with your email within 30 days of verified request.</p>
      </div>
    </main>
  );
}
