// import React, {useEffect, useState} from "react";
// import {fetchAllProducts} from "../api/admin";
// import {fetchLatestOrders} from "../api/order";
// import {useNavigate} from "react-router-dom";
//
// export default function AdminDashboard() {
//     const [products, setProducts] = useState([]);
//     const [latestOrders, setLatestOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [err, setErr] = useState("");
//     const navigate = useNavigate();
//
//     const token = localStorage.getItem("token");
//
//     const load = async () => {
//         setLoading(true);
//         setErr("");
//         try {
//             const [prod, orders] = await Promise.all([fetchAllProducts(token), fetchLatestOrders(token).catch(() => []), // tolerate if endpoint not available
//             ]);
//             setProducts(Array.isArray(prod) ? prod : []);
//             setLatestOrders(Array.isArray(orders) ? orders : []);
//         } catch (e) {
//             setErr(e?.message || "Failed to load dashboard data");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         load();
//     }, []);
//
//     const totalProducts = products.length;
//     const lowStockCount = products.filter((p) => Number(p.stock ?? 0) < 5).length;
//     const avgDiscount = products.length > 0 ? Math.round((products.reduce((s, p) => s + Number(p.discount ?? 0), 0) / products.length) * 10) / 10 : 0;
//
//     return (<div className="flex min-h-screen">
//
//
//             <main className="flex-1 p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
//                 <div className="flex items-center justify-between mb-6">
//                     <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
//                     <div className="flex gap-3">
//                         <button
//                             onClick={load}
//                             className="px-4 py-2 bg-white rounded shadow hover:shadow-md"
//                         >
//                             Refresh
//                         </button>
//                         <button
//                             onClick={() => navigate("/admin/products")}
//                             className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
//                         >
//                             Manage Products
//                         </button>
//                     </div>
//                 </div>
//
//                 {loading ? (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="h-28 bg-white rounded-xl shadow animate-pulse"/>
//                         <div className="h-28 bg-white rounded-xl shadow animate-pulse"/>
//                         <div className="h-28 bg-white rounded-xl shadow animate-pulse"/>
//                     </div>) : err ? (<div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
//                         {err}
//                     </div>) : (<>
//                         {/* Stats */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                             <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
//                                 <p className="text-sm text-gray-500">Total Products</p>
//                                 <p className="text-3xl font-bold text-blue-700">{totalProducts}</p>
//                             </div>
//                             <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
//                                 <p className="text-sm text-gray-500">Low Stock (&lt; 5)</p>
//                                 <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
//                             </div>
//                             <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
//                                 <p className="text-sm text-gray-500">Average Discount</p>
//                                 <p className="text-3xl font-bold text-green-700">{avgDiscount}%</p>
//                             </div>
//                         </div>
//
//                         {/* Quick Actions */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                             <button
//                                 onClick={() => navigate("/admin/products")}
//                                 className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow hover:shadow-lg text-left"
//                             >
//                                 <p className="text-xl font-semibold mb-1">Add / Edit Products</p>
//                                 <p className="text-sm text-blue-100">
//                                     Create, update and organize your catalog
//                                 </p>
//                             </button>
//                             <button
//                                 onClick={() => navigate("/admin/order")}
//                                 className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-xl shadow hover:shadow-lg text-left"
//                             >
//                                 <p className="text-xl font-semibold mb-1">Orders</p>
//                                 <p className="text-sm text-emerald-100">
//                                     Review and manage customer orders
//                                 </p>
//                             </button>
//                             <button
//                                 onClick={() => navigate("/categories")}
//                                 className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl shadow hover:shadow-lg text-left"
//                             >
//                                 <p className="text-xl font-semibold mb-1">Browse Store</p>
//                                 <p className="text-sm text-pink-100">
//                                     Quickly jump into the storefront
//                                 </p>
//                             </button>
//                         </div>
//
//                         {/* Latest Orders */}
//                         <div className="bg-white p-6 rounded-xl shadow">
//                             <div className="flex items-center justify-between mb-3">
//                                 <h2 className="text-xl font-semibold text-gray-800">
//                                     Latest Orders
//                                 </h2>
//                                 <button
//                                     className="text-sm text-blue-600 hover:underline"
//                                     onClick={() => navigate("/admin/order")}
//                                 >
//                                     View all
//                                 </button>
//                             </div>
//                             {latestOrders.length === 0 ? (<p className="text-gray-500">No recent orders.</p>) : (
//                                 <div className="divide-y">
//                                     {latestOrders.slice(0, 8).map((o) => {
//                                         const id = o.orderId ?? o.id ?? "-";
//                                         const status = o.orderStatus ?? o.status ?? "—";
//                                         const amount = o.amountPaid ?? o.total ?? o.amount ?? "—";
//                                         const date = o.orderDate ?? o.date ?? "—";
//                                         return (<div key={id} className="py-3 flex items-center justify-between">
//                                                 <div>
//                                                     <p className="font-medium text-gray-800">Order #{id}</p>
//                                                     <p className="text-xs text-gray-500">{date}</p>
//                                                 </div>
//                                                 <div className="flex items-center gap-6">
//                           <span className="text-sm text-gray-700">
//                             ₹{String(amount)}
//                           </span>
//                                                     <span
//                                                         className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
//                             {status}
//                           </span>
//                                                 </div>
//                                             </div>);
//                                     })}
//                                 </div>)}
//                         </div>
//                     </>)}
//             </main>
//         </div>);
// }

import React, {useEffect, useState} from "react";
import {fetchAllProducts} from "../api/admin";
import {fetchLatestOrders} from "../api/order";
import {useNavigate} from "react-router-dom";

export default function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [latestOrders, setLatestOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const load = async () => {
        setLoading(true);
        setErr("");
        try {
            const [prod, orders] = await Promise.all([fetchAllProducts(token), fetchLatestOrders(token).catch(() => []), // tolerate if endpoint not available
            ]);
            setProducts(Array.isArray(prod) ? prod : []);
            setLatestOrders(Array.isArray(orders) ? orders : []);
        } catch (e) {
            setErr(e?.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const totalProducts = products.length;
    const lowStockCount = products.filter((p) => Number(p.stock ?? 0) < 5).length;
    const avgDiscount = products.length > 0 ? Math.round((products.reduce((s, p) => s + Number(p.discount ?? 0), 0) / products.length) * 10) / 10 : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage your store efficiently</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={load}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Refresh
                        </button>
                        <button
                            onClick={() => navigate("/admin/products")}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Manage Products
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="h-24 bg-white rounded-lg border animate-pulse"/>
                        <div className="h-24 bg-white rounded-lg border animate-pulse"/>
                        <div className="h-24 bg-white rounded-lg border animate-pulse"/>
                    </div>
                ) : err ? (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {err}
                    </div>
                ) : (<>
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg border hover:shadow-sm transition-shadow">
                                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                                <p className="text-2xl font-semibold text-gray-900">{totalProducts}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg border hover:shadow-sm transition-shadow">
                                <p className="text-sm text-gray-600 mb-1">Low Stock</p>
                                <p className="text-2xl font-semibold text-gray-900">{lowStockCount}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg border hover:shadow-sm transition-shadow">
                                <p className="text-sm text-gray-600 mb-1">Avg Discount</p>
                                <p className="text-2xl font-semibold text-gray-900">{avgDiscount}%</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <button
                                onClick={() => navigate("/admin/products")}
                                className="bg-white p-6 rounded-lg border hover:shadow-sm transition-shadow text-left group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-gray-900">Products</h3>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600">Manage your product catalog</p>
                            </button>
                            <button
                                onClick={() => navigate("/admin/order")}
                                className="bg-white p-6 rounded-lg border hover:shadow-sm transition-shadow text-left group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-gray-900">Orders</h3>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600">View and manage orders</p>
                            </button>
                            <button
                                onClick={() => navigate("/admin/users")}
                                className="bg-white p-6 rounded-lg border hover:shadow-sm transition-shadow text-left group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-gray-900">Users</h3>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600">Manage user accounts</p>
                            </button>
                        </div>

                        {/* Latest Orders */}
                        <div className="bg-white p-6 rounded-lg border">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                                <button
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    onClick={() => navigate("/admin/order")}
                                >
                                    View all →
                                </button>
                            </div>
                            {latestOrders.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No recent orders</p>
                            ) : (
                                <div className="space-y-3">
                                    {latestOrders.slice(0, 5).map((o) => {
                                        const id = o.orderId ?? o.id ?? "-";
                                        const status = o.orderStatus ?? o.status ?? "—";
                                        const amount = o.amountPaid ?? o.total ?? o.amount ?? "—";
                                        const date = o.orderDate ?? o.date ?? "—";
                                        return (
                                            <div key={id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                                <div>
                                                    <p className="font-medium text-gray-900">#{id}</p>
                                                    <p className="text-sm text-gray-500">{date}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-medium text-gray-900">₹{String(amount)}</span>
                                                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                                        {status}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>)}
            </div>
        </div>
    );
}
