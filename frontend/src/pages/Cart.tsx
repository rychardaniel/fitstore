import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export function Cart() {
    const navigate = useNavigate();
    const { cart, isLoading, updateItemQuantity, removeItem, clearCart } =
        useCart();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto px-5 py-16 text-center">
                <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Your cart is waiting
                </h1>
                <p className="text-gray-600 mb-8">
                    Sign in to view your cart and continue shopping.
                </p>
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Sign In
                    <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    if (isLoading && !cart) {
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

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-5 py-16 text-center">
                <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Your cart is empty
                </h1>
                <p className="text-gray-600 mb-8">
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Start Shopping
                    <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    const handleQuantityChange = async (
        itemId: number,
        newQuantity: number
    ) => {
        if (newQuantity < 1) {
            await removeItem(itemId);
        } else {
            await updateItemQuantity(itemId, newQuantity);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-5 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Shopping Cart
                </h1>
                <button
                    onClick={() => clearCart()}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                    Clear Cart
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex gap-4"
                        >
                            {/* Product Image */}
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                {item.productImage ? (
                                    <img
                                        src={item.productImage}
                                        alt={item.productName}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-xs">
                                        No Image
                                    </span>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-grow">
                                <Link
                                    to={`/product/${item.productId}`}
                                    className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                                >
                                    {item.productName}
                                </Link>
                                <p className="text-green-600 font-bold mt-1">
                                    R$ {item.unitPrice.toFixed(2)}
                                </p>
                                {item.quantity > item.stockAvailable && (
                                    <p className="text-red-500 text-sm mt-1">
                                        Only {item.stockAvailable} available
                                    </p>
                                )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        handleQuantityChange(
                                            item.id,
                                            item.quantity - 1
                                        )
                                    }
                                    className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                                    disabled={isLoading}
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="w-10 text-center font-medium">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() =>
                                        handleQuantityChange(
                                            item.id,
                                            item.quantity + 1
                                        )
                                    }
                                    className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                                    disabled={
                                        isLoading ||
                                        item.quantity >= item.stockAvailable
                                    }
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            {/* Item Total & Remove */}
                            <div className="flex flex-col items-end justify-between">
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    disabled={isLoading}
                                >
                                    <Trash2 size={20} />
                                </button>
                                <span className="font-bold text-gray-800">
                                    R$ {item.total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({cart.totalItems} items)</span>
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
                            onClick={() => navigate("/checkout")}
                            className="w-full bg-yellow-400 text-gray-800 font-bold py-4 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout
                            <ArrowRight size={20} />
                        </button>

                        <Link
                            to="/"
                            className="block text-center text-blue-600 hover:text-blue-700 mt-4 font-medium"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
