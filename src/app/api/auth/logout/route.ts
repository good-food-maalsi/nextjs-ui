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
    });
    const data = await res.json();
    const nextRes = NextResponse.json(data, { status: res.status });
    nextRes.cookies.delete("accessToken");
    nextRes.cookies.delete("refreshToken");
    return nextRes;
  } catch (err) {
    console.error("[api/auth/logout]", err);
    const res = NextResponse.json({ message: "Logout failed" }, { status: 500 });
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    return res;
  }
}
