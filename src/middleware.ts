import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Host-based routing:
 * - offers.jadebuzz.com (and its vercel redirect) root → serve the
 *   seller cash-offer form at /offers. FB ads point here.
 * Other domains keep their normal behavior.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";

  const isOffersHost = host.startsWith("offers.") || host === "offers.jadebuzz.com";

  // Root (or trailing slash) on the offers host → rewrite to the seller form.
  if (isOffersHost && (pathname === "/" || pathname === "")) {
    const url = req.nextUrl.clone();
    url.pathname = "/offers";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
