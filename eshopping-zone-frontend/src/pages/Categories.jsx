import React, { useEffect, useState } from "react";
import { fetchAllProducts } from "../api/product";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const [products, setProducts] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [filteredGrouped, setFilteredGrouped] = useState({});
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchAllProducts(token)
      .then((data) => {
        setProducts(data);
        groupByCategory(data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const groupByCategory = (products) => {
    const groupedData = {};
    products.forEach((product) => {
      const category = product.category || "Others";
      if (!groupedData[category]) groupedData[category] = [];
      groupedData[category].push(product);
    });
    setGrouped(groupedData);
    setFilteredGrouped(groupedData);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleSearchAndFilter = () => {
    const filtered = {};
    Object.keys(grouped).forEach((category) => {
      if (selectedCategory === "All" || category === selectedCategory) {
        let filteredProducts = grouped[category].filter((product) =>
          product.productName.toLowerCase().includes(search.toLowerCase())
        );
        
        // Apply sorting
        if (sortOption === "priceLow") {
          filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortOption === "priceHigh") {
          filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name") {
          filteredProducts.sort((a, b) => a.productName.localeCompare(b.productName));
        } else if (sortOption === "discount") {
          filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        }
        
        if (filteredProducts.length > 0) {
          filtered[category] = filteredProducts;
        }
      }
    });
    setFilteredGrouped(filtered);
  };

    useEffect(() => {
        handleSearchAndFilter();
    }, [search, selectedCategory, sortOption, grouped]);

    const allCategories = ["All", ...Object.keys(grouped)];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 blur-3xl opacity-50 pointer-events-none"></div>
            
            <section className="relative px-4 py-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="relative inline-block">
                        <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4">
                            🛍️ Shop by Category
                        </h2>
                        <div className="absolute inset-0 text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent blur-2xl opacity-30 scale-110">
                            🛍️ Shop by Category
                        </div>
                    </div>
                    <div className="w-40 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full mb-4"></div>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Discover products organized by categories for easy browsing
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-16 p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl">
                    <div className="relative w-full md:w-1/3 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <input
                            type="text"
                            placeholder="🔍 Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="relative z-10 w-full p-4 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:border-purple-400/50 transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                        />
                    </div>
                    <div className="relative w-full md:w-1/4 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="relative z-10 w-full p-4 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:border-purple-400/50 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                        >
                            {allCategories.map((cat) => (
                                <option key={cat} value={cat} className="bg-gray-800 text-white">{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative w-full md:w-1/4 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="relative z-10 w-full p-4 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:border-emerald-400/50 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-gray-800 text-white">Sort By</option>
                            <option value="priceLow" className="bg-gray-800 text-white">Price: Low to High</option>
                            <option value="priceHigh" className="bg-gray-800 text-white">Price: High to Low</option>
                            <option value="name" className="bg-gray-800 text-white">Name: A to Z</option>
                            <option value="discount" className="bg-gray-800 text-white">Highest Discount</option>
                        </select>
                    </div>
                </div>

                {/* Category-wise Product Grid */}
                {Object.keys(filteredGrouped).map((category, index) => (
                    <div
                        key={category}
                        className="mb-16"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {/* Category Header */}
                        <div className="relative mb-8">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-2xl blur-lg opacity-50"></div>
                            <div className="relative bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
                                    {category}
                                </h3>
                                <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2"></div>
                            </div>
                        </div>
                        
                        {/* Products Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {filteredGrouped[category].map((product) => (
                                <div
                                    key={product.productId}
                                    onClick={() => handleProductClick(product.productId)}
                                    className="group cursor-pointer bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50 hover:border-purple-400/50 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
                                >
                                    {/* Card glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                                    
                                    {/* Image */}
                                    <div className="relative overflow-hidden rounded-xl mb-3">
                                        <img
                                            src={product.image}
                                            alt={product.productName}
                                            className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {product.discount && (
                                            <div className="absolute top-2 right-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                                                {product.discount}% OFF
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Product Info */}
                                    <div className="relative z-10 space-y-2">
                                        <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                                            {product.productName}
                                        </h4>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                                                ₹{product.price}
                                            </span>
                                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <span className="text-white text-xs">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                
                {/* Empty state */}
                {Object.keys(filteredGrouped).length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-300 mb-2">No products found</h3>
                        <p className="text-gray-400">Try adjusting your search or category filter</p>
                    </div>
                )}
            </section>
        </div>
    );

}
