"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { PageHeaderActions } from "@/components/ui/page-header-actions";
import { MenusDataTable } from "./_components/menus-data-table";

import { columns } from "./_components/columns";
import type { Menu } from "./_types";
import { MenuAvailability } from "./_types";
import { useMenus } from "@/hooks/use-menus";

function formatDate(date: string | Date | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("fr-FR");
}

export default function MenusPage() {
  const { data: apiMenus, isLoading, isError } = useMenus();

  const menus: Menu[] = React.useMemo(() => {
    if (!apiMenus) return [];
    return apiMenus.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description ?? "-",
      category: "-",
      availability: (m.availability ?? true)
        ? MenuAvailability.AVAILABLE
        : MenuAvailability.UNAVAILABLE,
      dishCount: 0,
      discountCount: 0,
      createdAt: formatDate(m.createdAt),
    }));
  }, [apiMenus]);

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
        data={menus}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
