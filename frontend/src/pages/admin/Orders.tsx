import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminService, type RecentOrder } from "../../services/AdminService";
import type { PaginatedResponse } from "../../types";

const ORDER_STATUSES = ["Open", "Confirmed", "Paid", "Canceled", "Delivered"];

export default function Orders() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState<RecentOrder[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        totalItems: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get("search") || "");

    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response: PaginatedResponse<RecentOrder> =
                await AdminService.getOrders({
                    status: status || undefined,
                    search: search || undefined,
                    page,
                    pageSize: 20,
                });
            setOrders(response.data);
            setPagination({
                page: response.page,
                totalPages: response.totalPages,
                totalItems: response.totalItems,
            });
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [status, page, search]);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            await AdminService.updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch (err) {
            console.error("Failed to update order status:", err);
        }
    };

    const updateFilter = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        if (key !== "page") newParams.set("page", "1");
        setSearchParams(newParams);
    };

    return (
        <div className="admin-page">
            <h1>Orders Management</h1>

            <div className="admin-filters">
                <div className="admin-filter">
                    <input
                        type="text"
                        placeholder="Search by customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && updateFilter("search", search)
                        }
                    />
                </div>

                <div className="admin-filter">
                    <select
                        value={status}
                        onChange={(e) => updateFilter("status", e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="admin-page__loading">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="admin-page__empty">No orders found</div>
            ) : (
                <>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Email</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.customerName || "-"}</td>
                                    <td>{order.customerEmail || "-"}</td>
                                    <td>R$ {order.total.toFixed(2)}</td>
                                    <td>
                                        <span
                                            className={`status-badge status-badge--${order.status.toLowerCase()}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("pt-BR")}
                                    </td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    order.id,
                                                    e.target.value
                                                )
                                            }
                                            className="status-select"
                                        >
                                            {ORDER_STATUSES.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {pagination.totalPages > 1 && (
                        <div className="admin-pagination">
                            <button
                                onClick={() =>
                                    updateFilter("page", String(page - 1))
                                }
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            <span>
                                Page {page} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() =>
                                    updateFilter("page", String(page + 1))
                                }
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
