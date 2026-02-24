"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
} from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useOrder } from "@/hooks/use-orders";
import type { OrderWithItems } from "@good-food/contracts/commands";

function OrderStatusBadge({ status }: { status: OrderWithItems["status"] }) {
  const config = {
    draft: {
      label: "Brouillon",
      color: "bg-gray-100 text-gray-600",
      icon: Clock,
    },
    confirmed: {
      label: "Confirmée",
      color: "bg-blue-100 text-blue-600",
      icon: CheckCircle,
    },
    preparation: {
      label: "En préparation",
      color: "bg-yellow-100 text-yellow-600",
      icon: Package,
    },
    ready: {
      label: "Prête",
      color: "bg-green-100 text-green-600",
      icon: CheckCircle,
    },
    canceled: {
      label: "Annulée",
      color: "bg-red-100 text-red-600",
      icon: XCircle,
    },
  };

  const { label, color, icon: Icon } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${color}`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </span>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const {
    profile,
    isLoading: authLoading,
    isAuthenticated,
  } = useRequireAuth("CUSTOMER");
  const { data: order, isLoading: orderLoading, isError } = useOrder(id);

  if (authLoading || orderLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isError || !order) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Commande introuvable</h2>
          <p className="text-gray-500 mb-8">
            Cette commande n'existe pas ou vous n'y avez pas accès.
          </p>
          <button
            onClick={() => router.push("/orders")}
            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Retour aux commandes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Commande #{order.id.slice(0, 8)}
              </h1>
              <p className="text-gray-500">
                Passée le{" "}
                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-4">Articles</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        Article {item.itemId.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantité: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {(item.unitPrice * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Status Timeline (Optional enhancement) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-4">Suivi de la commande</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Commande confirmée</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {order.status === "preparation" && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">En préparation</p>
                      <p className="text-sm text-gray-500">En cours...</p>
                    </div>
                  </div>
                )}

                {order.status === "ready" && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Prête à être récupérée</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.updatedAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Résumé</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{order.total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frais de livraison</span>
                  <span>0.00 €</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{order.total.toFixed(2)} €</span>
                </div>
              </div>

              {/* Restaurant Info (shopId reference) */}
              <div className="border-t pt-4">
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Restaurant</p>
                    <p className="text-sm">ID: {order.shopId.slice(0, 8)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
