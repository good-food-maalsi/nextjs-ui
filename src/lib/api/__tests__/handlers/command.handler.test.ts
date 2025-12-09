import { describe, it, expect, vi, beforeEach } from "vitest";
import { commandHandler } from "../../handlers/command.handler";
import { commandRepository } from "../../repositories/command.repository";
import { franchiseRepository } from "../../repositories/franchise.repository";
import { ingredientRepository } from "../../repositories/ingredient.repository";
import { NotFoundError } from "../../errors/api-error";
import { createMockCommand, createMockFranchise, createMockIngredient } from "@/tests/helpers/factories";
import { CommandStatus } from "@/generated/prisma/client";

vi.mock("../../repositories/command.repository");
vi.mock("../../repositories/franchise.repository");
vi.mock("../../repositories/ingredient.repository");

describe("Command Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCommands", () => {
    it("should return paginated commands", async () => {
      const mockData = {
        data: [createMockCommand()],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };

      vi.mocked(commandRepository.findAll).mockResolvedValue(mockData);

      const result = await commandHandler.getCommands({ page: 1, limit: 10 });

      expect(result).toEqual(mockData);
      expect(commandRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  describe("getCommandById", () => {
    it("should return command if found", async () => {
      const mockCommand = createMockCommand();
      vi.mocked(commandRepository.findById).mockResolvedValue(mockCommand);

      const result = await commandHandler.getCommandById(mockCommand.id);

      expect(result).toEqual(mockCommand);
      expect(commandRepository.findById).toHaveBeenCalledWith(mockCommand.id);
    });

    it("should throw NotFoundError if command not found", async () => {
      vi.mocked(commandRepository.findById).mockResolvedValue(null);

      await expect(
        commandHandler.getCommandById("non-existent-id")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("createCommand", () => {
    it("should create command with items", async () => {
      const mockCommand = createMockCommand();
      const mockFranchise = createMockFranchise();
      const mockIngredient = createMockIngredient();

      vi.mocked(franchiseRepository.exists).mockResolvedValue(true);
      vi.mocked(ingredientRepository.exists).mockResolvedValue(true);
      vi.mocked(commandRepository.create).mockResolvedValue(mockCommand);

      const result = await commandHandler.createCommand({
        franchise_id: mockFranchise.id,
        user_id: "550e8400-e29b-41d4-a716-446655440010",
        status: CommandStatus.draft,
        items: [
          {
            ingredient_id: mockIngredient.id,
            quantity: 10,
          },
        ],
      });

      expect(result).toEqual(mockCommand);
      expect(franchiseRepository.exists).toHaveBeenCalledWith(mockFranchise.id);
      expect(ingredientRepository.exists).toHaveBeenCalledWith(mockIngredient.id);
      expect(commandRepository.create).toHaveBeenCalled();
    });

    it("should throw NotFoundError if franchise not found", async () => {
      vi.mocked(franchiseRepository.exists).mockResolvedValue(false);

      await expect(
        commandHandler.createCommand({
          franchise_id: "non-existent-id",
          user_id: "550e8400-e29b-41d4-a716-446655440010",
        })
      ).rejects.toThrow(NotFoundError);

      expect(commandRepository.create).not.toHaveBeenCalled();
    });

    it("should throw NotFoundError if ingredient not found", async () => {
      vi.mocked(franchiseRepository.exists).mockResolvedValue(true);
      vi.mocked(ingredientRepository.exists).mockResolvedValue(false);

      await expect(
        commandHandler.createCommand({
          franchise_id: "550e8400-e29b-41d4-a716-446655440000",
          user_id: "550e8400-e29b-41d4-a716-446655440010",
          items: [
            {
              ingredient_id: "non-existent-ingredient",
              quantity: 10,
            },
          ],
        })
      ).rejects.toThrow(NotFoundError);

      expect(commandRepository.create).not.toHaveBeenCalled();
    });

    it("should create command without items", async () => {
      const mockCommand = createMockCommand();
      vi.mocked(franchiseRepository.exists).mockResolvedValue(true);
      vi.mocked(commandRepository.create).mockResolvedValue(mockCommand);

      const result = await commandHandler.createCommand({
        franchise_id: "550e8400-e29b-41d4-a716-446655440000",
        user_id: "550e8400-e29b-41d4-a716-446655440010",
      });

      expect(result).toEqual(mockCommand);
    });
  });

  describe("updateCommand", () => {
    it("should update command if exists", async () => {
      const mockCommand = createMockCommand({ status: CommandStatus.confirmed });
      vi.mocked(commandRepository.exists).mockResolvedValue(true);
      vi.mocked(commandRepository.update).mockResolvedValue(mockCommand);

      const result = await commandHandler.updateCommand(mockCommand.id, {
        status: CommandStatus.confirmed,
      });

      expect(result).toEqual(mockCommand);
      expect(commandRepository.update).toHaveBeenCalledWith(mockCommand.id, {
        status: CommandStatus.confirmed,
      });
    });

    it("should throw NotFoundError if command not found", async () => {
      vi.mocked(commandRepository.exists).mockResolvedValue(false);

      await expect(
        commandHandler.updateCommand("non-existent-id", { status: CommandStatus.confirmed })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteCommand", () => {
    it("should delete command if exists", async () => {
      const mockCommand = createMockCommand();
      vi.mocked(commandRepository.exists).mockResolvedValue(true);
      vi.mocked(commandRepository.delete).mockResolvedValue(mockCommand);

      const result = await commandHandler.deleteCommand(mockCommand.id);

      expect(result).toEqual(mockCommand);
      expect(commandRepository.delete).toHaveBeenCalledWith(mockCommand.id);
    });

    it("should throw NotFoundError if command not found", async () => {
      vi.mocked(commandRepository.exists).mockResolvedValue(false);

      await expect(
        commandHandler.deleteCommand("non-existent-id")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("addIngredientToCommand", () => {
    it("should add ingredient to command", async () => {
      const mockIngredientItem = {
        id: "item-id",
        command_id: "command-id",
        ingredient_id: "ingredient-id",
        quantity: 5,
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.mocked(commandRepository.exists).mockResolvedValue(true);
      vi.mocked(ingredientRepository.exists).mockResolvedValue(true);
      vi.mocked(commandRepository.addIngredient).mockResolvedValue(mockIngredientItem as unknown as CommandIngredient);

      const result = await commandHandler.addIngredientToCommand("command-id", {
        ingredient_id: "ingredient-id",
        quantity: 5,
      });

      expect(result).toEqual(mockIngredientItem);
      expect(commandRepository.addIngredient).toHaveBeenCalledWith("command-id", {
        ingredient_id: "ingredient-id",
        quantity: 5,
      });
    });

    it("should throw NotFoundError if command not found", async () => {
      vi.mocked(commandRepository.exists).mockResolvedValue(false);

      await expect(
        commandHandler.addIngredientToCommand("non-existent-id", {
          ingredient_id: "ingredient-id",
          quantity: 5,
        })
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if ingredient not found", async () => {
      vi.mocked(commandRepository.exists).mockResolvedValue(true);
      vi.mocked(ingredientRepository.exists).mockResolvedValue(false);

      await expect(
        commandHandler.addIngredientToCommand("command-id", {
          ingredient_id: "non-existent-ingredient",
          quantity: 5,
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("updateCommandIngredient", () => {
    it("should update ingredient quantity", async () => {
      const mockUpdatedItem = {
        id: "item-id",
        command_id: "command-id",
        ingredient_id: "ingredient-id",
        quantity: 15,
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.mocked(commandRepository.exists).mockResolvedValue(true);
      vi.mocked(ingredientRepository.exists).mockResolvedValue(true);
      vi.mocked(commandRepository.updateIngredientQuantity).mockResolvedValue(mockUpdatedItem as unknown as CommandIngredient);

      const result = await commandHandler.updateCommandIngredient(
        "command-id",
        "ingredient-id",
        { quantity: 15 }
      );

      expect(result).toEqual(mockUpdatedItem);
    });

    it("should throw NotFoundError if item not found", async () => {
      vi.mocked(commandRepository.exists).mockResolvedValue(true);
      vi.mocked(ingredientRepository.exists).mockResolvedValue(true);
      vi.mocked(commandRepository.updateIngredientQuantity).mockResolvedValue(null);

      await expect(
        commandHandler.updateCommandIngredient("command-id", "ingredient-id", { quantity: 15 })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("removeIngredientFromCommand", () => {
    it("should remove ingredient from command", async () => {
      vi.mocked(commandRepository.exists).mockResolvedValue(true);
      vi.mocked(ingredientRepository.exists).mockResolvedValue(true);
      vi.mocked(commandRepository.removeIngredient).mockResolvedValue({ count: 1 } as unknown as Prisma.BatchPayload);

      const result = await commandHandler.removeIngredientFromCommand(
        "command-id",
        "ingredient-id"
      );

      expect(result).toEqual({ message: "Ingredient removed successfully" });
      expect(commandRepository.removeIngredient).toHaveBeenCalledWith(
        "command-id",
        "ingredient-id"
      );
    });

    it("should throw NotFoundError if command not found", async () => {
      vi.mocked(commandRepository.exists).mockResolvedValue(false);

      await expect(
        commandHandler.removeIngredientFromCommand("non-existent-id", "ingredient-id")
      ).rejects.toThrow(NotFoundError);
    });
  });
});
