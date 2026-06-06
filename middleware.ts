import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect /portal → /client-portal/login (backward compat)
  if (pathname === "/portal") {
    return NextResponse.redirect(new URL("/client-portal/login", request.url));
  }

  // Unauthenticated user trying to access protected routes
  if (!user && pathname !== "/client-portal/login" && (
    pathname.startsWith("/client-portal") || pathname.startsWith("/admin")
  )) {
    return NextResponse.redirect(new URL("/client-portal/login", request.url));
  }

  // Authenticated user hitting login page → redirect by role
  if (user && pathname === "/client-portal/login") {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("auth_user_id", user.id)
      .single();

    if (profile?.role === "admin" || profile?.role === "super_admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/client-portal/dashboard", request.url));
  }

  // Admin-only routes
  if (pathname.startsWith("/admin") && user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("auth_user_id", user.id)
      .single();

    if (profile?.role !== "admin" && profile?.role !== "super_admin") {
      return NextResponse.redirect(new URL("/client-portal/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/portal",
    "/client-portal/:path*",
    "/admin/:path*",
  ],
};
