"use client";

import { Printer } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useCommand, useUpdateCommand } from "@/hooks/use-commands";
import type { CommandWithItems } from "@good-food-maalsi/contracts/franchise";

const statusLabels: Record<string, string> = {
  draft: "Brouillon",
  confirmed: "Confirmée",
  in_progress: "En préparation",
  delivered: "Livrée",
  canceled: "Annulée",
};

const statusVariants: Record<string, "default" | "pending" | "paid" | "failed"> = {
  draft: "pending",
  confirmed: "default",
  in_progress: "pending",
  delivered: "paid",
  canceled: "failed",
};

function formatDate(value: string | Date): string {
  const date = new Date(value as string | Date);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CommandDetailContent({ command }: { command: CommandWithItems }) {
  const updateCommand = useUpdateCommand();

  const handleUpdateStatus = (status: CommandWithItems["status"]) => {
    updateCommand.mutate({ id: command.id, dto: { status } });
  };

  return (
    <div className="min-h-screen">
      {/* En-tete */}
      <div className="bg-background">
        <div className="mx-auto max-w-6xl py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">
                  Commande #{command.id.slice(-6).toUpperCase()}
                </h1>
                <StatusBadge variant={statusVariants[command.status] ?? "default"}>
                  {statusLabels[command.status] ?? command.status}
                </StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDate(command.created_at)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="secondaryOutline" size="sm">
                <Printer className="h-4 w-4" />
                Imprimer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="mx-auto py-4 max-w-6xl flex gap-7 flex-col xl:flex-row">
        {/* Colonne principale */}
        <div className="space-y-7 flex-1">
          {/* Carte articles */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <StatusBadge variant={statusVariants[command.status] ?? "default"}>
                  {statusLabels[command.status] ?? command.status} ({command.items.length})
                </StatusBadge>
              </div>

              <div className="border rounded-[16px] overflow-hidden">
                {command.items.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    Aucun article dans cette commande.
                  </div>
                ) : (
                  command.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b p-4 last:border-b-0"
                    >
                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                          IMG
                        </div>
                      </div>

                      <div className="flex-1">
                        <p className="font-medium">
                          {item.ingredient?.name ?? item.ingredient_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ID: {item.ingredient_id.slice(0, 8)}...
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          x {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Actions de statut */}
              <div className="flex justify-end gap-2">
                {command.status !== "canceled" && (
                  <Button
                    variant="secondaryOutline"
                    onClick={() => handleUpdateStatus("canceled")}
                    disabled={updateCommand.isPending}
                  >
                    Annuler la commande
                  </Button>
                )}
                {command.status === "draft" && (
                  <Button
                    variant="secondary"
                    onClick={() => handleUpdateStatus("confirmed")}
                    disabled={updateCommand.isPending}
                  >
                    Confirmer
                  </Button>
                )}
                {command.status === "confirmed" && (
                  <Button
                    variant="secondary"
                    onClick={() => handleUpdateStatus("in_progress")}
                    disabled={updateCommand.isPending}
                  >
                    Démarrer la préparation
                  </Button>
                )}
                {command.status === "in_progress" && (
                  <Button
                    variant="secondary"
                    onClick={() => handleUpdateStatus("delivered")}
                    disabled={updateCommand.isPending}
                  >
                    Marquer comme livrée
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Carte historique */}
          <Card>
            <CardHeader>
              <CardTitle>Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-foreground" />
                    <div className="w-px flex-1 bg-border" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm">Commande créée</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(command.created_at)}
                    </p>
                  </div>
                </div>
                {command.updated_at !== command.created_at && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-foreground" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm">
                        Statut mis à jour : {statusLabels[command.status] ?? command.status}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(command.updated_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-7 min-w-[290px] xl:min-w-[380px]">
          <Card className="px-5">
            <div>
              <CardTitle>Informations</CardTitle>
            </div>
            <CardContent className="px-0 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">ID Commande</p>
                <p className="text-sm font-mono">{command.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Franchise</p>
                <p className="text-sm font-mono">{command.franchise_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Client (ID)</p>
                <p className="text-sm font-mono">{command.user_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Articles</p>
                <p className="text-sm font-medium">{command.items.length} article(s)</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                <p className="text-sm">{formatDate(command.updated_at)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: command, isLoading, isError } = useCommand(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Chargement de la commande...</p>
      </div>
    );
  }

  if (isError || !command) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">
          Commande introuvable ou erreur lors du chargement.
        </p>
      </div>
    );
  }

  return <CommandDetailContent command={command} />;
}
