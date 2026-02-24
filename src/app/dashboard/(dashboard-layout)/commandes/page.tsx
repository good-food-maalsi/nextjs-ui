"use client";

import React from "react";

import { OrdersDataTable } from "./_components/orders-data-table";
import { Button } from "@/components/ui/button";
import { PageHeaderActions } from "@/components/ui/page-header-actions";

import { columns } from "./_components/columns";
import type { Order } from "./_types";
import { PaymentStatus, OrderStatus, DeliveryStatus } from "./_types";
import { useCommands } from "@/hooks/use-commands";
import type { Command } from "@good-food/contracts/franchise";

function mapCommandToOrder(command: Command): Order {
  const statusMap: Record<string, OrderStatus> = {
    draft: OrderStatus.DRAFT,
    confirmed: OrderStatus.CONFIRMED,
    in_progress: OrderStatus.PREPARATION,
    delivered: OrderStatus.READY,
    canceled: OrderStatus.CANCELED,
  };

  const date = new Date(command.created_at);
  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    id: command.id,
    numero: `#${command.id.slice(-6).toUpperCase()}`,
    date: formattedDate,
    client: command.user_id,
    total: "N/A",
    statutPaiement: PaymentStatus.PENDING,
    statutCommande: statusMap[command.status] ?? OrderStatus.DRAFT,
    articles: 0,
    statutLivraison: DeliveryStatus.AWAITING,
  };
}

export default function CommandesPage() {
  const { data, isLoading, isError } = useCommands({ page: 1, limit: 50 });

  const orders: Order[] = (data?.data ?? []).map(mapCommandToOrder);

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
        data={orders}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
