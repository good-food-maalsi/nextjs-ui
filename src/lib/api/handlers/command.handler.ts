import { commandRepository } from "../repositories/command.repository";
import { franchiseRepository } from "../repositories/franchise.repository";
import { ingredientRepository } from "../repositories/ingredient.repository";
import type {
  CreateCommandInput,
  UpdateCommandInput,
  CommandQueryParams,
  AddIngredientToCommandInput,
  UpdateCommandIngredientInput,
} from "../validators/command.validator";
import { NotFoundError } from "../errors/api-error";
import { ensureExists } from "../../utils/validators";

export const commandHandler = {
  /**
   * Récupérer toutes les commandes
   */
  async getCommands(params: CommandQueryParams) {
    return commandRepository.findAll(params);
  },

  /**
   * Récupérer une commande par ID
   */
  async getCommandById(id: string) {
    const command = await commandRepository.findById(id);

    if (!command) {
      throw new NotFoundError(`Command with ID ${id} not found`);
    }

    return command;
  },

  /**
   * Créer une nouvelle commande
   */
  async createCommand(data: CreateCommandInput) {
    // Vérifier si la franchise existe
    await ensureExists(franchiseRepository, data.franchise_id, "Franchise");

    // Valider les items en parallèle si fournis
    if (data.items && data.items.length > 0) {
      const ingredientIds = data.items.map((item) => item.ingredient_id);

      // Vérifier l'existence de tous les ingrédients en parallèle
      await Promise.all(
        ingredientIds.map((id) =>
          ensureExists(ingredientRepository, id, "Ingredient")
        )
      );
    }

    const { items, ...commandData } = data;
    return commandRepository.create(commandData, items || []);
  },

  /**
   * Mettre à jour une commande
   */
  async updateCommand(id: string, data: UpdateCommandInput) {
    // Vérifier si la commande existe
    await ensureExists(commandRepository, id, "Command");

    return commandRepository.update(id, data);
  },

  /**
   * Supprimer une commande
   */
  async deleteCommand(id: string) {
    // Vérifier si la commande existe
    await ensureExists(commandRepository, id, "Command");

    return commandRepository.delete(id);
  },

  /**
   * Récupérer les ingrédients d'une commande
   */
  async getCommandIngredients(commandId: string) {
    // Vérifier si la commande existe
    await ensureExists(commandRepository, commandId, "Command");

    return commandRepository.getIngredients(commandId);
  },

  /**
   * Ajouter un ingrédient à une commande
   */
  async addIngredientToCommand(
    commandId: string,
    data: AddIngredientToCommandInput
  ) {
    // Vérifier si la commande et l'ingrédient existent en parallèle
    await Promise.all([
      ensureExists(commandRepository, commandId, "Command"),
      ensureExists(ingredientRepository, data.ingredient_id, "Ingredient"),
    ]);

    return commandRepository.addIngredient(commandId, data);
  },

  /**
   * Mettre à jour la quantité d'un ingrédient dans une commande
   */
  async updateCommandIngredient(
    commandId: string,
    ingredientId: string,
    data: UpdateCommandIngredientInput
  ) {
    // Vérifier si la commande et l'ingrédient existent en parallèle
    await Promise.all([
      ensureExists(commandRepository, commandId, "Command"),
      ensureExists(ingredientRepository, ingredientId, "Ingredient"),
    ]);

    const result = await commandRepository.updateIngredientQuantity(
      commandId,
      ingredientId,
      data
    );

    if (!result) {
      throw new NotFoundError(
        `Ingredient ${ingredientId} not found in command ${commandId}`
      );
    }

    return result;
  },

  /**
   * Retirer un ingrédient d'une commande
   */
  async removeIngredientFromCommand(commandId: string, ingredientId: string) {
    // Vérifier si la commande et l'ingrédient existent en parallèle
    await Promise.all([
      ensureExists(commandRepository, commandId, "Command"),
      ensureExists(ingredientRepository, ingredientId, "Ingredient"),
    ]);

    await commandRepository.removeIngredient(commandId, ingredientId);
    return { message: "Ingredient removed successfully" };
  },
};
