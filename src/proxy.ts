import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, extractRoles } from "@/lib/utils/token.utils";

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

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

function parseCookieStr(
  cookieStr: string,
): { name: string; value: string; maxAge?: number } | null {
  const [nameValue, ...rest] = cookieStr.split(";").map((s) => s.trim());
  const eq = nameValue.indexOf("=");
  if (eq === -1) return null;
  const name = nameValue.slice(0, eq);
  const value = nameValue.slice(eq + 1);
  if (!name || !value) return null;
  let maxAge: number | undefined;
  for (const part of rest) {
    const [k, v] = part.split("=").map((s) => s.trim());
    if (k?.toLowerCase() === "max-age" && v) maxAge = parseInt(v, 10);
  }
  return { name, value, maxAge };
}

/**
 * Essaie de rafraîchir le token via le gateway.
 * Retourne le nouveau accessToken si succès, null sinon.
 */
async function tryRefresh(
  request: NextRequest,
): Promise<{
  accessToken: string;
  cookies: Array<{ name: string; value: string; maxAge?: number }>;
} | null> {
  try {
    const refreshRes = await fetch(`${GATEWAY_URL}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: request.headers.get("cookie") ?? "" },
    });

    if (!refreshRes.ok) return null;

    const setCookies = (refreshRes.headers as Headers).getSetCookie?.() ?? [];
    if (!setCookies.length) {
      const raw = refreshRes.headers.get("set-cookie");
      if (raw) setCookies.push(raw);
    }

    const parsed = setCookies
      .map(parseCookieStr)
      .filter((c): c is NonNullable<typeof c> => c !== null);

    const newAccessToken = parsed.find((c) => c.name === "accessToken")?.value;
    if (!newAccessToken) return null;

    return { accessToken: newAccessToken, cookies: parsed };
  } catch {
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Allow public routes (login, register, etc.)
  // But if the user already has a valid session (or can refresh), redirect to dashboard
  if (isPublicRoute(pathname)) {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (accessToken) {
      const payload = await decrypt(accessToken);
      if (payload) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    if (request.cookies.get("refreshToken")?.value) {
      const refreshed = await tryRefresh(request);
      if (refreshed) {
        const payload = await decrypt(refreshed.accessToken);
        if (payload) {
          const redirectTo =
            request.nextUrl.searchParams.get("redirect") ?? "/dashboard";
          const response = NextResponse.redirect(
            new URL(redirectTo, request.url),
          );
          for (const { name, value, maxAge } of refreshed.cookies) {
            response.cookies.set(name, value, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              ...(maxAge !== undefined && { maxAge }),
            });
          }
          return response;
        }
      }
    }

    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  // No accessToken: try to refresh before giving up
  if (!accessToken) {
    const hasRefreshToken = !!request.cookies.get("refreshToken")?.value;

    if (!hasRefreshToken) {
      const loginUrl = new URL("/dashboard/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const refreshed = await tryRefresh(request);
    if (!refreshed) {
      const loginUrl = new URL("/dashboard/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("refreshToken");
      return response;
    }

    // Refresh succeeded: verify the new token then continue with cookies set
    const payload = await decrypt(refreshed.accessToken);
    if (!payload) {
      const loginUrl = new URL("/dashboard/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRoles = extractRoles(payload);
    const hasAllowedRole = userRoles.some((role) =>
      DASHBOARD_ALLOWED_ROLES.includes(role),
    );
    if (!hasAllowedRole) {
      const unauthorizedUrl = new URL("/dashboard/login", request.url);
      unauthorizedUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(unauthorizedUrl);
    }

    const response = NextResponse.next();
    for (const { name, value, maxAge } of refreshed.cookies) {
      response.cookies.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        ...(maxAge !== undefined && { maxAge }),
      });
    }
    return response;
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
