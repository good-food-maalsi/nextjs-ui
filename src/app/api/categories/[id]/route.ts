import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { categoryHandler } from "@/lib/api/handlers/category.handler";
import {
  updateCategorySchema,
  categoryIdSchema,
} from "@/lib/api/validators/category.validator";
import { handleError } from "@/lib/api/errors/error-handler";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/categories/:id
 * Get a category by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    await authMiddleware(request);

    // Validate ID
    const { id } = await params;
    const validatedParams = categoryIdSchema.parse({ id });

    // Get category
    const category = await categoryHandler.getCategoryById(validatedParams.id);

    return NextResponse.json(category);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/categories/:id
 * Update a category
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    await authMiddleware(request);

    // Validate ID
    const { id } = await params;
    const validatedParams = categoryIdSchema.parse({ id });

    // Parse and validate body
    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    // Update category
    const category = await categoryHandler.updateCategory(
      validatedParams.id,
      validatedData
    );

    return NextResponse.json(category);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/categories/:id
 * Delete a category
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    await authMiddleware(request);

    // Validate ID
    const { id } = await params;
    const validatedParams = categoryIdSchema.parse({ id });

    // Delete category
    await categoryHandler.deleteCategory(validatedParams.id);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
