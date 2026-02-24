"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { PageHeaderActions } from "@/components/ui/page-header-actions";
import { DiscountsDataTable } from "./_components/discounts-data-table";

import { columns } from "./_components/columns";
import type { Discount } from "./_types";
import { DiscountType, DiscountStatus } from "./_types";

// Données mockées pour la démo
const discountNames = [
  "Promo Week-end",
  "Happy Hour",
  "Menu Étudiant",
  "Réduction Fidélité",
  "Offre Rentrée",
  "Black Friday",
  "Promo du Jour",
  "Menu Midi",
  "Offre Anniversaire",
  "Réduction Famille",
];

const descriptions = [
  "Réduction de 20% sur tous les menus le week-end",
  "15% de réduction entre 14h et 17h",
  "Tarif spécial pour les étudiants avec carte",
  "Programme de fidélité avec avantages exclusifs",
  "Offre spéciale de rentrée sur une sélection de menus",
  "Réduction exceptionnelle pour le Black Friday",
  "Une offre différente chaque jour",
  "Tarif réduit pour les menus du midi",
  "Offre spéciale pour votre anniversaire",
  "Réduction pour les familles nombreuses",
];

// Génération des données mockées
const mockDiscounts: Discount[] = Array.from({ length: 25 }, (_, i) => {
  const types = [
    DiscountType.PERCENTAGE,
    DiscountType.FIXED_AMOUNT,
    DiscountType.SPECIAL_OFFER,
  ];
  const statuses = [
    DiscountStatus.ACTIVE,
    DiscountStatus.SCHEDULED,
    DiscountStatus.EXPIRED,
  ];

  const type = types[i % types.length];
  const status = statuses[i % statuses.length];

  return {
    id: `discount-${i + 1}`,
    name: discountNames[i % discountNames.length],
    description: descriptions[i % descriptions.length],
    type,
    discountValue:
      type === DiscountType.PERCENTAGE
        ? Math.floor(Math.random() * 30) + 10
        : Math.floor(Math.random() * 5) + 2,
    dateStart: "01/03/2025",
    dateEnd: "31/03/2025",
    status,
    menuCount: Math.floor(Math.random() * 5) + 1,
    createdAt: "08/03/2025",
    updatedAt: "10/03/2025",
  };
});

export default function ReductionsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Réductions</h1>
          <p className="text-muted-foreground">
            Gérez vos offres promotionnelles et réductions.
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
            Créer une réduction
          </Button>
        </PageHeaderActions>
      </div>

      <DiscountsDataTable
        columns={columns}
        data={mockDiscounts}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
