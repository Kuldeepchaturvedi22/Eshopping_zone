// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { getAuthToken } from "../api/_auth";
//
// export default function AdminNavbar() {
//     const navigate = useNavigate();
//     const token = getAuthToken();
//
//     const handleLogout = () => {
//         localStorage.clear();
//         window.dispatchEvent(new Event("auth:changed"));
//         window.dispatchEvent(new Event("auth:role-changed"));
//         navigate("/login");
//     };
//
//     return (
//         <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
//             <h1 className="text-xl text-blue-500 font-bold">Admin Panel</h1>
//             <div className="flex gap-6 items-center">
//                 <ul className="text-white p-4 flex gap-6 justify-between items-center font-medium">
//                     <Link to="/admin" className="hover:text-blue-400">Dashboard</Link>
//                     <li
//                         className="hover:text-yellow-300 cursor-pointer"
//                         onClick={() => navigate("/admin/products")}
//                     >
//                         Products
//                     </li>
//                     <li
//                         className="hover:text-yellow-300 cursor-pointer"
//                         onClick={() => navigate("/admin/users")}
//                     >
//                         Users
//                     </li>
//                     <li
//                         className="hover:text-yellow-300 cursor-pointer"
//                         onClick={() => navigate("/admin/settings")}
//                     >
//                         Settings
//                     </li>
//                     <li
//                         className="hover:text-yellow-300 cursor-pointer"
//                         onClick={() => navigate("/admin/order")}
//                     >
//                         Orders
//                     </li>
//
//                 {token ? (
//                     <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
//                 ) : (
//                     <Link to="/login" className="hover:text-green-400">Login</Link>
//                 )}
//                 </ul>
//             </div>
//         </nav>
//     );
// }

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthToken } from "../api/_auth";

export default function AdminNavbar() {
    const navigate = useNavigate();
    const token = getAuthToken();

    const handleLogout = () => {
        localStorage.clear();
        window.dispatchEvent(new Event("auth:changed"));
        window.dispatchEvent(new Event("auth:role-changed"));
        navigate("/login");
    };

    return (
        <nav className="bg-gray-900/95 backdrop-blur border-b border-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
            {/* Logo / Brand */}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                Admin Panel
            </h1>

            {/* Nav Links */}
            <ul className="flex gap-6 items-center font-medium">
                <Link to="/admin" className="hover:text-cyan-400 transition-colors duration-200">
                    Dashboard
                </Link>
                <li
                    className="hover:text-yellow-300 cursor-pointer transition-colors duration-200"
                    onClick={() => navigate("/admin/products")}
                >
                    Products
                </li>
                <li
                    className="hover:text-yellow-300 cursor-pointer transition-colors duration-200"
                    onClick={() => navigate("/admin/users")}
                >
                    Users
                </li>
                <li
                    className="hover:text-yellow-300 cursor-pointer transition-colors duration-200"
                    onClick={() => navigate("/admin/settings")}
                >
                    Settings
                </li>
                <li
                    className="hover:text-yellow-300 cursor-pointer transition-colors duration-200"
                    onClick={() => navigate("/admin/order")}
                >
                    Orders
                </li>

                {token ? (
                    <button
                        onClick={handleLogout}
                        className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                    >
                        Login
                    </Link>
                )}
            </ul>
        </nav>
    );
}
