"use client";

import { useState } from "react";
import { useSubscription } from "@/lib/SubscriptionContext";

export default function DealCalculatorPage() {
  const { tier, checkAccess, showUpgrade } = useSubscription();
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [rent, setRent] = useState("");
  const [downPayment, setDownPayment] = useState("20");
  const [interestRate, setInterestRate] = useState("6.5");
  const [propertyTax, setPropertyTax] = useState("2.3");
  const [insurance, setInsurance] = useState("1200");
  const [maintenance, setMaintenance] = useState("8");
  const [management, setManagement] = useState("8");
  const [vacancy, setVacancy] = useState("5");

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const p = parseFloat(price) || 0;
  const r = parseFloat(rent) || 0;
  const dp = parseFloat(downPayment) / 100;
  const ir = parseFloat(interestRate) / 100;
  const pt = parseFloat(propertyTax) / 100;
  const ins = parseFloat(insurance) || 1200;
  const maint = parseFloat(maintenance) / 100;
  const mgmt = parseFloat(management) / 100;
  const vac = parseFloat(vacancy) / 100;

  const canCalculate = p > 0 && r > 0;

  const lookupRent = async () => {
    if (!address.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/property-lookup?address=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data.rentEstimate) setRent(data.rentEstimate.toString());
      if (data.valueEstimate && !price) setPrice(data.valueEstimate.toString());
    } catch {}
    setLoading(false);
  };

  const calculate = () => {
    const loanAmount = p * (1 - dp);
    const monthlyRate = ir / 12;
    const numPayments = 30 * 12;
    const mortgage =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const annualTax = p * pt;
    const monthlyTax = annualTax / 12;
    const monthlyIns = ins / 12;
    const monthlyMaint = r * maint;
    const monthlyMgmt = r * mgmt;
    const monthlyVac = r * vac;

    const totalExpenses = mortgage + monthlyTax + monthlyIns + monthlyMaint + monthlyMgmt + monthlyVac;
    const monthlyCashFlow = r - totalExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashInvestment = p * dp;
    const cocROI = cashInvestment > 0 ? (annualCashFlow / cashInvestment) * 100 : 0;
    const capRate = p > 0 ? ((r * 12 - annualTax - ins - (r * 12 * (maint + mgmt + vac))) / p) * 100 : 0;
    const dscr = totalExpenses > 0 ? r / totalExpenses : 0;

    setResult({
      monthlyCashFlow,
      annualCashFlow,
      cocROI,
      capRate,
      dscr,
      mortgage,
      totalExpenses,
      cashInvestment,
      loanAmount,
    });
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">🧮 Deal Calculator</h1>
      <p className="text-sm text-[#8b95a9] mb-6">
        Enter a deal to see cash flow, ROI, cap rate, and debt coverage ratio.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-sm">Property Details</h3>

          <div>
            <label className="text-xs text-[#8b95a9] block mb-1">Address (auto-fill rent)</label>
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="1234 Main St, Houston, TX"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0] placeholder-[#8b95a9]"
              />
              <button onClick={lookupRent} disabled={loading}
                className="bg-[#1a2035] border border-[#1e2a45] rounded-lg px-3 py-2 text-xs text-[#8b95a9] hover:text-[#e2e8f0] transition">
                {loading ? "..." : "Look up"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#8b95a9] block mb-1">Purchase Price ($)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0]" />
            </div>
            <div>
              <label className="text-xs text-[#8b95a9] block mb-1">Monthly Rent ($)</label>
              <input type="number" value={rent} onChange={(e) => setRent(e.target.value)}
                className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0]" />
            </div>
          </div>

          <h3 className="font-semibold text-sm pt-2 border-t border-[#1e2a45]">Financing</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#8b95a9] block mb-1">Down Payment ({downPayment}%)</label>
              <input type="range" min={5} max={40} step={5} value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="w-full accent-[#06b6d4]" />
            </div>
            <div>
              <label className="text-xs text-[#8b95a9] block mb-1">Interest Rate ({interestRate}%)</label>
              <input type="range" min={4} max={10} step={0.25} value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full accent-[#06b6d4]" />
            </div>
          </div>

          <h3 className="font-semibold text-sm pt-2 border-t border-[#1e2a45]">Expenses</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#8b95a9] block mb-1">Property Tax ({propertyTax}%)</label>
              <input type="range" min={1} max={4} step={0.1} value={propertyTax}
                onChange={(e) => setPropertyTax(e.target.value)}
                className="w-full accent-[#06b6d4]" />
            </div>
            <div>
              <label className="text-xs text-[#8b95a9] block mb-1">Insurance ($/yr)</label>
              <input type="number" value={insurance} onChange={(e) => setInsurance(e.target.value)}
                className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0]" />
            </div>
            <div>
              <label className="text-xs text-[#8b95a9] block mb-1">Maintenance ({maintenance}%)</label>
              <input type="range" min={5} max={20} step={1} value={maintenance}
                onChange={(e) => setMaintenance(e.target.value)}
                className="w-full accent-[#06b6d4]" />
            </div>
            <div>
              <label className="text-xs text-[#8b95a9] block mb-1">Management ({management}%)</label>
              <input type="range" min={0} max={12} step={1} value={management}
                onChange={(e) => setManagement(e.target.value)}
                className="w-full accent-[#06b6d4]" />
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={!canCalculate}
            className="w-full bg-[#06b6d4] text-[#0b0f1a] font-semibold py-3 rounded-lg text-sm hover:bg-[#0891b2] transition disabled:opacity-50 mt-2"
          >
            Calculate Deal
          </button>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 space-y-5">
              <h3 className="font-semibold text-sm">📊 Deal Analysis</h3>

              {/* Primary Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <MetricBox
                  label="Monthly Cash Flow"
                  value={`$${result.monthlyCashFlow.toFixed(0)}`}
                  color={result.monthlyCashFlow > 0 ? "text-[#10b981]" : "text-[#ef4444]"}
                />
                <MetricBox
                  label="Annual Cash Flow"
                  value={`$${result.annualCashFlow.toFixed(0)}`}
                  color={result.annualCashFlow > 0 ? "text-[#10b981]" : "text-[#ef4444]"}
                />
                <MetricBox
                  label="CoC ROI"
                  value={`${result.cocROI.toFixed(1)}%`}
                  color={result.cocROI > 8 ? "text-[#f59e0b]" : result.cocROI > 4 ? "text-[#06b6d4]" : "text-[#ef4444]"}
                />
                <MetricBox
                  label="Cap Rate"
                  value={`${result.capRate.toFixed(1)}%`}
                  color={result.capRate > 8 ? "text-[#10b981]" : result.capRate > 5 ? "text-[#06b6d4]" : "text-[#8b95a9]"}
                />
                <MetricBox label="DSCR" value={result.dscr.toFixed(2)}
                  color={result.dscr >= 1 ? "text-[#10b981]" : "text-[#ef4444]"} />
                <MetricBox label="Monthly Mortgage" value={`$${result.mortgage.toFixed(0)}`} color="text-[#8b95a9]" />
              </div>

              {/* Deal Score */}
              <div className={`rounded-xl p-4 text-center ${
                result.monthlyCashFlow > 200 && result.cocROI > 8 ? "bg-[#10b981]/10 border border-[#10b981]/30" :
                result.monthlyCashFlow > 0 ? "bg-[#f59e0b]/10 border border-[#f59e0b]/30" :
                "bg-[#ef4444]/10 border border-[#ef4444]/30"
              }`}>
                <div className="text-lg font-bold">
                  {result.monthlyCashFlow > 200 && result.cocROI > 8 ? "🟢 Strong Buy" :
                   result.monthlyCashFlow > 0 ? "🟡 Marginal" : "🔴 Pass"}
                </div>
                <div className="text-xs text-[#8b95a9] mt-1">
                  {result.monthlyCashFlow > 200 && result.cocROI > 8 ? "Positive cash flow + strong ROI" :
                   result.monthlyCashFlow > 0 ? "Breakeven or low ROI" : "Negative cash flow — not viable"}
                </div>
              </div>

              {/* Breakdown */}
              <div className="text-xs text-[#8b95a9] space-y-1">
                <div className="flex justify-between"><span>Purchase Price</span><span>${p.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Loan Amount</span><span>${result.loanAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Cash Invested</span><span>${result.cashInvestment.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Total Monthly Expenses</span><span>$${result.totalExpenses.toFixed(0)}</span></div>
                <div className="flex justify-between"><span>Effective Rent</span><span>$${r.toFixed(0)}</span></div>
              </div>
            </div>
          ) : (
            <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-10 text-center text-[#8b95a9] text-sm">
              <div className="text-3xl mb-3">🏠</div>
              Fill in the property details and click Calculate to see your deal analysis.
            </div>
          )}

          {/* Pro upsell for extra features */}
          {!checkAccess("export-pdf") && (
            <div className="mt-3 bg-[#1a2035] border border-[#f59e0b]/30 rounded-xl p-3 text-center text-xs">
              🔒 <strong>Export PDF reports</strong> and <strong>batch analyze 10+ properties</strong> with Pro.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function MetricBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#0b0f1a] rounded-lg p-3">
      <div className="text-xs text-[#8b95a9]">{label}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}
