import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Subdomain-based routing for the JadeBuzz reiai app:
 *   - offers.jadebuzz.com  (root /)  → seller cash-offer form   [/offers]
 *   - dashboard.jadebuzz.com (root /)→ REI dashboard            [/]
 *   - jadebuzz.com / www.jadebuzz.com → marketing/dashboard root
 *
 * FB ads point sellers at offers.jadebuzz.com; the dashboard uses
 * dashboard.jadebuzz.com. This keeps the two products on separate
 * URLs that don't collide.
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

  // dashboard. and jadebuzz.com/www hosts serve the dashboard at root (default).
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
