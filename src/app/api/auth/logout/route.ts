import { NextResponse } from "next/server";

const GATEWAY_URL =
    process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

/**
 * Proxy logout : appelle le gateway et efface les cookies same-origin.
 */
export async function GET(request: Request) {
    try {
        const cookie = request.headers.get("cookie") ?? "";
        const res = await fetch(`${GATEWAY_URL}/auth/logout`, {
            method: "GET",
            headers: { cookie },
            cache: "no-store",
        });

        let data = {};
        try {
            const text = await res.text();
            if (text) data = JSON.parse(text);
        } catch (e) {
            // Ignore JSON parse errors for empty responses from the API
        }

        // Always return 200 OK to the client to ensure cookies are cleared locally
        const nextRes = NextResponse.json(data, { status: 200 });
        nextRes.cookies.delete("accessToken");
        nextRes.cookies.delete("refreshToken");
        return nextRes;
    } catch (err) {
        console.error("[api/auth/logout]", err);
        // Even if the gateway request fails, we want the client to clear cookies and redirect to login
        const res = NextResponse.json(
            { message: "Logout locally successful (upstream failed)" },
            { status: 200 },
        );
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
        return res;
    }
}
