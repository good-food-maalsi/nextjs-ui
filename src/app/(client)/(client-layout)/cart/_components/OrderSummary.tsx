"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "@legendapp/state/react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cartState$, cartActions } from "@/lib/store/cart.store";
import { useConfirmOrder } from "@/hooks/use-orders";

export function OrderSummary() {
  const router = useRouter();
  const draftOrderId = useSelector(cartState$.draftOrderId);
  const { mutate: confirmOrder, isPending } = useConfirmOrder();

  const subtotal = cartActions.totalPrice();
  const deliveryFee = 2.99; // Mock fee
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!draftOrderId) {
      toast.error("Aucune commande à passer");
      return;
    }

    confirmOrder(draftOrderId, {
      onSuccess: async (order) => {
        toast.success("Commande confirmée avec succès !");
        await cartActions.clearCart(); // Clear cart locally
        router.push(`/orders/${order.id}`);
      },
      onError: (error: Error) => {
        toast.error("Erreur lors de la confirmation : " + error.message);
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
      <h2 className="text-xl font-bold mb-6">Résumé de la commande</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Sous-total</span>
          <span>{subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Frais de livraison</span>
          <span>{deliveryFee.toFixed(2)} €</span>
        </div>
        <div className="border-t pt-3 flex justify-between font-bold text-lg mt-3">
          <span>Total</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={isPending || !draftOrderId}
        className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isPending ? "Confirmation..." : "Passer la commande"}
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
