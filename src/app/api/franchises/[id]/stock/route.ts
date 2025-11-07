import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { franchiseHandler } from "@/lib/api/handlers/franchise.handler";
import { franchiseIdSchema } from "@/lib/api/validators/franchise.validator";
import { handleError } from "@/lib/api/errors/error-handler";

/**
 * GET /api/franchises/[id]/stock
 * Récupérer le stock d'une franchise
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const { id: franchiseId } = franchiseIdSchema.parse({ id });

    // Récupérer le stock
    const stock = await franchiseHandler.getFranchiseStock(franchiseId);

    return NextResponse.json(stock);
  } catch (error) {
    return handleError(error);
  }
}
