import { PrismaClient } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";
import type {
  CreateFranchiseInput,
  UpdateFranchiseInput,
  FranchiseQueryParams,
} from "../validators/franchise.validator";

const prisma = new PrismaClient();

export const franchiseRepository = {
  /**
   * Récupérer toutes les franchises avec pagination et filtres
   */
  async findAll(params: FranchiseQueryParams) {
    const { page = 1, limit = 10, search, city, state } = params;
    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: Prisma.FranchiseWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { street: { contains: search, mode: "insensitive" } },
      ];
    }

    if (city) {
      where.city = { equals: city, mode: "insensitive" };
    }

    if (state) {
      where.state = { equals: state, mode: "insensitive" };
    }

    const [franchises, total] = await Promise.all([
      prisma.franchise.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          _count: {
            select: {
              stocks: true,
              commands: true,
            },
          },
        },
      }),
      prisma.franchise.count({ where }),
    ]);

    return {
      data: franchises,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Récupérer une franchise par ID
   */
  async findById(id: string) {
    return prisma.franchise.findUnique({
      where: { id },
      include: {
        stocks: {
          include: {
            ingredient: true,
          },
        },
        commands: {
          orderBy: { created_at: "desc" },
          take: 10,
        },
        _count: {
          select: {
            stocks: true,
            commands: true,
          },
        },
      },
    });
  },

  /**
   * Récupérer une franchise par email
   */
  async findByEmail(email: string) {
    return prisma.franchise.findUnique({
      where: { email },
    });
  },

  /**
   * Créer une nouvelle franchise
   */
  async create(data: CreateFranchiseInput) {
    return prisma.franchise.create({
      data,
    });
  },

  /**
   * Mettre à jour une franchise
   */
  async update(id: string, data: UpdateFranchiseInput) {
    return prisma.franchise.update({
      where: { id },
      data,
    });
  },

  /**
   * Supprimer une franchise
   */
  async delete(id: string) {
    return prisma.franchise.delete({
      where: { id },
    });
  },

  /**
   * Récupérer le stock d'une franchise
   */
  async getStock(franchiseId: string) {
    return prisma.stockFranchise.findMany({
      where: { franchise_id: franchiseId },
      include: {
        ingredient: {
          include: {
            supplier: true,
            ingredient_categories: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: { ingredient: { name: "asc" } },
    });
  },

  /**
   * Vérifier si une franchise existe
   */
  async exists(id: string): Promise<boolean> {
    const count = await prisma.franchise.count({
      where: { id },
    });
    return count > 0;
  },
};
