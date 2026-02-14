import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type {
  CreateIngredientInput,
  UpdateIngredientInput,
  IngredientQueryParams,
  CategoryInput,
} from "../validators/ingredient.validator";

export const ingredientRepository = {
  /**
   * Récupérer tous les ingrédients avec pagination et filtres
   */
  async findAll(params: IngredientQueryParams) {
    const { page = 1, limit = 10, search, supplier_id, category_id } = params;
    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: Prisma.IngredientWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (supplier_id) {
      where.supplier_id = supplier_id;
    }

    if (category_id) {
      where.ingredient_categories = {
        some: {
          category_id,
        },
      };
    }

    const [ingredients, total] = await Promise.all([
      prisma.ingredient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          ingredient_categories: {
            include: {
              category: true,
            },
          },
          _count: {
            select: {
              stocks: true,
              command_ingredients: true,
            },
          },
        },
      }),
      prisma.ingredient.count({ where }),
    ]);

    return {
      data: ingredients,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Récupérer un ingrédient par ID
   */
  async findById(id: string) {
    return prisma.ingredient.findUnique({
      where: { id },
      include: {
        supplier: true,
        ingredient_categories: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            stocks: true,
            command_ingredients: true,
          },
        },
      },
    });
  },

  /**
   * Créer un nouvel ingrédient avec catégories
   */
  async create(
    data: Omit<CreateIngredientInput, "categories">,
    categories: CategoryInput[]
  ) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create the ingredient
      const ingredient = await tx.ingredient.create({
        data: {
          name: data.name,
          description: data.description,
          supplier_id: data.supplier_id,
          unit_price: data.unit_price,
        },
      });

      // Handle categories if provided
      if (categories.length > 0) {
        const categoryIds: string[] = [];

        for (const cat of categories) {
          if (cat.id) {
            // Link to existing category
            categoryIds.push(cat.id);
          } else if (cat.name) {
            // Create a new category
            const newCategory = await tx.category.create({
              data: {
                name: cat.name,
                description: cat.description,
              },
            });
            categoryIds.push(newCategory.id);
          }
        }

        // Create IngredientCategory relations
        await tx.ingredientCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            ingredient_id: ingredient.id,
            category_id: categoryId,
          })),
        });
      }

      // Return ingredient with its relations
      return tx.ingredient.findUnique({
        where: { id: ingredient.id },
        include: {
          supplier: true,
          ingredient_categories: {
            include: {
              category: true,
            },
          },
        },
      });
    });
  },

  /**
   * Mettre à jour un ingrédient
   */
  async update(id: string, data: UpdateIngredientInput) {
    return prisma.ingredient.update({
      where: { id },
      data,
      include: {
        supplier: true,
        ingredient_categories: {
          include: {
            category: true,
          },
        },
      },
    });
  },

  /**
   * Supprimer un ingrédient
   */
  async delete(id: string) {
    return prisma.ingredient.delete({
      where: { id },
    });
  },

  /**
   * Vérifier si un ingrédient existe
   */
  async exists(id: string): Promise<boolean> {
    const count = await prisma.ingredient.count({
      where: { id },
    });
    return count > 0;
  },

  /**
   * Récupérer les catégories d'un ingrédient
   */
  async getCategories(ingredientId: string) {
    const result = await prisma.ingredientCategory.findMany({
      where: { ingredient_id: ingredientId },
      include: {
        category: true,
      },
      orderBy: {
        category: {
          name: "asc",
        },
      },
    });

    return result.map((ic: { category: unknown }) => ic.category);
  },

  /**
   * Ajouter/créer des catégories à un ingrédient
   */
  async addCategories(ingredientId: string, categories: CategoryInput[]) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const categoryIds: string[] = [];

      for (const cat of categories) {
        if (cat.id) {
          // Link to existing category
          categoryIds.push(cat.id);
        } else if (cat.name) {
          // Check if category already exists by name
          let existingCategory = await tx.category.findFirst({
            where: {
              name: {
                equals: cat.name,
                mode: "insensitive",
              },
            },
          });

          if (!existingCategory) {
            // Create a new category
            existingCategory = await tx.category.create({
              data: {
                name: cat.name,
                description: cat.description,
              },
            });
          }

          categoryIds.push(existingCategory.id);
        }
      }

      // Create relations (ignore duplicates)
      for (const categoryId of categoryIds) {
        // Check if relation already exists
        const existing = await tx.ingredientCategory.findFirst({
          where: {
            ingredient_id: ingredientId,
            category_id: categoryId,
          },
        });

        if (!existing) {
          await tx.ingredientCategory.create({
            data: {
              ingredient_id: ingredientId,
              category_id: categoryId,
            },
          });
        }
      }

      // Return updated categories
      return this.getCategories(ingredientId);
    });
  },

  /**
   * Retirer une catégorie d'un ingrédient
   */
  async removeCategory(ingredientId: string, categoryId: string) {
    return prisma.ingredientCategory.deleteMany({
      where: {
        ingredient_id: ingredientId,
        category_id: categoryId,
      },
    });
  },
};
