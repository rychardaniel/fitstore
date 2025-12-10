import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ShoppingCart,
    Heart,
    ArrowLeft,
    Minus,
    Plus,
    Check,
} from "lucide-react";
import { ProductService } from "../services/ProductService";
import { ReviewService } from "../services/ReviewService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import type { Product, ProductReviews, Review, CreateReview } from "../types";
import { StarRating } from "../components/StarRating";
import { ReviewForm } from "../components/ReviewForm";
import { ReviewList } from "../components/ReviewList";

export function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem, isLoading: cartLoading } = useCart();
    const { isAuthenticated, user } = useAuth();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<ProductReviews | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);

    const productId = id ? parseInt(id) : 0;
    const inWishlist = isInWishlist(productId);

    useEffect(() => {
        if (!id) return;

        setIsLoading(true);
        Promise.all([
            ProductService.getById(productId),
            ReviewService.getProductReviews(productId),
        ])
            .then(([productData, reviewsData]) => {
                setProduct(productData);
                setReviews(reviewsData);
            })
            .catch(() => setError("Product not found"))
            .finally(() => setIsLoading(false));
    }, [id, productId]);

    const handleAddToCart = async () => {
        if (!product) return;

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        try {
            await addItem(product.id, quantity);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to add to cart");
        }
    };

    const handleWishlistToggle = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        try {
            if (inWishlist) {
                await removeFromWishlist(productId);
            } else {
                await addToWishlist(productId);
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        }
    };

    const handleReviewSubmit = async (data: CreateReview) => {
        if (editingReview) {
            await ReviewService.updateReview(editingReview.id, data);
        } else {
            await ReviewService.createReview(productId, data);
        }
        const updatedReviews = await ReviewService.getProductReviews(productId);
        setReviews(updatedReviews);
        setShowReviewForm(false);
        setEditingReview(null);
    };

    const handleEditReview = (review: Review) => {
        setEditingReview(review);
        setShowReviewForm(true);
    };

    const handleDeleteReview = async (reviewId: number) => {
        if (!window.confirm("Are you sure you want to delete this review?"))
            return;
        await ReviewService.deleteReview(reviewId);
        const updatedReviews = await ReviewService.getProductReviews(productId);
        setReviews(updatedReviews);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity((q) => q - 1);
    };

    const increaseQuantity = () => {
        if (product && quantity < product.stockQuantity) {
            setQuantity((q) => q + 1);
        }
    };

    const userHasReviewed = reviews?.reviews.some((r) => r.userId === user?.id);

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-5 py-10">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="h-96 bg-gray-200 rounded"></div>
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-24 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-6xl mx-auto px-5 py-10 text-center">
                <p className="text-red-500 mb-4">
                    {error || "Product not found"}
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={20} />
                    Back to Products
                </button>
            </div>
        );
    }

    const hasDiscount =
        product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / product.originalPrice!) * 100)
        : 0;

    return (
        <div className="max-w-6xl mx-auto px-5 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Product Image */}
                <div className="bg-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[400px]">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-[400px] max-w-full object-contain"
                        />
                    ) : (
                        <div className="text-gray-400 text-lg">
                            No Image Available
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    {/* Category & Brand */}
                    <div className="flex gap-2 text-sm">
                        {product.categoryName && (
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                {product.categoryName}
                            </span>
                        )}
                        {product.brandName && (
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                {product.brandName}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-800">
                        {product.name}
                    </h1>

                    {/* Rating Summary */}
                    {reviews && reviews.totalReviews > 0 && (
                        <div className="flex items-center gap-2">
                            <StarRating
                                rating={Math.round(reviews.averageRating)}
                                size="md"
                            />
                            <span className="text-gray-600">
                                {reviews.averageRating.toFixed(1)} (
                                {reviews.totalReviews} reviews)
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-green-600">
                            R$ {product.price.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-xl text-gray-400 line-through">
                                    R$ {product.originalPrice!.toFixed(2)}
                                </span>
                                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                                    -{discountPercent}%
                                </span>
                            </>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div>
                        {product.stockQuantity > 0 ? (
                            <span className="text-green-600 font-medium">
                                ✓ In Stock ({product.stockQuantity} available)
                            </span>
                        ) : (
                            <span className="text-red-600 font-medium">
                                ✗ Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                Description
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* Quantity Selector */}
                    {product.stockQuantity > 0 && (
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700 font-medium">
                                Quantity:
                            </span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={decreaseQuantity}
                                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="px-4 py-2 border-x border-gray-300 min-w-[50px] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={increaseQuantity}
                                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                    disabled={quantity >= product.stockQuantity}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={
                                product.stockQuantity === 0 || cartLoading
                            }
                            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold transition-all ${
                                addedToCart
                                    ? "bg-green-500 text-white"
                                    : product.stockQuantity === 0
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
                            }`}
                        >
                            {addedToCart ? (
                                <>
                                    <Check size={20} />
                                    Added to Cart!
                                </>
                            ) : (
                                <>
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleWishlistToggle}
                            className={`p-4 border-2 rounded-lg transition-colors ${
                                inWishlist
                                    ? "border-red-400 bg-red-50 text-red-500"
                                    : "border-gray-300 hover:border-red-400 hover:text-red-400"
                            }`}
                        >
                            <Heart
                                size={24}
                                fill={inWishlist ? "currentColor" : "none"}
                            />
                        </button>
                    </div>

                    {/* SKU */}
                    {product.sku && (
                        <p className="text-sm text-gray-400 pt-4">
                            SKU: {product.sku}
                        </p>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <section className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Customer Reviews
                        {reviews && reviews.totalReviews > 0 && (
                            <span className="text-gray-500 font-normal text-lg ml-2">
                                ({reviews.totalReviews})
                            </span>
                        )}
                    </h2>
                    {isAuthenticated && !userHasReviewed && !showReviewForm && (
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Write a Review
                        </button>
                    )}
                </div>

                {/* Rating Distribution */}
                {reviews && reviews.totalReviews > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-gray-800">
                                    {reviews.averageRating.toFixed(1)}
                                </div>
                                <StarRating
                                    rating={Math.round(reviews.averageRating)}
                                    size="md"
                                />
                                <div className="text-sm text-gray-500 mt-1">
                                    {reviews.totalReviews} reviews
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count =
                                        reviews.ratingDistribution[star] || 0;
                                    const percent =
                                        reviews.totalReviews > 0
                                            ? (count / reviews.totalReviews) *
                                              100
                                            : 0;
                                    return (
                                        <div
                                            key={star}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="text-sm w-8">
                                                {star} ★
                                            </span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-400 h-2 rounded-full"
                                                    style={{
                                                        width: `${percent}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-500 w-8">
                                                {count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Review Form */}
                {showReviewForm && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingReview
                                ? "Edit Your Review"
                                : "Write Your Review"}
                        </h3>
                        <ReviewForm
                            onSubmit={handleReviewSubmit}
                            initialRating={editingReview?.rating}
                            initialTitle={editingReview?.title || ""}
                            initialComment={editingReview?.comment || ""}
                            submitLabel={
                                editingReview
                                    ? "Update Review"
                                    : "Submit Review"
                            }
                            onCancel={() => {
                                setShowReviewForm(false);
                                setEditingReview(null);
                            }}
                        />
                    </div>
                )}

                {/* Reviews List */}
                <ReviewList
                    reviews={reviews?.reviews || []}
                    currentUserId={user?.id}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                />
            </section>
        </div>
    );
}
