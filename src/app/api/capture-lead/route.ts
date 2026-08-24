import { NextRequest, NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { screenSellerAddress } from "@/lib/screenSeller";

// --- Our S3-backed seller-leads store (one JSON object per lead) ---
const LEADS_BUCKET = "houston-re-report";
const LEADS_PREFIX = "seller-leads/";

const AWS_CFG = () => ({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Persist a seller lead as a JSON object in S3.
 * Uses a unique key per lead (timestamp + random) to avoid
 * read-then-write race conditions on a shared append log.
 */
async function persistLeadToS3(lead: Record<string, unknown>): Promise<boolean> {
  try {
    const s3 = new S3Client(AWS_CFG());
    const ts = lead["captured_at"] as string;
    const rand = Math.random().toString(36).slice(2, 8);
    const Key = `${LEADS_PREFIX}${ts.replace(/[^0-9T-Z:-]/g, "").replace(/[:.]/g, "-")}_${rand}.json`;
    await s3.send(new PutObjectCommand({
      Bucket: LEADS_BUCKET,
      Key,
      Body: JSON.stringify(lead, null, 2),
      ContentType: "application/json",
    }));
    return true;
  } catch (e: any) {
    console.error("[S3 persist lead]", e?.message);
    return false;
  }
}

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
    const { email, name, source, phone, address, timeline, consent, consent_at } = await req.json();

    const displayName = name?.trim() || "Houston investor";
    const now = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "full",
      timeStyle: "short",
    });
    const iso = new Date().toISOString();

    // --- PERSIST the full seller lead to S3 (the vital fix) ---
    // Capture name, phone, address, timeline — the data the page submits
    // but the old handler silently dropped.
    const sellerLead: Record<string, unknown> = {
      type: "seller_lead",
      captured_at: iso,
      captured_at_ct: now,
      name: displayName,
      phone: phone?.trim() || "",
      address: address?.trim() || "",
      timeline: timeline || "",
      source: source || "offers-page",
      status: "new",
      screened: false,
      consent: !!consent,
      consent_at: consent_at || null,
    };
    const persisted = await persistLeadToS3(sellerLead);
    console.log(`[LEAD PERSIST] ${persisted ? "OK" : "FAILED"} — ${sellerLead.address}`);

    // --- 2. Distress screening: score the seller's address (HOT/WARM/COLD) ---
    // Query our 229K-parcel DB via the deal API, tag the lead tier.
    const screening = await screenSellerAddress(sellerLead.address as string);

    // Attach screening result to the lead record. Always persist the
    // screening status (incl. reason) so we can diagnose & rank.
    const enrichedLead = {
      ...sellerLead,
      screened: screening.screened,
      score: screening.score,
      tier: screening.tier,
      parcel: screening.parcel ?? undefined,
      screen_reason: screening.reason,
    };
    await persistLeadToS3({ ...enrichedLead, kind: "screened" });

    // --- Return persistence status + screening so we can verify end-to-end ---
    const result = NextResponse.json({
      success: true,
      persisted,
      screening: {
        tier: screening.tier,
        score: screening.score,
      },
      lead_id: sellerLead.captured_at,
    });
    if (!persisted) {
      result.headers.set("x-lead-persisted", "false");
    }

    // Send notification to you via AWS SES
    try {
      const client = new SESClient({
        region: "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
      });

      // Notification to you — a NEW SELLER LEAD (Product 4)
      await client.send(new SendEmailCommand({
        Source: "pietto.vasco@gmail.com",
        Destination: { ToAddresses: ["pietto.vasco@gmail.com"] },
        Message: {
          Subject: { Data: `🏠 NEW SELLER LEAD — ${sellerLead.address}` },
          Body: {
            Text: {
              Data: [
                `A seller submitted a cash-offer request!`,
                ``,
                `Name: ${sellerLead.name}`,
                `Phone: ${sellerLead.phone}`,
                `Address: ${sellerLead.address}`,
                `Timeline: ${sellerLead.timeline || "n/a"}`,
                ``,
                `DISTRESS SCREEN: ${screening.tier}${screening.score != null ? ` (${screening.score}/100)` : ""}`,
                `Parcel owner: ${screening.parcel?.owner || "n/a"}`,
                `Market value: ${screening.parcel?.market_value != null ? "$" + screening.parcel.market_value.toLocaleString() : "n/a"}`,
                `Out-of-state owner: ${screening.parcel?.out_of_state ? "YES" : "no"}`,
                ``,
                `Source: ${sellerLead.source}`,
                `Time: ${sellerLead.captured_at_ct}`,
                ``,
                `S3 persisted: ${persisted ? "YES" : "NO — CHECK"}`,
                ``,
                `— JadeBuzz Analytics (Product 4 seller lead)`,
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

    return result;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
