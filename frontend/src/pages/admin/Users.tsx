import { useEffect, useState } from "react";
import { AdminService, type AdminUser } from "../../services/AdminService";
import type { PaginatedResponse } from "../../types";

export default function Users() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        totalItems: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response: PaginatedResponse<AdminUser> =
                await AdminService.getUsers(page, 20, search || undefined);
            setUsers(response.data);
            setPagination({
                page: response.page,
                totalPages: response.totalPages,
                totalItems: response.totalItems,
            });
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            await AdminService.updateUserRole(userId, newRole);
            fetchUsers();
        } catch (err) {
            console.error("Failed to update user role:", err);
        }
    };

    const handleToggleActive = async (userId: number) => {
        try {
            await AdminService.toggleUserActive(userId);
            fetchUsers();
        } catch (err) {
            console.error("Failed to toggle user status:", err);
        }
    };

    return (
        <div className="admin-page">
            <h1>Users Management</h1>

            <div className="admin-filters">
                <div className="admin-filter">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="admin-page__loading">Loading users...</div>
            ) : users.length === 0 ? (
                <div className="admin-page__empty">No users found</div>
            ) : (
                <>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Orders</th>
                                <th>Total Spent</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>#{user.id}</td>
                                    <td>{user.fullName || "-"}</td>
                                    <td>{user.email || "-"}</td>
                                    <td>{user.phone || "-"}</td>
                                    <td>
                                        <select
                                            value={user.role}
                                            onChange={(e) =>
                                                handleRoleChange(
                                                    user.id,
                                                    e.target.value
                                                )
                                            }
                                            className="role-select"
                                        >
                                            <option value="Client">
                                                Client
                                            </option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>{user.orderCount}</td>
                                    <td>R$ {user.totalSpent.toFixed(2)}</td>
                                    <td>
                                        <span
                                            className={`status-badge ${
                                                user.active
                                                    ? "status-badge--active"
                                                    : "status-badge--inactive"
                                            }`}
                                        >
                                            {user.active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleToggleActive(user.id)
                                            }
                                            className={`btn-small ${
                                                user.active
                                                    ? "btn-danger"
                                                    : "btn-success"
                                            }`}
                                        >
                                            {user.active
                                                ? "Deactivate"
                                                : "Activate"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {pagination.totalPages > 1 && (
                        <div className="admin-pagination">
                            <button
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            <span>
                                Page {page} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page === pagination.totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
