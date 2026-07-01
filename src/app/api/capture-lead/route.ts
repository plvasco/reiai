import { NextRequest, NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export async function POST(req: NextRequest) {
  try {
    const { email, name, source } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const displayName = name?.trim() || "Houston investor";
    const now = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "full",
      timeStyle: "short",
    });

    // Send notification to you via AWS SES
    try {
      const client = new SESClient({
        region: "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
      });

      // Notification to you (SES sandbox — can only send to verified emails)
      await client.send(new SendEmailCommand({
        Source: "pietto.vasco@gmail.com",
        Destination: { ToAddresses: ["pietto.vasco@gmail.com"] },
        Message: {
          Subject: { Data: `🏛️ New JadeBuzz Signup — ${displayName}` },
          Body: {
            Text: {
              Data: [
                `New dashboard signup!`,
                ``,
                `Name: ${displayName}`,
                `Email: ${email}`,
                `Source: ${source || "landing-page"}`,
                `Time: ${now}`,
                `Total: TODO`,
                ``,
                `— JadeBuzz Analytics`,
              ].join("\n"),
            },
          },
        },
      }));

      // Welcome email - SES sandbox limits us to verified recipients only
      // Request production access at:
      // https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html
      // Once approved, uncomment below to auto-send welcome emails
    } catch (sesError) {
      // Log but don't block — user still gets access
      console.error("[SES ERROR]", sesError);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
