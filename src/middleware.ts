import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Subdomain-based routing for the JadeBuzz reiai app:
 *   - jadebuzz.com / www.jadebuzz.com  (root /) → MARKETING page      [/marketing]
 *   - dashboard.jadebuzz.com          (root /) → REI dashboard       [/]
 *   - offers.jadebuzz.com             (root /) → seller cash-offer    [/offers]
 *
 * Sub-paths pass through normally.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = (req.headers.get("host") || "").toLowerCase();

  // Only act on the root path; let sub-paths pass through normally.
  const isRoot = pathname === "/" || pathname === "";

  if (!isRoot) {
    return NextResponse.next();
  }

  const isOffersHost = host.startsWith("offers.");
  const isDashboardHost = host.startsWith("dashboard.");

  if (isOffersHost) {
    // Offers host root → rewrite to the seller form.
    const url = req.nextUrl.clone();
    url.pathname = "/offers";
    return NextResponse.rewrite(url);
  }

  if (isDashboardHost) {
    // Dashboard host root → serve the dashboard (default root page).
    return NextResponse.next();
  }

  // jadebuzz.com / www.jadebuzz.com root → marketing page.
  const url = req.nextUrl.clone();
  url.pathname = "/marketing";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/"],
};
