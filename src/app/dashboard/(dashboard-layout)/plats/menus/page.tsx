"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { PageHeaderActions } from "@/components/ui/page-header-actions";
import { MenusDataTable } from "./_components/menus-data-table";
import { createColumns } from "./_components/columns";
import { MenuFormDialog } from "./_components/menu-form-dialog";
import { DeleteMenuDialog } from "./_components/delete-menu-dialog";
import type { Menu } from "./_types";
import { MenuAvailability } from "./_types";
import { useMenus } from "@/hooks/use-menus";

function formatDate(date: string | Date | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("fr-FR");
}

export default function MenusPage() {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editMenuId, setEditMenuId] = React.useState<string | null>(null);
  const [deleteMenu, setDeleteMenu] = React.useState<Menu | null>(null);

  const { data: apiMenus, isLoading, isError } = useMenus();

  const handleEdit = React.useCallback((menu: Menu) => {
    setEditMenuId(menu.id);
  }, []);

  const handleDelete = React.useCallback((menu: Menu) => {
    setDeleteMenu(menu);
  }, []);

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
          <Button
            variant="secondaryOutline"
            size="sm"
            onClick={() => setCreateOpen(true)}
          >
            Créer un menu
          </Button>
        </PageHeaderActions>
      </div>

      <MenuFormDialog open={createOpen} onOpenChange={setCreateOpen} />

      <MenuFormDialog
        open={!!editMenuId}
        onOpenChange={(open) => !open && setEditMenuId(null)}
        menuId={editMenuId}
      />

      <DeleteMenuDialog
        open={!!deleteMenu}
        onOpenChange={(open) => !open && setDeleteMenu(null)}
        menu={deleteMenu}
      />

      <MenusDataTable
        columns={createColumns}
        data={menus}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
