import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { ingredientHandler } from "@/lib/api/handlers/ingredient.handler";
import {
  createIngredientSchema,
  ingredientQuerySchema,
} from "@/lib/api/validators/ingredient.validator";
import { handleError } from "@/lib/api/errors/error-handler";

/**
 * GET /api/ingredients
 * Récupérer tous les ingrédients avec pagination et filtres
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Parser et valider les paramètres de requête
    const { searchParams } = new URL(request.url);
    const queryParams = ingredientQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      supplier_id: searchParams.get("supplier_id"),
      category_id: searchParams.get("category_id"),
    });

    // Récupérer les ingrédients
    const result = await ingredientHandler.getIngredients(queryParams);

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/ingredients
 * Créer un nouvel ingrédient
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Parser et valider le body
    const body = await request.json();
    const validatedData = createIngredientSchema.parse(body);

    // Créer l'ingrédient
    const ingredient = await ingredientHandler.createIngredient(validatedData);

    return NextResponse.json(ingredient, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
