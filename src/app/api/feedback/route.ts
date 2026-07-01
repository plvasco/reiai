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

    // Send instant email notification via SES
    try {
      const { SESClient, SendEmailCommand } = await import("@aws-sdk/client-ses");
      const client = new SESClient({
        region: "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
      });
      const typeEmoji: Record<string, string> = { bug: "🐛", feature: "💡", data: "📊", general: "💬" };
      await client.send(new SendEmailCommand({
        Source: "pietto.vasco@gmail.com",
        Destination: { ToAddresses: ["pietto.vasco@gmail.com"] },
        Message: {
          Subject: { Data: `💬 New Feedback: ${entry.name} — ${typeEmoji[entry.type] || "💬"} ${entry.type}` },
          Body: { Text: { Data: [
            `New feedback from ${entry.name} (${entry.email})`,
            ``,
            `Type: ${entry.type}`,
            `Message: ${entry.message}`,
            `Time: ${entry.timestamp}`,
          ].join("\n") } },
        },
      }));
    } catch {}

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
