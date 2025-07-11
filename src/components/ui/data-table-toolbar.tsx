"use client";

import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { DataTableDateFilter } from "./data-table-filter-date";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

interface RowData {
  categories: Array<{ category: { name: string } }>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const firstColumn = table.getAllColumns()[1];

  const getAllCategories = () => {
    const uniqueNames = new Set<string>();
    const rows = table.getCoreRowModel().rows;
    rows.forEach((row) => {
      const categories = (row.original as RowData).categories;

      if (categories && Array.isArray(categories)) {
        categories.forEach((cat) => {
          if (cat?.category?.name) {
            uniqueNames.add(cat.category.name);
          }
        });
      }
    });

    return Array.from(uniqueNames).map((name) => ({
      label: name,
      value: name,
    }));
  };

  const values = [
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
            placeholder="Rechercher..."
            value={(firstColumn.getFilterValue() as string) ?? ""}
            onChange={(event) => firstColumn.setFilterValue(event.target.value)}
            className="h-8 w-[250px]"
          />
          {table
            .getAllColumns()
            .filter((column) => column.getCanFilter())
            .map((column) => {
              if (column.id === "categories") {
                return (
                  <DataTableFacetedFilter
                    key={column.id}
                    table={table}
                    column={column}
                    title={
                      typeof column.columnDef.header === "string"
                        ? column.columnDef.header
                        : ""
                    }
                    options={getAllCategories()}
                    canMultipleSlection={true}
                  />
                );
              }
              if (column.id === "author") {
                return (
                  <DataTableFacetedFilter
                    key={column.id}
                    table={table}
                    column={column}
                    title={
                      typeof column.columnDef.header === "string"
                        ? column.columnDef.header
                        : ""
                    }
                    options={Array.from(
                      column.getFacetedUniqueValues().keys()
                    ).map((value: string) => ({
                      label: value,
                      value,
                    }))}
                    canMultipleSlection={false}
                  />
                );
              }
              if (column.id === "createdAt") {
                return (
                  <DataTableDateFilter
                    key={column.id}
                    table={table}
                    column={column}
                    title={
                      typeof column.columnDef.header === "string"
                        ? column.columnDef.header
                        : ""
                    }
                    options={values.map((value: string) => ({
                      label: value,
                      value,
                    }))}
                    canMultipleSlection={false}
                  />
                );
              }
              return (
                <DataTableFacetedFilter
                  key={column.id}
                  table={table}
                  column={column}
                  title={
                    typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : ""
                  }
                  options={Array.from(
                    column.getFacetedUniqueValues().keys()
                  ).map((value: string) => ({
                    label: value,
                    value,
                  }))}
                />
              );
            })}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
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
