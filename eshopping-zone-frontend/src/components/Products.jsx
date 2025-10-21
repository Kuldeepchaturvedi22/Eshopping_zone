import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../api/product";
import AnimatedToast from "../components/AnimatedToast";
import { useCart } from "../context/CartContext"; // Import the cart context hook

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
                element.classList.add("ring-4", "ring-blue-400", "transition-all");
                setTimeout(() => {
                    element.classList.remove("ring-4", "ring-blue-400");
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
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-10 px-4 md:px-16 mt-16 transition-all duration-500 ease-in-out">
            <h2 className="text-4xl font-extrabold text-center mb-6 text-purple-900 drop-shadow-lg animate-fade-in">
                🛍️ Explore Our Products
            </h2>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border border-purple-300 rounded shadow focus:ring-2 focus:ring-purple-400 w-full md:w-1/3"
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="p-2 border border-purple-300 rounded shadow w-full md:w-1/4"
                >
                    {uniqueCategories.map((cat) => (
                        <option key={cat}>{cat}</option>
                    ))}
                </select>
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="p-2 border border-purple-300 rounded shadow w-full md:w-1/4"
                >
                    <option value="">Sort By</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="latest">Trending (Latest)</option>
                </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {sortedProducts.map((product) => (
                    <div
                        key={product.productId}
                        id={`product-${product.productId}`}
                        className="bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-4 border border-purple-100"
                    >
                        <img
                            src={product.image}
                            alt={product.productName}
                            className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                        <h3 className="text-xl font-bold text-purple-800">{product.productName}</h3>
                        <p className="text-gray-600 text-sm mb-1">{product.description}</p>
                        <p className="text-blue-600 font-bold text-lg">₹{product.price}</p>
                        <p className="text-green-600 text-sm mb-2">Discount: {product.discount}%</p>

                        {isInCart(product.productId) ? (
                            <button
                                onClick={() => handleRemoveItemWithFeedback(product.productId)}
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                            >
                                Remove from Cart
                            </button>
                        ) : (
                            <button
                                onClick={() => handleAddToCartWithFeedback(product)}
                                className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition"
                            >
                                Add to Cart
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <AnimatedToast {...toast} />
        </div>
    );
}