import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { ingredientHandler } from "@/lib/api/handlers/ingredient.handler";
import {
  updateIngredientSchema,
  ingredientIdSchema,
} from "@/lib/api/validators/ingredient.validator";
import { handleError } from "@/lib/api/errors/error-handler";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/ingredients/:id
 * Récupérer un ingrédient par ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const validatedParams = ingredientIdSchema.parse({ id });

    // Récupérer l'ingrédient
    const ingredient = await ingredientHandler.getIngredientById(
      validatedParams.id
    );

    return NextResponse.json(ingredient);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/ingredients/:id
 * Mettre à jour un ingrédient
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const validatedParams = ingredientIdSchema.parse({ id });

    // Parser et valider le body
    const body = await request.json();
    const validatedData = updateIngredientSchema.parse(body);

    // Mettre à jour l'ingrédient
    const ingredient = await ingredientHandler.updateIngredient(
      validatedParams.id,
      validatedData
    );

    return NextResponse.json(ingredient);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/ingredients/:id
 * Supprimer un ingrédient
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const validatedParams = ingredientIdSchema.parse({ id });

    // Supprimer l'ingrédient
    await ingredientHandler.deleteIngredient(validatedParams.id);

    return NextResponse.json(
      { message: "Ingredient deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
