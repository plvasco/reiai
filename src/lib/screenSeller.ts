/**
 * Seller-lead distress screening.
 * Calls our JadeBuzz Deal Analysis API to score a seller's submitted
 * address against the 229K-parcel Houston DB.
 *
 * If the API is unreachable or the address isn't in our DB, we return
 * an "unscreened" result rather than failing the lead capture.
 */
const JADEBUZZ_API = process.env.JADEBUZZ_API_URL || "https://api.jadebuzz.com";
const JADEBUZZ_API_KEY = process.env.JADEBUZZ_API_KEY || "";

export interface ScreenResult {
  screened: boolean;
  score: number | null;      // 0-100 lead score, null if unscreened
  tier: "HOT" | "WARM" | "COLD" | "UNScreened";
  parcel?: {
    owner: string;
    market_value: number | null;
    year_built: number | null;
    sqft: number | null;
    zip: string | null;
    out_of_state: boolean;
  };
  reason?: string;           // why screening failed (if any)
}

export async function screenSellerAddress(address: string): Promise<ScreenResult> {
  if (!address) {
    return { screened: false, score: null, tier: "UNScreened", reason: "no address" };
  }

  try {
    const hname = "X" + "-API-Key"; // avoid token mangling
    const res = await fetch(`${JADEBUZZ_API}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [hname]: JADEBUZZ_API_KEY,
      },
      body: JSON.stringify({ address }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) {
      return {
        screened: false,
        score: null,
        tier: "UNScreened",
        reason: `api_${res.status}`,
      };
    }

    const data = await res.json();
    const score = data?.lead_score ?? null;
    const p = data?.parcel_data;

    if (score == null) {
      return { screened: false, score: null, tier: "UNScreened", reason: "not_in_db" };
    }

    const tier: ScreenResult["tier"] = score >= 70 ? "HOT" : score >= 50 ? "WARM" : "COLD";

    return {
      screened: true,
      score,
      tier,
      parcel: {
        owner: p?.owner || "",
        market_value: p?.market_value ?? null,
        year_built: p?.year_built ?? null,
        sqft: p?.sqft ?? null,
        zip: p?.zip ?? null,
        out_of_state: !!p?.out_of_state,
      },
    };
  } catch (e: any) {
    return {
      screened: false,
      score: null,
      tier: "UNScreened",
      reason: e?.message || "network_error",
    };
  }
}
