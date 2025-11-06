"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { MenuDetail, MenuDish, MenuDiscount } from "../_types";
import { MenuAvailability, menuAvailabilityLabels } from "../_types";

// Données mockées pour un menu détaillé
const mockDishes: MenuDish[] = [
  {
    id: "dish-1",
    name: "Big King",
    description: "Double steak, fromage, salade, tomate, oignons, sauce burger",
    basePrice: "9,00 €",
    availability: "available",
  },
  {
    id: "dish-2",
    name: "Frites Moyennes",
    description: "Frites dorées et croustillantes",
    basePrice: "3,50 €",
    availability: "available",
  },
  {
    id: "dish-3",
    name: "Boisson 50cl",
    description: "Coca-Cola, Fanta, Sprite ou Oasis",
    basePrice: "2,50 €",
    availability: "available",
  },
];

const mockDiscounts: MenuDiscount[] = [
  {
    id: "discount-1",
    name: "Promo Week-end",
    description: "Réduction de 20% sur tous les menus le week-end",
    type: "percentage",
    discountValue: 20,
    dateStart: "01/03/2025",
    dateEnd: "31/03/2025",
  },
];

const mockMenuDetail: MenuDetail = {
  id: "menu-1",
  name: "Menu Big King",
  description: "Un menu complet avec frites et boisson",
  category: "Menu Signature",
  availability: MenuAvailability.AVAILABLE,
  dishes: mockDishes,
  discounts: mockDiscounts,
  createdAt: "08/03/2025",
  updatedAt: "10/03/2025",
};

const discountTypeLabels: Record<string, string> = {
  percentage: "Pourcentage",
  fixed_amount: "Montant fixe",
  special_offer: "Offre spéciale",
};

export default function MenuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [menu] = React.useState<MenuDetail>(mockMenuDetail);
  const [isLoading] = React.useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* En-tête avec navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux menus
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{menu.name}</h1>
            <p className="text-muted-foreground mt-2">{menu.description}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="secondaryOutline" size="sm">
              Modifier
            </Button>
            <Button variant="destructiveOutline" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      </div>

      {/* Informations du menu */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Catégorie
            </p>
            <p className="text-base mt-1">{menu.category}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Disponibilité
            </p>
            <div className="mt-1">
              <StatusBadge
                variant={
                  menu.availability === MenuAvailability.AVAILABLE
                    ? "success"
                    : "destructive"
                }
              >
                {menuAvailabilityLabels[menu.availability]}
              </StatusBadge>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Nombre de plats
            </p>
            <p className="text-base mt-1">{menu.dishes.length} plat(s)</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Date de création
            </p>
            <p className="text-base mt-1">{menu.createdAt}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Dernière modification
            </p>
            <p className="text-base mt-1">{menu.updatedAt}</p>
          </div>
        </CardContent>
      </Card>

      {/* Liste des plats du menu */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Plats du menu</CardTitle>
          <Button variant="secondaryOutline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un plat
          </Button>
        </CardHeader>
        <CardContent>
          {menu.dishes.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-primary-200">
                  <TableRow>
                    <TableHead>Nom du plat</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Prix de base</TableHead>
                    <TableHead>Disponibilité</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menu.dishes.map((dish) => (
                    <TableRow key={dish.id}>
                      <TableCell className="font-medium">{dish.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[300px] truncate">
                        {dish.description}
                      </TableCell>
                      <TableCell>{dish.basePrice}</TableCell>
                      <TableCell>
                        <StatusBadge
                          variant={
                            dish.availability === "available"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {dish.availability === "available"
                            ? "Disponible"
                            : "Indisponible"}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucun plat dans ce menu
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des réductions appliquées */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Réductions appliquées
          </CardTitle>
          <Button variant="secondaryOutline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une réduction
          </Button>
        </CardHeader>
        <CardContent>
          {menu.discounts.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-primary-200">
                  <TableRow>
                    <TableHead>Nom de la réduction</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead>Date de début</TableHead>
                    <TableHead>Date de fin</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menu.discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{discount.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {discount.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {discountTypeLabels[discount.type]}
                      </TableCell>
                      <TableCell>
                        {discount.type === "percentage"
                          ? `${discount.discountValue}%`
                          : `${discount.discountValue} €`}
                      </TableCell>
                      <TableCell>{discount.dateStart}</TableCell>
                      <TableCell>{discount.dateEnd}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucune réduction appliquée à ce menu
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
