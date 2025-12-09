"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Tag, Calendar, Percent } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { DiscountDetail, DiscountMenu } from "../_types";
import {
  DiscountType,
  DiscountStatus,
  discountTypeLabels,
  discountStatusLabels,
} from "../_types";

// Données mockées pour les menus associés
const mockMenus: DiscountMenu[] = [
  {
    id: "menu-1",
    name: "Menu Big King",
    category: "Menu Signature",
  },
  {
    id: "menu-2",
    name: "Menu WHOPPER",
    category: "Menu Classique",
  },
  {
    id: "menu-3",
    name: "Menu Chicken Louisiane",
    category: "Menu Premium",
  },
];

// Données mockées pour une réduction détaillée
const mockDiscountDetail: DiscountDetail = {
  id: "discount-1",
  name: "Promo Week-end",
  description: "Réduction de 20% sur tous les menus le week-end",
  type: DiscountType.PERCENTAGE,
  discountValue: 20,
  dateStart: "01/03/2025",
  dateEnd: "31/03/2025",
  status: DiscountStatus.ACTIVE,
  menuCount: 3,
  createdAt: "08/03/2025",
  updatedAt: "10/03/2025",
  menus: mockMenus,
};

// Fonction pour déterminer la variante du badge de statut
const getStatusVariant = (
  status: DiscountStatus
): "success" | "warning" | "default" => {
  switch (status) {
    case DiscountStatus.ACTIVE:
      return "success";
    case DiscountStatus.SCHEDULED:
      return "warning";
    case DiscountStatus.EXPIRED:
      return "default";
    default:
      return "default";
  }
};

export default function DiscountDetailPage() {
  const _params = useParams();
  const router = useRouter();
  const [discount] = React.useState<DiscountDetail>(mockDiscountDetail);
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

  // Calcul du format d'affichage de la valeur
  const displayValue =
    discount.type === DiscountType.PERCENTAGE
      ? `${discount.discountValue}%`
      : discount.type === DiscountType.FIXED_AMOUNT
        ? `${discount.discountValue} €`
        : "Offre spéciale";

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
          Retour aux réductions
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Tag className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {discount.name}
              </h1>
              <p className="text-muted-foreground mt-2">
                {discount.description}
              </p>
            </div>
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

      {/* Informations de la réduction */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4" />
              Type de réduction
            </p>
            <Badge variant="outline" className="text-base">
              {discountTypeLabels[discount.type]}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
              <Percent className="h-4 w-4" />
              Valeur
            </p>
            <p className="text-2xl font-bold text-secondary">{displayValue}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Statut
            </p>
            <StatusBadge variant={getStatusVariant(discount.status)}>
              {discountStatusLabels[discount.status]}
            </StatusBadge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              Date de début
            </p>
            <p className="text-base">{discount.dateStart}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              Date de fin
            </p>
            <p className="text-base">{discount.dateEnd}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Menus associés
            </p>
            <p className="text-base">{discount.menuCount} menu(s)</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Date de création
            </p>
            <p className="text-base">{discount.createdAt}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Dernière modification
            </p>
            <p className="text-base">{discount.updatedAt}</p>
          </div>
        </CardContent>
      </Card>

      {/* Liste des menus associés */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Menus bénéficiant de cette réduction</CardTitle>
          <Button variant="secondaryOutline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un menu
          </Button>
        </CardHeader>
        <CardContent>
          {discount.menus.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-primary-200">
                  <TableRow>
                    <TableHead>Nom du menu</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discount.menus.map((menu) => (
                    <TableRow key={menu.id}>
                      <TableCell className="font-medium">{menu.name}</TableCell>
                      <TableCell>{menu.category}</TableCell>
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
              Aucun menu associé à cette réduction
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
