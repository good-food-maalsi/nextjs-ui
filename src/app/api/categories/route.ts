import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { categoryHandler } from "@/lib/api/handlers/category.handler";
import {
  createCategorySchema,
  categoryQuerySchema,
} from "@/lib/api/validators/category.validator";
import { handleError } from "@/lib/api/errors/error-handler";

/**
 * GET /api/categories
 * Récupérer toutes les catégories avec pagination et filtres
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Parser et valider les paramètres de requête
    const { searchParams } = new URL(request.url);
    const queryParams = categoryQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
    });

    // Récupérer les catégories
    const result = await categoryHandler.getCategories(queryParams);

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/categories
 * Créer une nouvelle catégorie
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Parser et valider le body
    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);

    // Créer la catégorie
    const category = await categoryHandler.createCategory(validatedData);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
