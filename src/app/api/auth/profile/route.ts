import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

/**
 * Proxy GET /auth/profile : envoie les cookies same-origin au gateway.
 */
export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") ?? "";
    const res = await fetch(`${GATEWAY_URL}/auth/profile`, {
      method: "GET",
      headers: { cookie },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/auth/profile]", err);
    return NextResponse.json(
      { error: "Profil indisponible" },
      { status: 500 },
    );
  }
}
