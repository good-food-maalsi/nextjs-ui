import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors",
  {
    variants: {
      variant: {
        // Statuts de paiement
        paid: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
        pending: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
        failed: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
        refunded: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-400",

        // Statuts de commande
        processing: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
        confirmed: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
        cancelled: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
        completed: "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",

        // Statuts de livraison
        preparing: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
        shipped: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
        delivered: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
        returned: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",

        // Statut générique "traité" comme dans l'image
        processed: "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
      },
    },
    defaultVariants: {
      variant: "processed",
    },
  }
)

export type StatusBadgeVariant = VariantProps<typeof statusBadgeVariants>["variant"]

interface StatusBadgeProps extends React.ComponentProps<"span">, VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant, ...props }: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    />
  )
}

// Fonction utilitaire pour mapper les statuts en français vers les variants
export function getStatusVariant(status: string): StatusBadgeVariant {
  const statusMap: Record<string, StatusBadgeVariant> = {
    // Statuts de paiement
    "payé": "paid",
    "en attente": "pending",
    "échoué": "failed",
    "remboursé": "refunded",

    // Statuts de commande
    "en cours": "processing",
    "confirmée": "confirmed",
    "annulée": "cancelled",
    "terminée": "completed",
    "traitée": "processed",

    // Statuts de livraison
    "préparation": "preparing",
    "expédiée": "shipped",
    "livrée": "delivered",
    "retournée": "returned",
  }

  return statusMap[status.toLowerCase()] || "processed"
}

export { StatusBadge, statusBadgeVariants }