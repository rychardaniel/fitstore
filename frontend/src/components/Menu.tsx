import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CategoryService } from "../services/CategoryService";
import type { Category } from "../types";

export function Menu() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        CategoryService.list()
            .then((data) => setCategories(data))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <aside className="w-full md:w-64 p-4 bg-white rounded-lg shadow-sm mb-5 md:mb-0 md:mr-5 h-fit">
            <div className="mb-5 pb-2.5 border-b border-gray-100">
                <h4 className="mb-3 text-blue-600 font-bold text-lg">
                    Categories
                </h4>
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-5 bg-gray-200 rounded animate-pulse"
                            ></div>
                        ))}
                    </div>
                ) : (
                    <ul className="list-none space-y-2">
                        <li>
                            <Link
                                to="/"
                                className="text-gray-600 hover:text-blue-600 text-sm no-underline transition-colors"
                            >
                                All Products
                            </Link>
                        </li>
                        {categories.map((category) => (
                            <li key={category.id}>
                                <Link
                                    to={`/?category=${category.id}`}
                                    className="text-gray-600 hover:text-blue-600 text-sm no-underline transition-colors"
                                >
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                        {categories.length === 0 && !isLoading && (
                            <li className="text-gray-400 text-sm">
                                No categories available
                            </li>
                        )}
                    </ul>
                )}
            </div>

            <div className="mb-5 pb-2.5 border-b border-gray-100">
                <h4 className="mb-3 text-blue-600 font-bold text-lg">
                    Price Range
                </h4>
                <ul className="list-none space-y-2">
                    <li>
                        <Link
                            to="/?maxPrice=50"
                            className="text-gray-600 hover:text-blue-600 text-sm no-underline transition-colors"
                        >
                            Up to R$ 50
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/?minPrice=50&maxPrice=100"
                            className="text-gray-600 hover:text-blue-600 text-sm no-underline transition-colors"
                        >
                            R$ 50 to R$ 100
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/?minPrice=100"
                            className="text-gray-600 hover:text-blue-600 text-sm no-underline transition-colors"
                        >
                            Over R$ 100
                        </Link>
                    </li>
                </ul>
            </div>

            <div>
                <h4 className="mb-3 text-blue-600 font-bold text-lg">Stock</h4>
                <ul className="list-none space-y-2">
                    <li>
                        <Link
                            to="/?inStock=true"
                            className="text-gray-600 hover:text-blue-600 text-sm no-underline transition-colors"
                        >
                            In Stock Only
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
