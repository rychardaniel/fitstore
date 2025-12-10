import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { CategoryService } from "../../services/CategoryService";
import { AdminService } from "../../services/AdminService";
import type { Category } from "../../types";

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );
    const [name, setName] = useState("");

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const data = await CategoryService.list();
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openCreateModal = () => {
        setEditingCategory(null);
        setName("");
        setShowModal(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setName(category.name);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await AdminService.updateCategory(editingCategory.id, { name });
            } else {
                await AdminService.createCategory({ name });
            }
            setShowModal(false);
            fetchCategories();
        } catch (err) {
            console.error("Failed to save category:", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this category?"))
            return;
        try {
            await AdminService.deleteCategory(id);
            fetchCategories();
        } catch (err) {
            console.error("Failed to delete category:", err);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <h1>Categories Management</h1>
                <button onClick={openCreateModal} className="btn-primary">
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            {isLoading ? (
                <div className="admin-page__loading">Loading categories...</div>
            ) : categories.length === 0 ? (
                <div className="admin-page__empty">No categories found</div>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Products</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>#{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.productCount || 0}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() =>
                                                openEditModal(category)
                                            }
                                            className="btn-icon"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(category.id)
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
            )}

            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="modal modal--small"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>
                            {editingCategory ? "Edit Category" : "Add Category"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
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
                                    {editingCategory ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
