import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { commandHandler } from "@/lib/api/handlers/command.handler";
import {
  createCommandSchema,
  commandQuerySchema,
} from "@/lib/api/validators/command.validator";
import { handleError } from "@/lib/api/errors/error-handler";

/**
 * GET /api/commands
 * Récupérer toutes les commandes avec pagination et filtres
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Parser et valider les paramètres de requête
    const { searchParams } = new URL(request.url);
    const queryParams = commandQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      franchise_id: searchParams.get("franchise_id"),
      status: searchParams.get("status"),
      user_id: searchParams.get("user_id"),
    });

    // Récupérer les commandes
    const result = await commandHandler.getCommands(queryParams);

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/commands
 * Créer une nouvelle commande
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Parser et valider le body
    const body = await request.json();
    const validatedData = createCommandSchema.parse(body);

    // Créer la commande
    const command = await commandHandler.createCommand(validatedData);

    return NextResponse.json(command, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
