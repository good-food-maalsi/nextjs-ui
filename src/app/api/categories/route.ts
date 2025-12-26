import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { categoryHandler } from "@/lib/api/handlers/category.handler";
import {
  createCategorySchema,
  categoryQuerySchema,
} from "@/lib/api/validators/category.validator";
import { handleError } from "@/lib/api/errors/error-handler";

/**
 * GET /api/categories
 * Get all categories with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    await authMiddleware(request);

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = categoryQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
    });

    // Get categories
    const result = await categoryHandler.getCategories(queryParams);

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/categories
 * Create a new category
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await authMiddleware(request);

    // Parse and validate body
    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);

    // Create category
    const category = await categoryHandler.createCategory(validatedData);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
