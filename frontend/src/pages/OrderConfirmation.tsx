import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { OrderService } from "../services/OrderService";
import type { Order } from "../types";

export function OrderConfirmation() {
    const { uuid } = useParams<{ uuid: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!uuid) return;

        OrderService.getOrderByUuid(uuid)
            .then((data) => setOrder(data))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [uuid]);

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto px-5 py-16 text-center">
                <div className="animate-pulse space-y-4">
                    <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-2xl mx-auto px-5 py-16 text-center">
                <p className="text-gray-600 mb-4">Order not found</p>
                <Link
                    to="/"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                >
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-5 py-12">
            {/* Success Header */}
            <div className="text-center mb-10">
                <CheckCircle
                    size={80}
                    className="mx-auto text-green-500 mb-6"
                />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Order Confirmed!
                </h1>
                <p className="text-gray-600">
                    Thank you for your purchase. Your order has been received.
                </p>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <Package className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">
                        Order Details
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Order Number</p>
                        <p className="font-mono text-sm">
                            {order.uuid.substring(0, 8).toUpperCase()}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-medium">{order.orderDate}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                            {order.status}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-bold text-green-600">
                            R$ {order.totalAmount.toFixed(2)}
                        </p>
                    </div>
                </div>

                <hr className="my-4" />

                {/* Items */}
                <h3 className="font-semibold text-gray-800 mb-3">
                    Items Ordered
                </h3>
                <div className="space-y-3">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                            <span className="text-gray-600">
                                {item.productName} × {item.quantity}
                            </span>
                            <span className="font-medium">
                                R$ {item.total.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                    <>
                        <hr className="my-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Shipping Address
                        </h3>
                        <p className="text-gray-600">
                            {order.shippingAddress.address}
                            <br />
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.zipCode}
                        </p>
                    </>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/orders"
                    className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                    View All Orders
                </Link>
                <Link
                    to="/"
                    className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors text-center flex items-center justify-center gap-2"
                >
                    Continue Shopping
                    <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
}
