import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API not configured" }, { status: 500 });
  }

  try {
    // Step 1: Get rent estimate
    const rentUrl = `https://api.rentcast.io/v1/rent/long-term?address=${encodeURIComponent(address)}`;
    const rentRes = await fetch(rentUrl, { headers: { "X-Api-Key": apiKey } });
    const rentData = rentRes.ok ? await rentRes.json() : null;

    // Step 2: Get value estimate
    const valueUrl = `https://api.rentcast.io/v1/value?address=${encodeURIComponent(address)}`;
    const valueRes = await fetch(valueUrl, { headers: { "X-Api-Key": apiKey } });
    const valueData = valueRes.ok ? await valueRes.json() : null;

    // Step 3: Get ZIP market data
    const zipMatch = address.match(/\b7\d{4}\b/);
    let marketData = null;
    if (zipMatch) {
      const marketUrl = `https://api.rentcast.io/v1/markets?zipCode=${zipMatch[0]}`;
      const marketRes = await fetch(marketUrl, { headers: { "X-Api-Key": apiKey } });
      if (marketRes.ok) marketData = await marketRes.json();
    }

    // Calculate yield
    const rentEstimate = rentData?.rent ?? rentData?.averageRent ?? null;
    const valueEstimate = valueData?.value ?? valueData?.averageValue ?? null;
    const sqft = rentData?.squareFootage ?? valueData?.squareFootage ?? null;
    const grossYield = rentEstimate && valueEstimate
      ? Math.round((rentEstimate * 12 / valueEstimate) * 10000) / 100
      : null;
    const pricePerSqFt = valueEstimate && sqft
      ? Math.round(valueEstimate / sqft * 100) / 100
      : null;

    return NextResponse.json({
      address,
      rentEstimate,
      valueEstimate,
      grossYield,
      pricePerSqFt,
      squareFootage: sqft,
      bedrooms: rentData?.bedrooms ?? null,
      bathrooms: rentData?.bathrooms ?? null,
      propertyType: rentData?.propertyType ?? null,
      zipMarket: marketData?.saleData ?? null,
      comps: rentData?.comps ?? [],
    });
  } catch (err: any) {
    console.error("Property lookup error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
