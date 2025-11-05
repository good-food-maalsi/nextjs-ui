"use client";

import { Edit, Printer } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({
  params: _params,
}: OrderDetailPageProps) {
  // En production, on fetcherait les donnees avec l'id
  // const { id } = await params;

  // Donnees mockees pour la demo
  const order = {
    id: "1542",
    date: "7 mars 2025 a 07:48",
    location: "Rouen",
    statutPaiement: "Payee",
    statutCommande: "Non traitee",
    livreur: {
      nom: "Jean Blondion",
    },
    articles: [
      {
        id: "1",
        nom: "Toast oeuf avocat",
        sku: "SKU : IF-TOAST-OA",
        image: "/placeholder-dish.jpg",
        prix: 8.5,
        quantite: 1,
        total: 8.5,
      },
      {
        id: "2",
        nom: "Burger Normand",
        sku: "SKU : IF-BURGER-NO",
        image: "/placeholder-dish.jpg",
        prix: 11.5,
        quantite: 2,
        total: 23.0,
      },
    ],
    sousTotal: 31.5,
    livraison: {
      methode: "Velo, Jean Blondion (6.5km en 13min)",
      cout: 3.5,
    },
    taxes: 5.83,
    total: 35.0,
    client: {
      nom: "Guillaume Deman",
      email: "guillaume.deman@vidaobe.fr",
      adresse: {
        rue: "17 rue des Bons Enfants",
        codePostal: "76000",
        ville: "Rouen",
        pays: "France",
      },
      telephone: "+33 6 00 00 00 00",
    },
    historique: [
      {
        evenement:
          "Un paiement de 35,00 EUR effectue avec une carte Visa se terminant par 1240 a ete traite",
        heure: "07:48",
      },
      {
        evenement: "Guillaume Deman a passe cette commande",
        heure: "07:48",
      },
    ],
  };

  return (
    <div className="min-h-screen">
      {/* En-tete */}
      <div className="bg-background">
        <div className="mx-auto max-w-6xl py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">Commande #{order.id}</h1>
                <StatusBadge variant="paid">{order.statutPaiement}</StatusBadge>
                <StatusBadge variant="pending">
                  {order.statutCommande}
                </StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground">
                {order.date} • {order.location}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="secondaryOutline" size="sm">
                Rembourser
              </Button>
              <Button variant="secondaryOutline" size="sm">
                Modifier
              </Button>
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
          {/* Carte commande non traitee */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge variant="pending">Non traite (2)</StatusBadge>
                </div>
              </div>
              {/* Table structure - Livreur + Articles */}
              <div className="border rounded-[16px] overflow-hidden">
                {/* Premiere ligne - Livreur */}
                <div className="border-b bg-muted/50 p-4">
                  <p className="text-sm font-medium">Livreur</p>
                  <p className="text-sm text-muted-foreground">
                    {order.livreur.nom}
                  </p>
                </div>

                {/* Lignes suivantes - Articles */}
                {order.articles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center gap-4 border-b p-4 last:border-b-0"
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                      {/* Placeholder pour l'image */}
                      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        IMG
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{article.nom}</p>
                      <p className="text-sm text-muted-foreground">
                        {article.sku}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {article.prix.toFixed(2)} EUR
                      </span>
                      <span className="text-muted-foreground">
                        x {article.quantite}
                      </span>
                      <span className="min-w-[80px] text-right font-medium">
                        {article.total.toFixed(2)} EUR
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end gap-2">
                <Button variant="secondaryOutline">Annuler la commande</Button>
                <Button variant="secondary">Confirmer la preparation</Button>
              </div>
            </CardContent>
          </Card>

          {/* Carte paiement */}
          <Card>
            <CardContent className="space-y-4">
              <StatusBadge variant="paid">Payee</StatusBadge>
              <div className="border rounded-[16px] overflow-hidden">
                {/* Première cellule - Sous-total, Livraison, Taxes */}
                <div className="border-b p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <div className="text-right">
                      <span className="text-muted-foreground">
                        {order.articles.length} articles
                      </span>
                      <span className="ml-4 font-medium">
                        {order.sousTotal.toFixed(2)} EUR
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <div className="text-right">
                      <span className="text-muted-foreground">
                        {order.livraison.methode}
                      </span>
                      <span className="ml-4 font-medium">
                        {order.livraison.cout.toFixed(2)} EUR
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes</span>
                    <div className="text-right">
                      <span className="text-muted-foreground">
                        FR TVA 20% (inclus)
                      </span>
                      <span className="ml-4 font-medium">
                        {order.taxes.toFixed(2)} EUR
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deuxième cellule - Total */}
                <div className="flex justify-between p-4 font-semibold">
                  <span>Total</span>
                  <span>{order.total.toFixed(2)} EUR</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendrier */}
          <Card>
            <CardHeader>
              <CardTitle>Calendrier</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="text-sm font-medium">Aujourd'hui</div>

                <div className="space-y-4">
                  {order.historique.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-foreground" />
                        {index < order.historique.length - 1 && (
                          <div className="w-px flex-1 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm">{event.evenement}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.heure}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-7 min-w-[290px] xl:min-w-[380px]">
          {/* Notes */}
          <Card>
            <div className="flex items-center justify-between px-5">
              <CardTitle>Notes</CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aucun commentaire du client
              </p>
            </CardContent>
          </Card>

          <Card className="px-5">
            <div>
              <CardTitle>Client</CardTitle>

              <div className="flex items-center justify-between mt-1.5">
                <Link
                  href="#"
                  className="text-secondary text-sm hover:underline"
                >
                  {order.client.nom}
                </Link>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <CardTitle>Informations de contact</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <Link
                href={`mailto:${order.client.email}`}
                className="text-sm text-secondary hover:underline"
              >
                {order.client.email}
              </Link>
              <Link
                href={`tel:${order.client.telephone}`}
                className="text-sm text-secondary hover:underline"
              >
                {order.client.telephone}
              </Link>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <CardTitle>Adresse de livraison</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm">
                <p>{order.client.adresse.rue}</p>
                <p>
                  {order.client.adresse.codePostal} {order.client.adresse.ville}
                </p>
                <p>{order.client.adresse.pays}</p>
              </div>

              <Button
                variant="link"
                className="h-auto p-0 text-sm text-secondary"
              >
                Voir la carte
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
