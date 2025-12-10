import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import { Orders } from "./pages/Orders";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";

// Admin imports
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import AdminCategories from "./pages/admin/Categories";
import AdminBrands from "./pages/admin/Brands";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <Routes>
                            {/* Admin Routes */}
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<AdminDashboard />} />
                                <Route
                                    path="products"
                                    element={<AdminProducts />}
                                />
                                <Route
                                    path="orders"
                                    element={<AdminOrders />}
                                />
                                <Route path="users" element={<AdminUsers />} />
                                <Route
                                    path="categories"
                                    element={<AdminCategories />}
                                />
                                <Route
                                    path="brands"
                                    element={<AdminBrands />}
                                />
                            </Route>

                            {/* Public Routes */}
                            <Route
                                path="/*"
                                element={
                                    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-800">
                                        <Header />
                                        <main className="flex-grow w-full">
                                            <Routes>
                                                <Route
                                                    path="/"
                                                    element={<Home />}
                                                />
                                                <Route
                                                    path="/login"
                                                    element={<Login />}
                                                />
                                                <Route
                                                    path="/register"
                                                    element={<Register />}
                                                />
                                                <Route
                                                    path="/product/:id"
                                                    element={<ProductDetails />}
                                                />
                                                <Route
                                                    path="/cart"
                                                    element={<Cart />}
                                                />
                                                <Route
                                                    path="/checkout"
                                                    element={<Checkout />}
                                                />
                                                <Route
                                                    path="/order-confirmation/:uuid"
                                                    element={
                                                        <OrderConfirmation />
                                                    }
                                                />
                                                <Route
                                                    path="/orders"
                                                    element={<Orders />}
                                                />
                                                <Route
                                                    path="/orders/:id"
                                                    element={
                                                        <OrderConfirmation />
                                                    }
                                                />
                                                <Route
                                                    path="/search"
                                                    element={<Search />}
                                                />
                                                <Route
                                                    path="/profile"
                                                    element={<Profile />}
                                                />
                                                <Route
                                                    path="/wishlist"
                                                    element={<Wishlist />}
                                                />
                                            </Routes>
                                        </main>
                                        <Footer />
                                    </div>
                                }
                            />
                        </Routes>
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
