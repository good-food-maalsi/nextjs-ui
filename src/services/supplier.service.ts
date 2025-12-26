import api from "@/lib/config/api.config";
import type {
  Supplier,
  SuppliersResponse,
  CreateSupplierInput,
  UpdateSupplierInput,
} from "@/lib/types/supplier.types";

interface ISupplierService {
  findAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => Promise<SuppliersResponse>;
  findById: (id: string) => Promise<Supplier>;
  create: (data: CreateSupplierInput) => Promise<Supplier>;
  update: (id: string, data: UpdateSupplierInput) => Promise<Supplier>;
  delete: (id: string) => Promise<void>;
}

const baseURL = "/suppliers";

export const supplierService: ISupplierService = {
  async findAll(params = {}) {
    const { data } = await api.get(baseURL, { params });
    return data;
  },

  async findById(id: string) {
    const { data } = await api.get(`${baseURL}/${id}`);
    return data;
  },

  async create(supplierData: CreateSupplierInput) {
    const { data } = await api.post(baseURL, supplierData);
    return data;
  },

  async update(id: string, supplierData: UpdateSupplierInput) {
    const { data } = await api.put(`${baseURL}/${id}`, supplierData);
    return data;
  },

  async delete(id: string) {
    await api.delete(`${baseURL}/${id}`);
  },
};
