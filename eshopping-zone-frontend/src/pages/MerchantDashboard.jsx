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
            <div className="max-w-6xl mx-auto p-4 mt-16">
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="h-28 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-28 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-28 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    if (err) {
        return (
            <div className="max-w-6xl mx-auto p-4 mt-16">
                <div className="p-3 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-700 rounded">
                    {err}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 mt-16 text-gray-900 dark:text-gray-100">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Merchant Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as {email}</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">My Products</p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{products.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Orders Received</p>
                    <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">{orders.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
                    <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">₹{totalSales.toFixed(2)}</p>
                </div>
            </div>

            {/* Product list */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold">My Products</h2>
                    <button
                        onClick={load}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Refresh
                    </button>
                </div>
                {products.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No products found.</p>
                ) : (
                    <div className="grid md:grid-cols-3 gap-4">
                        {products.map((p) => (
                            <div key={p.productId} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
                                <img
                                    src={p.image}
                                    alt={p.productName}
                                    className="w-full h-40 object-cover rounded mb-3"
                                />
                                <div className="font-semibold">{p.productName}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{p.description}</div>
                                <div className="mt-1 text-sm">
                                    <span className="font-semibold">₹{p.price}</span>
                                    <span className="ml-2 text-green-700 dark:text-green-400">{p.discount}% off</span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Stock: {p.stock}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Orders list */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Latest Orders</h2>
                {orders.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No orders yet.</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {orders
                            .slice()
                            .sort((a, b) => Number((b.orderId ?? b.id) || 0) - Number((a.orderId ?? a.id) || 0))
                            .slice(0, 8)
                            .map((o) => {
                                const id = o.orderId ?? o.id;
                                const status = o.orderStatus ?? o.status ?? "";
                                const amount = o.amountPaid ?? o.total ?? "—";
                                const date = o.orderDate ?? o.date ?? "—";
                                return (
                                    <div key={id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium">Order #{id}</div>
                                            <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                                {status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            <div>Date: {date}</div>
                                            <div>Amount: ₹{String(amount)}</div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
}
