import { api } from "./api";
import type { Cart } from "../types";

export const CartService = {
    getCart: async (): Promise<Cart> => {
        return api.get<Cart>("/cart");
    },

    addItem: async (productId: number, quantity: number = 1): Promise<Cart> => {
        return api.post("/cart/items", { productId, quantity });
    },

    updateItemQuantity: async (
        itemId: number,
        quantity: number
    ): Promise<Cart> => {
        return api.put(`/cart/items/${itemId}`, { quantity });
    },

    removeItem: async (itemId: number): Promise<Cart> => {
        return api.delete(`/cart/items/${itemId}`);
    },

    clearCart: async (): Promise<void> => {
        return api.delete("/cart");
    },
};
