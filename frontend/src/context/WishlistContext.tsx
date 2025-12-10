import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import type { ReactNode } from "react";
import type { Wishlist, WishlistItem } from "../types";
import { WishlistService } from "../services/WishlistService";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
    wishlist: Wishlist | null;
    isLoading: boolean;
    itemCount: number;
    addToWishlist: (productId: number) => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;
    clearWishlist: () => Promise<void>;
    isInWishlist: (productId: number) => boolean;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
    undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlist(null);
            return;
        }

        setIsLoading(true);
        try {
            const data = await WishlistService.getWishlist();
            setWishlist(data);
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
            setWishlist(null);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (productId: number) => {
        const data = await WishlistService.addToWishlist(productId);
        setWishlist(data);
    };

    const removeFromWishlist = async (productId: number) => {
        const data = await WishlistService.removeFromWishlist(productId);
        setWishlist(data);
    };

    const clearWishlist = async () => {
        await WishlistService.clearWishlist();
        setWishlist({ id: wishlist?.id ?? 0, totalItems: 0, items: [] });
    };

    const isInWishlist = (productId: number): boolean => {
        return (
            wishlist?.items.some(
                (item: WishlistItem) => item.productId === productId
            ) ?? false
        );
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                isLoading,
                itemCount: wishlist?.totalItems ?? 0,
                addToWishlist,
                removeFromWishlist,
                clearWishlist,
                isInWishlist,
                refreshWishlist: fetchWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
