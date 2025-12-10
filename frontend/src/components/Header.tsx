import { useState } from "react";
import {
    Search,
    ShoppingCart,
    User,
    LogOut,
    Menu as MenuIcon,
    X,
    Heart,
    Package,
    UserCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export function Header() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const { getItemCount } = useCart();
    const { itemCount: wishlistCount } = useWishlist();
    const [searchQuery, setSearchQuery] = useState("");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate("/");
    };

    const itemCount = getItemCount();

    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-4 md:px-8 shadow-lg">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Logo */}
                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-white no-underline flex items-center gap-2"
                    >
                        🛒 Fitstore
                    </Link>
                    <button
                        className="md:hidden text-white"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        {showMobileMenu ? (
                            <X size={24} />
                        ) : (
                            <MenuIcon size={24} />
                        )}
                    </button>
                </div>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className={`flex-grow max-w-lg w-full bg-white rounded-lg overflow-hidden flex ${
                        showMobileMenu ? "block" : "hidden md:flex"
                    }`}
                >
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-grow border-none p-3 text-base text-gray-700 focus:outline-none"
                        placeholder="Search products..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-700 text-white border-none px-4 cursor-pointer hover:bg-blue-800 transition-colors"
                    >
                        <Search size={20} />
                    </button>
                </form>

                {/* Navigation */}
                <div
                    className={`flex gap-4 items-center ${
                        showMobileMenu ? "flex-col w-full" : "hidden md:flex"
                    }`}
                >
                    {isAuthenticated ? (
                        <>
                            {/* Wishlist */}
                            <Link
                                to="/wishlist"
                                className="text-white no-underline flex items-center hover:bg-white/10 p-2 rounded-lg transition-colors relative"
                                title="Wishlist"
                            >
                                <Heart size={22} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                                        {wishlistCount > 99
                                            ? "99+"
                                            : wishlistCount}
                                    </span>
                                )}
                            </Link>

                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowUserMenu(!showUserMenu)
                                    }
                                    className="text-white flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <User size={20} />
                                    <span className="max-w-[100px] truncate">
                                        {user?.fullName || "Account"}
                                    </span>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() =>
                                                setShowUserMenu(false)
                                            }
                                        >
                                            <UserCircle size={18} />
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() =>
                                                setShowUserMenu(false)
                                            }
                                        >
                                            <Package size={18} />
                                            My Orders
                                        </Link>
                                        <Link
                                            to="/wishlist"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() =>
                                                setShowUserMenu(false)
                                            }
                                        >
                                            <Heart size={18} />
                                            Wishlist
                                        </Link>
                                        <hr className="my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="text-white no-underline text-sm p-2 hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <User size={18} />
                            Sign In
                        </Link>
                    )}

                    <Link
                        to="/cart"
                        className="text-white no-underline font-bold flex items-center hover:bg-white/10 p-2 rounded-lg transition-colors relative"
                    >
                        <ShoppingCart size={22} />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-800 rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                                {itemCount > 99 ? "99+" : itemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
