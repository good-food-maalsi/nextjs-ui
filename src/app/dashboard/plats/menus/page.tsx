"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { PageHeaderActions } from "@/components/ui/page-header-actions";
import { MenusDataTable } from "./_components/menus-data-table";

import { columns } from "./_components/columns";
import type { Menu } from "./_types";
import { MenuAvailability } from "./_types";

// Données mockées pour la démo
const menuNames = [
  "Menu Big King",
  "Menu WHOPPER",
  "Menu Chicken Louisiane",
  "Menu Master Cantal Bacon",
  "Menu Double Steakhouse",
  "Menu Crispy Chicken",
  "Menu Big Fish",
  "Menu Végétarien",
  "Menu Kids",
  "Menu Petit Déjeuner",
];

const categories = [
  "Menu Signature",
  "Menu Classique",
  "Menu Premium",
  "Menu Enfant",
  "Menu Petit Déjeuner",
];

const descriptions = [
  "Un menu complet avec frites et boisson",
  "Notre menu phare avec des ingrédients de qualité",
  "Un menu gourmand pour les grands appétits",
  "Menu adapté pour les enfants",
  "Commencez bien la journée avec ce menu",
];

// Génération des données mockées
const mockMenus: Menu[] = Array.from({ length: 25 }, (_, i) => ({
  id: `menu-${i + 1}`,
  name: menuNames[i % menuNames.length],
  description: descriptions[i % descriptions.length],
  category: categories[i % categories.length],
  availability:
    i % 5 === 0 ? MenuAvailability.UNAVAILABLE : MenuAvailability.AVAILABLE,
  dishCount: Math.floor(Math.random() * 5) + 2,
  discountCount: i % 3 === 0 ? Math.floor(Math.random() * 2) + 1 : 0,
  createdAt: "08/03/2025",
}));

export default function MenusPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Menus</h1>
          <p className="text-muted-foreground">
            Gérez vos menus et compositions de plats.
          </p>
        </div>

        <PageHeaderActions>
          <Button variant="secondaryOutline" size="sm">
            Importer
          </Button>
          <Button variant="secondaryOutline" size="sm">
            Exporter
          </Button>
          <Button variant="secondaryOutline" size="sm">
            Créer un menu
          </Button>
        </PageHeaderActions>
      </div>

      <MenusDataTable
        columns={columns}
        data={mockMenus}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
