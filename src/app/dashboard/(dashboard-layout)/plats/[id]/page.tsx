"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDish, useDishIngredients, useAddDishIngredient, useUpdateDishIngredient, useRemoveDishIngredient } from "@/hooks/use-dishes";
import { useStocks } from "@/hooks/use-stocks";
import { useFranchiseId } from "@/hooks/use-franchise";
import type { DishIngredient } from "@good-food-maalsi/contracts/catalog";
import type { StockWithIngredient } from "@good-food-maalsi/contracts/franchise";

const EMPTY_STOCKS: StockWithIngredient[] = [];

function getIngredientName(stockId: string, stocks: StockWithIngredient[] | undefined): string {
  const stock = stocks?.find((s) => s.id === stockId);
  return stock?.ingredient?.name ?? stockId;
}

export default function PlatDetailPage() {
  const params = useParams<{ id: string }>();
  const dishId = params.id;
  const franchiseId = useFranchiseId();

  const [selectedStockId, setSelectedStockId] = React.useState<string>("");
  const [quantityToAdd, setQuantityToAdd] = React.useState<number>(1);
  const [editingIngredientId, setEditingIngredientId] = React.useState<string | null>(null);
  const [editQuantity, setEditQuantity] = React.useState<number>(1);

  const { data: dish, isLoading: dishLoading, isError: dishError } = useDish(dishId);
  const { data: dishIngredients = [], isLoading: ingredientsLoading } = useDishIngredients(dishId);
  const { data: stocksData } = useStocks({
    franchise_id: franchiseId ?? "",
    limit: 100,
  });
  const stocksList = React.useMemo(
    () => stocksData?.data ?? EMPTY_STOCKS,
    [stocksData?.data]
  );
  const addIngredientMutation = useAddDishIngredient();
  const updateIngredientMutation = useUpdateDishIngredient();
  const removeIngredientMutation = useRemoveDishIngredient();

  const existingStockIds = React.useMemo(
    () => new Set(dishIngredients.map((di) => di.stock_id)),
    [dishIngredients]
  );
  const availableStocks = React.useMemo(
    () => stocksList.filter((s) => !existingStockIds.has(s.id)),
    [stocksList, existingStockIds]
  );

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockId || quantityToAdd < 1) return;
    try {
      await addIngredientMutation.mutateAsync({
        dishId,
        data: { stock_id: selectedStockId, quantity_required: quantityToAdd },
      });
      setSelectedStockId("");
      setQuantityToAdd(1);
    } catch {
      // toast handled by hook
    }
  };

  const startEdit = (di: DishIngredient) => {
    setEditingIngredientId(di.id);
    setEditQuantity(di.quantity_required);
  };

  const cancelEdit = () => {
    setEditingIngredientId(null);
  };

  const saveEdit = async () => {
    if (!editingIngredientId || editQuantity < 1) return;
    try {
      await updateIngredientMutation.mutateAsync({
        dishId,
        ingredientId: editingIngredientId,
        data: { quantity_required: editQuantity },
      });
      setEditingIngredientId(null);
    } catch {
      // toast handled by hook
    }
  };

  const handleRemove = async (ingredientId: string) => {
    try {
      await removeIngredientMutation.mutateAsync({ dishId, ingredientId });
    } catch {
      // toast handled by hook
    }
  };

  if (dishLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (dishError || !dish) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard/plats">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux plats
          </Link>
        </Button>
        <p className="text-destructive">Plat introuvable.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/dashboard/plats">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux plats
        </Link>
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{dish.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-muted-foreground">{dish.description}</p>
          <p className="font-medium">
            Prix de base : {dish.basePrice.toFixed(2).replace(".", ",")} €
          </p>
          <p className="text-sm text-muted-foreground">
            Disponible : {dish.availability ? "Oui" : "Non"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingrédients du plat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {franchiseId && (
            <form onSubmit={handleAddIngredient} className="flex flex-wrap items-end gap-3">
              <div className="space-y-2">
                <label htmlFor="add-ingredient-stock" className="text-sm font-medium">
                  Ajouter un ingrédient (stock franchise)
                </label>
                <Select
                  value={selectedStockId}
                  onValueChange={setSelectedStockId}
                  disabled={availableStocks.length === 0}
                >
                  <SelectTrigger id="add-ingredient-stock" className="w-[220px]">
                    <SelectValue placeholder="Choisir un ingrédient" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStocks.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.ingredient?.name ?? s.id} (stock: {s.quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="add-ingredient-quantity" className="text-sm font-medium">
                  Quantité requise
                </label>
                <Input
                  id="add-ingredient-quantity"
                  type="number"
                  min={1}
                  value={quantityToAdd}
                  onChange={(e) => setQuantityToAdd(parseInt(e.target.value, 10) || 1)}
                  className="w-24"
                />
              </div>
              <Button
                type="submit"
                disabled={!selectedStockId || addIngredientMutation.isPending || availableStocks.length === 0}
              >
                Ajouter
              </Button>
            </form>
          )}

          {!franchiseId && (
            <p className="text-sm text-muted-foreground">
              Connectez-vous avec une franchise pour gérer les ingrédients.
            </p>
          )}

          {ingredientsLoading ? (
            <div className="text-muted-foreground text-sm">Chargement des ingrédients...</div>
          ) : dishIngredients.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucun ingrédient pour ce plat.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrédient</TableHead>
                  <TableHead>Quantité requise</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dishIngredients.map((di) => (
                  <TableRow key={di.id}>
                    <TableCell>
                      {getIngredientName(di.stock_id, stocksList)}
                    </TableCell>
                    <TableCell>
                      {editingIngredientId === di.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(parseInt(e.target.value, 10) || 1)}
                            className="w-20"
                          />
                          <Button size="sm" onClick={saveEdit} disabled={updateIngredientMutation.isPending}>
                            Enregistrer
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            Annuler
                          </Button>
                        </div>
                      ) : (
                        di.quantity_required
                      )}
                    </TableCell>
                    <TableCell>
                      {editingIngredientId === di.id ? null : (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => startEdit(di)}
                            aria-label="Modifier la quantité"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleRemove(di.id)}
                            disabled={removeIngredientMutation.isPending}
                            aria-label="Retirer l'ingrédient"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
