import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const path = request.nextUrl.pathname;

  if (path === "/") {
    let url = new URL("/about", request.url);
    if (request.cookies.has("project"))
      url = new URL("/dashboard", request.url);
    else if (request.cookies.has("user")) url = new URL("/about", request.url);
    return NextResponse.redirect(url);
  } else if (path.startsWith("/dashboard")) {
    let url = "/sign-in";
    if (request.cookies.has("project")) return NextResponse.next();
    if (request.cookies.has("user")) url = "/projects";
    return NextResponse.redirect(new URL(url, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/(.*)"],
};
