import { NextResponse } from "next/server";
import foreclosuresData from "@/lib/foreclosures_export.json";

export interface ForeclosureRecord {
  doc_id: string;
  county: string;
  sale_date: string;
  file_date: string;
  property_address: string | null;
  trustee: string | null;
  owner_name: string | null;
  loan_amount: string | null;
  pages: number;
  source: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const county = searchParams.get("county");
  const zip = searchParams.get("zip");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  let rawData = foreclosuresData as unknown;
  let data: ForeclosureRecord[] = [];
  
  // Handle both formats: flat array or {export_time, total_filings, filings: [...]}
  if (Array.isArray(rawData)) {
    data = rawData as ForeclosureRecord[];
  } else if ((rawData as any).filings && Array.isArray((rawData as any).filings)) {
    data = (rawData as any).filings as ForeclosureRecord[];
  }

  // Apply filters
  if (county && county !== "all") {
    data = data.filter((r) => r.county.toLowerCase() === county.toLowerCase());
  }
  if (zip) {
    const z = zip.toLowerCase();
    data = data.filter(
      (r) =>
        r.property_address?.toLowerCase().includes(z) ||
        r.doc_id.toLowerCase().includes(z)
    );
  }

  const total = data.length;
  const sliced = data.slice(offset, offset + limit);

  return NextResponse.json({
    data: sliced,
    total,
    count: sliced.length,
    offset,
    limit,
  });
}
