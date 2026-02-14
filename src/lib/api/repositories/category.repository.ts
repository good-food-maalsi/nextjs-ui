import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryQueryParams,
} from "../validators/category.validator";

export const categoryRepository = {
  /**
   * Récupérer toutes les catégories avec pagination et filtres
   */
  async findAll(params: CategoryQueryParams) {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: Prisma.CategoryWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              ingredient_categories: true,
            },
          },
        },
      }),
      prisma.category.count({ where }),
    ]);

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Récupérer une catégorie par ID
   */
  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        ingredient_categories: {
          include: {
            ingredient: true,
          },
          orderBy: {
            ingredient: {
              name: "asc",
            },
          },
        },
        _count: {
          select: {
            ingredient_categories: true,
          },
        },
      },
    });
  },

  /**
   * Récupérer une catégorie par nom
   */
  async findByName(name: string) {
    return prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  },

  /**
   * Créer une nouvelle catégorie
   */
  async create(data: CreateCategoryInput) {
    return prisma.category.create({
      data,
    });
  },

  /**
   * Mettre à jour une catégorie
   */
  async update(id: string, data: UpdateCategoryInput) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  /**
   * Supprimer une catégorie
   */
  async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  },

  /**
   * Vérifier si une catégorie existe
   */
  async exists(id: string): Promise<boolean> {
    const count = await prisma.category.count({
      where: { id },
    });
    return count > 0;
  },
};
