import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stockFranchiseHandler } from "@/lib/api/handlers/stock-franchise.handler";
import {
  stockFranchiseIdSchema,
  updateStockFranchiseSchema,
} from "@/lib/api/validators/stock-franchise.validator";
import { handleError } from "@/lib/api/errors/error-handler";
import { authMiddleware } from "../../_middleware/auth.middleware";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await authMiddleware(request);

    const { id } = stockFranchiseIdSchema.parse(await params);
    const result = await stockFranchiseHandler.getStockById(id);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await authMiddleware(request);

    const { id } = stockFranchiseIdSchema.parse(await params);
    const body = await request.json();
    const data = updateStockFranchiseSchema.parse(body);

    const result = await stockFranchiseHandler.updateStock(id, data);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await authMiddleware(request);

    const { id } = stockFranchiseIdSchema.parse(await params);
    const result = await stockFranchiseHandler.deleteStock(id);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
