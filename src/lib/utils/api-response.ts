import { NextResponse } from "next/server";

/**
 * Pagination metadata for collection responses
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Standard API response wrapper for single resource
 */
export interface ApiResponse<T> {
  data: T;
}

/**
 * Standard API response wrapper for collections with pagination
 */
export interface ApiCollectionResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Standard API response for success messages
 */
export interface ApiMessageResponse {
  message: string;
}

/**
 * Creates a standardized JSON response for a single resource
 * @param data - The resource data
 * @param status - HTTP status code (default: 200)
 */
export function createApiResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data }, { status });
}

/**
 * Creates a standardized JSON response for a collection with pagination
 * @param data - Array of resources
 * @param meta - Pagination metadata
 * @param status - HTTP status code (default: 200)
 */
export function createApiCollectionResponse<T>(
  data: T[],
  meta: PaginationMeta,
  status: number = 200
): NextResponse<ApiCollectionResponse<T>> {
  return NextResponse.json({ data, meta }, { status });
}

/**
 * Creates a standardized JSON response for success messages
 * @param message - Success message
 * @param status - HTTP status code (default: 200)
 */
export function createApiMessageResponse(
  message: string,
  status: number = 200
): NextResponse<ApiMessageResponse> {
  return NextResponse.json({ message }, { status });
}

/**
 * Creates a standardized JSON response for resource creation
 * @param data - The created resource data
 */
export function createApiCreatedResponse<T>(
  data: T
): NextResponse<ApiResponse<T>> {
  return createApiResponse(data, 201);
}

/**
 * Creates a standardized JSON response for resource deletion
 * @param resourceName - Name of the deleted resource
 */
export function createApiDeletedResponse(
  resourceName: string
): NextResponse<ApiMessageResponse> {
  return createApiMessageResponse(
    `${resourceName} deleted successfully`,
    200
  );
}
