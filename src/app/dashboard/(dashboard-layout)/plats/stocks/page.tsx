"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IngredientsTab } from "./_components/ingredients-tab";
import { StockTab } from "./_components/stock-tab";

export default function StocksPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des Stocks et Ingrédients
        </h1>
        <p className="text-muted-foreground mt-2">
          Gérez votre catalogue d&apos;ingrédients et les stocks de votre
          franchise
        </p>
      </div>

      <Tabs defaultValue="ingredients" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="ingredients">Ingrédients</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients">
          <IngredientsTab />
        </TabsContent>

        <TabsContent value="stock">
          <StockTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
