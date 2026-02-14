"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PageHeaderActions } from "@/components/ui/page-header-actions";
import { IngredientsDataTable } from "./ingredients-data-table";
import {
  createIngredientsColumns,
  type IngredientDisplay,
} from "./ingredients-columns";
import { IngredientFormDialog } from "./ingredient-form-dialog";
import { DeleteIngredientDialog } from "./delete-ingredient-dialog";
import { useIngredients } from "@/hooks/use-ingredients";
import type { Ingredient } from "@/lib/types/ingredient.types";

function mapIngredientToDisplay(ingredient: Ingredient): IngredientDisplay {
  return {
    id: ingredient.id,
    nom: ingredient.name,
    description: ingredient.description,
    fournisseur: ingredient.supplier.name,
    prix_unitaire: ingredient.unit_price,
  };
}

export function IngredientsTab() {
  const [page] = React.useState(1);
  const [limit] = React.useState(100);
  const [search] = React.useState("");

  const { data, isLoading, isError } = useIngredients({ page, limit, search });

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    React.useState<Ingredient | null>(null);

  const handleEdit = (ingredientDisplay: IngredientDisplay) => {
    const ingredient = data?.data.find((i) => i.id === ingredientDisplay.id);
    if (ingredient) {
      setSelectedIngredient(ingredient);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (ingredientDisplay: IngredientDisplay) => {
    const ingredient = data?.data.find((i) => i.id === ingredientDisplay.id);
    if (ingredient) {
      setSelectedIngredient(ingredient);
      setDeleteDialogOpen(true);
    }
  };

  const ingredients: IngredientDisplay[] =
    data?.data.map(mapIngredientToDisplay) ?? [];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Catalogue d&apos;ingrédients
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les ingrédients disponibles pour toutes les franchises
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
            Ajouter un ingrédient
          </Button>
        </PageHeaderActions>
      </div>

      <IngredientsDataTable
        columns={createIngredientsColumns}
        data={ingredients}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <IngredientFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <IngredientFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        ingredient={selectedIngredient || undefined}
      />

      <DeleteIngredientDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        ingredient={selectedIngredient}
      />
    </div>
  );
}
