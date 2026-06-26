import { ZipData } from "./types";

// Growth catalysts by ZIP — weighted scoring model
interface GrowthScore {
  zip: string;
  submarket: string;
  totalScore: number; // 0-100
  grade: string; // A+ through F
  categories: {
    infrastructure: number;  // /25
    demandVelocity: number;  // /25
    affordability: number;   // /25
    institutional: number;   // /25
  };
  upside: string; // short description
  timeHorizon: string; // "1-3yr", "3-5yr", "5-10yr"
}

const CATALYSTS: Record<string, { infra: string[]; inst: string[]; upside: string; horizon: string }> = {
  "77003": {
    infra: ["East River 150-acre mixed-use (former KBR)", "METRORail Green/Purple lines", "NHHIP highway reconstruction", "Buffalo Bayou East master plan"],
    inst: ["$1.5B+ committed development", "City of Houston tax increment reinvestment zone"],
    upside: "Most catalysts of any Houston ZIP. East River alone will transform the area. When retail velocity catches up to institutional investment, appreciation will accelerate rapidly.",
    horizon: "3-7yr"
  },
  "77004": {
    infra: ["Ion District innovation hub", "TMC3 $1.5B biomedical campus", "SH 288 connector"],
    inst: ["UH/TSU university anchors", "Texas Medical Center expansion", "HISD NES reform targeted"],
    upside: "Institutional money is already in. TMC3 will bring 10,000+ high-income jobs. High inventory (579 listings) suppresses DOM temporarily — absorption is the key metric to watch.",
    horizon: "3-5yr"
  },
  "77011": {
    infra: ["Port Houston $1.4B capital program", "SH 225 widening", "BW8 connector"],
    inst: ["Port jobs growth (2,000+/yr)", "Industrial-to-residential conversion incentives"],
    upside: "Port-driven demand is steady and recession-resistant. Affordable base ($350K) with rising permits. Not flashy, but fundamentals are solid. Steady 5-7% annual appreciation.",
    horizon: "5-10yr"
  },
  "77012": {
    infra: ["East River project impact zone", "BW8/SH225 direct connectors", "Industrial-to-residential conversions"],
    inst: ["Low inventory (71 total listings) = scarcity premium", "Adjacent to Port Houston expansion"],
    upside: "Lowest inventory in our set means any demand spike hits prices fast. $219K med price + 7.4% yield = affordable entry with decent cash flow while waiting for appreciation.",
    horizon: "3-7yr"
  },
  "77020": {
    infra: ["NHHIP direct impact zone", "I-10/Eastex connector improvements", "Neighborhood infrastructure investment"],
    inst: ["Lowest inner-city entry point", "Permit growth accelerating from low base"],
    upside: "Fast sell-through (27d DOM) + 9.4% yield + NHHIP catalyst = rare combination. The market has already discovered this ZIP. Buy now while med price is still $265K.",
    horizon: "1-4yr"
  },
  "77009": {
    infra: ["Heights teardown-rebuild boom continuing", "Northern edges development"],
    inst: ["Already gentrifying — spillover from Heights core", "Premium pricing limits upside but floor is solid"],
    upside: "Late-stage gentrification. The easy money was made 5 years ago, but northern edges near 610 still offer value. 26d DOM proves demand is strong. Yield is low (5.1%) — cash flow isn't the play here.",
    horizon: "1-3yr"
  },
  "77026": {
    infra: ["Northeast corridor infrastructure investment", "NHHIP connectivity benefits"],
    inst: ["Rock-bottom pricing ($168K median)", "Speculative — few committed projects"],
    upside: "Highest risk/reward in Houston. Lowest entry price but 79d DOM means investors aren't buying yet. If the NE corridor revitalization materializes, this could 2-3x. If not, you hold for 10+ years.",
    horizon: "5-15yr"
  },
  "77033": {
    infra: ["SH 288 expansion complete", "Convenient access to Med Center", "Transit corridor improvements"],
    inst: ["Highest gross yield in Houston (11.5%)", "Medical Center employment base nearby"],
    upside: "11.5% yield is the headline — but $185K med price at 57d DOM means there's genuine demand. SH 288 access to the Med Center creates a natural demand floor. Cash flow monster with appreciation upside.",
    horizon: "3-7yr"
  },
  "77051": {
    infra: ["SH 288 corridor", "Sunnyside revitalization plans"],
    inst: ["Fast sell-through (26d DOM)", "8.4% yield — best of both worlds"],
    upside: "Sunnyside is being discovered. 26d DOM at $270K with 8.4% yield is the sweet spot. SH 288 expansion makes Med Center/Greenway Plaza commuters take notice. Buy before the word gets out.",
    horizon: "2-5yr"
  },
  "77041": {
    infra: ["NW Houston development corridor", "High permit volume"],
    inst: ["#1 appreciation in Houston (NeighborhoodScout)", "Established demand — not speculative"],
    upside: "The proven winner. 23d DOM + 6.6% yield + top appreciation = the safest bet in Houston. Flood risk in portions is the only caveat. Buy elevated areas outside 500-yr floodplain.",
    horizon: "1-5yr"
  },
  "77040": {
    infra: ["Adjacent to 77041 corridor", "Permit growth steady"],
    inst: ["Spillover demand from 77041", "Affordable entry at $300K"],
    upside: "77041's affordable neighbor. 24d DOM at $300K with 7% yield = better cash flow than 77041 with similar velocity. Spillover appreciation as 77041 prices out buyers.",
    horizon: "1-5yr"
  },
  "77044": {
    infra: ["Generation Park 4,000-acre master plan", "FM 2100 widening", "Lake Houston area development"],
    inst: ["High new-construction volume (339 listings)", "Lower flood risk (newer drainage)"],
    upside: "Safest emerging bet. Generation Park is a 4,000-acre planned development creating a new submarket. 26d DOM shows strong demand. Lower flood risk than most Houston growth areas.",
    horizon: "3-10yr"
  },
  "77079": {
    infra: ["Memorial/Westchase area — built-out infrastructure"],
    inst: ["Premium suburb — low inventory (247)", "Established schools and amenities"],
    upside: "Not a growth play — a stability play. 22d fastest DOM in our set proves premium demand. $565K med price limits upside, but 22d DOM means you can exit fast. Best for investors who want liquidity.",
    horizon: "1-3yr"
  },
  "77043": {
    infra: ["Spring Branch revitalization", "Heights gentrification spillover"],
    inst: ["Townhome infill accelerating", "Katy Freeway corridor access"],
    upside: "Spring Branch West is catching the gentrification wave from the Heights. 25d DOM at $450K with decent $/sqft ($197) compared to inner-loop. Mid-term appreciation play.",
    horizon: "2-6yr"
  },
  "77093": {
    infra: ["North Houston infrastructure", "Airport-related development"],
    inst: ["Affordable base ($229K)", "8.4% yield with moderate upside"],
    upside: "Solid cash flow play. 63d DOM is slower but 8.4% yield compensates. IAH airport employment provides demand floor. Not a home run, but a steady double.",
    horizon: "5-10yr"
  },
  "77087": {
    infra: ["I-610 South feasibility study", "Transit corridor improvements"],
    inst: ["Infill development growing", "Affordable entry ($266K)"],
    upside: "Dark horse. 26d DOM at $266K with moderate catalysts. If the 610 South study leads to actual improvements, this could pop. For now, decent cash flow + fast sell-through.",
    horizon: "3-8yr"
  },
};

export function calculateGrowthScore(zipData: ZipData): GrowthScore | null {
  const catalyst = CATALYSTS[zipData.zip];
  if (!catalyst) return null;

  // Infrastructure score (0-25)
  let infraScore = Math.min(catalyst.infra.length * 5, 25);

  // Demand velocity score (0-25)
  const dom = zipData.medDOM ?? 100;
  let velScore = 0;
  if (dom < 25) velScore = 25;
  else if (dom < 30) velScore = 22;
  else if (dom < 40) velScore = 18;
  else if (dom < 55) velScore = 14;
  else if (dom < 70) velScore = 10;
  else velScore = 6; // Slow DOM = still pre-gentrification, some upside

  // Affordability score (0-25)
  const price = zipData.medPrice ?? 500000;
  const yield_ = zipData.grossYield ?? 0;
  let affordScore = 0;
  if (price < 200000) affordScore = 25;
  else if (price < 250000) affordScore = 22;
  else if (price < 300000) affordScore = 19;
  else if (price < 400000) affordScore = 15;
  else if (price < 500000) affordScore = 10;
  else affordScore = 5;
  // Bonus for high yield
  if (yield_ > 8) affordScore += 3;
  else if (yield_ > 6) affordScore += 1;
  affordScore = Math.min(affordScore, 25);

  // Institutional score (0-25)
  let instScore = Math.min(catalyst.inst.length * 6, 25);

  // Total
  const total = Math.min(infraScore + velScore + affordScore + instScore, 100);

  // Grade
  let grade: string;
  if (total >= 85) grade = "A+";
  else if (total >= 75) grade = "A";
  else if (total >= 65) grade = "A-";
  else if (total >= 55) grade = "B+";
  else if (total >= 45) grade = "B";
  else if (total >= 35) grade = "B-";
  else if (total >= 25) grade = "C+";
  else grade = "C";

  return {
    zip: zipData.zip,
    submarket: zipData.submarket,
    totalScore: total,
    grade,
    categories: {
      infrastructure: infraScore,
      demandVelocity: velScore,
      affordability: affordScore,
      institutional: instScore,
    },
    upside: catalyst.upside,
    timeHorizon: catalyst.horizon,
  };
}

export function getAllGrowthScores(zipData: ZipData[]): GrowthScore[] {
  return zipData
    .map(calculateGrowthScore)
    .filter((s): s is GrowthScore => s !== null)
    .sort((a, b) => b.totalScore - a.totalScore);
}

export { CATALYSTS };
