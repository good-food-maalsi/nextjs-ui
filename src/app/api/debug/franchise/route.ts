import { NextResponse } from "next/server";
import { serverSession } from "@/lib/session/server-session";
import { createAuthenticatedFranchiseClient } from "@/lib/config/ts-rest-client";

/**
 * Route de debug pour diagnostiquer "Aucune franchise associée".
 * GET /api/debug/franchise - à supprimer en production
 */
export async function GET() {
  const session = await serverSession.getServerSession();
  const accessToken = await serverSession.getAccessToken();
  const franchiseId = session?.franchise_id;

  const result: Record<string, unknown> = {
    hasSession: !!session,
    franchise_id: franchiseId,
    hasAccessToken: !!accessToken,
  };

  if (!franchiseId || !accessToken) {
    return NextResponse.json(result);
  }

  try {
    const client = createAuthenticatedFranchiseClient(accessToken);
    const response = await client.franchises.getById({
      params: { id: franchiseId },
    });
    result.apiStatus = response.status;
    result.apiBody = response.body;
  } catch (err) {
    result.apiError = err instanceof Error ? err.message : String(err);
    if (err && typeof err === "object" && "response" in err) {
      const r = (err as { response?: { status?: number; data?: unknown } })
        .response;
      result.apiStatus = r?.status;
      result.apiData = r?.data;
    }
  }

  return NextResponse.json(result);
}
