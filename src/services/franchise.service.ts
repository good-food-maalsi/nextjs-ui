import { franchiseClient } from "@/lib/config/ts-rest-client";
import type { Franchise } from "@good-food-maalsi/contracts/franchise";

interface FranchisesResponse {
  data: Franchise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function findAll(params: {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  state?: string;
} = {}): Promise<FranchisesResponse> {
  const response = await franchiseClient.franchises.getAll({ query: params });
  if (response.status !== 200) throw new Error("Failed to fetch franchises");
  return response.body as FranchisesResponse;
}

async function findById(id: string): Promise<Franchise> {
  const response = await franchiseClient.franchises.getById({ params: { id } });
  if (response.status !== 200) throw new Error("Franchise not found");
  return response.body as Franchise;
}

export const franchiseService = {
  findAll,
  findById,
};
