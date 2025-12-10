import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { BrandService } from "../../services/BrandService";
import { AdminService } from "../../services/AdminService";
import type { Brand } from "../../types";

export default function Brands() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [name, setName] = useState("");

    const fetchBrands = async () => {
        setIsLoading(true);
        try {
            const data = await BrandService.list();
            setBrands(data);
        } catch (err) {
            console.error("Failed to fetch brands:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const openCreateModal = () => {
        setEditingBrand(null);
        setName("");
        setShowModal(true);
    };

    const openEditModal = (brand: Brand) => {
        setEditingBrand(brand);
        setName(brand.name);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBrand) {
                await AdminService.updateBrand(editingBrand.id, { name });
            } else {
                await AdminService.createBrand({ name });
            }
            setShowModal(false);
            fetchBrands();
        } catch (err) {
            console.error("Failed to save brand:", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this brand?"))
            return;
        try {
            await AdminService.deleteBrand(id);
            fetchBrands();
        } catch (err) {
            console.error("Failed to delete brand:", err);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <h1>Brands Management</h1>
                <button onClick={openCreateModal} className="btn-primary">
                    <Plus size={20} />
                    Add Brand
                </button>
            </div>

            {isLoading ? (
                <div className="admin-page__loading">Loading brands...</div>
            ) : brands.length === 0 ? (
                <div className="admin-page__empty">No brands found</div>
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
                        {brands.map((brand) => (
                            <tr key={brand.id}>
                                <td>#{brand.id}</td>
                                <td>{brand.name}</td>
                                <td>{brand.productCount || 0}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => openEditModal(brand)}
                                            className="btn-icon"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(brand.id)
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
                        <h2>{editingBrand ? "Edit Brand" : "Add Brand"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Brand Name</label>
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
                                    {editingBrand ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
