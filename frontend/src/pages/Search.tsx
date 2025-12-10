import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ProductService } from "../services/ProductService";
import { CategoryService } from "../services/CategoryService";
import type {
    Product,
    Category,
    PaginatedResponse,
    ProductFilter,
} from "../types";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const { addItem } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { isAuthenticated } = useAuth();

    const query = searchParams.get("q") || "";
    const categoryId = searchParams.get("category")
        ? Number(searchParams.get("category"))
        : undefined;
    const minPrice = searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined;
    const maxPrice = searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined;
    const page = searchParams.get("page")
        ? Number(searchParams.get("page"))
        : 1;
    const sortBy = searchParams.get("sortBy") || "name";
    const sortDescending = searchParams.get("sortDesc") === "true";

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await CategoryService.list();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const filter: ProductFilter = {
                    search: query || undefined,
                    categoryId,
                    minPrice,
                    maxPrice,
                    page,
                    pageSize: 12,
                    sortBy,
                    sortDescending,
                };
                const response: PaginatedResponse<Product> =
                    await ProductService.list(filter);
                setProducts(response.data);
                setTotalPages(response.totalPages);
                setTotalItems(response.totalItems);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [query, categoryId, minPrice, maxPrice, page, sortBy, sortDescending]);

    const updateFilter = (key: string, value: string | undefined) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        if (key !== "page") {
            newParams.set("page", "1");
        }
        setSearchParams(newParams);
    };

    const handleAddToCart = async (productId: number) => {
        try {
            await addItem(productId, 1);
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    const handleWishlistToggle = async (productId: number) => {
        try {
            if (isInWishlist(productId)) {
                await removeFromWishlist(productId);
            } else {
                await addToWishlist(productId);
            }
        } catch (error) {
            console.error("Failed to toggle wishlist:", error);
        }
    };

    return (
        <div className="search-page">
            <div className="search-page__header">
                <h1>Search Results</h1>
                {query && (
                    <p className="search-page__query">Results for "{query}"</p>
                )}
                <p className="search-page__count">
                    {totalItems} products found
                </p>
            </div>

            <div className="search-page__content">
                <aside className="search-page__filters">
                    <h2>Filters</h2>

                    <div className="search-filter">
                        <label htmlFor="category-filter">Category</label>
                        <select
                            id="category-filter"
                            value={categoryId || ""}
                            onChange={(e) =>
                                updateFilter(
                                    "category",
                                    e.target.value || undefined
                                )
                            }
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="search-filter">
                        <label>Price Range</label>
                        <div className="search-filter__price">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice || ""}
                                onChange={(e) =>
                                    updateFilter(
                                        "minPrice",
                                        e.target.value || undefined
                                    )
                                }
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice || ""}
                                onChange={(e) =>
                                    updateFilter(
                                        "maxPrice",
                                        e.target.value || undefined
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="search-filter">
                        <label htmlFor="sort-filter">Sort By</label>
                        <select
                            id="sort-filter"
                            value={`${sortBy}-${sortDescending}`}
                            onChange={(e) => {
                                const [newSort, desc] =
                                    e.target.value.split("-");
                                updateFilter("sortBy", newSort);
                                updateFilter(
                                    "sortDesc",
                                    desc === "true" ? "true" : undefined
                                );
                            }}
                        >
                            <option value="name-false">Name (A-Z)</option>
                            <option value="name-true">Name (Z-A)</option>
                            <option value="price-false">
                                Price (Low to High)
                            </option>
                            <option value="price-true">
                                Price (High to Low)
                            </option>
                        </select>
                    </div>
                </aside>

                <main className="search-page__results">
                    {isLoading ? (
                        <div className="search-page__loading">
                            Loading products...
                        </div>
                    ) : products.length === 0 ? (
                        <div className="search-page__empty">
                            <p>No products found matching your criteria.</p>
                            <button
                                onClick={() =>
                                    setSearchParams(new URLSearchParams())
                                }
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="search-page__grid">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="product-card"
                                    >
                                        {isAuthenticated && (
                                            <button
                                                className={`product-card__wishlist ${
                                                    isInWishlist(product.id)
                                                        ? "product-card__wishlist--active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleWishlistToggle(
                                                        product.id
                                                    )
                                                }
                                                aria-label={
                                                    isInWishlist(product.id)
                                                        ? "Remove from wishlist"
                                                        : "Add to wishlist"
                                                }
                                            >
                                                ♥
                                            </button>
                                        )}
                                        <Link to={`/products/${product.id}`}>
                                            <img
                                                src={
                                                    product.image ||
                                                    "/placeholder.jpg"
                                                }
                                                alt={product.name}
                                                className="product-card__image"
                                            />
                                        </Link>
                                        <div className="product-card__info">
                                            <Link
                                                to={`/products/${product.id}`}
                                            >
                                                <h3 className="product-card__name">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="product-card__category">
                                                {product.categoryName}
                                            </p>
                                            <div className="product-card__pricing">
                                                {product.originalPrice &&
                                                    product.originalPrice >
                                                        product.price && (
                                                        <span className="product-card__original-price">
                                                            R${" "}
                                                            {product.originalPrice.toFixed(
                                                                2
                                                            )}
                                                        </span>
                                                    )}
                                                <span className="product-card__price">
                                                    R${" "}
                                                    {product.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <button
                                                className="product-card__add-to-cart"
                                                onClick={() =>
                                                    handleAddToCart(product.id)
                                                }
                                                disabled={
                                                    product.stockQuantity === 0
                                                }
                                            >
                                                {product.stockQuantity === 0
                                                    ? "Out of Stock"
                                                    : "Add to Cart"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="search-page__pagination">
                                    <button
                                        onClick={() =>
                                            updateFilter(
                                                "page",
                                                String(page - 1)
                                            )
                                        }
                                        disabled={page === 1}
                                    >
                                        Previous
                                    </button>
                                    <span>
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() =>
                                            updateFilter(
                                                "page",
                                                String(page + 1)
                                            )
                                        }
                                        disabled={page === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
