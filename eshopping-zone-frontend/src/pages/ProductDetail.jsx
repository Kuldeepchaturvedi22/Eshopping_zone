import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, fetchAllProducts } from '../api/product';
import { useCart } from '../context/CartContext';
import AnimatedToast from '../components/AnimatedToast';

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { handleAddToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    useEffect(() => {
        const loadProduct = async () => {
            try {
                // Try to get specific product first
                let data;
                try {
                    data = await getProductById(productId);
                } catch {
                    // Fallback: get from all products
                    const allProducts = await fetchAllProducts();
                    data = allProducts.find(p => p.productId === parseInt(productId));
                    if (!data) throw new Error('Product not found');
                }
                setProduct(data);
            } catch (error) {
                console.error('Error loading product:', error);
                showToast('Failed to load product details', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId]);

    const handleAddToCartClick = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Please login to add items to cart', 'error');
            return;
        }
        
        if (product) {
            try {
                for (let i = 0; i < quantity; i++) {
                    await handleAddToCart(product);
                }
                showToast(`Added ${quantity} item(s) to cart!`, 'success');
            } catch (error) {
                showToast('Failed to add item to cart', 'error');
            }
        }
    };

    const handleBuyNow = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Please login to purchase', 'error');
            return;
        }
        
        if (product) {
            try {
                for (let i = 0; i < quantity; i++) {
                    await handleAddToCart(product);
                }
                navigate('/cart');
            } catch (error) {
                showToast('Failed to add item to cart', 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
                    <button 
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-all duration-300"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors duration-300"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-lg opacity-30"></div>
                        <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50">
                            <img
                                src={product.image}
                                alt={product.productName}
                                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                            />
                            {product.discount && (
                                <div className="absolute top-12 right-12 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black text-lg font-bold px-4 py-2 rounded-full shadow-lg">
                                    {product.discount}% OFF
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-4">
                                {product.productName}
                            </h1>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                {product.description || 'Premium quality product with exceptional features and design.'}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                                ₹{product.price}
                            </span>
                            {product.discount && (
                                <span className="text-xl text-gray-400 line-through">
                                    ₹{Math.round(product.price / (1 - product.discount / 100))}
                                </span>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/30">
                                <h3 className="text-purple-300 font-semibold mb-1">Category</h3>
                                <p className="text-white">{product.category || 'General'}</p>
                            </div>
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/30">
                                <h3 className="text-purple-300 font-semibold mb-1">Stock</h3>
                                <p className="text-white">{product.stock || 'In Stock'}</p>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="space-y-3">
                            <h3 className="text-white font-semibold text-lg">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:scale-105 transition-all duration-300 border border-gray-600"
                                >
                                    -
                                </button>
                                <span className="text-2xl font-bold text-white w-16 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:scale-105 transition-all duration-300 border border-gray-600"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                onClick={handleAddToCartClick}
                                className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border border-purple-400/30"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm hover:bg-white/20"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 pt-6">
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>Free Shipping</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                                <span>Easy Returns</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
                                <span>Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-1500"></div>
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatedToast {...toast} />
        </div>
    );
};

export default ProductDetail;