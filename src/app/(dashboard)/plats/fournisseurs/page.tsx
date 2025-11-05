"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { SuppliersDataTable } from "@/components/ui/suppliers-data-table";

import { columns, type Fournisseur } from "./_components/columns";

// Données mockées pour la démo
const fournisseurs = [
  "UNION PRIMEURS",
  "BOUCHERIE MODERNE",
  "FROMAGERIE ARTISANALE",
  "MARAÎCHERS ASSOCIÉS",
  "POISSONNERIE DU PORT",
];
const adresses = [
  "Rue Roger Ollivier, 45370 Dry",
  "Avenue de la République, 76000 Rouen",
  "Place du Marché, 14000 Caen",
  "Rue des Fermes, 27000 Évreux",
  "Quai de la Seine, 76600 Le Havre",
];

const mockFournisseurs: Fournisseur[] = Array.from({ length: 25 }, (_, i) => ({
  id: `fournisseur-${i + 1}`,
  nom: fournisseurs[i % fournisseurs.length],
  adresse: adresses[i % adresses.length],
  telephone: "01 23 45 67 89",
  email: "exemple@exemple.com",
}));

export default function FournisseursPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="secondaryOutline" size="sm">
            Importer
          </Button>
          <Button variant="secondaryOutline" size="sm">
            Exporter
          </Button>
          <Button variant="secondaryOutline" size="sm">
            Ajouter un fournisseur
          </Button>
        </div>
      </div>

      <SuppliersDataTable
        columns={columns}
        data={mockFournisseurs}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
