import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductService } from "../services/ProductService";
import { Menu } from "../components/Menu";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types";

export function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addItem, isLoading: cartLoading } = useCart();
    const { isAuthenticated } = useAuth();
    const [addedProductId, setAddedProductId] = useState<number | null>(null);

    useEffect(() => {
        ProductService.list()
            .then((response) => setProducts(response.data))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    const handleAddToCart = async (productId: number) => {
        if (!isAuthenticated) {
            window.location.href = "/login";
            return;
        }

        try {
            await addItem(productId, 1);
            setAddedProductId(productId);
            setTimeout(() => setAddedProductId(null), 1500);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to add to cart");
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto px-5 py-5 flex-grow">
            <Menu />

            <section className="flex-grow pl-0 md:pl-5">
                <h1 className="text-2xl font-bold mb-4 pb-2.5 border-b-2 border-gray-100">
                    Featured Products
                </h1>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-white border border-gray-200 rounded-lg p-4"
                            >
                                <div className="bg-gray-200 h-36 rounded mb-4"></div>
                                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-start">
                        {products.map((product) => (
                            <article
                                key={product.id}
                                className="bg-white border border-gray-200 rounded-lg p-4 text-center transition-shadow hover:shadow-lg group"
                            >
                                <Link to={`/product/${product.id}`}>
                                    <div className="bg-gray-100 h-36 flex justify-center items-center mb-2.5 text-gray-400 rounded overflow-hidden">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </div>
                                    <h2 className="text-lg font-semibold mb-1 text-blue-500 hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h2>
                                </Link>
                                <p className="text-sm text-gray-500 mb-2.5">
                                    {product.brandName}
                                </p>
                                <div className="mb-4">
                                    {product.originalPrice &&
                                        product.originalPrice >
                                            product.price && (
                                            <span className="text-gray-400 line-through mr-2">
                                                R${" "}
                                                {product.originalPrice.toFixed(
                                                    2
                                                )}
                                            </span>
                                        )}
                                    <span className="text-xl font-bold text-green-600">
                                        R$ {product.price.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(product.id)}
                                    disabled={
                                        product.stockQuantity === 0 ||
                                        cartLoading
                                    }
                                    className={`w-full py-2.5 px-5 rounded cursor-pointer font-bold transition-colors ${
                                        addedProductId === product.id
                                            ? "bg-green-500 text-white"
                                            : product.stockQuantity === 0
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
                                    }`}
                                >
                                    {addedProductId === product.id
                                        ? "✓ Added!"
                                        : product.stockQuantity === 0
                                        ? "Out of Stock"
                                        : "Add to Cart"}
                                </button>
                            </article>
                        ))}

                        {products.length === 0 && (
                            <p className="col-span-full text-center text-gray-500 py-10">
                                No products found.
                            </p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
