import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, extractRoles } from "@/lib/utils/token.utils";

// Roles allowed to access the dashboard
const DASHBOARD_ALLOWED_ROLES = ["ADMIN", "FRANCHISE_OWNER", "STAFF"];

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/dashboard/login",
  "/dashboard/register",
  "/dashboard/request-password-reset",
  "/dashboard/reset-password",
];

// Check if a path is a public route
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Allow public routes (login, register, etc.)
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get access token from cookies
  const accessToken = request.cookies.get("accessToken")?.value;

  // No token = redirect to login
  if (!accessToken) {
    const loginUrl = new URL("/dashboard/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token and check role
  const payload = await decrypt(accessToken);

  if (!payload) {
    // Invalid token = redirect to login
    const loginUrl = new URL("/dashboard/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    // Clear invalid cookies
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  // Check if user has an allowed role
  const userRoles = extractRoles(payload);
  const hasAllowedRole = userRoles.some((role) =>
    DASHBOARD_ALLOWED_ROLES.includes(role),
  );

  if (!hasAllowedRole) {
    // User doesn't have permission - redirect to unauthorized page or login
    const unauthorizedUrl = new URL("/dashboard/login", request.url);
    unauthorizedUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(unauthorizedUrl);
  }

  // User is authenticated and authorized
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all dashboard routes except static files
    "/dashboard/:path*",
  ],
};
