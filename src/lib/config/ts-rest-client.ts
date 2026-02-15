import { initClient } from "@ts-rest/core";
import { franchiseContract } from "@good-food-maalsi/contracts/franchise";
import { authContract } from "@good-food-maalsi/contracts/auth";
import { catalogContract } from "@good-food-maalsi/contracts/catalog";

const gatewayUrl =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

// Le gateway nginx route /franchise/* → franchise-service (en strippant /franchise/)
// Les paths du contrat (/suppliers, /ingredients, ...) doivent donc être préfixés par /franchise
export const franchiseClient = initClient(franchiseContract, {
  baseUrl: `${gatewayUrl}/franchise`,
  credentials: "include" as const,
});

/**
 * Client franchise authentifié par token.
 * À utiliser côté serveur : les requêtes Node.js n'envoient pas les cookies du navigateur,
 * le franchise-service exige un JWT dans Authorization.
 */
export function createAuthenticatedFranchiseClient(accessToken: string) {
  return initClient(franchiseContract, {
    baseUrl: `${gatewayUrl}/franchise`,
    baseHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

// Les paths du contrat auth commencent déjà par /auth/ — baseUrl sans préfixe supplémentaire
export const authClient = initClient(authContract, {
  baseUrl: gatewayUrl,
  credentials: "include" as const,
});

// Le gateway nginx route /catalog/* → catalog-service (en strippant /catalog/)
export const catalogClient = initClient(catalogContract, {
  baseUrl: `${gatewayUrl}/catalog`,
  credentials: "include" as const,
});
