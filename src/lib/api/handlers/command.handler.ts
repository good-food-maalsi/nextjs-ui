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
   * Get all commands
   */
  async getCommands(params: CommandQueryParams) {
    return commandRepository.findAll(params);
  },

  /**
   * Get a command by ID
   */
  async getCommandById(id: string) {
    const command = await commandRepository.findById(id);

    if (!command) {
      throw new NotFoundError(`Command with ID ${id} not found`);
    }

    return command;
  },

  /**
   * Create a new command
   */
  async createCommand(data: CreateCommandInput) {
    // Check if franchise exists
    await ensureExists(franchiseRepository, data.franchise_id, "Franchise");

    // Validate items in parallel if provided
    if (data.items && data.items.length > 0) {
      const ingredientIds = data.items.map((item) => item.ingredient_id);

      // Check existence of all ingredients in parallel
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
   * Update a command
   */
  async updateCommand(id: string, data: UpdateCommandInput) {
    // Check if command exists
    await ensureExists(commandRepository, id, "Command");

    return commandRepository.update(id, data);
  },

  /**
   * Delete a command
   */
  async deleteCommand(id: string) {
    // Check if command exists
    await ensureExists(commandRepository, id, "Command");

    return commandRepository.delete(id);
  },

  /**
   * Get ingredients of a command
   */
  async getCommandIngredients(commandId: string) {
    // Check if command exists
    await ensureExists(commandRepository, commandId, "Command");

    return commandRepository.getIngredients(commandId);
  },

  /**
   * Add an ingredient to a command
   */
  async addIngredientToCommand(
    commandId: string,
    data: AddIngredientToCommandInput
  ) {
    // Check if command and ingredient exist in parallel
    await Promise.all([
      ensureExists(commandRepository, commandId, "Command"),
      ensureExists(ingredientRepository, data.ingredient_id, "Ingredient"),
    ]);

    return commandRepository.addIngredient(commandId, data);
  },

  /**
   * Update ingredient quantity in a command
   */
  async updateCommandIngredient(
    commandId: string,
    ingredientId: string,
    data: UpdateCommandIngredientInput
  ) {
    // Check if command and ingredient exist in parallel
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
   * Remove an ingredient from a command
   */
  async removeIngredientFromCommand(commandId: string, ingredientId: string) {
    // Check if command and ingredient exist in parallel
    await Promise.all([
      ensureExists(commandRepository, commandId, "Command"),
      ensureExists(ingredientRepository, ingredientId, "Ingredient"),
    ]);

    await commandRepository.removeIngredient(commandId, ingredientId);
    return { message: "Ingredient removed successfully" };
  },
};
