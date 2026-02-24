"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  paymentStatusLabels,
  orderStatusLabels,
  deliveryStatusLabels,
  PaymentStatus,
  OrderStatus,
  DeliveryStatus,
} from "@/app/dashboard/(dashboard-layout)/commandes/columns";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableDateFilter } from "./data-table-filter-date";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter;
  const globalFilter = table.getState().globalFilter ?? "";

  const dateFilterValues = [
    "Aujourd'hui",
    "Cette semaine",
    "Ce mois",
    "Cette année",
    "Personnalisé",
  ];

  return (
    <div className="flex items-end justify-between">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start gap-2 sm:flex-row">
          <Input
            placeholder="Rechercher (n°, client, ID)..."
            value={globalFilter}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-[250px]"
          />

          {/* Filtre Statut du paiement */}
          {table.getColumn("statutPaiement") && (
            <DataTableFacetedFilter
              table={table}
              column={table.getColumn("statutPaiement")!}
              title="Paiement"
              options={Object.values(PaymentStatus).map((value) => ({
                label: paymentStatusLabels[value],
                value,
              }))}
              canMultipleSlection={true}
            />
          )}

          {/* Filtre Statut de commande */}
          {table.getColumn("statutCommande") && (
            <DataTableFacetedFilter
              table={table}
              column={table.getColumn("statutCommande")!}
              title="Commande"
              options={Object.values(OrderStatus).map((value) => ({
                label: orderStatusLabels[value],
                value,
              }))}
              canMultipleSlection={true}
            />
          )}

          {/* Filtre Statut de livraison */}
          {table.getColumn("statutLivraison") && (
            <DataTableFacetedFilter
              table={table}
              column={table.getColumn("statutLivraison")!}
              title="Livraison"
              options={Object.values(DeliveryStatus).map((value) => ({
                label: deliveryStatusLabels[value],
                value,
              }))}
              canMultipleSlection={true}
            />
          )}

          {/* Filtre Date */}
          {table.getColumn("date") && (
            <DataTableDateFilter
              table={table}
              column={table.getColumn("date")!}
              title="Date"
              options={dateFilterValues.map((value: string) => ({
                label: value,
                value,
              }))}
              canMultipleSlection={false}
            />
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters();
                table.setGlobalFilter("");
              }}
              className="h-8 px-2 lg:px-3"
            >
              Réinitialiser
              <X />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
