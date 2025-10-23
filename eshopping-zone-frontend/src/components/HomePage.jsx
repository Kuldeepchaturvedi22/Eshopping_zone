import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllProducts } from '../api/product';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchAllProducts();
                const featured = (Array.isArray(data) ? data : [])
                    .slice()
                    .sort((a, b) => Number(b.discount ?? 0) - Number(a.discount ?? 0))
                    .slice(0, 6);
                setFeaturedProducts(featured);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const categories = [
        { name: 'Electronics', icon: '📱', color: 'from-blue-500 to-cyan-500', items: '2.5k+' },
        { name: 'Fashion', icon: '👗', color: 'from-pink-500 to-rose-500', items: '1.8k+' },
        { name: 'Home & Garden', icon: '🏠', color: 'from-green-500 to-emerald-500', items: '950+' },
        { name: 'Sports', icon: '⚽', color: 'from-orange-500 to-red-500', items: '720+' },
        { name: 'Books', icon: '📚', color: 'from-purple-500 to-indigo-500', items: '1.2k+' },
        { name: 'Beauty', icon: '💄', color: 'from-pink-400 to-purple-400', items: '680+' }
    ];

    const features = [
        { icon: '🚚', title: 'Free Shipping', desc: 'On orders over ₹999' },
        { icon: '🔒', title: 'Secure Payment', desc: '100% protected checkout' },
        { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
        { icon: '🎧', title: '24/7 Support', desc: 'Always here to help' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-3xl"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 py-20">
                    <div className="text-center">
                        <div className="relative inline-block mb-6">
                            <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                                E-Shopping Zone
                            </h1>
                            <div className="absolute inset-0 text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent blur-2xl opacity-30 scale-110">
                                E-Shopping Zone
                            </div>
                        </div>
                        
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Discover premium products, exclusive deals, and exceptional quality in one elegant destination
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <button 
                                onClick={() => navigate('/products')}
                                className="group px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border border-purple-400/30"
                            >
                                <span className="flex items-center gap-2">
                                    Start Shopping
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                    </svg>
                                </span>
                            </button>
                            
                            <button 
                                onClick={() => navigate('/categories')}
                                className="px-8 py-4 bg-white/10 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm hover:bg-white/20"
                            >
                                Browse Categories
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>10k+ Happy Customers</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                                <span>Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
                                <span>Fast Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4">
                            Shop by Category
                        </h2>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Explore our carefully curated collections designed for every lifestyle
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((category, index) => (
                            <div
                                key={category.name}
                                onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
                                className="group cursor-pointer"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative">
                                    <div className={`absolute -inset-1 bg-gradient-to-r ${category.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500`}></div>
                                    
                                    <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-purple-400/50 shadow-2xl group-hover:scale-105 transition-all duration-300">
                                        <div className="text-center">
                                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                                {category.icon}
                                            </div>
                                            <h3 className="text-white font-bold text-sm mb-1 group-hover:text-purple-300 transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-gray-400 text-xs">
                                                {category.items} items
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4">
                            Featured Products
                        </h2>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Handpicked items with the best deals and highest quality
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl h-64 animate-pulse border border-gray-700"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {featuredProducts.map((product, index) => (
                                <div
                                    key={product.productId}
                                    onClick={() => navigate(`/product/${product.productId}`)}
                                    className="group cursor-pointer"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                                        
                                        <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50 hover:border-purple-400/50 shadow-2xl group-hover:scale-105 transition-all duration-300">
                                            <div className="relative overflow-hidden rounded-xl mb-4">
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
                                            
                                            <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                                                {product.productName}
                                            </h3>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                                                    ₹{product.price}
                                                </span>
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <span className="text-white text-xs">→</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <button 
                            onClick={() => navigate('/products')}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            View All Products
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="text-center group"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500"></div>
                                    
                                    <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 group-hover:border-purple-400/50 transition-all duration-300">
                                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-300 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-lg opacity-30"></div>
                        
                        <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-3xl p-12 border border-gray-700/50">
                            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4">
                                Stay Updated
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                                Subscribe to get special offers, free giveaways, and exclusive deals
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 backdrop-blur-sm"
                                />
                                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;