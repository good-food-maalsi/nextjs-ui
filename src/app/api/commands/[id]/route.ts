import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { commandHandler } from "@/lib/api/handlers/command.handler";
import {
  updateCommandSchema,
  commandIdSchema,
} from "@/lib/api/validators/command.validator";
import { handleError } from "@/lib/api/errors/error-handler";
import { validateFranchiseAccess } from "@/lib/api/utils/franchise-permissions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/commands/:id
 * Récupérer une commande par ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    const user = await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const validatedParams = commandIdSchema.parse({ id });

    // Récupérer la commande
    const command = await commandHandler.getCommandById(validatedParams.id);

    // Vérifier l'accès à cette franchise
    validateFranchiseAccess(user, command.franchise_id);

    return NextResponse.json(command);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/commands/:id
 * Mettre à jour une commande
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    const user = await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const validatedParams = commandIdSchema.parse({ id });

    // Récupérer la commande pour vérifier l'accès
    const existingCommand = await commandHandler.getCommandById(
      validatedParams.id
    );

    // Vérifier l'accès à cette franchise
    validateFranchiseAccess(user, existingCommand.franchise_id);

    // Parser et valider le body
    const body = await request.json();
    const validatedData = updateCommandSchema.parse(body);

    // Mettre à jour la commande
    const command = await commandHandler.updateCommand(
      validatedParams.id,
      validatedData
    );

    return NextResponse.json(command);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/commands/:id
 * Supprimer une commande
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    const user = await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const validatedParams = commandIdSchema.parse({ id });

    // Récupérer la commande pour vérifier l'accès
    const existingCommand = await commandHandler.getCommandById(
      validatedParams.id
    );

    // Vérifier l'accès à cette franchise
    validateFranchiseAccess(user, existingCommand.franchise_id);

    // Supprimer la commande
    await commandHandler.deleteCommand(validatedParams.id);

    return NextResponse.json(
      { message: "Command deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
