"use client";

import { PRELIMINARY_ZIP_DATA } from "@/lib/preliminary-data";
import { getAllGrowthScores } from "@/lib/growth-score";
import { CATALYSTS } from "@/lib/growth-score";

export default function GrowthPage() {
  const scores = getAllGrowthScores(PRELIMINARY_ZIP_DATA);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-[#10b981]";
    if (grade.startsWith("B")) return "text-[#06b6d4]";
    return "text-[#f59e0b]";
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "bg-[#10b981]";
    if (score >= 55) return "bg-[#06b6d4]";
    if (score >= 35) return "bg-[#f59e0b]";
    return "bg-[#ef4444]";
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">📈 Growth Potential Rankings</h1>
      <p className="text-sm text-[#8b95a9] mb-6">
        Proprietary scoring model combining infrastructure catalysts, demand velocity, affordability, and institutional investment.
        Each ZIP scored 0-100 across four categories. Higher score = higher expected appreciation over the next 3-7 years.
      </p>

      {/* Top Picks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {scores.slice(0, 3).map((s, i) => (
          <div key={s.zip} className="bg-gradient-to-br from-[#111827] to-[#1a2035] border border-[#06b6d4]/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8b95a9]">#{i + 1} Pick</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${getGradeColor(s.grade)} bg-[#0b0f1a]`}>{s.grade}</span>
            </div>
            <div className="text-lg font-bold text-[#06b6d4]">{s.zip}</div>
            <div className="text-xs text-[#8b95a9] mb-2">{s.submarket}</div>
            <div className="text-3xl font-bold mb-1" style={{ color: s.totalScore >= 75 ? '#10b981' : s.totalScore >= 55 ? '#06b6d4' : '#f59e0b' }}>
              {s.totalScore}
              <span className="text-sm text-[#8b95a9]">/100</span>
            </div>
            <div className="text-xs text-[#8b95a9]">{s.timeHorizon} horizon</div>
          </div>
        ))}
      </div>

      {/* Full Rankings */}
      <div className="space-y-3">
        {scores.slice(3).map((s) => {
          const cat = CATALYSTS[s.zip];
          return (
            <details key={s.zip} className="bg-[#111827] border border-[#1e2a45] rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer hover:bg-[#1a2035] transition flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${getScoreColor(s.totalScore)} flex items-center justify-center text-sm font-bold text-[#0b0f1a] shrink-0`}>
                  {s.totalScore}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#06b6d4]">{s.zip}</span>
                    <span className={`text-xs font-semibold ${getGradeColor(s.grade)}`}>{s.grade}</span>
                    <span className="text-xs text-[#8b95a9]">{s.timeHorizon}</span>
                  </div>
                  <div className="text-xs text-[#8b95a9] truncate">{s.submarket}</div>
                </div>
                <div className="hidden md:grid grid-cols-4 gap-3 text-center text-xs shrink-0">
                  <div>
                    <div className="font-bold text-[#06b6d4]">{s.categories.infrastructure}</div>
                    <div className="text-[#8b95a9]">Infra</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#10b981]">{s.categories.demandVelocity}</div>
                    <div className="text-[#8b95a9]">Velocity</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#f59e0b]">{s.categories.affordability}</div>
                    <div className="text-[#8b95a9]">Afford</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#8b5cf6]">{s.categories.institutional}</div>
                    <div className="text-[#8b95a9]">Inst.</div>
                  </div>
                </div>
              </summary>
              <div className="px-4 pb-4 pt-0 border-t border-[#1e2a45]">
                <div className="mt-3 grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-[#06b6d4] mb-1 uppercase tracking-wider">Infrastructure Catalysts</h4>
                    <ul className="text-xs text-[#8b95a9] space-y-1">
                      {cat?.infra.map((item, i) => <li key={i} className="flex items-start gap-1">▸ {item}</li>)}
                    </ul>
                    <h4 className="text-xs font-semibold text-[#8b5cf6] mb-1 mt-3 uppercase tracking-wider">Institutional Investment</h4>
                    <ul className="text-xs text-[#8b95a9] space-y-1">
                      {cat?.inst.map((item, i) => <li key={i} className="flex items-start gap-1">▸ {item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#f59e0b] mb-1 uppercase tracking-wider">Thesis</h4>
                    <p className="text-xs text-[#8b95a9] leading-relaxed">{s.upside}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="text-[#8b95a9]">Time horizon:</span>
                      <span className="font-semibold text-[#06b6d4]">{s.timeHorizon}</span>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          );
        })}
      </div>

      {/* Scoring Methodology */}
      <div className="mt-8 bg-[#111827] border border-[#1e2a45] rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-3">📐 Scoring Methodology</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-lg font-bold text-[#06b6d4]">/25</div>
            <div className="text-xs text-[#8b95a9]">Infrastructure</div>
            <div className="text-[10px] text-[#8b95a9]">Projects underway: East River, NHHIP, SH 288, Port Houston, METRORail, Generation Park</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#10b981]">/25</div>
            <div className="text-xs text-[#8b95a9]">Demand Velocity</div>
            <div className="text-[10px] text-[#8b95a9]">Current sell-through speed — DOM under 30d scores highest. Under 50d = retail velocity achieved.</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#f59e0b]">/25</div>
            <div className="text-xs text-[#8b95a9]">Affordability</div>
            <div className="text-[10px] text-[#8b95a9]">Entry price + gross yield. Sub-$250K with 8%+ yield scores highest. Room for appreciation.</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#8b5cf6]">/25</div>
            <div className="text-xs text-[#8b95a9]">Institutional</div>
            <div className="text-[10px] text-[#8b95a9]">Committed capital: TMC3, Ion District, Port Houston, university anchors, tax increment zones</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-[#8b95a9] text-center">
        Growth scores are a proprietary JadeBuzz Analytics model. Not financial advice. Always conduct your own due diligence.
      </div>
    </main>
  );
}
