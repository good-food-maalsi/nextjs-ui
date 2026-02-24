import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import type { Dish } from "@good-food-maalsi/contracts/catalog";
import { orderService } from "@/services/order.service";

export interface CartItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    quantity: number;
    restaurantId: string;
}

interface CartState {
    items: CartItem[];
    draftOrderId: string | null;
    restaurantId: string | null;
    isOpen: boolean;
}

export const cartState$ = observable<CartState>({
    items: [],
    draftOrderId: null,
    restaurantId: null,
    isOpen: false,
});

// Persist cart to local storage
persistObservable(cartState$, {
    local: "cart",
    pluginLocal: ObservablePersistLocalStorage,
});

// Helper to convert Dish to CartItem
function dishToCartItem(dish: Dish, restaurantId: string): CartItem {
    return {
        id: dish.id,
        name: dish.name,
        description: dish.description,
        price: dish.basePrice,
        image: dish.imageUrl ?? null,
        quantity: 1,
        restaurantId,
    };
}

export const cartActions = {
    addToCart: async (dish: Dish, restaurantId: string) => {
        const currentRestaurantId = cartState$.restaurantId.peek();

        // Check if adding item from a different restaurant
        if (currentRestaurantId && currentRestaurantId !== restaurantId) {
            const confirmClear = window.confirm(
                "Vous ne pouvez commander que dans un seul restaurant à la fois. Voulez-vous vider votre panier actuel ?"
            );
            if (!confirmClear) return;
            await cartActions.clearCart();
        }

        const draftOrderId = cartState$.draftOrderId.peek();
        const currentItems = cartState$.items.peek();

        // Prepare item to add
        const itemToAdd = {
            itemId: dish.id,
            quantity: 1,
            unitPrice: dish.basePrice,
        };

        if (!draftOrderId) {
            // First item: create draft order
            const order = await orderService.create({
                shopId: restaurantId,
                items: [itemToAdd],
            });
            cartState$.items.set([dishToCartItem(dish, restaurantId)]);
            cartState$.draftOrderId.set(order.id);
            cartState$.restaurantId.set(restaurantId);
        } else {
            // Add item incrementally to existing draft order
            await orderService.addItem(draftOrderId, itemToAdd);

            // Update local state
            const existingItemIndex = currentItems.findIndex((item) => item.id === dish.id);
            const newItems: CartItem[] =
                existingItemIndex > -1
                    ? currentItems.map((item, i) =>
                          i === existingItemIndex
                              ? { ...item, quantity: item.quantity + 1 }
                              : item
                      )
                    : [...currentItems, dishToCartItem(dish, restaurantId)];
            cartState$.items.set(newItems);
        }
        cartState$.isOpen.set(true);
    },

    removeFromCart: async (productId: string) => {
        const currentItems = cartState$.items.peek();
        const newItems = currentItems.filter((item) => item.id !== productId);

        if (newItems.length === 0) {
            const draftOrderId = cartState$.draftOrderId.peek();
            if (draftOrderId) {
                await orderService.delete(draftOrderId);
            }
            cartState$.items.set([]);
            cartState$.draftOrderId.set(null);
            cartState$.restaurantId.set(null);
            return;
        }

        const draftOrderId = cartState$.draftOrderId.peek();
        if (draftOrderId) {
            const payload = newItems.map((item) => ({
                itemId: item.id,
                quantity: item.quantity,
                unitPrice: item.price,
            }));
            await orderService.updateItems(draftOrderId, { items: payload });
            cartState$.items.set(newItems);
        }
    },

    updateQuantity: async (productId: string, quantity: number) => {
        if (quantity <= 0) {
            await cartActions.removeFromCart(productId);
            return;
        }

        const currentItems = cartState$.items.peek();
        const index = currentItems.findIndex((item) => item.id === productId);
        if (index === -1) return;

        const newItems = currentItems.map((item, i) =>
            i === index ? { ...item, quantity } : item
        );
        const payload = newItems.map((item) => ({
            itemId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
        }));
        const draftOrderId = cartState$.draftOrderId.peek();
        if (draftOrderId) {
            await orderService.updateItems(draftOrderId, { items: payload });
            cartState$.items.set(newItems);
        }
    },

    clearCart: async () => {
        const draftOrderId = cartState$.draftOrderId.peek();
        if (draftOrderId) {
            await orderService.delete(draftOrderId);
        }
        cartState$.items.set([]);
        cartState$.draftOrderId.set(null);
        cartState$.restaurantId.set(null);
    },

    clearCartLocal: () => {
        // Clear local state only (without deleting backend order)
        // Used after order confirmation since confirmed orders can't be deleted
        cartState$.items.set([]);
        cartState$.draftOrderId.set(null);
        cartState$.restaurantId.set(null);
    },

    hydrateCart: async () => {
        const draftOrderId = cartState$.draftOrderId.peek();
        if (!draftOrderId) return;

        try {
            const order = await orderService.findById(draftOrderId);
            if (order.status !== "draft") {
                // Order already confirmed/canceled, clear local state
                cartState$.draftOrderId.set(null);
                cartState$.restaurantId.set(null);
                cartState$.items.set([]);
                return;
            }

            // Note: This is simplified - in a real app, we'd need to fetch
            // dish details from catalog-service to reconstruct full CartItem objects
            // For now, we'll keep the local state as source of truth
            cartState$.restaurantId.set(order.shopId);
        } catch (error) {
            console.error("Failed to hydrate cart:", error);
            // Draft order not found, clear local state
            cartState$.draftOrderId.set(null);
            cartState$.restaurantId.set(null);
        }
    },

    toggleCart: () => {
        cartState$.isOpen.set((prev) => !prev);
    },

    totalPrice: () => {
        return cartState$.items
            .get()
            .reduce((total, item) => total + item.price * item.quantity, 0);
    },

    totalItems: () => {
        return cartState$.items.get().reduce((total, item) => total + item.quantity, 0);
    },
};
