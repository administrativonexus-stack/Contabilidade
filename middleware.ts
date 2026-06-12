import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/portal") {
    return NextResponse.redirect(new URL("/client-portal/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/portal"],
};
