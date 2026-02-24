import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

const ORDERS_URL = `${GATEWAY_URL}/commands/orders`;

function getAccessTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/\baccessToken=([^;]+)/);
  return match ? match[1].trim() : null;
}

async function handleOrders(request: NextRequest) {
  try {
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

    const res = await fetch(ORDERS_URL, init);
    const data = await res.json().catch(() => ({}));

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/commands/orders]", err);
    return NextResponse.json(
      { message: "Service commands indisponible" },
      { status: 502 },
    );
  }
}

export const GET = handleOrders;
export const POST = handleOrders;

