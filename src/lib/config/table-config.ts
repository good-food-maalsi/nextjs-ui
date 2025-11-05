// Configuration des tables
export const TABLE_CONFIG = {
  // Nombre de lignes par page par défaut
  PAGE_SIZE: 10,

  // Nombre de lignes skeleton affichées pendant le chargement
  LOADING_ROWS: 10,

  // Délai de debounce pour la recherche (ms)
  SEARCH_DEBOUNCE: 300,

  // Temps d'animation pour les transitions (ms)
  ANIMATION_DURATION: 200,
} as const;

// Configuration de pagination
export const PAGINATION_SIZES = [10, 20, 30, 40, 50] as const;

// Messages par défaut
export const TABLE_MESSAGES = {
  LOADING: "Chargement...",
  ERROR: "Une erreur est survenue lors du chargement des données.",
  EMPTY: "Aucune donnée trouvée",
  SEARCH_PLACEHOLDER: "Rechercher...",
} as const;
