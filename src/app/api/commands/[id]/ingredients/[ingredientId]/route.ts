import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { commandHandler } from "@/lib/api/handlers/command.handler";
import { updateCommandIngredientSchema } from "@/lib/api/validators/command.validator";
import { handleError } from "@/lib/api/errors/error-handler";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string; ingredientId: string }>;
}

const commandIngredientIdsSchema = z.object({
  id: z.uuid("Invalid command ID format"),
  ingredientId: z.uuid("Invalid ingredient ID format"),
});

/**
 * PUT /api/commands/:id/ingredients/:ingredientId
 * Mettre à jour la quantité d'un ingrédient dans une commande
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider les IDs
    const { id, ingredientId } = await params;
    const validatedParams = commandIngredientIdsSchema.parse({
      id,
      ingredientId,
    });

    // Parser et valider le body
    const body = await request.json();
    const validatedData = updateCommandIngredientSchema.parse(body);

    // Mettre à jour l'ingrédient
    const ingredient = await commandHandler.updateCommandIngredient(
      validatedParams.id,
      validatedParams.ingredientId,
      validatedData
    );

    return NextResponse.json(ingredient);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/commands/:id/ingredients/:ingredientId
 * Retirer un ingrédient d'une commande
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider les IDs
    const { id, ingredientId } = await params;
    const validatedParams = commandIngredientIdsSchema.parse({
      id,
      ingredientId,
    });

    // Retirer l'ingrédient
    const result = await commandHandler.removeIngredientFromCommand(
      validatedParams.id,
      validatedParams.ingredientId
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
