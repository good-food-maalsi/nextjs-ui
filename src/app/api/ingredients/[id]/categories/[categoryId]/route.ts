import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { ingredientHandler } from "@/lib/api/handlers/ingredient.handler";
import { handleError } from "@/lib/api/errors/error-handler";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string; categoryId: string }>;
}

const ingredientCategoryIdsSchema = z.object({
  id: z.uuid("Invalid ingredient ID format"),
  categoryId: z.uuid("Invalid category ID format"),
});

/**
 * DELETE /api/ingredients/:id/categories/:categoryId
 * Retirer une catégorie d'un ingrédient
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider les IDs
    const { id, categoryId } = await params;
    const validatedParams = ingredientCategoryIdsSchema.parse({ id, categoryId });

    // Retirer la catégorie
    const result = await ingredientHandler.removeCategoryFromIngredient(
      validatedParams.id,
      validatedParams.categoryId
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
