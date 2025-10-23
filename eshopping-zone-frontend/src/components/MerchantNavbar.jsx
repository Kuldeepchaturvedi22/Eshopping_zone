// import { Link, useNavigate } from "react-router-dom";
// import React from "react";
//
// export default function MerchantNavbar() {
//     const navigate = useNavigate();
//
//     const logout = () => {
//         // Clear auth data and notify app to update role-aware UI
//         ["token", "jwt", "jwtToken", "role"].forEach((k) => {
//             localStorage.removeItem(k);
//             sessionStorage.removeItem(k);
//         });
//         window.dispatchEvent(new Event("auth:role-changed"));
//         navigate("/login");
//     };
//
//     return (
//     <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
//         <h1 className="text-xl text-blue-500 font-bold">Merchant Panel</h1>
//         <div className="flex gap-6 items-center">
//             <ul className="text-white p-4 flex gap-6 justify-between items-center font-medium">
//                 <Link to="/merchant" className="hover:text-blue-400">Dashboard</Link>
//                 <li
//                     className="hover:text-yellow-300 cursor-pointer"
//                     onClick={() => navigate("/merchant/products")}
//                 >
//                     Products
//                 </li>
//                 <li
//                     className="hover:text-yellow-300 cursor-pointer"
//                     onClick={() => navigate("/profile")}
//                 >
//                     Profile
//                 </li>
//                 <li
//                     className="hover:text-yellow-300 cursor-pointer"
//                     onClick={() => navigate("/merchant/orders")}
//                 >
//                     Orders
//                 </li>
//                 <li
//                     className="hover:text-yellow-300 cursor-pointer"
//                     onClick={() => navigate("/merchant/notifications")}
//                 >
//                     Notifications
//                 </li>
//                 <button onClick={logout} style={{ marginLeft: "auto" }}>Logout</button>
//             </ul>
//         </div>
//     </nav>
//     );
// }

import { Link, useNavigate } from "react-router-dom";
import React from "react";

export default function MerchantNavbar() {
    const navigate = useNavigate();

    const logout = () => {
        ["token", "jwt", "jwtToken", "role"].forEach((k) => {
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
        });
        window.dispatchEvent(new Event("auth:role-changed"));
        navigate("/login");
    };

    return (
        <nav className="bg-gray-900/95 backdrop-blur border-b border-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
            {/* Logo / Brand */}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                Merchant Panel
            </h1>

            {/* Nav Links */}
            <ul className="flex gap-6 items-center font-medium">
                <Link to="/merchant" className="hover:text-cyan-400 transition-colors duration-200">
                    Dashboard
                </Link>
                <li
                    className="hover:text-yellow-300 cursor-pointer transition-colors duration-200"
                    onClick={() => navigate("/merchant/products")}
                >
                    Products
                </li>
                <li
                    className="hover:text-yellow-300 cursor-pointer transition-colors duration-200"
                    onClick={() => navigate("/profile")}
                >
                    Profile
                </li>
                <li
                    className="hover:text-yellow-300 cursor-pointer transition-colors duration-200"
                    onClick={() => navigate("/merchant/orders")}
                >
                    Orders
                </li>
                <li
                    className="hover:text-yellow-300 cursor-pointer transition-colors duration-200"
                    onClick={() => navigate("/merchant/notifications")}
                >
                    Notifications
                </li>
            </ul>

            {/* Logout Button */}
            <button
                onClick={logout}
                className="ml-6 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300"
            >
                Logout
            </button>
        </nav>
    );
}
