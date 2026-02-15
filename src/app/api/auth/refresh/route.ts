import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

/**
 * Proxy refresh : appelle le gateway et met à jour les cookies same-origin.
 */
export async function POST(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") ?? "";
    const res = await fetch(`${GATEWAY_URL}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: cookie },
      credentials: "include",
    });

    const data = await res.json();
    const nextRes = NextResponse.json(data, { status: res.status });

    if (res.ok) {
      const setCookies = (res.headers as Headers).getSetCookie?.() ?? [];
      if (setCookies.length === 0) {
        const raw = res.headers.get("set-cookie");
        if (raw) setCookies.push(raw);
      }
      for (const cookieStr of setCookies) {
        const [nameValue, ...rest] = cookieStr.split(";").map((s) => s.trim());
        const eq = nameValue.indexOf("=");
        const name = nameValue.slice(0, eq);
        const value = nameValue.slice(eq + 1);
        if (name && value) {
          const options: Record<string, string | number | boolean> = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          };
          for (const part of rest) {
            const [k, v] = part.split("=").map((s) => s.trim());
            if (k?.toLowerCase() === "max-age" && v) {
              options.maxAge = parseInt(v, 10);
              break;
            }
          }
          nextRes.cookies.set(name, value, options);
        }
      }
    }

    return nextRes;
  } catch (err) {
    console.error("[api/auth/refresh]", err);
    return NextResponse.json({ message: "Refresh failed" }, { status: 500 });
  }
}
