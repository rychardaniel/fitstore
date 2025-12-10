import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ProductService } from "../../services/ProductService";
import { CategoryService } from "../../services/CategoryService";
import { BrandService } from "../../services/BrandService";
import { AdminService } from "../../services/AdminService";
import type {
    Product,
    Category,
    Brand,
    PaginatedResponse,
    ProductFilter,
} from "../../types";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState<number | undefined>();
    const [minPrice, setMinPrice] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();
    const [stockFilter, setStockFilter] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        originalPrice: 0,
        stockQuantity: 0,
        categoryId: 0,
        brandId: 0,
        sku: "",
        image: "",
    });

    const fetchProducts = async (page = 1) => {
        setIsLoading(true);
        try {
            const filter: ProductFilter = {
                search: search || undefined,
                categoryId,
                minPrice,
                maxPrice,
                page,
                pageSize: 20,
            };
            console.log("Fetching products with filter:", filter);
            let response: PaginatedResponse<Product> =
                await ProductService.list(filter);

            // Apply stock filter client-side
            if (stockFilter === "low") {
                response = {
                    ...response,
                    data: response.data.filter((p) => p.stockQuantity < 10),
                };
            } else if (stockFilter === "out") {
                response = {
                    ...response,
                    data: response.data.filter((p) => p.stockQuantity === 0),
                };
            } else if (stockFilter === "in") {
                response = {
                    ...response,
                    data: response.data.filter((p) => p.stockQuantity > 0),
                };
            }

            setProducts(response.data);
            setPagination({
                page: response.page,
                totalPages: response.totalPages,
            });
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search, categoryId, minPrice, maxPrice, stockFilter]);

    useEffect(() => {
        CategoryService.list().then(setCategories);
        BrandService.list().then(setBrands);
    }, []);

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({
            name: "",
            description: "",
            price: 0,
            originalPrice: 0,
            stockQuantity: 0,
            categoryId: 0,
            brandId: 0,
            sku: "",
            image: "",
        });
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || "",
            price: product.price,
            originalPrice: product.originalPrice || 0,
            stockQuantity: product.stockQuantity,
            categoryId: product.categoryId || 0,
            brandId: product.brandId || 0,
            sku: product.sku || "",
            image: product.image || "",
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await AdminService.updateProduct(editingProduct.id, formData);
            } else {
                await AdminService.createProduct(formData);
            }
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            console.error("Failed to save product:", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this product?"))
            return;
        try {
            await AdminService.deleteProduct(id);
            fetchProducts();
        } catch (err) {
            console.error("Failed to delete product:", err);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <h1>Products Management</h1>
                <button onClick={openCreateModal} className="btn-primary">
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            <div className="admin-filters">
                <div className="admin-filter">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="admin-filter">
                    <select
                        value={categoryId || ""}
                        onChange={(e) =>
                            setCategoryId(
                                e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                            )
                        }
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="admin-filter">
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice || ""}
                        onChange={(e) =>
                            setMinPrice(
                                e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                            )
                        }
                        style={{ width: "120px" }}
                    />
                </div>
                <div className="admin-filter">
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice || ""}
                        onChange={(e) =>
                            setMaxPrice(
                                e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                            )
                        }
                        style={{ width: "120px" }}
                    />
                </div>
                <div className="admin-filter">
                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                    >
                        <option value="">All Stock</option>
                        <option value="in">In Stock</option>
                        <option value="low">Low Stock (&lt;10)</option>
                        <option value="out">Out of Stock</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="admin-page__loading">Loading products...</div>
            ) : (
                <>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="product-thumb"
                                            />
                                        ) : (
                                            <div className="product-thumb--placeholder">
                                                -
                                            </div>
                                        )}
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.sku || "-"}</td>
                                    <td>{product.categoryName || "-"}</td>
                                    <td>R$ {product.price.toFixed(2)}</td>
                                    <td>
                                        <span
                                            className={
                                                product.stockQuantity < 10
                                                    ? "text-danger"
                                                    : ""
                                            }
                                        >
                                            {product.stockQuantity}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() =>
                                                    openEditModal(product)
                                                }
                                                className="btn-icon"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(product.id)
                                                }
                                                className="btn-icon btn-icon--danger"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {pagination.totalPages > 1 && (
                        <div className="admin-pagination">
                            <button
                                onClick={() =>
                                    fetchProducts(pagination.page - 1)
                                }
                                disabled={pagination.page === 1}
                            >
                                Previous
                            </button>
                            <span>
                                Page {pagination.page} of{" "}
                                {pagination.totalPages}
                            </span>
                            <button
                                onClick={() =>
                                    fetchProducts(pagination.page + 1)
                                }
                                disabled={
                                    pagination.page === pagination.totalPages
                                }
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>
                            {editingProduct ? "Edit Product" : "Add Product"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: Number(e.target.value),
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Original Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.originalPrice}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                originalPrice: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        value={formData.stockQuantity}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                stockQuantity: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>SKU</label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                sku: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                categoryId: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    >
                                        <option value={0}>
                                            Select Category
                                        </option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Brand</label>
                                    <select
                                        value={formData.brandId}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                brandId: Number(e.target.value),
                                            })
                                        }
                                    >
                                        <option value={0}>Select Brand</option>
                                        {brands.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            image: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingProduct ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
