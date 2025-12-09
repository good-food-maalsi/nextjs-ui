import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { commandHandler } from "@/lib/api/handlers/command.handler";
import {
  commandIdSchema,
  addIngredientToCommandSchema,
} from "@/lib/api/validators/command.validator";
import { handleError } from "@/lib/api/errors/error-handler";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/commands/:id/ingredients
 * Récupérer les ingrédients d'une commande
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const validatedParams = commandIdSchema.parse({ id });

    // Récupérer les ingrédients
    const ingredients = await commandHandler.getCommandIngredients(
      validatedParams.id
    );

    return NextResponse.json({ data: ingredients });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/commands/:id/ingredients
 * Ajouter un ingrédient à une commande
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const validatedParams = commandIdSchema.parse({ id });

    // Parser et valider le body
    const body = await request.json();
    const validatedData = addIngredientToCommandSchema.parse(body);

    // Ajouter l'ingrédient
    const ingredient = await commandHandler.addIngredientToCommand(
      validatedParams.id,
      validatedData
    );

    return NextResponse.json(ingredient, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
