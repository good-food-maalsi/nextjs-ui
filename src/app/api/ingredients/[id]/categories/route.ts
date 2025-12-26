import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { ingredientHandler } from "@/lib/api/handlers/ingredient.handler";
import {
  ingredientIdSchema,
  addCategoriesToIngredientSchema,
} from "@/lib/api/validators/ingredient.validator";
import { handleError } from "@/lib/api/errors/error-handler";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/ingredients/:id/categories
 * Récupérer les catégories d'un ingrédient
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const validatedParams = ingredientIdSchema.parse({ id });

    // Récupérer les catégories
    const categories = await ingredientHandler.getIngredientCategories(
      validatedParams.id
    );

    return NextResponse.json({ data: categories });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/ingredients/:id/categories
 * Ajouter/créer des catégories à un ingrédient
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const validatedParams = ingredientIdSchema.parse({ id });

    // Parser et valider le body
    const body = await request.json();
    const validatedData = addCategoriesToIngredientSchema.parse(body);

    // Ajouter les catégories
    const categories = await ingredientHandler.addCategoriesToIngredient(
      validatedParams.id,
      validatedData
    );

    return NextResponse.json({ data: categories }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
