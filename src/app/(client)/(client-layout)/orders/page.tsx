"use client";

import Link from "next/link";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useOrders } from "@/hooks/use-orders";
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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${color}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
}

export default function OrdersPage() {
  const {
    profile,
    isLoading: authLoading,
    isAuthenticated,
  } = useRequireAuth("CUSTOMER");
  const { data: orders, isLoading: ordersLoading } = useOrders();

  if (authLoading || ordersLoading) {
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

  // Filter out draft orders from the list
  const visibleOrders =
    orders?.filter((order) => order.status !== "draft") ?? [];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>

      {visibleOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Aucune commande</h2>
          <p className="text-gray-500 mb-8">
            Vous n'avez pas encore passé de commande.
          </p>
          <Link
            href="/restaurants"
            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors inline-block"
          >
            Découvrir les restaurants
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Commande #{order.id.slice(0, 8)}
                  </h3>
                  <p className="text-gray-500 text-sm">
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

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <p className="text-gray-600">
                  {order.items.length} article
                  {order.items.length > 1 ? "s" : ""}
                </p>
                <p className="font-bold text-lg">{order.total.toFixed(2)} €</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
