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
 * Get all suppliers with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    await authMiddleware(request);

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = supplierQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
    });

    // Get suppliers
    const result = await supplierHandler.getSuppliers(queryParams);

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/suppliers
 * Create a new supplier
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await authMiddleware(request);

    // Parse and validate body
    const body = await request.json();
    const validatedData = createSupplierSchema.parse(body);

    // Create supplier
    const supplier = await supplierHandler.createSupplier(validatedData);

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
