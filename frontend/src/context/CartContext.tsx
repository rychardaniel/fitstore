import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Cart } from "../types";
import { CartService } from "../services/CartService";
import { useAuth } from "./AuthContext";

interface CartContextType {
    cart: Cart | null;
    isLoading: boolean;
    addItem: (productId: number, quantity?: number) => Promise<void>;
    updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
    getItemCount: () => number;
    getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const refreshCart = async () => {
        if (!isAuthenticated) {
            setCart(null);
            return;
        }

        setIsLoading(true);
        try {
            const cartData = await CartService.getCart();
            setCart(cartData);
        } catch (error) {
            // 401 is expected when token is invalid/expired - silently clear cart
            setCart(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshCart();
    }, [isAuthenticated]);

    const addItem = async (productId: number, quantity: number = 1) => {
        if (!isAuthenticated) {
            throw new Error("Please login to add items to cart");
        }

        setIsLoading(true);
        try {
            const updatedCart = await CartService.addItem(productId, quantity);
            setCart(updatedCart);
        } finally {
            setIsLoading(false);
        }
    };

    const updateItemQuantity = async (itemId: number, quantity: number) => {
        setIsLoading(true);
        try {
            const updatedCart = await CartService.updateItemQuantity(
                itemId,
                quantity
            );
            setCart(updatedCart);
        } finally {
            setIsLoading(false);
        }
    };

    const removeItem = async (itemId: number) => {
        setIsLoading(true);
        try {
            const updatedCart = await CartService.removeItem(itemId);
            setCart(updatedCart);
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async () => {
        setIsLoading(true);
        try {
            await CartService.clearCart();
            setCart(null);
        } finally {
            setIsLoading(false);
        }
    };

    const getItemCount = () => cart?.totalItems ?? 0;
    const getSubtotal = () => cart?.subtotal ?? 0;

    return (
        <CartContext.Provider
            value={{
                cart,
                isLoading,
                addItem,
                updateItemQuantity,
                removeItem,
                clearCart,
                refreshCart,
                getItemCount,
                getSubtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
