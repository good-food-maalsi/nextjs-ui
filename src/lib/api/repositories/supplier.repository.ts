import { PrismaClient } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";
import type {
  CreateSupplierInput,
  UpdateSupplierInput,
  SupplierQueryParams,
} from "../validators/supplier.validator";

const prisma = new PrismaClient();

export const supplierRepository = {
  /**
   * Récupérer tous les fournisseurs avec pagination et filtres
   */
  async findAll(params: SupplierQueryParams) {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: Prisma.SupplierWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          _count: {
            select: {
              ingredients: true,
            },
          },
        },
      }),
      prisma.supplier.count({ where }),
    ]);

    return {
      data: suppliers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Récupérer un fournisseur par ID
   */
  async findById(id: string) {
    return prisma.supplier.findUnique({
      where: { id },
      include: {
        ingredients: {
          orderBy: { name: "asc" },
        },
        _count: {
          select: {
            ingredients: true,
          },
        },
      },
    });
  },

  /**
   * Récupérer un fournisseur par email
   */
  async findByEmail(email: string) {
    return prisma.supplier.findUnique({
      where: { email },
    });
  },

  /**
   * Créer un nouveau fournisseur
   */
  async create(data: CreateSupplierInput) {
    return prisma.supplier.create({
      data,
    });
  },

  /**
   * Mettre à jour un fournisseur
   */
  async update(id: string, data: UpdateSupplierInput) {
    return prisma.supplier.update({
      where: { id },
      data,
    });
  },

  /**
   * Supprimer un fournisseur
   */
  async delete(id: string) {
    return prisma.supplier.delete({
      where: { id },
    });
  },

  /**
   * Vérifier si un fournisseur existe
   */
  async exists(id: string): Promise<boolean> {
    const count = await prisma.supplier.count({
      where: { id },
    });
    return count > 0;
  },
};
