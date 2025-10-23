// import React, { useEffect, useMemo, useState } from "react";
// import { fetchProductsByMerchantEmail } from "../api/merchant";
// import { fetchOrdersByMerchantEmail } from "../api/order";
// import { getAuthToken } from "../api/_auth";
//
// export default function MerchantDashboard() {
//     const email = localStorage.getItem("email") || "";
//     const token = getAuthToken();
//
//     const [products, setProducts] = useState([]);
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [err, setErr] = useState("");
//
//     const totalSales = useMemo(() => {
//         return orders.reduce((s, o) => s + Number(o.amountPaid ?? o.total ?? 0), 0);
//     }, [orders]);
//
//     const load = async () => {
//         setLoading(true);
//         setErr("");
//         try {
//             const [prods, ords] = await Promise.all([
//                 fetchProductsByMerchantEmail(email, token),
//                 fetchOrdersByMerchantEmail(email, token),
//             ]);
//             setProducts(Array.isArray(prods) ? prods : []);
//             setOrders(Array.isArray(ords) ? ords : []);
//         } catch (e) {
//             setErr(e?.message || "Failed to load dashboard");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         load();
//     }, []);
//
//     if (loading) {
//         return (
//             <div className="max-w-6xl mx-auto p-4 mt-16">
//                 <div className="grid md:grid-cols-3 gap-4">
//                     <div className="h-28 bg-gray-100 rounded animate-pulse" />
//                     <div className="h-28 bg-gray-100 rounded animate-pulse" />
//                     <div className="h-28 bg-gray-100 rounded animate-pulse" />
//                 </div>
//             </div>
//         );
//     }
//
//     if (err) {
//         return (
//             <div className="max-w-6xl mx-auto p-4 mt-16">
//                 <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">
//                     {err}
//                 </div>
//             </div>
//         );
//     }
//
//     return (
//         <div className="max-w-6xl mx-auto p-4 mt-16">
//             {/* Header */}
//             <div className="mb-6">
//                 <h1 className="text-2xl font-bold">Merchant Dashboard</h1>
//                 <p className="text-sm text-gray-600">Signed in as {email}</p>
//             </div>
//
//             {/* KPIs */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                 <div className="bg-white rounded-xl shadow p-5">
//                     <p className="text-sm text-gray-500">My Products</p>
//                     <p className="text-3xl font-bold text-blue-700">{products.length}</p>
//                 </div>
//                 <div className="bg-white rounded-xl shadow p-5">
//                     <p className="text-sm text-gray-500">Orders Received</p>
//                     <p className="text-3xl font-bold text-indigo-700">{orders.length}</p>
//                 </div>
//                 <div className="bg-white rounded-xl shadow p-5">
//                     <p className="text-sm text-gray-500">Total Sales</p>
//                     <p className="text-3xl font-bold text-emerald-700">₹{totalSales.toFixed(2)}</p>
//                 </div>
//             </div>
//
//             {/* Product list */}
//             <div className="mb-8">
//                 <div className="flex items-center justify-between mb-3">
//                     <h2 className="text-xl font-semibold">My Products</h2>
//                     <button
//                         onClick={load}
//                         className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     >
//                         Refresh
//                     </button>
//                 </div>
//                 {products.length === 0 ? (
//                     <p className="text-gray-500">No products found.</p>
//                 ) : (
//                     <div className="grid md:grid-cols-3 gap-4">
//                         {products.map((p) => (
//                             <div key={p.productId} className="bg-white rounded-xl shadow p-4">
//                                 <img
//                                     src={p.image}
//                                     alt={p.productName}
//                                     className="w-full h-40 object-cover rounded mb-3"
//                                 />
//                                 <div className="font-semibold">{p.productName}</div>
//                                 <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>
//                                 <div className="mt-1 text-sm">
//                                     <span className="font-semibold">₹{p.price}</span>
//                                     <span className="ml-2 text-green-700">{p.discount}% off</span>
//                                 </div>
//                                 <div className="text-xs text-gray-500">Stock: {p.stock}</div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//
//             {/* Orders list */}
//             <div className="mb-8">
//                 <h2 className="text-xl font-semibold mb-3">Latest Orders</h2>
//                 {orders.length === 0 ? (
//                     <p className="text-gray-500">No orders yet.</p>
//                 ) : (
//                     <div className="grid md:grid-cols-2 gap-4">
//                         {orders
//                             .slice()
//                             .sort((a, b) => Number((b.orderId ?? b.id) || 0) - Number((a.orderId ?? a.id) || 0))
//                             .slice(0, 8)
//                             .map((o) => {
//                                 const id = o.orderId ?? o.id;
//                                 const status = o.orderStatus ?? o.status ?? "";
//                                 const amount = o.amountPaid ?? o.total ?? "—";
//                                 const date = o.orderDate ?? o.date ?? "—";
//                                 return (
//                                     <div key={id} className="bg-white rounded-xl shadow p-4">
//                                         <div className="flex items-center justify-between">
//                                             <div className="font-medium">Order #{id}</div>
//                                             <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
//                                                 {status}
//                                             </span>
//                                         </div>
//                                         <div className="text-sm text-gray-600 mt-1">
//                                             <div>Date: {date}</div>
//                                             <div>Amount: ₹{String(amount)}</div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

import React, { useEffect, useMemo, useState } from "react";
import { fetchProductsByMerchantEmail } from "../api/merchant";
import { fetchOrdersByMerchantEmail } from "../api/order";
import { getAuthToken } from "../api/_auth";

export default function MerchantDashboard() {
    const email = localStorage.getItem("email") || "";
    const token = getAuthToken();

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const totalSales = useMemo(() => {
        return orders.reduce((s, o) => s + Number(o.amountPaid ?? o.total ?? 0), 0);
    }, [orders]);

    const load = async () => {
        setLoading(true);
        setErr("");
        try {
            const [prods, ords] = await Promise.all([
                fetchProductsByMerchantEmail(email, token),
                fetchOrdersByMerchantEmail(email, token),
            ]);
            setProducts(Array.isArray(prods) ? prods : []);
            setOrders(Array.isArray(ords) ? ords : []);
        } catch (e) {
            setErr(e?.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 animate-pulse"/>
                        <div className="h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 animate-pulse"/>
                        <div className="h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 animate-pulse"/>
                    </div>
                </div>
            </div>
        );
    }

    if (err) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg backdrop-blur-sm">
                        {err}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 blur-3xl opacity-50 pointer-events-none"></div>
            
            <div className="relative max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Merchant Dashboard</h1>
                        <p className="text-gray-300 mt-1">Welcome back, {email}</p>
                    </div>
                    <button
                        onClick={load}
                        className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
                    >
                        Refresh
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50 hover:border-purple-400/50 transition-all duration-300 shadow-2xl">
                        <p className="text-sm text-gray-400 mb-1">My Products</p>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{products.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50 hover:border-blue-400/50 transition-all duration-300 shadow-2xl">
                        <p className="text-sm text-gray-400 mb-1">Orders Received</p>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{orders.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50 hover:border-green-400/50 transition-all duration-300 shadow-2xl">
                        <p className="text-sm text-gray-400 mb-1">Total Sales</p>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">₹{totalSales.toFixed(2)}</p>
                    </div>
                </div>

                {/* Products */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-6">My Products</h2>
                    {products.length === 0 ? (
                        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/50 text-center">
                            <p className="text-gray-400">No products found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((p) => (
                                <div key={p.productId} className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl border border-gray-700/50 hover:border-purple-400/50 transition-all duration-300 shadow-2xl hover:scale-105 overflow-hidden">
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={p.image}
                                            alt={p.productName}
                                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {p.discount > 0 && (
                                            <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black text-sm font-bold px-3 py-1 rounded-full">
                                                {p.discount}% OFF
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{p.productName}</h3>
                                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{p.description}</p>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">₹{p.price}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">Stock: {p.stock}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Orders */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50 shadow-2xl">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-6">Recent Orders</h2>
                    {orders.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No orders yet</p>
                    ) : (
                        <div className="space-y-3">
                            {orders
                                .slice()
                                .sort((a, b) => Number((b.orderId ?? b.id) || 0) - Number((a.orderId ?? a.id) || 0))
                                .slice(0, 6)
                                .map((o) => {
                                    const id = o.orderId ?? o.id;
                                    const status = o.orderStatus ?? o.status ?? "";
                                    const amount = o.amountPaid ?? o.total ?? "—";
                                    const date = o.orderDate ?? o.date ?? "—";
                                    return (
                                        <div key={id} className="flex items-center justify-between py-3 border-b border-gray-700/30 last:border-0">
                                            <div>
                                                <p className="font-medium text-white">#{id}</p>
                                                <p className="text-sm text-gray-400">{date}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">₹{String(amount)}</span>
                                                <span className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-400/30">
                                                    {status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
