import { initClient } from "@ts-rest/core";
import { franchiseContract } from "@good-food/contracts/franchise";
import { authContract } from "@good-food/contracts/auth";
import { catalogContract } from "@good-food/contracts/catalog";
import { commandsContract } from "@good-food/contracts/commands";

const gatewayUrl =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

// Le gateway nginx route /franchise/* → franchise-service (en strippant /franchise/)
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

// Le gateway nginx route /commands/* → commands-service (en strippant /commands/)
// Côté navigateur : on passe par le proxy Next.js /api/commands pour éviter CORS
// et pour que les cookies (accessToken / refreshToken) soient bien envoyés (same-origin 3000).
const commandsBaseUrl =
  typeof window !== "undefined" ? "/api/commands" : `${gatewayUrl}/commands`;

export const commandsClient = initClient(commandsContract, {
  baseUrl: commandsBaseUrl,
  credentials: "include" as const,
});
