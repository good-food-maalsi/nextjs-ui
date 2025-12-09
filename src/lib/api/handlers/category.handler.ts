import { categoryRepository } from "../repositories/category.repository";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryQueryParams,
} from "../validators/category.validator";
import { NotFoundError } from "../errors/api-error";
import {
  ensureExists,
  validateNameUniqueness,
  validateNameUniquenessForUpdate,
} from "../../utils/validators";

export const categoryHandler = {
  /**
   * Récupérer toutes les catégories
   */
  async getCategories(params: CategoryQueryParams) {
    return categoryRepository.findAll(params);
  },

  /**
   * Récupérer une catégorie par ID
   */
  async getCategoryById(id: string) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError(`Category with ID ${id} not found`);
    }

    return category;
  },

  /**
   * Créer une nouvelle catégorie
   */
  async createCategory(data: CreateCategoryInput) {
    // Vérifier si le nom existe déjà
    await validateNameUniqueness(categoryRepository, data.name, "category");

    return categoryRepository.create(data);
  },

  /**
   * Mettre à jour une catégorie
   */
  async updateCategory(id: string, data: UpdateCategoryInput) {
    // Vérifier si la catégorie existe
    await ensureExists(categoryRepository, id, "Category");

    // Si le nom est modifié, vérifier qu'il n'existe pas déjà
    if (data.name) {
      await validateNameUniquenessForUpdate(
        categoryRepository,
        data.name,
        id,
        "category"
      );
    }

    return categoryRepository.update(id, data);
  },

  /**
   * Supprimer une catégorie
   */
  async deleteCategory(id: string) {
    // Vérifier si la catégorie existe
    await ensureExists(categoryRepository, id, "Category");

    return categoryRepository.delete(id);
  },
};
