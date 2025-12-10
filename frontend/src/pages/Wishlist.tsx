import { useNavigate, Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function Wishlist() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { wishlist, isLoading, removeFromWishlist, clearWishlist } =
        useWishlist();
    const { addItem } = useCart();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    const handleMoveToCart = async (productId: number) => {
        try {
            await addItem(productId, 1);
            await removeFromWishlist(productId);
        } catch (error) {
            console.error("Failed to move to cart:", error);
        }
    };

    const handleRemove = async (productId: number) => {
        try {
            await removeFromWishlist(productId);
        } catch (error) {
            console.error("Failed to remove from wishlist:", error);
        }
    };

    const handleClearAll = async () => {
        if (window.confirm("Are you sure you want to clear your wishlist?")) {
            try {
                await clearWishlist();
            } catch (error) {
                console.error("Failed to clear wishlist:", error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="wishlist-page__loading">Loading wishlist...</div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="wishlist-page__header">
                <h1>My Wishlist</h1>
                {wishlist && wishlist.items.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="wishlist-page__clear"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {!wishlist || wishlist.items.length === 0 ? (
                <div className="wishlist-page__empty">
                    <p>Your wishlist is empty.</p>
                    <Link to="/" className="wishlist-page__browse">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="wishlist-page__grid">
                    {wishlist.items.map((item) => (
                        <div key={item.id} className="wishlist-item">
                            <button
                                className="wishlist-item__remove"
                                onClick={() => handleRemove(item.productId)}
                                aria-label="Remove from wishlist"
                            >
                                ×
                            </button>

                            <Link to={`/products/${item.productId}`}>
                                <img
                                    src={
                                        item.productImage || "/placeholder.jpg"
                                    }
                                    alt={item.productName}
                                    className="wishlist-item__image"
                                />
                            </Link>

                            <div className="wishlist-item__info">
                                <Link to={`/products/${item.productId}`}>
                                    <h3 className="wishlist-item__name">
                                        {item.productName}
                                    </h3>
                                </Link>

                                <div className="wishlist-item__pricing">
                                    {item.originalPrice &&
                                        item.originalPrice > item.price && (
                                            <span className="wishlist-item__original-price">
                                                R${" "}
                                                {item.originalPrice.toFixed(2)}
                                            </span>
                                        )}
                                    <span className="wishlist-item__price">
                                        R$ {item.price.toFixed(2)}
                                    </span>
                                </div>

                                <p
                                    className={`wishlist-item__stock ${
                                        item.inStock
                                            ? "wishlist-item__stock--available"
                                            : "wishlist-item__stock--unavailable"
                                    }`}
                                >
                                    {item.inStock ? "In Stock" : "Out of Stock"}
                                </p>

                                <p className="wishlist-item__added">
                                    Added on{" "}
                                    {new Date(item.addedAt).toLocaleDateString(
                                        "pt-BR"
                                    )}
                                </p>

                                <button
                                    className="wishlist-item__add-to-cart"
                                    onClick={() =>
                                        handleMoveToCart(item.productId)
                                    }
                                    disabled={!item.inStock}
                                >
                                    {item.inStock
                                        ? "Move to Cart"
                                        : "Notify When Available"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
