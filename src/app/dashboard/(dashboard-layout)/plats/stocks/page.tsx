"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { PageHeaderActions } from "@/components/ui/page-header-actions";
import { StocksDataTable } from "./_components/stocks-data-table";

import { columns } from "./_components/columns";
import type { Stock } from "./_types";

// Données mockées pour la démo (basées sur le screenshot)
const ingredients = [
  "Tomates charnue",
  "Oignons rouges",
  "Poivrons verts",
  "Salade iceberg",
  "Cornichons",
  "Fromage cheddar",
  "Bacon fumé",
  "Poulet pané",
  "Boeuf haché",
  "Pain burger",
];

const categories = [
  "Tomate",
  "Légumes",
  "Légumes",
  "Légumes",
  "Condiments",
  "Fromage",
  "Viande",
  "Viande",
  "Viande",
  "Pain",
];

// Génération des données mockées
const mockStocks: Stock[] = Array.from({ length: 25 }, (_, i) => ({
  id: `stock-${i + 1}`,
  ingredient: ingredients[i % ingredients.length],
  stock: i >= 12 ? 0 : 100, // Les derniers items ont 0 en stock
  categories: categories[i % categories.length],
  fournisseur: "UNION PRIMEURS",
  misAJourLe: "14/03/2025",
}));

export default function StocksPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError] = React.useState(false);

  // Simulation du chargement
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stocks</h1>
        </div>

        <PageHeaderActions>
          <Button variant="secondaryOutline" size="sm">
            Gérer les catégories
          </Button>
          <Button variant="secondaryOutline" size="sm">
            Exporter
          </Button>
          <Button variant="secondaryOutline" size="sm">
            Importer
          </Button>
        </PageHeaderActions>
      </div>

      <StocksDataTable
        columns={columns}
        data={mockStocks}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
