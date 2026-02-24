"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Store } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function CartSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { isLoading, isAuthenticated } = useRequireAuth("CUSTOMER");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Commande prise en compte</h1>
        <p className="text-gray-600 mb-8">
          Merci pour votre commande. Elle a bien été enregistrée et sera
          préparée dans les plus brefs délais.
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-8">
            Référence : <span className="font-mono font-medium">{orderId.slice(0, 8)}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {orderId && (
            <Link
              href={`/orders/${orderId}`}
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              <Package className="w-5 h-5" />
              Voir ma commande
            </Link>
          )}
          <Link
            href="/restaurants"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            <Store className="w-5 h-5" />
            Continuer mes achats
          </Link>
        </div>

        <Link
          href="/home"
          className="inline-block mt-6 text-gray-500 hover:text-gray-700 text-sm"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
