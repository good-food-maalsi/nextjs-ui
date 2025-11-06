"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { PageHeaderActions } from "@/components/ui/page-header-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DishesDataTable } from "./_components/dishes-data-table";

import { columns } from "./_components/columns";
import type { Dish } from "./_types";
import { DishStatus, DishAvailability } from "./_types";

// Données mockées pour la démo (basées sur le screenshot)
const dishNames = [
  "Master Cantal Bacon",
  "Master Poulet Cantal",
  "Chicken Louisiane Steakhouse",
  "Chicken Spicy",
  "Double Steakhouse",
  "Double Cheese Bacon",
  "Double WHOPPER Cheese",
  "Steakhouse",
  "Big King XXL",
  "WHOPPER",
  "Big King",
  "Crispy Chicken Cheese",
  "Big Fish",
  "Un P'tit Wrap !",
];

const menuNames = [
  "Master Cantal Bacon",
  "Master Poulet Cantal",
  "Chicken Louisiane Steakhouse",
  "Chicken Spicy",
  "Double Steakhouse",
  "Menu Maxi BestOf",
];

// Génération des données mockées
const mockDishes: Dish[] = Array.from({ length: 25 }, (_, i) => ({
  id: `dish-${i + 1}`,
  nom: dishNames[i % dishNames.length],
  prixBase: "9,00 €",
  disponibilite:
    i === 8 || i === 9 || i === 13 || i === 21 || i === 22
      ? DishAvailability.UNAVAILABLE
      : DishAvailability.AVAILABLE,
  menusAssocies: menuNames[i % menuNames.length],
  dateCreation: "08/03/2025",
  statut:
    i % 3 === 0
      ? DishStatus.PUBLISHED
      : i % 3 === 1
        ? DishStatus.DRAFT
        : DishStatus.ARCHIVED,
}));

export default function PlatsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>("publies");

  // Simulation du chargement
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filtrage des plats selon l'onglet actif
  const filteredDishes = React.useMemo(() => {
    switch (activeTab) {
      case "publies":
        return mockDishes.filter(
          (dish) => dish.statut === DishStatus.PUBLISHED
        );
      case "brouillon":
        return mockDishes.filter((dish) => dish.statut === DishStatus.DRAFT);
      case "archive":
        return mockDishes.filter((dish) => dish.statut === DishStatus.ARCHIVED);
      default:
        return mockDishes;
    }
  }, [activeTab]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plats</h1>
        </div>

        <PageHeaderActions>
          <Button variant="secondaryOutline" size="sm">
            Importer
          </Button>
          <Button variant="secondaryOutline" size="sm">
            Exporter
          </Button>
          <Button variant="secondaryOutline" size="sm">
            Créer un plat
          </Button>
        </PageHeaderActions>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="publies">Publiés</TabsTrigger>
          <TabsTrigger value="brouillon">Brouillon</TabsTrigger>
          <TabsTrigger value="archive">Archivé</TabsTrigger>
        </TabsList>

        <TabsContent value="publies">
          <DishesDataTable
            columns={columns}
            data={filteredDishes}
            isLoading={isLoading}
            isError={isError}
          />
        </TabsContent>

        <TabsContent value="brouillon">
          <DishesDataTable
            columns={columns}
            data={filteredDishes}
            isLoading={isLoading}
            isError={isError}
          />
        </TabsContent>

        <TabsContent value="archive">
          <DishesDataTable
            columns={columns}
            data={filteredDishes}
            isLoading={isLoading}
            isError={isError}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
