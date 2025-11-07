import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { franchiseHandler } from "@/lib/api/handlers/franchise.handler";
import {
  createFranchiseSchema,
  franchiseQuerySchema,
} from "@/lib/api/validators/franchise.validator";
import { handleError } from "@/lib/api/errors/error-handler";

/**
 * GET /api/franchises
 * Récupérer toutes les franchises avec pagination et filtres
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Parser et valider les paramètres de requête
    const { searchParams } = new URL(request.url);
    const queryParams = franchiseQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      city: searchParams.get("city"),
      state: searchParams.get("state"),
    });

    // Récupérer les franchises
    const result = await franchiseHandler.getFranchises(queryParams);

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/franchises
 * Créer une nouvelle franchise
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Parser et valider le body
    const body = await request.json();
    const validatedData = createFranchiseSchema.parse(body);

    // Créer la franchise
    const franchise = await franchiseHandler.createFranchise(validatedData);

    return NextResponse.json(franchise, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
