"use client";

import React from "react";

import { OrdersDataTable } from "./_components/orders-data-table";
import { Button } from "@/components/ui/button";
import { PageHeaderActions } from "@/components/ui/page-header-actions";

import { columns } from "./_components/columns";
import type { Order } from "./_types";
import {
  PaymentStatus,
  OrderStatus,
  DeliveryStatus,
} from "./_types";

// Données de test avec variété pour tester les filtres
const statutsPaiement: PaymentStatus[] = [
  PaymentStatus.PENDING,
  PaymentStatus.COMPLETED,
  PaymentStatus.FAILED,
  PaymentStatus.REFUND,
];
const statutsCommande: OrderStatus[] = [
  OrderStatus.DRAFT,
  OrderStatus.CONFIRMED,
  OrderStatus.PREPARATION,
  OrderStatus.READY,
  OrderStatus.CANCELED,
];
const statutsLivraison: DeliveryStatus[] = [
  DeliveryStatus.AWAITING,
  DeliveryStatus.COMMAND_RETRIEVED,
  DeliveryStatus.DELIVERED,
  DeliveryStatus.UNABLE_TO_DELIVER,
];
const clients = [
  "Alexandre KAKAL",
  "Marie DUPONT",
  "Jean MARTIN",
  "Sophie BERNARD",
  "Lucas PETIT",
];
const dates = [
  "Aujourd'hui à 14:30",
  "Hier à 7:10",
  "Il y a 2 jours",
  "Il y a 3 jours",
  "Il y a 1 semaine",
];

const mockOrders: Order[] = Array.from({ length: 25 }, (_, i) => ({
  id: `order-${i + 1}`,
  numero: `#${1542 + i}`,
  date: dates[i % dates.length],
  client: clients[i % clients.length],
  total: `${(Math.random() * 200 + 50).toFixed(2)} €`,
  statutPaiement: statutsPaiement[i % statutsPaiement.length],
  statutCommande: statutsCommande[i % statutsCommande.length],
  articles: Math.floor(Math.random() * 5) + 1,
  statutLivraison: statutsLivraison[i % statutsLivraison.length],
}));

export default function CommandesPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
          <p className="text-muted-foreground">
            Gérez et suivez toutes vos commandes depuis cette interface.
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
            Créer une commande
          </Button>
        </PageHeaderActions>
      </div>

      <OrdersDataTable
        columns={columns}
        data={mockOrders}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
