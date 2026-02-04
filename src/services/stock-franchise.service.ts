import api from "@/lib/config/api.config";
import type {
  StockFranchise,
  StockFranchiseResponse,
  CreateStockFranchiseInput,
  UpdateStockFranchiseInput,
} from "@/lib/types/stock-franchise.types";

interface IStockFranchiseService {
  findAll: (params: {
    page?: number;
    limit?: number;
    search?: string;
    franchise_id: string;
  }) => Promise<StockFranchiseResponse>;
  findById: (id: string) => Promise<StockFranchise>;
  create: (data: CreateStockFranchiseInput) => Promise<StockFranchise>;
  update: (id: string, data: UpdateStockFranchiseInput) => Promise<StockFranchise>;
  delete: (id: string) => Promise<void>;
}

const baseURL = "/stocks";

export const stockFranchiseService: IStockFranchiseService = {
  async findAll(params) {
    const { data } = await api.get(baseURL, { params });
    return data;
  },

  async findById(id: string) {
    const { data } = await api.get(`${baseURL}/${id}`);
    return data;
  },

  async create(stockData: CreateStockFranchiseInput) {
    const { data } = await api.post(baseURL, stockData);
    return data;
  },

  async update(id: string, stockData: UpdateStockFranchiseInput) {
    const { data } = await api.put(`${baseURL}/${id}`, stockData);
    return data;
  },

  async delete(id: string) {
    await api.delete(`${baseURL}/${id}`);
  },
};
