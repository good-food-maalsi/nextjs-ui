import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { franchiseHandler } from "@/lib/api/handlers/franchise.handler";
import {
  updateFranchiseSchema,
  franchiseIdSchema,
} from "@/lib/api/validators/franchise.validator";
import { handleError } from "@/lib/api/errors/error-handler";

/**
 * GET /api/franchises/[id]
 * Récupérer une franchise par ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const { id: franchiseId } = franchiseIdSchema.parse({ id });

    // Récupérer la franchise
    const franchise = await franchiseHandler.getFranchiseById(franchiseId);

    return NextResponse.json(franchise);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/franchises/[id]
 * Mettre à jour une franchise
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const { id: franchiseId } = franchiseIdSchema.parse({ id });

    // Parser et valider le body
    const body = await request.json();
    const validatedData = updateFranchiseSchema.parse(body);

    // Mettre à jour la franchise
    const franchise = await franchiseHandler.updateFranchise(
      franchiseId,
      validatedData
    );

    return NextResponse.json(franchise);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/franchises/[id]
 * Supprimer une franchise
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Valider l'ID
    const { id } = await params;
    const { id: franchiseId } = franchiseIdSchema.parse({ id });

    // Supprimer la franchise
    await franchiseHandler.deleteFranchise(franchiseId);

    return NextResponse.json(
      { message: "Franchise deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
