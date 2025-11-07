import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { supplierHandler } from "@/lib/api/handlers/supplier.handler";
import {
  createSupplierSchema,
  supplierQuerySchema,
} from "@/lib/api/validators/supplier.validator";
import { handleError } from "@/lib/api/errors/error-handler";

/**
 * GET /api/suppliers
 * Récupérer tous les fournisseurs avec pagination et filtres
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Parser et valider les paramètres de requête
    const { searchParams } = new URL(request.url);
    const queryParams = supplierQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
    });

    // Récupérer les fournisseurs
    const result = await supplierHandler.getSuppliers(queryParams);

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/suppliers
 * Créer un nouveau fournisseur
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    await authMiddleware(request);

    // Parser et valider le body
    const body = await request.json();
    const validatedData = createSupplierSchema.parse(body);

    // Créer le fournisseur
    const supplier = await supplierHandler.createSupplier(validatedData);

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
