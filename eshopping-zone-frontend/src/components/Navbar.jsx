import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";
export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { getTotalItems } = useCart();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
    window.location.reload();
  };

  const handleMenuClick = () => {
    setShowMenu(false);
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
    setShowMenu(false);
  };

  const categories = ["Electronics", "Fashion", "Home", "Books", "Toys"];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white text-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-blue-600 font-sans tracking-wide">
          eShopping Zone
        </h1>

        {/* <div className="hidden md:flex items-center flex-1 mx-6">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
          />
          <button className="bg-blue-600 p-2 rounded-r-md">
            <MagnifyingGlassIcon className="h-5 w-5 text-white" />
          </button>
        </div> */}
        <div className="hidden md:flex items-center flex-1 mx-6">
          <SearchBar />
        </div>

        <ul className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <div className="relative group">
            <Link to="/categories" className="hover:text-blue-600">Categories</Link>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded mt-2 w-40">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="h-6 w-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {getTotalItems()}
              </span>
            )}
          </Link>

          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)}>
              <UserCircleIcon className="h-8 w-8" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={handleMenuClick}>My Account</Link>
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100" onClick={handleMenuClick}>Orders</Link>
                <Link to="/about" className="block px-4 py-2 hover:bg-gray-100" onClick={handleMenuClick}>About Us</Link>
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                ) : (
                  <Link to="/login" className="block px-4 py-2 hover:bg-gray-100" onClick={handleMenuClick}>Login</Link>
                )}
              </div>
            )}
          </div>
        </ul>

        <button className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {showMenu && (
        <div className="md:hidden bg-white px-4 pb-4">
          <div className="flex items-center mb-3">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md"
            />
            <button className="bg-blue-600 p-2 rounded-r-md">
              <MagnifyingGlassIcon className="h-5 w-5 text-white" />
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            <Link
              to="/"
              className="relative text-gray-800 hover:text-blue-600 transition duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="relative text-gray-800 hover:text-blue-600 transition duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
            >
              Products
            </Link>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="text-left hover:text-blue-600"
              >
                {cat}
              </button>
            ))}
            <Link to="/cart" className="hover:text-blue-600">Cart</Link>
            <Link to="/profile" className="hover:text-blue-600">My Account</Link>
            <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
              Orders
            </Link>
            <Link to="/about" className="hover:text-blue-600">About Us</Link>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-left hover:text-blue-600">Logout</button>
            ) : (
              <Link to="/login" className="hover:text-blue-600">Login</Link>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}