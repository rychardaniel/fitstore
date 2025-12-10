import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Eye, XCircle } from "lucide-react";
import { OrderService } from "../services/OrderService";
import { useAuth } from "../context/AuthContext";
import type { OrderSummary } from "../types";

const statusColors: Record<string, string> = {
    Open: "bg-blue-100 text-blue-700",
    Confirmed: "bg-purple-100 text-purple-700",
    Paid: "bg-green-100 text-green-700",
    Canceled: "bg-red-100 text-red-700",
    Delivered: "bg-gray-100 text-gray-700",
};

export function Orders() {
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) return;

        OrderService.getUserOrders()
            .then((data) => setOrders(data))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [isAuthenticated]);

    const handleCancelOrder = async (orderId: number) => {
        if (!confirm("Are you sure you want to cancel this order?")) return;

        try {
            await OrderService.cancelOrder(orderId);
            setOrders(
                orders.map((o) =>
                    o.id === orderId ? { ...o, status: "Canceled" } : o
                )
            );
        } catch (err) {
            alert(
                err instanceof Error ? err.message : "Failed to cancel order"
            );
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto px-5 py-16 text-center">
                <Package size={64} className="mx-auto text-gray-300 mb-6" />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    View Your Orders
                </h1>
                <p className="text-gray-600 mb-8">
                    Sign in to view your order history.
                </p>
                <Link
                    to="/login"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-5 py-10">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-5 py-16 text-center">
                <Package size={64} className="mx-auto text-gray-300 mb-6" />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    No Orders Yet
                </h1>
                <p className="text-gray-600 mb-8">
                    You haven't placed any orders yet.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-5 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            {/* Order Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="font-semibold text-gray-800">
                                        Order #
                                        {order.uuid
                                            .substring(0, 8)
                                            .toUpperCase()}
                                    </h2>
                                    <span
                                        className={`px-2 py-1 rounded text-sm font-medium ${
                                            statusColors[order.status] ||
                                            "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {order.itemCount} item
                                    {order.itemCount > 1 ? "s" : ""} • Ordered
                                    on {order.orderDate}
                                </p>
                            </div>

                            {/* Total */}
                            <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">
                                    R$ {order.totalAmount.toFixed(2)}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Link
                                    to={`/orders/${order.id}`}
                                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Eye size={18} />
                                    View
                                </Link>
                                {(order.status === "Open" ||
                                    order.status === "Confirmed") && (
                                    <button
                                        onClick={() =>
                                            handleCancelOrder(order.id)
                                        }
                                        className="flex items-center gap-1 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <XCircle size={18} />
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
