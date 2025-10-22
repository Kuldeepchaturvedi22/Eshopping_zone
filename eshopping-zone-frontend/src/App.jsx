import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import MerchantNavbar from "./components/MerchantNavbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import CategoryShowcase from "./components/CategoryShowcase";
import FeaturedProducts from "./components/FeaturedProducts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AboutUs from "./components/AboutUs";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./components/Products";
import AdminRoute from "./routes/AdminRoute";
import MerchantRoute from "./routes/MerchantRoute";
import Cart from "./pages/Cart";
import Categories from "./pages/Categories";
import AdminProducts from "./pages/AdminProducts";
import PaymentSuccess from "./components/PaymentSuccess";
import Orders from "./pages/Orders";
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantProducts from "./pages/MerchantProducts";
import MerchantOrders from "./pages/MerchantOrders";
import MerchantNotifications from "./pages/MerchantNotifications";
import { CartProvider } from "./context/CartContext";
import OrderPayment from "./pages/PaymentSuccess.jsx";
import TopDeals from "./components/TopDeals"; // NEW
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";
import AdminOrder from "./pages/AdminOrder.jsx";
import DealsAndLatestLayout from "./components/DealsAndLatestLayout.jsx";


function App() {
    const [role, setRole] = useState(() => localStorage.getItem("role") || null);

    useEffect(() => {
        const syncRole = () => setRole(localStorage.getItem("role") || null);
        const onStorage = (e) => { if (e.key === "role") syncRole(); };
        window.addEventListener("auth:role-changed", syncRole);
        window.addEventListener("storage", onStorage);
        return () => {
            window.removeEventListener("auth:role-changed", syncRole);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    const renderNavbar = () => {
        if (role === "ADMIN") return <AdminNavbar />;
        if (role === "MERCHANT") return <MerchantNavbar />;
        return <Navbar />;
    };

    return (
        <CartProvider>
            <div className="min-h-screen flex flex-col">
                {renderNavbar()}

                <main className="flex-1 bg-black">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                role === "ADMIN" ? (
                                    <Navigate to="/admin" />
                                ) : role === "MERCHANT" ? (
                                    <Navigate to="/merchant" />
                                ) : (
                                    <>
                                        <Hero />
                                        <DealsAndLatestLayout />
                                        <CategoryShowcase />
                                        <FeaturedProducts />
                                        <Products />
                                    </>
                                )
                            }
                        />

                        {/* Admin */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        <Route path="/admin/products" element={<AdminProducts />} />
                        <Route
                            path="/admin/users"
                            element={
                                <AdminRoute>
                                    <AdminUsers />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/settings"
                            element={
                                <AdminRoute>
                                    <AdminSettings />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/order"
                            element={
                            <AdminRoute>
                                <AdminOrder />
                            </AdminRoute>
                            }
                        />
                        {/* Merchant */}
                        <Route
                            path="/merchant"
                            element={
                                <MerchantRoute>
                                    <MerchantDashboard />
                                </MerchantRoute>
                            }
                        />
                        <Route
                            path="/merchant/products"
                            element={
                                <MerchantRoute>
                                    <MerchantProducts />
                                </MerchantRoute>
                            }
                        />
                        <Route
                            path="/merchant/orders"
                            element={
                                <MerchantRoute>
                                    <MerchantOrders />
                                </MerchantRoute>
                            }
                        />
                        <Route
                            path="/merchant/notifications"
                            element={
                                <MerchantRoute>
                                    <MerchantNotifications />
                                </MerchantRoute>
                            }
                        />

                        {/* Common */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/categories" element={<Categories />} />

                        {/* New: Order review/payment screen */}
                        <Route path="/checkout" element={<OrderPayment />} />

                        <Route path="/payment-success" element={<PaymentSuccess />} />
                        <Route path="/orders" element={<Orders />} />
                    </Routes>
                </main>

                <Footer /> {/* Black footer pinned at the bottom */}
            </div>
        </CartProvider>
    );
}

export default App;