import { NextRequest, NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const LEAD_REPORT_URL = "https://houston-re-report.s3.us-east-1.amazonaws.com/leads-db/sample/77020_lead_report.html";
const LEAD_REPORT_PDF = "https://houston-re-report.s3.us-east-1.amazonaws.com/leads-db/sample/77020_lead_report.html";

const WELCOME_EMAIL_HTML = (name: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; background: #0b0f1a; color: #e2e8f0; padding: 40px;">
  <div style="max-width: 560px; margin: 0 auto;">
    <h1 style="color: #06b6d4; font-size: 24px;">Welcome to JadeBuzz Analytics 🏛️</h1>
    <p style="color: #94a3b8; line-height: 1.6;">Hi ${name || "investor"},</p>
    <p style="color: #94a3b8; line-height: 1.6;">
      You now have free access to the Houston RE Intelligence Dashboard. 
      Here's what's waiting for you:
    </p>
    <ul style="color: #94a3b8; line-height: 1.8;">
      <li>📊 <strong style="color: #e2e8f0;">32 ZIP codes</strong> tracked with live DOM, price, rent & yield data</li>
      <li>🏛️ <strong style="color: #e2e8f0;">836+ foreclosure filings</strong> across Harris & Fort Bend counties</li>
      <li>📈 <strong style="color: #e2e8f0;">Growth scoring & gentrification clock</strong> — find emerging markets before they spike</li>
      <li>🧮 <strong style="color: #e2e8f0;">Deal calculator</strong> — cap rates, cash flow, DSCR, BRRRR analysis</li>
    </ul>

    <div style="background: #131a2b; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h2 style="color: #06b6d4; font-size: 16px; margin-top: 0;">🔥 Free Sample: 77020 Distressed Lead List</h2>
      <p style="color: #94a3b8; font-size: 13px;">
        25 hot properties in Denver Harbor — the fastest-accelerating ZIP in Houston (27d median DOM, 8.9% yield). 
        Includes owner names, market values, ARV estimates, and map links.
      </p>
      <a href="${LEAD_REPORT_URL}" 
         style="display: inline-block; background: #06b6d4; color: #0b0f1a; text-decoration: none; 
                padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">
        📄 View Sample Lead Report
      </a>
    </div>

    <div style="background: #131a2b; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h2 style="color: #06b6d4; font-size: 16px; margin-top: 0;">🚀 Go Pro — $39/mo</h2>
      <p style="color: #94a3b8; font-size: 13px;">
        Unlock unlimited distressed leads, yield columns, property comps, PDF exports, SMS alerts, 
        and weekly batch lead refresh. 
      </p>
      <a href="https://reiai-mu.vercel.app/pricing" 
         style="display: inline-block; background: #10b981; color: #0b0f1a; text-decoration: none; 
                padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">
        🔓 Upgrade to Pro
      </a>
    </div>

    <p style="color: #5a6577; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 16px;">
      JadeBuzz Analytics · Houston, TX · <a href="https://jadebuzz.com" style="color: #06b6d4;">jadebuzz.com</a>
    </p>
  </div>
</body>
</html>`;

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

      // Welcome email — send to the new signer with the lead report
      // SES sandbox: only verified emails. Your Gmail is verified.
      // To send to any email: request production access at
      // https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html
      try {
        await client.send(new SendEmailCommand({
          Source: "pietto.vasco@gmail.com",
          Destination: { ToAddresses: ["pietto.vasco@gmail.com"] }, // sandbox — send to you for now
          Message: {
            Subject: { Data: `🎉 Welcome to JadeBuzz, ${displayName}!` },
            Body: {
              Html: { Data: WELCOME_EMAIL_HTML(displayName) },
            },
          },
        }));
        console.log(`[SES] Welcome sent to ${email}`);
      } catch (welcomeErr) {
        console.error("[SES WELCOME ERROR]", welcomeErr);
      }
    } catch (sesError) {
      // Log but don't block — user still gets access
      console.error("[SES ERROR]", sesError);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
