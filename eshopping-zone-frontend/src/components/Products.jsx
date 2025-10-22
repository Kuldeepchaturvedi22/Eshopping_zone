// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { fetchAllProducts } from "../api/product";
// import AnimatedToast from "../components/AnimatedToast";
// import { useCart } from "../context/CartContext";
//
// export default function Products() {
//     const [products, setProducts] = useState([]);
//     const [search, setSearch] = useState("");
//     const [categoryFilter, setCategoryFilter] = useState("All");
//     const [sortOption, setSortOption] = useState("");
//     const [toast, setToast] = useState({ show: false, message: "", type: "" });
//
//     // Use the cart context
//     const { handleAddToCart, handleRemoveItem, cartItems } = useCart();
//
//     const location = useLocation();
//     const navigate = useNavigate();
//     const queryParams = new URLSearchParams(location.search);
//     const initialCategory = queryParams.get("category") || "All";
//     const highlightProductId = queryParams.get("productId");
//
//     useEffect(() => {
//         const token = localStorage.getItem("token");
//
//         fetchAllProducts(token)
//             .then((data) => setProducts(data))
//             .catch((err) => console.error("Failed to load products", err));
//     }, []);
//
//     useEffect(() => {
//         setCategoryFilter(initialCategory);
//     }, [initialCategory]);
//
//     useEffect(() => {
//         if (highlightProductId) {
//             const element = document.getElementById(`product-${highlightProductId}`);
//             if (element) {
//                 element.scrollIntoView({ behavior: "smooth", block: "center" });
//                 element.classList.add("ring-4", "ring-blue-400", "transition-all");
//                 setTimeout(() => {
//                     element.classList.remove("ring-4", "ring-blue-400");
//                 }, 3000);
//             }
//         }
//     }, [products, highlightProductId]);
//
//     const filteredProducts = products.filter((product) => {
//         const matchesSearch = product.productName.toLowerCase().includes(search.toLowerCase());
//         const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
//         return matchesSearch && matchesCategory;
//     });
//
//     let sortedProducts = [...filteredProducts];
//     if (sortOption === "priceLow") {
//         sortedProducts.sort((a, b) => a.price - b.price);
//     } else if (sortOption === "priceHigh") {
//         sortedProducts.sort((a, b) => b.price - a.price);
//     } else if (sortOption === "latest") {
//         sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     }
//
//     const uniqueCategories = ["All", ...new Set(products.map((p) => p.category))];
//
//     const showToast = (message, type) => {
//         setToast({ show: true, message, type });
//         setTimeout(() => setToast({ ...toast, show: false }), 3000);
//     };
//
//     const isInCart = (productId) => {
//         return cartItems?.some(item => item.productId === productId);
//     };
//
//     const handleAddToCartWithFeedback = async (product) => {
//         try {
//             const token = localStorage.getItem("token");
//             const customerId = localStorage.getItem("customerId");
//
//             console.log("Adding to cart with token:", token ? "exists" : "missing");
//             console.log("Customer ID:", customerId);
//
//             if (!token || !customerId) {
//                 showToast("Please login to add items to cart", "info");
//                 navigate("/login");
//                 return;
//             }
//
//             // Add await here to properly catch errors
//             await handleAddToCart(product);
//             showToast("Product added to your cart. Happy shopping!", "success");
//         } catch (error) {
//             console.error("Failed to add item to cart:", error);
//             showToast("Failed to add item to cart. Please try again.", "error");
//         }
//     };
//
//     const handleRemoveItemWithFeedback = (itemId) => {
//         try {
//             // Use the cart context function
//             handleRemoveItem(itemId);
//             showToast("Product removed from your cart.", "info");
//         } catch (error) {
//             console.error("Failed to remove item from cart:", error);
//             showToast("Failed to remove item from cart. Please try again.", "error");
//         }
//     };
//
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-10 px-4 md:px-16 mt-16 transition-all duration-500 ease-in-out">
//             <h2 className="text-4xl font-extrabold text-center mb-6 text-purple-900 drop-shadow-lg animate-fade-in">
//                 🛍️ Explore Our Products
//             </h2>
//
//             {/* Search & Filter */}
//             <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
//                 <input
//                     type="text"
//                     placeholder="Search products..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="p-2 border border-purple-300 rounded shadow focus:ring-2 focus:ring-purple-400 w-full md:w-1/3"
//                 />
//                 <select
//                     value={categoryFilter}
//                     onChange={(e) => setCategoryFilter(e.target.value)}
//                     className="p-2 border border-purple-300 rounded shadow w-full md:w-1/4"
//                 >
//                     {uniqueCategories.map((cat) => (
//                         <option key={cat}>{cat}</option>
//                     ))}
//                 </select>
//                 <select
//                     value={sortOption}
//                     onChange={(e) => setSortOption(e.target.value)}
//                     className="p-2 border border-purple-300 rounded shadow w-full md:w-1/4"
//                 >
//                     <option value="">Sort By</option>
//                     <option value="priceLow">Price: Low to High</option>
//                     <option value="priceHigh">Price: High to Low</option>
//                     <option value="latest">Trending (Latest)</option>
//                 </select>
//             </div>
//
//             {/* Product Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 ">
//                 {sortedProducts.map((product) => (
//                     <div
//                         key={product.productId}
//                         id={`product-${product.productId}`}
//                         className="bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-4 border border-purple-100"
//                     >
//                         <img
//                             src={product.image}
//                             alt={product.productName}
//                             className="w-full h-48 object-cover rounded-lg mb-3"
//                         />
//                         <h3 className="text-xl font-bold text-purple-800">{product.productName}</h3>
//                         <p className="text-gray-600 text-sm mb-1">{product.description}</p>
//                         <p className="text-blue-600 font-bold text-lg">₹{product.price}</p>
//                         <p className="text-green-600 text-sm mb-2">Discount: {product.discount}%</p>
//
//                         {isInCart(product.productId) ? (
//                             <button
//                                 onClick={() => handleRemoveItemWithFeedback(product.productId)}
//                                 className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
//                             >
//                                 Remove from Cart
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={() => handleAddToCartWithFeedback(product)}
//                                 className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition"
//                             >
//                                 Add to Cart
//                             </button>
//                         )}
//                     </div>
//                 ))}
//             </div>
//
//             <AnimatedToast {...toast} />
//         </div>
//     );
// }

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../api/product";
import AnimatedToast from "../components/AnimatedToast";
import { useCart } from "../context/CartContext";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [sortOption, setSortOption] = useState("");
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    // Use the cart context
    const { handleAddToCart, handleRemoveItem, cartItems } = useCart();

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get("category") || "All";
    const highlightProductId = queryParams.get("productId");

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetchAllProducts(token)
            .then((data) => setProducts(data))
            .catch((err) => console.error("Failed to load products", err));
    }, []);

    useEffect(() => {
        setCategoryFilter(initialCategory);
    }, [initialCategory]);

    useEffect(() => {
        if (highlightProductId) {
            const element = document.getElementById(`product-${highlightProductId}`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
                element.classList.add("ring-4", "ring-cyan-400", "transition-all");
                setTimeout(() => {
                    element.classList.remove("ring-4", "ring-cyan-400");
                }, 3000);
            }
        }
    }, [products, highlightProductId]);

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.productName.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    let sortedProducts = [...filteredProducts];
    if (sortOption === "priceLow") {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHigh") {
        sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "latest") {
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const uniqueCategories = ["All", ...new Set(products.map((p) => p.category))];

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    const isInCart = (productId) => {
        return cartItems?.some(item => item.productId === productId);
    };

    const handleAddToCartWithFeedback = async (product) => {
        try {
            const token = localStorage.getItem("token");
            const customerId = localStorage.getItem("customerId");

            console.log("Adding to cart with token:", token ? "exists" : "missing");
            console.log("Customer ID:", customerId);

            if (!token || !customerId) {
                showToast("Please login to add items to cart", "info");
                navigate("/login");
                return;
            }

            // Add await here to properly catch errors
            await handleAddToCart(product);
            showToast("Product added to your cart. Happy shopping!", "success");
        } catch (error) {
            console.error("Failed to add item to cart:", error);
            showToast("Failed to add item to cart. Please try again.", "error");
        }
    };

    const handleRemoveItemWithFeedback = (itemId) => {
        try {
            // Use the cart context function
            handleRemoveItem(itemId);
            showToast("Product removed from your cart.", "info");
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
            showToast("Failed to remove item from cart. Please try again.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-transparent py-10 px-4 md:px-16 mt-16 transition-all duration-500 ease-in-out relative">
            {/* Ambient background glow */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20 pointer-events-none -z-10"></div>

            {/* Header Section */}
            <div className="text-center mb-12 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-3xl blur-3xl -z-10"></div>
                <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 animate-pulse">
                    🛍️ EXPLORE OUR PRODUCTS
                </h2>
                <div className="w-40 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
                <p className="text-gray-300 mt-4 text-lg">Discover amazing products that light up your world</p>
            </div>

            {/* Search & Filter Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl">
                <div className="relative w-full md:w-1/3 group">
                    <input
                        type="text"
                        placeholder="🔍 Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-4 bg-gray-800/90 text-white border-2 border-gray-700 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                </div>

                <div className="relative w-full md:w-1/4 group">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full p-4 bg-gray-800/90 text-white border-2 border-gray-700 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                    >
                        {uniqueCategories.map((cat) => (
                            <option key={cat} value={cat} className="bg-gray-800 text-white">{cat}</option>
                        ))}
                    </select>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                </div>

                <div className="relative w-full md:w-1/4 group">
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full p-4 bg-gray-800/90 text-white border-2 border-gray-700 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                    >
                        <option value="" className="bg-gray-800 text-white">Sort By</option>
                        <option value="priceLow" className="bg-gray-800 text-white">Price: Low to High</option>
                        <option value="priceHigh" className="bg-gray-800 text-white">Price: High to Low</option>
                        <option value="latest" className="bg-gray-800 text-white">Trending (Latest)</option>
                    </select>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sortedProducts.map((product) => (
                    <div
                        key={product.productId}
                        id={`product-${product.productId}`}
                        className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 p-6 border border-gray-700/50 hover:border-purple-400/50 relative overflow-hidden"
                    >
                        {/* Card glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                        {/* Image container */}
                        <div className="relative overflow-hidden rounded-xl mb-4">
                            <img
                                src={product.image}
                                alt={product.productName}
                                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Discount badge */}
                            {product.discount > 0 && (
                                <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black text-sm font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                                    {product.discount}% OFF
                                </div>
                            )}
                        </div>

                        {/* Product details */}
                        <div className="space-y-3 relative z-10">
                            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                                {product.productName}
                            </h3>

                            <p className="text-gray-400 text-sm line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                                {product.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                                    ₹{product.price}
                                </span>
                                {product.discount > 0 && (
                                    <span className="text-emerald-400 text-sm font-semibold">
                                        Save {product.discount}%
                                    </span>
                                )}
                            </div>

                            {/* Action button */}
                            <div className="pt-4">
                                {isInCart(product.productId) ? (
                                    <button
                                        onClick={() => handleRemoveItemWithFeedback(product.productId)}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25 flex items-center justify-center space-x-2"
                                    >
                                        <span>🗑️</span>
                                        <span>Remove from Cart</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAddToCartWithFeedback(product)}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2 group-hover:animate-pulse"
                                    >
                                        <span>🛒</span>
                                        <span>Add to Cart</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Floating particles effect */}
                        <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                        <div className="absolute bottom-4 right-4 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{animationDelay: '0.5s'}}></div>
                    </div>
                ))}
            </div>

            {/* Empty state */}
            {sortedProducts.length === 0 && (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-300 mb-2">No products found</h3>
                    <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
            )}

            {/* Decorative elements */}
            <div className="flex justify-center mt-16">
                <div className="flex space-x-3">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                    ))}
                </div>
            </div>

            <AnimatedToast {...toast} />
        </div>
    );
}