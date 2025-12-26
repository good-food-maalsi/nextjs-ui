import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { supplierHandler } from "@/lib/api/handlers/supplier.handler";
import {
  updateSupplierSchema,
  supplierIdSchema,
} from "@/lib/api/validators/supplier.validator";
import { handleError } from "@/lib/api/errors/error-handler";

/**
 * GET /api/suppliers/[id]
 * Récupérer un fournisseur par ID
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
    const { id: supplierId } = supplierIdSchema.parse({ id });

    // Récupérer le fournisseur
    const supplier = await supplierHandler.getSupplierById(supplierId);

    return NextResponse.json(supplier);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/suppliers/[id]
 * Mettre à jour un fournisseur
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
    const { id: supplierId } = supplierIdSchema.parse({ id });

    // Parser et valider le body
    const body = await request.json();
    const validatedData = updateSupplierSchema.parse(body);

    // Mettre à jour le fournisseur
    const supplier = await supplierHandler.updateSupplier(
      supplierId,
      validatedData
    );

    return NextResponse.json(supplier);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/suppliers/[id]
 * Supprimer un fournisseur
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
    const { id: supplierId } = supplierIdSchema.parse({ id });

    // Supprimer le fournisseur
    await supplierHandler.deleteSupplier(supplierId);

    return NextResponse.json(
      { message: "Supplier deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
