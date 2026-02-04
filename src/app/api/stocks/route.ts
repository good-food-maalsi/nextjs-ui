import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stockFranchiseHandler } from "@/lib/api/handlers/stock-franchise.handler";
import {
  stockFranchiseQuerySchema,
  createStockFranchiseSchema,
} from "@/lib/api/validators/stock-franchise.validator";
import { handleError } from "@/lib/api/errors/error-handler";
import { authMiddleware } from "../_middleware/auth.middleware";
import { resolveFranchiseId } from "@/lib/api/utils/franchise-permissions";

export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request);

    const { searchParams } = new URL(request.url);
    const params = stockFranchiseQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      franchise_id: searchParams.get("franchise_id"),
    });

    // Résoudre le franchise_id selon le rôle de l'utilisateur
    const franchiseId = resolveFranchiseId(user, params.franchise_id);

    const result = await stockFranchiseHandler.getStocks({
      ...params,
      franchise_id: franchiseId,
    });
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request);

    const body = await request.json();
    const data = createStockFranchiseSchema.parse(body);

    // Résoudre le franchise_id (ignorer celui du body pour utilisateurs normaux)
    const franchiseId = resolveFranchiseId(user, data.franchise_id);

    const result = await stockFranchiseHandler.createStock({
      ...data,
      franchise_id: franchiseId,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
