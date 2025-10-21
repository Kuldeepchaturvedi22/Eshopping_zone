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
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <div className="flex gap-6 items-center">
                <Link to="/admin" className="hover:text-blue-400">Dashboard</Link>
                <Link to="/admin/products" className="hover:text-blue-400">Products</Link>
                <Link to="/admin/orders" className="hover:text-blue-400">Orders</Link>
                {token ? (
                    <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
                ) : (
                    <Link to="/login" className="hover:text-green-400">Login</Link>
                )}
            </div>
        </nav>
    );
}