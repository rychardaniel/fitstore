import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { OrderService } from "../services/OrderService";

export function Checkout() {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const [shippingData, setShippingData] = useState({
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || "",
        zipCode: user?.zipCode || "",
        notes: "",
    });

    if (!isAuthenticated) {
        navigate("/login");
        return null;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-5 py-16 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Your cart is empty
                </h1>
                <Link
                    to="/"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setShippingData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError("");

        try {
            const order = await OrderService.createOrder({
                shippingAddress: shippingData.address,
                shippingCity: shippingData.city,
                shippingState: shippingData.state,
                shippingZipCode: shippingData.zipCode,
                notes: shippingData.notes,
            });

            await clearCart();
            navigate(`/order-confirmation/${order.uuid}`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to process order"
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const states = [
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MT",
        "MS",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RJ",
        "RN",
        "RS",
        "RO",
        "RR",
        "SC",
        "SP",
        "SE",
        "TO",
    ];

    return (
        <div className="max-w-6xl mx-auto px-5 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate("/cart")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back to Cart</span>
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Shipping Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Truck className="text-blue-600" size={24} />
                            <h2 className="text-xl font-bold text-gray-800">
                                Shipping Address
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Street Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={shippingData.address}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="123 Main St, Apt 4B"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={shippingData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State
                                    </label>
                                    <select
                                        name="state"
                                        value={shippingData.state}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">Select</option>
                                        {states.map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ZIP Code
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={shippingData.zipCode}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="00000-000"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order Notes (optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={shippingData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Special instructions for delivery..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Info Placeholder */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="text-blue-600" size={24} />
                            <h2 className="text-xl font-bold text-gray-800">
                                Payment Method
                            </h2>
                        </div>
                        <p className="text-gray-600">
                            Payment will be processed after order confirmation.
                            You will receive payment instructions via email.
                        </p>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            Order Summary
                        </h2>

                        {/* Items */}
                        <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                            {cart.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between text-sm"
                                >
                                    <span className="text-gray-600">
                                        {item.productName} × {item.quantity}
                                    </span>
                                    <span className="font-medium">
                                        R$ {item.total.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <hr className="my-4" />

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>R$ {cart.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <hr />
                            <div className="flex justify-between text-xl font-bold text-gray-800">
                                <span>Total</span>
                                <span>R$ {cart.subtotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-green-500 text-white font-bold py-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                "Processing..."
                            ) : (
                                <>
                                    <Check size={20} />
                                    Place Order
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
