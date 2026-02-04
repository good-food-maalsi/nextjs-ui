import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stockFranchiseHandler } from "@/lib/api/handlers/stock-franchise.handler";
import {
  stockFranchiseIdSchema,
  updateStockFranchiseSchema,
} from "@/lib/api/validators/stock-franchise.validator";
import { handleError } from "@/lib/api/errors/error-handler";
import { authMiddleware } from "../../_middleware/auth.middleware";
import { validateFranchiseAccess } from "@/lib/api/utils/franchise-permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authMiddleware(request);

    const { id } = stockFranchiseIdSchema.parse(await params);
    const result = await stockFranchiseHandler.getStockById(id);

    // Vérifier l'accès à cette franchise
    validateFranchiseAccess(user, result.franchise_id);

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authMiddleware(request);

    const { id } = stockFranchiseIdSchema.parse(await params);

    // Récupérer le stock pour vérifier l'accès
    const existingStock = await stockFranchiseHandler.getStockById(id);

    // Vérifier l'accès à cette franchise
    validateFranchiseAccess(user, existingStock.franchise_id);

    const body = await request.json();
    const data = updateStockFranchiseSchema.parse(body);

    const result = await stockFranchiseHandler.updateStock(id, data);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authMiddleware(request);

    const { id } = stockFranchiseIdSchema.parse(await params);

    // Récupérer le stock pour vérifier l'accès
    const existingStock = await stockFranchiseHandler.getStockById(id);

    // Vérifier l'accès à cette franchise
    validateFranchiseAccess(user, existingStock.franchise_id);

    const result = await stockFranchiseHandler.deleteStock(id);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
