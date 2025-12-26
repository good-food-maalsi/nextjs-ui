import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { franchiseHandler } from "@/lib/api/handlers/franchise.handler";
import { franchiseIdSchema } from "@/lib/api/validators/franchise.validator";
import { upsertStockSchema } from "@/lib/api/validators/stock.validator";
import { handleError } from "@/lib/api/errors/error-handler";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/franchises/:id/stock
 * Récupérer le stock d'une franchise
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const { id: franchiseId } = franchiseIdSchema.parse({ id });

    // Récupérer le stock
    const stock = await franchiseHandler.getFranchiseStock(franchiseId);

    return NextResponse.json({ data: stock });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/franchises/:id/stock
 * Ajouter ou mettre à jour du stock
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const { id: franchiseId } = franchiseIdSchema.parse({ id });

    // Parser et valider le body
    const body = await request.json();
    const validatedData = upsertStockSchema.parse(body);

    // Ajouter/mettre à jour le stock
    const stock = await franchiseHandler.upsertFranchiseStock(
      franchiseId,
      validatedData
    );

    return NextResponse.json(stock, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
