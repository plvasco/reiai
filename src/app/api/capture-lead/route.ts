import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, name, source } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Store locally — this is a file-based approach since we're on Vercel
    // In production, connect this to a proper email service (Resend, Mailchimp, etc.)
    console.log("[LEAD CAPTURE]", { email, name, source, timestamp: new Date().toISOString() });

    // TODO: Connect to email service
    // - Resend: send confirmation email
    // - Mailchimp / ConvertKit: add to list
    // - Notion / Airtable: log in database

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
