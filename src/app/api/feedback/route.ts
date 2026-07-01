import { NextRequest, NextResponse } from "next/server";

// In-memory feedback store (resets on deploy — fine for beta phase)
// Replace with Vercel KV / Supabase for production
let feedbacks: { name: string; email: string; type: string; message: string; timestamp: string }[] = [];

export async function POST(req: NextRequest) {
  try {
    const { name, email, type, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json({ error: "Email and message required" }, { status: 400 });
    }

    const entry = {
      name: name?.trim() || "Anonymous",
      email: email.trim(),
      type: type || "general",
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    feedbacks.push(entry);

    // Log it (Vercel retains logs)
    console.log("[FEEDBACK]", entry);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const auth = req.nextUrl.searchParams.get("key");
  if (auth !== "jadebuzz-feedback-admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ feedbacks, total: feedbacks.length });
}
