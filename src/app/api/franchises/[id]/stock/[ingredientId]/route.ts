import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { franchiseHandler } from "@/lib/api/handlers/franchise.handler";
import {
  stockIdsSchema,
  updateStockQuantitySchema,
} from "@/lib/api/validators/stock.validator";
import { handleError } from "@/lib/api/errors/error-handler";

interface RouteParams {
  params: Promise<{ id: string; ingredientId: string }>;
}

/**
 * PUT /api/franchises/:id/stock/:ingredientId
 * Mettre à jour la quantité en stock
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider les IDs
    const { id, ingredientId } = await params;
    const validatedParams = stockIdsSchema.parse({
      franchiseId: id,
      ingredientId,
    });

    // Parser et valider le body
    const body = await request.json();
    const validatedData = updateStockQuantitySchema.parse(body);

    // Mettre à jour le stock
    const stock = await franchiseHandler.updateFranchiseStockQuantity(
      validatedParams.franchiseId,
      validatedParams.ingredientId,
      validatedData
    );

    return NextResponse.json(stock);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/franchises/:id/stock/:ingredientId
 * Supprimer une entrée de stock
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider les IDs
    const { id, ingredientId } = await params;
    const validatedParams = stockIdsSchema.parse({
      franchiseId: id,
      ingredientId,
    });

    // Supprimer le stock
    const result = await franchiseHandler.deleteFranchiseStock(
      validatedParams.franchiseId,
      validatedParams.ingredientId
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
