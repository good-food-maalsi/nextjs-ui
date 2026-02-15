"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PageHeaderActions } from "@/components/ui/page-header-actions";
import { StockDataTable } from "./stock-data-table";
import {
  createStockColumns,
  type StockFranchiseDisplay,
} from "./stock-columns";
import { StockFormDialog } from "./stock-form-dialog";
import { DeleteStockDialog } from "./delete-stock-dialog";
import { useStocks } from "@/hooks/use-stocks";
import { useFranchiseId } from "@/hooks/use-franchise";
import type { StockFranchise } from "@/lib/types/stock-franchise.types";

function mapStockToDisplay(stock: StockFranchise): StockFranchiseDisplay {
  return {
    id: stock.id,
    ingredient_nom: stock.ingredient.name,
    supplier_nom: stock.ingredient.supplier?.name ?? "",
    quantite: stock.quantity,
    prix_unitaire: stock.ingredient.unit_price,
  };
}

export function StockTab() {
  const franchiseId = useFranchiseId();
  const [page] = React.useState(1);
  const [limit] = React.useState(100);
  const [search] = React.useState("");

  const { data, isLoading, isError } = useStocks({
    page,
    limit,
    search,
    franchise_id: franchiseId || "",
  });

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedStock, setSelectedStock] =
    React.useState<StockFranchise | null>(null);

  const handleEdit = (stockDisplay: StockFranchiseDisplay) => {
    const stock = data?.data.find((s) => s.id === stockDisplay.id);
    if (stock) {
      setSelectedStock(stock);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (stockDisplay: StockFranchiseDisplay) => {
    const stock = data?.data.find((s) => s.id === stockDisplay.id);
    if (stock) {
      setSelectedStock(stock);
      setDeleteDialogOpen(true);
    }
  };

  const stocks: StockFranchiseDisplay[] =
    data?.data.map(mapStockToDisplay) ?? [];

  if (!franchiseId) {
    // TODO: Redirect to login page
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Stock de la franchise
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les quantités d&apos;ingrédients disponibles dans votre
            franchise
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
            onClick={() => setCreateDialogOpen(true)}
          >
            Ajouter au stock
          </Button>
        </PageHeaderActions>
      </div>

      <StockDataTable
        columns={createStockColumns}
        data={stocks}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <StockFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <StockFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        stock={selectedStock || undefined}
      />

      <DeleteStockDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        stock={selectedStock}
      />
    </div>
  );
}
