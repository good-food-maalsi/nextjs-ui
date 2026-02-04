import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { commandHandler } from "@/lib/api/handlers/command.handler";
import {
  createCommandSchema,
  commandQuerySchema,
} from "@/lib/api/validators/command.validator";
import { handleError } from "@/lib/api/errors/error-handler";
import { resolveFranchiseId } from "@/lib/api/utils/franchise-permissions";

/**
 * GET /api/commands
 * Récupérer toutes les commandes avec pagination et filtres
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const user = await authMiddleware(request);

    // Parser et valider les paramètres de requête
    const { searchParams } = new URL(request.url);
    const queryParams = commandQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      franchise_id: searchParams.get("franchise_id"),
      status: searchParams.get("status"),
      user_id: searchParams.get("user_id"),
    });

    // Résoudre le franchise_id selon le rôle de l'utilisateur
    const franchiseId = resolveFranchiseId(user, queryParams.franchise_id);

    // Récupérer les commandes avec le franchise_id forcé
    const result = await commandHandler.getCommands({
      ...queryParams,
      franchise_id: franchiseId,
    });

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
    const user = await authMiddleware(request);

    // Parser et valider le body
    const body = await request.json();
    const validatedData = createCommandSchema.parse(body);

    // Résoudre le franchise_id (ignorer celui du body pour utilisateurs normaux)
    const franchiseId = resolveFranchiseId(user, validatedData.franchise_id);

    const command = await commandHandler.createCommand(validatedData, {
      franchiseId,
    });

    return NextResponse.json(command, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
