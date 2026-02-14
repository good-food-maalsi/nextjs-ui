import { describe, it, expect } from "vitest";
import {
  isAdmin,
  resolveFranchiseId,
  validateFranchiseAccess,
} from "../../utils/franchise-permissions";
import type { JWTPayload } from "@/lib/types/auth.types";
import { ForbiddenError } from "../../errors/api-error";

describe("Franchise Permissions Utils", () => {
  // Mock users
  const mockAdminUser: JWTPayload = {
    sub: "admin-123",
    email: "admin@example.com",
    role: "admin",
    franchise_id: undefined, // Admin n'a pas de franchise_id
  };

  const mockNormalUser: JWTPayload = {
    sub: "user-123",
    email: "user@example.com",
    role: "user",
    franchise_id: "franchise-456",
  };

  const mockFranchiseId = "franchise-789";

  describe("isAdmin", () => {
    it("should return true if user has no franchise_id", () => {
      expect(isAdmin(mockAdminUser)).toBe(true);
    });

    it("should return false if user has a franchise_id", () => {
      expect(isAdmin(mockNormalUser)).toBe(false);
    });

    it("should return true if franchise_id is null", () => {
      const userWithNull: JWTPayload = {
        ...mockNormalUser,
        franchise_id: null as unknown as undefined,
      };
      expect(isAdmin(userWithNull)).toBe(true);
    });
  });

  describe("resolveFranchiseId", () => {
    describe("Admin users", () => {
      it("should return the requested franchise_id when provided", () => {
        const result = resolveFranchiseId(mockAdminUser, mockFranchiseId);
        expect(result).toBe(mockFranchiseId);
      });

      it("should throw ForbiddenError if no franchise_id is provided", () => {
        expect(() => resolveFranchiseId(mockAdminUser, undefined)).toThrow(
          ForbiddenError
        );
        expect(() => resolveFranchiseId(mockAdminUser, undefined)).toThrow(
          "Admin users must specify a franchise_id parameter"
        );
      });

      it("should throw ForbiddenError if empty string is provided", () => {
        expect(() => resolveFranchiseId(mockAdminUser, "")).toThrow(
          ForbiddenError
        );
      });
    });

    describe("Normal users", () => {
      it("should return user's franchise_id from token", () => {
        const result = resolveFranchiseId(mockNormalUser, undefined);
        expect(result).toBe(mockNormalUser.franchise_id);
      });

      it("should ignore requested franchise_id and use token's franchise_id", () => {
        const requestedId = "different-franchise-999";
        const result = resolveFranchiseId(mockNormalUser, requestedId);

        // Sécurité : l'utilisateur normal ne peut PAS changer de franchise
        expect(result).toBe(mockNormalUser.franchise_id);
        expect(result).not.toBe(requestedId);
      });

      it("should return token's franchise_id even if requested is empty", () => {
        const result = resolveFranchiseId(mockNormalUser, "");
        expect(result).toBe(mockNormalUser.franchise_id);
      });
    });
  });

  describe("validateFranchiseAccess", () => {
    describe("Admin users", () => {
      it("should allow access to any franchise", () => {
        expect(() =>
          validateFranchiseAccess(mockAdminUser, mockFranchiseId)
        ).not.toThrow();
      });

      it("should allow access to different franchises", () => {
        expect(() =>
          validateFranchiseAccess(mockAdminUser, "franchise-aaa")
        ).not.toThrow();
        expect(() =>
          validateFranchiseAccess(mockAdminUser, "franchise-bbb")
        ).not.toThrow();
      });
    });

    describe("Normal users", () => {
      it("should allow access to their own franchise", () => {
        expect(() =>
          validateFranchiseAccess(
            mockNormalUser,
            mockNormalUser.franchise_id!
          )
        ).not.toThrow();
      });

      it("should deny access to other franchises", () => {
        const otherFranchiseId = "other-franchise-999";

        expect(() =>
          validateFranchiseAccess(mockNormalUser, otherFranchiseId)
        ).toThrow(ForbiddenError);
        expect(() =>
          validateFranchiseAccess(mockNormalUser, otherFranchiseId)
        ).toThrow("You do not have permission to access this franchise's data");
      });

      it("should deny access to empty franchise_id", () => {
        expect(() => validateFranchiseAccess(mockNormalUser, "")).toThrow(
          ForbiddenError
        );
      });
    });
  });

  describe("Multi-tenant security scenarios", () => {
    it("should prevent cross-franchise access attempt", () => {
      // Scénario : utilisateur essaie d'accéder à une ressource d'une autre franchise
      const userFranchiseId = "franchise-A";
      const resourceFranchiseId = "franchise-B";

      const user: JWTPayload = {
        sub: "attacker-123",
        email: "attacker@example.com",
        franchise_id: userFranchiseId,
      };

      // L'utilisateur récupère une ressource de franchise-B
      expect(() =>
        validateFranchiseAccess(user, resourceFranchiseId)
      ).toThrow(ForbiddenError);
    });

    it("should allow admin to switch between franchises", () => {
      const franchises = ["franchise-A", "franchise-B", "franchise-C"];

      franchises.forEach((franchiseId) => {
        const resolved = resolveFranchiseId(mockAdminUser, franchiseId);
        expect(resolved).toBe(franchiseId);

        expect(() =>
          validateFranchiseAccess(mockAdminUser, franchiseId)
        ).not.toThrow();
      });
    });

    it("should enforce user isolation even with malicious input", () => {
      const maliciousUser: JWTPayload = {
        ...mockNormalUser,
        franchise_id: "franchise-legit",
      };

      // Tentative 1: passer un autre franchise_id dans resolveFranchiseId
      const attempt1 = resolveFranchiseId(maliciousUser, "franchise-hacked");
      expect(attempt1).toBe("franchise-legit"); // Forcé au franchise_id du token

      // Tentative 2: essayer d'accéder à une ressource d'une autre franchise
      expect(() =>
        validateFranchiseAccess(maliciousUser, "franchise-hacked")
      ).toThrow(ForbiddenError);
    });
  });
});
