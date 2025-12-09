import { ingredientRepository } from "../repositories/ingredient.repository";
import { supplierRepository } from "../repositories/supplier.repository";
import { categoryRepository } from "../repositories/category.repository";
import type {
  CreateIngredientInput,
  UpdateIngredientInput,
  IngredientQueryParams,
  AddCategoriesToIngredientInput,
} from "../validators/ingredient.validator";
import { NotFoundError, BadRequestError } from "../errors/api-error";
import { ensureExists } from "../../utils/validators";

export const ingredientHandler = {
  /**
   * Récupérer tous les ingrédients
   */
  async getIngredients(params: IngredientQueryParams) {
    return ingredientRepository.findAll(params);
  },

  /**
   * Récupérer un ingrédient par ID
   */
  async getIngredientById(id: string) {
    const ingredient = await ingredientRepository.findById(id);

    if (!ingredient) {
      throw new NotFoundError(`Ingredient with ID ${id} not found`);
    }

    return ingredient;
  },

  /**
   * Créer un nouvel ingrédient
   */
  async createIngredient(data: CreateIngredientInput) {
    // Vérifier si le supplier existe
    await ensureExists(supplierRepository, data.supplier_id, "Supplier");

    // Valider les catégories en parallèle
    if (data.categories && data.categories.length > 0) {
      // Extraire les IDs de catégories existantes
      const categoryIds = data.categories
        .filter((cat) => cat.id)
        .map((cat) => cat.id as string);

      // Vérifier l'existence de toutes les catégories en parallèle
      if (categoryIds.length > 0) {
        await Promise.all(
          categoryIds.map((id) =>
            ensureExists(categoryRepository, id, "Category")
          )
        );
      }

      // Valider les noms de nouvelles catégories
      for (const cat of data.categories) {
        if (!cat.id && (!cat.name || cat.name.trim().length < 2)) {
          throw new BadRequestError(
            "Category name must be at least 2 characters"
          );
        }
      }
    }

    const { categories, ...ingredientData } = data;
    return ingredientRepository.create(ingredientData, categories || []);
  },

  /**
   * Mettre à jour un ingrédient
   */
  async updateIngredient(id: string, data: UpdateIngredientInput) {
    // Vérifier si l'ingrédient et le supplier existent en parallèle
    const checks = [ensureExists(ingredientRepository, id, "Ingredient")];

    if (data.supplier_id) {
      checks.push(ensureExists(supplierRepository, data.supplier_id, "Supplier"));
    }

    await Promise.all(checks);

    return ingredientRepository.update(id, data);
  },

  /**
   * Supprimer un ingrédient
   */
  async deleteIngredient(id: string) {
    // Vérifier si l'ingrédient existe
    await ensureExists(ingredientRepository, id, "Ingredient");

    return ingredientRepository.delete(id);
  },

  /**
   * Récupérer les catégories d'un ingrédient
   */
  async getIngredientCategories(ingredientId: string) {
    // Vérifier si l'ingrédient existe
    await ensureExists(ingredientRepository, ingredientId, "Ingredient");

    return ingredientRepository.getCategories(ingredientId);
  },

  /**
   * Ajouter/créer des catégories à un ingrédient
   */
  async addCategoriesToIngredient(
    ingredientId: string,
    data: AddCategoriesToIngredientInput
  ) {
    // Vérifier si l'ingrédient existe
    await ensureExists(ingredientRepository, ingredientId, "Ingredient");

    // Extraire les IDs de catégories existantes
    const categoryIds = data.categories
      .filter((cat) => cat.id)
      .map((cat) => cat.id as string);

    // Vérifier l'existence de toutes les catégories en parallèle
    if (categoryIds.length > 0) {
      await Promise.all(
        categoryIds.map((id) => ensureExists(categoryRepository, id, "Category"))
      );
    }

    // Valider les noms de nouvelles catégories
    for (const cat of data.categories) {
      if (!cat.id && (!cat.name || cat.name.trim().length < 2)) {
        throw new BadRequestError(
          "Category name must be at least 2 characters"
        );
      }
    }

    return ingredientRepository.addCategories(ingredientId, data.categories);
  },

  /**
   * Retirer une catégorie d'un ingrédient
   */
  async removeCategoryFromIngredient(ingredientId: string, categoryId: string) {
    // Vérifier si l'ingrédient et la catégorie existent en parallèle
    await Promise.all([
      ensureExists(ingredientRepository, ingredientId, "Ingredient"),
      ensureExists(categoryRepository, categoryId, "Category"),
    ]);

    await ingredientRepository.removeCategory(ingredientId, categoryId);
    return { message: "Category removed successfully" };
  },
};
