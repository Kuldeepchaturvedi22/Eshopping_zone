// import { Routes, Route, Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
//
// import Navbar from "./components/Navbar";
// import AdminNavbar from "./components/AdminNavbar";
// import Footer from "./components/Footer";
// import Hero from "./components/Hero";
// import CategoryShowcase from "./components/CategoryShowcase";
// import CategoriesHome from "./components/CategoriesHome";
// import FeaturedProducts from "./components/FeaturedProducts";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import AboutUs from "./components/AboutUs";
// import AdminDashboard from "./pages/AdminDashboard";
// import Products from "./components/Products";
// import AdminRoute from "./routes/AdminRoute";
// import Cart from "./pages/Cart";
// import Categories from "./pages/Categories";
// import AdminProducts from "./pages/AdminProducts";
// import PaymentSuccess from "./components/PaymentSuccess";
// import Orders from "./pages/Orders";
// import { CartProvider } from "./context/CartContext";
//
// function App() {
//   const [role, setRole] = useState(null);
//
//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     setRole(storedRole);
//   }, []);
//
//   return (
//     <CartProvider>
//       {/* Show navbar based on role */}
//       {role === "ADMIN" ? <AdminNavbar /> : <Navbar />}
//
//       <Routes>
//         {/* Redirect root path based on role */}
//         <Route
//           path="/"
//           element={
//             role === "ADMIN" ? (
//               <Navigate to="/admin" />
//             ) : (
//               <>
//                 <Hero />
//                 <CategoriesHome />
//                 <CategoryShowcase />
//                 <FeaturedProducts />
//                 <Products />
//               </>
//             )
//           }
//         />
// a
//         {/* Admin Dashboard */}
//         <Route
//           path="/admin"
//           element={
//             <AdminRoute>
//               <AdminDashboard />
//             </AdminRoute>
//           }
//         />
//         {/* Common Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/about"  element={<AboutUs />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/categories" element={<Categories />} />
//         <Route path="/payment-success" element={<PaymentSuccess />} />
//         <Route path="/admin/products" element={<AdminProducts />} />
//         <Route path="/orders" element={<Orders />} />
//       </Routes>
//       <Footer />
//     </CartProvider>
//   );
// }
//
// export default App;

// src/App.jsx
// File: `src/App.jsx`
// Updated to include MerchantNavbar, MerchantRoute, and merchant routes
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import MerchantNavbar from "./components/MerchantNavbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import CategoryShowcase from "./components/CategoryShowcase";
import CategoriesHome from "./components/CategoriesHome";
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
            {renderNavbar()}

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
                                <CategoriesHome />
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

            <Footer />
        </CartProvider>
    );
}

export default App;