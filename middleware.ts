import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest): NextResponse {
  const path = request.nextUrl.pathname;

  if (path === "/") {
    let url = new URL("/about", request.url);
    if (request.cookies.has("token")) url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  } else if (path.startsWith("/dashboard")) {
    let url = new URL("/sign-in", request.url);
    if (request.cookies.has("token")) return NextResponse.next();
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/dashboard", "/dashboard/(.*)"],
};
