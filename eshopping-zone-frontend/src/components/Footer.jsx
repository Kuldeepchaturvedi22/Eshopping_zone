import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-black text-gray-300 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <img
                            src="/favicon.svg"
                            alt="Eshopping Zone Logo"
                            className="w-8 h-8"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <span className="text-lg font-semibold text-white">
              eShopping Zone
            </span>
                    </div>
                    <p className="text-sm text-gray-400">
                        Your one-stop destination for fashion, electronics & lifestyle.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link to="/" className="hover:text-white">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/products" className="hover:text-white">
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link to="/cart" className="hover:text-white">
                                Cart
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-white">
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Contact</h3>
                    <p className="text-sm">📧 support@eshoppingzone.com</p>
                    <p className="text-sm">📞 +91 12345 67890</p>
                    <p className="text-sm">📍 Bangalore, India</p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
                © {new Date().getFullYear()} eShopping Zone. All rights reserved.
            </div>
        </footer>
    );
}
