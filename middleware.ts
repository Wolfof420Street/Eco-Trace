import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0, isAuth0Configured } from "@/src/infrastructure/auth0/client";

export async function middleware(req: NextRequest) {
  if (isAuth0Configured) {
    return auth0.middleware(req);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"]
};
