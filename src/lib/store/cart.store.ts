import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import type { Product} from "@/services/restaurant.service";

export interface CartItem extends Product {
    quantity: number;
    restaurantId: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

export const cartState$ = observable<CartState>({
    items: [],
    isOpen: false,
});

// Persist cart to local storage
persistObservable(cartState$, {
    local: "cart",
    pluginLocal: ObservablePersistLocalStorage,
});

export const cartActions = {
    addToCart: (product: Product, restaurantId: string) => {
        const currentItems = cartState$.items.get();
        const existingItemIndex = currentItems.findIndex(
            (item) => item.id === product.id && item.restaurantId === restaurantId
        );

        // Check if adding item from a different restaurant
        if (currentItems.length > 0 && currentItems[0].restaurantId !== restaurantId) {
            const confirmClear = window.confirm(
                "Vous ne pouvez commander que dans un seul restaurant à la fois. Voulez-vous vider votre panier actuel ?"
            );
            if (confirmClear) {
                cartState$.items.set([{ ...product, quantity: 1, restaurantId }]);
            }
            return;
        }

        if (existingItemIndex > -1) {
            cartState$.items[existingItemIndex].quantity.set((q) => q + 1);
        } else {
            cartState$.items.push({ ...product, quantity: 1, restaurantId });
        }

        cartState$.isOpen.set(true); // Open cart when adding item
    },

    removeFromCart: (productId: string) => {
        const currentItems = cartState$.items.get();
        const newItems = currentItems.filter((item) => item.id !== productId);
        cartState$.items.set(newItems);
    },

    updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
            cartActions.removeFromCart(productId);
            return;
        }
        const index = cartState$.items.get().findIndex((item) => item.id === productId);
        if (index > -1) {
            cartState$.items[index].quantity.set(quantity);
        }
    },

    clearCart: () => {
        cartState$.items.set([]);
    },

    toggleCart: () => {
        cartState$.isOpen.set((prev) => !prev);
    },

    totalPrice: () => {
        return cartState$.items.get().reduce((total, item) => total + item.price * item.quantity, 0);
    },

    totalItems: () => {
        return cartState$.items.get().reduce((total, item) => total + item.quantity, 0);
    }
};
