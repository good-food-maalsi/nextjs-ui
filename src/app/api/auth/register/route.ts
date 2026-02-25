import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const GATEWAY_URL =
    process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

/**
 * Proxy register pour définir les cookies sur la même origine (localhost:3000).
 * Délègue POST /auth/register au gateway et renvoie les cookies Set-Cookie.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const res = await fetch(`${GATEWAY_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        let data: Record<string, unknown>;
        const contentType = res.headers.get("content-type") ?? "";
        try {
            data = contentType.includes("application/json")
                ? await res.json()
                : {
                      error: "Service d'authentification indisponible. Réessayez plus tard.",
                  };
        } catch {
            data =
                res.status >= 500
                    ? {
                          error: "Service temporairement indisponible. Réessayez dans quelques instants.",
                      }
                    : { error: "Inscription impossible" };
        }
        const nextRes = NextResponse.json(data, { status: res.status });

        if (res.ok) {
            const setCookies = (res.headers as Headers).getSetCookie?.() ?? [];
            if (setCookies.length === 0) {
                const raw = res.headers.get("set-cookie");
                if (raw) setCookies.push(raw);
            }
            for (const cookieStr of setCookies) {
                const [nameValue, ...rest] = cookieStr
                    .split(";")
                    .map((s) => s.trim());
                const eq = nameValue.indexOf("=");
                const name = nameValue.slice(0, eq);
                const value = nameValue.slice(eq + 1);
                if (name && value) {
                    const options: Record<string, string | number | boolean> = {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        path: "/",
                        ...(process.env.COOKIE_DOMAIN && {
                            domain: process.env.COOKIE_DOMAIN,
                        }),
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
        console.error("[api/auth/register]", err);
        return NextResponse.json(
            { error: "Inscription impossible" },
            { status: 500 },
        );
    }
}
