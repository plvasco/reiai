import { NextResponse } from "next/server";
import foreclosuresData from "@/lib/foreclosures_export.json";
import { PRELIMINARY_ZIP_DATA } from "@/lib/preliminary-data";

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
  med_dom: number | null;
}

// Build ZIP lookup map
const ZIP_MAP: Record<string, { medDOM: number | null }> = {};
for (const z of PRELIMINARY_ZIP_DATA) {
  ZIP_MAP[z.zip] = { medDOM: z.medDOM };
}

function extractZipFromAddress(addr: string | null): string | null {
  if (!addr) return null;
  const m = addr.match(/\b(\d{5})\b/);
  return m ? m[1] : null;
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
    data = (rawData as any[]).map(mapRecord);
  } else if ((rawData as any).filings && Array.isArray((rawData as any).filings)) {
    data = (rawData as any).filings.map(mapRecord);
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

function mapRecord(r: any): ForeclosureRecord {
  const addr = r.property_address || null;
  const zipCode = extractZipFromAddress(addr);
  const zipInfo = zipCode ? ZIP_MAP[zipCode] : null;
  
  return {
    doc_id: r.doc_id || "",
    county: r.county || (r.county_id === 1 ? "Harris" : r.county_id === 2 ? "Fort Bend" : "Unknown"),
    sale_date: r.sale_date || "",
    file_date: r.file_date || "",
    property_address: addr,
    trustee: r.trustee || null,
    owner_name: extractOwner(r.ocr_text),
    loan_amount: extractAmount(r.ocr_text),
    pages: r.pages || 0,
    source: `${r.county || (r.county_id === 1 ? "Harris" : "Fort Bend")} County Clerk`,
    med_dom: zipInfo?.medDOM ?? null,
  };
}

function extractOwner(text: string | null): string | null {
  if (!text) return null;
  const m = text.match(/Owner:\s*(.+?)(?:\||$)/);
  return m ? m[1].trim() : null;
}

function extractAmount(text: string | null): string | null {
  if (!text) return null;
  const m = text.match(/Amount:\s*\$?([0-9,]+\.?\d*)/);
  return m ? m[1].replace(",", "") : null;
}
