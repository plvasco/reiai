import { NextResponse } from "next/server";
import { ZipData, SUBMARKETS } from "@/lib/types";

// Fetch all ZIP data from RentCast API
async function fetchZipData(zip: string): Promise<ZipData | null> {
  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://api.rentcast.io/v1/markets?zipCode=${zip}`,
      { headers: { "X-Api-Key": apiKey }, next: { revalidate: 3600 } } // 1 hour cache
    );
    if (!res.ok) return null;
    const data = await res.json();
    const sd = data.saleData || {};
    const rd = data.rentalData || {};

    const medPrice = sd.medianPrice ?? null;
    const medRent = rd.medianRent ?? null;
    const grossYield =
      medPrice && medRent ? Math.round((medRent * 12) / medPrice * 10000) / 100 : null;

    return {
      zip,
      submarket: SUBMARKETS[zip] || "Unknown",
      medDOM: sd.medianDaysOnMarket ?? null,
      avgDOM: sd.averageDaysOnMarket ? Math.round(sd.averageDaysOnMarket * 10) / 10 : null,
      medPrice,
      medPPS: sd.medianPricePerSquareFoot
        ? Math.round(sd.medianPricePerSquareFoot * 100) / 100
        : null,
      medRent,
      grossYield,
      totalListings: sd.totalListings ?? null,
      newListings: sd.newListings ?? null,
      avgSqFt: sd.averageSquareFootage ? Math.round(sd.averageSquareFootage) : null,
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zipsParam = searchParams.get("zips");
  const zips = zipsParam
    ? zipsParam.split(",")
    : ["77041", "77040", "77065", "77043", "77079", "77044", "77009", "77020",
       "77087", "77051", "77003", "77004", "77011", "77012", "77033", "77093", "77026"];

  const results = await Promise.all(zips.map(fetchZipData));
  const valid = results.filter((r): r is ZipData => r !== null);

  return NextResponse.json({ data: valid, count: valid.length });
}
