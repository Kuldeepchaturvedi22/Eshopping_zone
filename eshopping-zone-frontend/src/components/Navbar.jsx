// import React, {useEffect, useRef, useState} from "react";
// import {Link, useNavigate} from "react-router-dom";
// import {
//     Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, UserCircleIcon, XMarkIcon,
// } from "@heroicons/react/24/outline";
// import {useCart} from "../context/CartContext";
// import SearchBar from "./SearchBar";
//
// export default function Navbar() {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [showMenu, setShowMenu] = useState(false);
//     const [catsOpen, setCatsOpen] = useState(false);
//     const [theme, setTheme] = useState("light");
//     const catsTimerRef = useRef(null);
//     const menuRef = useRef(null);
//     const navigate = useNavigate();
//     const {getTotalItems} = useCart();
//
//     useEffect(() => {
//         const loggedIn = localStorage.getItem("isLoggedIn") === "true";
//         setIsLoggedIn(loggedIn);
//     }, []);
//
//     // Load + apply theme on mount
//     useEffect(() => {
//         const saved = localStorage.getItem("theme") || "light";
//         setTheme(saved);
//         document.documentElement.setAttribute("data-theme", saved);
//     }, []);
//
//     // Handle clicks outside the user menu
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (menuRef.current && !menuRef.current.contains(event.target)) {
//                 setShowMenu(false);
//             }
//         };
//
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);
//
//     const toggleTheme = () => {
//         const next = theme === "dark" ? "light" : "light";
//         setTheme(next);
//         localStorage.setItem("theme", next);
//         document.documentElement.setAttribute("data-theme", next);
//     };
//
//     const openCats = () => {
//         if (catsTimerRef.current) clearTimeout(catsTimerRef.current);
//         setCatsOpen(true);
//     };
//     const closeCats = () => {
//         if (catsTimerRef.current) clearTimeout(catsTimerRef.current);
//         catsTimerRef.current = setTimeout(() => setCatsOpen(false), 120);
//     };
//
//     const handleLogout = () => {
//         localStorage.clear();
//         setIsLoggedIn(false);
//         navigate("/login");
//         window.location.reload();
//     };
//
//     const handleMenuClick = () => setShowMenu(false);
//     const handleCategoryClick = (category) => {
//         navigate(`/products?category=${encodeURIComponent(category)}`);
//         setShowMenu(false);
//     };
//
//     // User menu handlers
//     const handleUserMenuEnter = () => {
//         setShowMenu(true);
//     };
//
//     const handleUserMenuLeave = () => {
//         // Small delay to prevent accidental closure
//         setTimeout(() => setShowMenu(false), 150);
//     };
//
//     const categories = ["Electronics", "Fashion", "Home", "Books", "Toys"];
//
//     return (<nav className="nav-glossy">
//             <div
//                 className="max-w-7xl mx-auto px-4 py-3 bg-black bg-opacity-80 backdrop-blur-md shadow-[0_0_10px_rgba(255,255,255,0.1)] border-b border-gray-800 flex items-center gap-4 text-white">
//                 {/* Brand */}
//                 <Link to="/" className="flex items-center gap-2 group">
//                     <div
//                         className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] shadow-lg">
//                         <img src="/favicon.svg" alt="Logo" className="h-full w-full object-cover rounded-lg"/>
//                     </div>
//                     <span className="text-white font-extrabold tracking-tight text-lg group-hover:opacity-90">
//             E‑Shopping Zone
//           </span>
//                 </Link>
//
//                 {/* Search */}
//                 <div className="hidden md:flex items-center flex-1 mx-6">
//                     <SearchBar/>
//                 </div>
//
//                 {/* Desktop links/actions */}
//                 <ul className="ml-auto hidden md:flex gap-6 items-center">
//                     <Link to="/" className="text-white hover:text-white link-underline">Home</Link>
//                     <Link to="/products" className="text-white hover:text-white link-underline">Products</Link>
//
//                     {/* Categories dropdown */}
//                     <div className="relative" onMouseEnter={openCats} onMouseLeave={closeCats}>
//                         <button className="text-white hover:text-white link-underline">Categories</button>
//                         {catsOpen && (<div
//                                 className="absolute bg-gray-700 text-white  right-0 mt-3 w-44 rounded-2xl glass p-2 z-50">
//                                 {categories.map((cat) => (<button
//                                         key={cat}
//                                         onClick={() => handleCategoryClick(cat)}
//                                         className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white"
//                                     >
//                                         {cat}
//                                     </button>))}
//                             </div>)}
//                     </div>
//
//                     {/* Cart */}
//                     <Link to="/cart" className="relative">
//                         <ShoppingCartIcon className="h-6 w-6 text-white/90 hover:text-white transition"/>
//                         {getTotalItems() > 0 && (<span
//                                 className="absolute -top-2 -right-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
//                 {getTotalItems()}
//               </span>)}
//                     </Link>
//
//                     {/* User menu - Enhanced with hover and click outside */}
//                     <div className="relative" ref={menuRef}>
//                         <button
//                             onClick={() => setShowMenu(prev => !prev)}
//                             onMouseEnter={handleUserMenuEnter}
//                             className="rounded-lg hover:bg-white/10 p-1 transition flex items-center gap-1"
//                         >
//                             <UserCircleIcon className="h-8 w-8 text-white/90 hover:text-white"/>
//                             <svg
//                                 className={`w-3 h-3 text-white/70 transition-transform ${showMenu ? 'rotate-180' : ''}`}
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
//                             </svg>
//                         </button>
//                         {showMenu && (<div
//                                 onMouseEnter={handleUserMenuEnter}
//                                 onMouseLeave={handleUserMenuLeave}
//                                 className="absolute bg-gray-700 right-0 mt-3 w-56 rounded-2xl glass p-2 z-50 animate-in slide-in-from-top-2 duration-200"
//                             >
//                                 <Link
//                                     to="/profile"
//                                     className="block px-3 py-2 rounded-lg text-white/90 hover:bg-white/70 hover:text-white transition"
//                                     onClick={handleMenuClick}
//                                 >
//                                     My Account
//                                 </Link>
//                                 <Link
//                                     to="/orders"
//                                     className="block px-3 py-2 rounded-lg text-white/90 hover:bg-white/70 hover:text-white transition"
//                                     onClick={handleMenuClick}
//                                 >
//                                     Orders
//                                 </Link>
//                                 <Link
//                                     to="/about"
//                                     className="block px-3 py-2 rounded-lg text-white/90 hover:bg-white/70 hover:text-white transition"
//                                     onClick={handleMenuClick}
//                                 >
//                                     About Us
//                                 </Link>
//                                 <div className="border-t border-white/20 my-2"></div>
//                                 {isLoggedIn ? (<button
//                                         onClick={handleLogout}
//                                         className="block w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
//                                     >
//                                         Logout
//                                     </button>) : (<Link
//                                         to="/login"
//                                         className="block px-3 py-2 rounded-lg text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition"
//                                         onClick={handleMenuClick}
//                                     >
//                                         Login
//                                     </Link>)}
//                             </div>)}
//                     </div>
//                 </ul>
//
//                 {/* Mobile hamburger */}
//                 <button className="ml-auto md:hidden rounded-lg hover:bg-white/10 p-1"
//                         onClick={() => setShowMenu((v) => !v)}>
//                     {showMenu ? <XMarkIcon className="h-6 w-6 text-white"/> :
//                         <Bars3Icon className="h-6 w-6 text-white"/>}
//                 </button>
//             </div>
//
//             {/* Mobile menu */}
//             {showMenu && (<div className="md:hidden px-4 pb-4 glass rounded-t-3xl mx-2">
//                     <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center gap-2 flex-1">
//                             <input
//                                 type="text"
//                                 placeholder="Search..."
//                                 className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/60 focus:outline-none"
//                             />
//                             <button className="btn-ghost p-2">
//                                 <MagnifyingGlassIcon className="h-5 w-5"/>
//                             </button>
//                         </div>
//                     </div>
//
//                     <ul className="flex flex-col gap-2">
//                         <Link to="/" className="text-white/90 hover:text-white link-underline"
//                               onClick={handleMenuClick}>
//                             Home
//                         </Link>
//                         <Link to="/products" className="text-white/90 hover:text-white link-underline"
//                               onClick={handleMenuClick}>
//                             Products
//                         </Link>
//                         <Link to="/cart" className="text-white/90 hover:text-white link-underline"
//                               onClick={handleMenuClick}>
//                             Cart
//                         </Link>
//
//                         <Link to={"/categories"} className="text-white/90 hover:text-white link-underline"
//                               onClick={handleMenuClick}>
//                             Categories
//                         </Link>
//                         <p className="bg-black h-2 text-white ">---</p>
//                         <Link to="/profile" className="text-white/90 hover:text-white link-underline"
//                               onClick={handleMenuClick}>
//                             My Account
//                         </Link>
//                         <Link to="/orders" className="text-white/90 hover:text-white link-underline"
//                               onClick={handleMenuClick}>
//                             Orders
//                         </Link>
//                         <Link to="/about" className="text-white/90 hover:text-white link-underline"
//                               onClick={handleMenuClick}>
//                             About Us
//                         </Link>
//                         {isLoggedIn ? (
//                             <button onClick={handleLogout} className="text-white/90 hover:text-red-100 transition">
//                                 Logout
//                             </button>) : (
//                             <Link to="/login" className="text-white/90 hover:text-white" onClick={handleMenuClick}>
//                                 Login
//                             </Link>)}
//                     </ul>
//                 </div>)}
//         </nav>);
// }

import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    Bars3Icon, ChevronDownIcon, MagnifyingGlassIcon, ShoppingCartIcon, UserCircleIcon, XMarkIcon,
} from "@heroicons/react/24/outline";
import {MoonIcon, SunIcon} from "@heroicons/react/24/solid";
import {useCart} from "../context/CartContext";
import SearchBar from "./SearchBar";

// Mobile Search Component
const MobileSearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query.trim())}`);
            onSearch();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-xl blur opacity-50"></div>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="relative w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                />
            </div>
            <button
                onClick={handleSearch}
                className="p-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white transition-all duration-300 hover:scale-105 shadow-lg"
            >
                <MagnifyingGlassIcon className="h-5 w-5"/>
            </button>
        </div>
    );
};

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [catsOpen, setCatsOpen] = useState(false);
    const [theme, setTheme] = useState("light");
    const [scrolled, setScrolled] = useState(false);
    const catsTimerRef = useRef(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const {getTotalItems} = useCart();

    useEffect(() => {
        const loggedIn = localStorage?.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);

        // Listen for auth changes
        const handleAuthChange = () => {
            const newLoggedIn = localStorage?.getItem("isLoggedIn") === "true";
            setIsLoggedIn(newLoggedIn);
        };

        window.addEventListener("auth:changed", handleAuthChange);
        return () => window.removeEventListener("auth:changed", handleAuthChange);
    }, []);

    // Load + apply theme on mount
    useEffect(() => {
        const saved = localStorage?.getItem("theme") || "light";
        setTheme(saved);
        document.documentElement.setAttribute("data-theme", saved);
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle clicks outside the user menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "light";
        setTheme(next);
        localStorage?.setItem("theme", next);
        document.documentElement.setAttribute("data-theme", next);
    };

    const openCats = () => {
        if (catsTimerRef.current) clearTimeout(catsTimerRef.current);
        setCatsOpen(true);
    };

    const closeCats = () => {
        if (catsTimerRef.current) clearTimeout(catsTimerRef.current);
        catsTimerRef.current = setTimeout(() => setCatsOpen(false), 120);
    };

    const handleLogout = () => {
        localStorage?.clear();
        setIsLoggedIn(false);
        navigate("/login");
        window.location.reload();
    };

    const handleMenuClick = () => setShowMenu(false);

    const handleCategoryClick = (category) => {
        navigate(`/products?category=${encodeURIComponent(category)}`);
        setShowMenu(false);
    };

    const handleUserMenuEnter = () => {
        setShowMenu(true);
    };

    const handleUserMenuLeave = () => {
        setTimeout(() => setShowMenu(false), 150);
    };

    const categories = ["Electronics", "Fashion", "Home", "Books", "Toys"];

    return (<div className="fixed top-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-lg z-50">
            {/* Background glow effect */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-3xl opacity-50 pointer-events-none"></div>

            <nav
                className={`relative nav-glossy transition-all duration-500 ${scrolled ? 'backdrop-blur-xl bg-black/90 shadow-2xl border-b-2 border-purple-500/30' : 'backdrop-blur-lg bg-black/80 border-b border-white/10'}`}>
                {/* Inner glow */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-6">
                        {/* Enhanced Brand with glow */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                {/* Outer glow */}
                                <div
                                    className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
                                {/* Logo container */}
                                <div
                                    className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 shadow-2xl border border-white/20 overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                    <img
                                        src="/favicon.svg"
                                        alt="Logo"
                                        className="h-full w-full object-cover"
                                    />
                                    {/* Shine effect */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </div>
                            <div className="relative">
                                <span
                                    className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                                    E‑Shopping Zone
                                </span>
                                {/* Text glow */}
                                <div
                                    className="absolute inset-0 text-2xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent blur-sm opacity-30 scale-110">
                                    E‑Shopping Zone
                                </div>
                            </div>
                        </Link>

                        {/* Enhanced Search with glass effect */}
                        <div className="hidden md:flex flex-1 max-w-md mx-6">
                            <div className="relative w-full">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-blue-600/30 rounded-2xl blur-lg opacity-50"></div>
                                <div className="relative">
                                    <SearchBar/>
                                </div>
                            </div>
                        </div>


                        {/* Enhanced Desktop Navigation */}
                        <ul className="ml-auto hidden md:flex gap-5 items-center">
                            {[{to: '/', label: 'Home'}, {to: '/products', label: 'Products'}].map((item) => (<Link
                                    key={item.to}
                                    to={item.to}
                                    className="relative px-4 py-2 text-white/90 hover:text-white font-semibold transition-all duration-300 group"
                                >
                                    {item.label}
                                    <span
                                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>))}

                            {/* Enhanced Categories dropdown */}
                            <div className="relative" onMouseEnter={openCats} onMouseLeave={closeCats}>
                                <button
                                    className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white font-semibold transition-all duration-300 group">
                                    Categories
                                    <ChevronDownIcon
                                        className={`w-4 h-4 transition-transform duration-300 ${catsOpen ? 'rotate-180' : ''}`}/>
                                    <span
                                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>

                                {catsOpen && (<div
                                        className="absolute right-0 mt-6 w-64 backdrop-blur-xl bg-black/95 border-2 border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden z-50">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10"></div>
                                        <div className="relative p-3">
                                            {categories.map((cat, index) => (<button
                                                    key={cat}
                                                    onClick={() => handleCategoryClick(cat)}
                                                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:via-pink-600/20 hover:to-blue-600/20 transition-all duration-300 group"
                                                    style={{animationDelay: `${index * 75}ms`}}
                                                >
                                                    <span className="font-medium">{cat}</span>
                                                    <svg
                                                        className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                    </svg>
                                                </button>))}
                                        </div>
                                    </div>)}
                            </div>

                            {/* Enhanced Theme toggle */}
                            {/*<button*/}
                            {/*    aria-label="Toggle theme"*/}
                            {/*    onClick={toggleTheme}*/}
                            {/*    className="relative p-3 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"*/}
                            {/*    title={theme === "light" ? "Switch to dark" : "Switch to light"}*/}
                            {/*>*/}
                            {/*    <div*/}
                            {/*        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>*/}
                            {/*    {theme === "light" ? <SunIcon*/}
                            {/*            className="h-5 w-5 text-yellow-400 relative z-10 group-hover:rotate-45 transition-transform duration-300"/> :*/}
                            {/*        <MoonIcon*/}
                            {/*            className="h-5 w-5 text-blue-400 relative z-10 group-hover:scale-110 transition-transform duration-300"/>}*/}
                            {/*</button>*/}

                            {/* Enhanced Cart */}
                            <Link to="/cart" className="relative group">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <ShoppingCartIcon
                                        className="h-5 w-5 text-white/90 group-hover:text-white relative z-10 group-hover:scale-110 transition-transform duration-300"/>
                                    {getTotalItems() > 0 && (<span
                                            className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse border border-white/20">
                                            {getTotalItems()}
                                        </span>)}
                            </Link>

                            {/* Enhanced User menu */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setShowMenu(prev => !prev)}
                                    onMouseEnter={handleUserMenuEnter}
                                    className="flex items-center gap-2 p-3 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"
                                >
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <UserCircleIcon
                                        className="h-6 w-6 text-white/90 group-hover:text-white relative z-10 group-hover:scale-110 transition-transform duration-300"/>
                                    <ChevronDownIcon
                                        className={`w-3 h-3 text-white/70 transition-transform duration-300 relative z-10 ${showMenu ? 'rotate-180' : ''}`}/>
                                </button>

                                {showMenu && (<div
                                        onMouseEnter={handleUserMenuEnter}
                                        onMouseLeave={handleUserMenuLeave}
                                        className="absolute right-0 mt-4 w-72 backdrop-blur-xl bg-black/95 border-2 border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden z-50"
                                    >
                                        <div
                                            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10"></div>
                                        <div className="relative p-3">
                                            {[{to: '/profile', label: 'My Account', icon: '👤'}, {
                                                to: '/orders',
                                                label: 'Orders',
                                                icon: '📦'
                                            }, {to: '/about', label: 'About Us', icon: 'ℹ️'},].map((item) => (<Link
                                                    key={item.to}
                                                    to={item.to}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:via-pink-600/20 hover:to-blue-600/20 transition-all duration-300 group"
                                                    onClick={handleMenuClick}
                                                >
                                                    <span className="text-lg">{item.icon}</span>
                                                    <span className="font-medium">{item.label}</span>
                                                    <svg
                                                        className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                    </svg>
                                                </Link>))}

                                            <div className="border-t border-white/10 my-3"></div>

                                            {isLoggedIn ? (<button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-300 group"
                                                >
                                                    <span className="text-lg">🚪</span>
                                                    <span className="font-medium">Logout</span>
                                                </button>) : (<Link
                                                    to="/login"
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-all duration-300 group"
                                                    onClick={handleMenuClick}
                                                >
                                                    <span className="text-lg">🔐</span>
                                                    <span className="font-medium">Login</span>
                                                </Link>)}
                                        </div>
                                    </div>)}
                            </div>
                        </ul>

                        {/* Enhanced Mobile hamburger */}
                        <button
                            className="ml-auto md:hidden p-3 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"
                            onClick={() => setShowMenu((v) => !v)}
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {showMenu ? <XMarkIcon
                                    className="h-6 w-6 text-white relative z-10 group-hover:rotate-90 transition-transform duration-300"/> :
                                <Bars3Icon
                                    className="h-6 w-6 text-white relative z-10 group-hover:scale-110 transition-transform duration-300"/>}
                        </button>
                    </div>
                </div>

                {/* Enhanced Mobile menu */}
                {showMenu && (<div
                        className="md:hidden mx-4 mb-4 backdrop-blur-xl bg-black/95 border-2 border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10"></div>
                        <div className="relative p-4">
                            {/* Enhanced Mobile search */}
                            <MobileSearchBar onSearch={() => setShowMenu(false)} />

                            {/* Mobile navigation links with enhanced styling */}
                            <div className="space-y-2">
                                {[{to: '/', label: 'Home', icon: '🏠'}, {
                                    to: '/products',
                                    label: 'Products',
                                    icon: '🛍️'
                                }, {to: '/cart', label: 'Cart', icon: '🛒'}, {
                                    to: '/categories',
                                    label: 'Categories',
                                    icon: '📂'
                                },].map((item, index) => (<Link
                                        key={item.to}
                                        to={item.to}
                                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:via-pink-600/20 hover:to-blue-600/20 transition-all duration-300 group"
                                        onClick={handleMenuClick}
                                        style={{animationDelay: `${index * 50}ms`}}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="font-medium flex-1">{item.label}</span>
                                        <svg
                                            className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </Link>))}

                                <div className="border-t border-white/10 my-4"></div>

                                {[{to: '/profile', label: 'My Account', icon: '👤'}, {
                                    to: '/orders',
                                    label: 'Orders',
                                    icon: '📦'
                                }, {to: '/about', label: 'About Us', icon: 'ℹ️'},].map((item, index) => (<Link
                                        key={item.to}
                                        to={item.to}
                                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:via-pink-600/20 hover:to-blue-600/20 transition-all duration-300 group"
                                        onClick={handleMenuClick}
                                        style={{animationDelay: `${(index + 4) * 50}ms`}}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="font-medium flex-1">{item.label}</span>
                                        <svg
                                            className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </Link>))}

                                {isLoggedIn ? (<button
                                        onClick={handleLogout}
                                        className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-300 group"
                                    >
                                        <span className="text-xl">🚪</span>
                                        <span className="font-medium flex-1">Logout</span>
                                    </button>) : (<Link
                                        to="/login"
                                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-all duration-300 group"
                                        onClick={handleMenuClick}
                                    >
                                        <span className="text-xl">🔐</span>
                                        <span className="font-medium flex-1">Login</span>
                                    </Link>)}
                            </div>
                        </div>
                    </div>)}
            </nav>
        </div>);
}