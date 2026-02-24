import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

function getAccessTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/\baccessToken=([^;]+)/);
  return match ? match[1].trim() : null;
}

async function proxy(
  request: NextRequest,
  context: { params: { path?: string[] } },
) {
  try {
    const path = context.params.path ?? [];
    const pathStr = path.length ? path.join("/") : "";
    const url = `${GATEWAY_URL}/commands/${pathStr}`;

    const cookie = request.headers.get("cookie") ?? "";
    const accessToken = getAccessTokenFromCookie(cookie);

    const headers: Record<string, string> = {
      cookie,
      "Content-Type": "application/json",
    };
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const init: RequestInit = {
      method: request.method,
      headers,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      const body = await request.text();
      if (body) init.body = body;
    }

    const res = await fetch(url, init);
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/commands proxy]", err);
    return NextResponse.json(
      { message: "Service commands indisponible" },
      { status: 502 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;

