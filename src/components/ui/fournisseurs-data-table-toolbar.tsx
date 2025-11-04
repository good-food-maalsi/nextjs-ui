"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FournisseursDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function FournisseursDataTableToolbar<TData>({
  table,
}: FournisseursDataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter;
  const globalFilter = table.getState().globalFilter ?? "";

  return (
    <div className="flex items-end justify-between">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start gap-2 sm:flex-row">
          <Input
            placeholder="Rechercher (nom, email, téléphone)..."
            value={globalFilter}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-[250px]"
          />

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
