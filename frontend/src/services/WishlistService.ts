import { api } from "./api";
import type { Wishlist } from "../types";

export const WishlistService = {
    getWishlist: () => api.get<Wishlist>("/wishlist"),

    addToWishlist: (productId: number) =>
        api.post<Wishlist>(`/wishlist/${productId}`),

    removeFromWishlist: (productId: number) =>
        api.delete<Wishlist>(`/wishlist/${productId}`),

    clearWishlist: () => api.delete<void>("/wishlist"),

    isInWishlist: (productId: number) =>
        api.get<boolean>(`/wishlist/${productId}/check`),
};
