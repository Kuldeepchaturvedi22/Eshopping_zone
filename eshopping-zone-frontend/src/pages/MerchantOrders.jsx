import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchOrdersByMerchantEmail, changeOrderStatus as changeOrderStatusApi } from "../api/order";
import { getAuthToken } from "../api/_auth";

const STATUS_OPTIONS = ["ALL","CANCELLED", "SHIPPED", "DELIVERED", "PENDING", "FAILED", "PLACED"];

const normalize = (s) => String(s ?? "").toLowerCase();
const getOrderId = (o) => o?.orderId ?? o?.id ?? "";
const getOrderStatus = (o) => o?.orderStatus ?? o?.status ?? "";
const filterOrders = (orders, statusFilter, query) => {
    const qn = normalize(query);
    return orders
        .filter((o) => {
            const id = String(getOrderId(o));
            const status = String(getOrderStatus(o));
            const matchesStatus = statusFilter === "ALL" || status === statusFilter;
            const matchesQuery = !query || id.includes(query) || normalize(status).includes(qn);
            return matchesStatus && matchesQuery;
        })
        .sort((a, b) => Number(getOrderId(b) || 0) - Number(getOrderId(a) || 0));
};

function MerchantOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [query, setQuery] = useState("");

    const token = getAuthToken();
    const email = localStorage.getItem("email") || "";

    const loadOrders = useCallback(async () => {
        setLoading(true);
        setErrorMsg("");
        try {
            const data = await fetchOrdersByMerchantEmail(email, token);
            setOrders(Array.isArray(data) ? data : []);
        } catch (e) {
            setErrorMsg(e?.message || "Error loading orders");
        } finally {
            setLoading(false);
        }
    }, [email, token]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const filtered = useMemo(() => filterOrders(orders, statusFilter, query), [orders, statusFilter, query]);

    const handleChangeStatus = useCallback(
        async (orderId, newStatus) => {
            if (!newStatus) return;
            const yes = window.confirm(`Change status of order #${orderId} to ${newStatus}?`);
            if (!yes) return;
            try {
                await changeOrderStatusApi(orderId, newStatus, token);
                await loadOrders();
            } catch (e) {
                alert(e?.message || "Failed to update status");
            }
        },
        [token, loadOrders]
    );

    return (
        <div className="max-w-6xl mx-auto p-4 mt-16 text-gray-200 bg-gray-900 min-h-screen">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Orders for {email}</h2>
                <div className="flex gap-2">
                    <button onClick={loadOrders} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Refresh
                    </button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 mb-4">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by Order ID or status…"
                    className="px-3 py-2 border border-gray-700 rounded w-full md:w-64 bg-gray-800 text-white placeholder-gray-400"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-700 rounded w-full md:w-48 bg-gray-800 text-white"
                >
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-gray-800 text-white">
                            {s === "ALL" ? "All" : s}
                        </option>
                    ))}
                </select>
            </div>
            {loading ? (
                <div className="space-y-3">
                    <div className="h-24 bg-gray-700 rounded animate-pulse" />
                    <div className="h-24 bg-gray-700 rounded animate-pulse" />
                    <div className="h-24 bg-gray-700 rounded animate-pulse" />
                </div>
            ) : errorMsg ? (
                <div className="p-3 bg-red-900 text-red-200 border border-red-700 rounded">{errorMsg}</div>
            ) : filtered.length === 0 ? (
                <p className="text-gray-400">No orders found.</p>
            ) : (
                <ul className="grid md:grid-cols-2 gap-4">
                    {filtered.map((o) => {
                        const id = getOrderId(o);
                        const status = getOrderStatus(o);
                        const amount = o.amountPaid ?? o.total ?? o.amount ?? "—";
                        return (
                            <li key={id} className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-md hover:shadow-lg transition">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="font-semibold text-white">Order #{id}</div>
                                        <div className="text-sm text-gray-400">
                                            Status:{" "}
                                            <span className="px-2 py-0.5 text-xs rounded bg-gray-700 text-gray-300">{status}</span>
                                        </div>
                                        <div className="text-sm text-gray-300 mt-1">Amount: ₹{String(amount)}</div>
                                    </div>
                                    <div className="text-right">
                                        <label className="text-sm text-gray-400">
                                            Update status:
                                            <select
                                                defaultValue=""
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    e.currentTarget.value = "";
                                                    if (!val) return;
                                                    handleChangeStatus(id, val);
                                                }}
                                                className="ml-2 border border-gray-600 rounded px-2 py-1 text-sm bg-gray-700 text-white"
                                            >
                                                <option value="">Select</option>
                                                <option value="PENDING">PENDING</option>
                                                <option value="SHIPPED">SHIPPED</option>
                                                <option value="DELIVERED">DELIVERED</option>
                                                <option value="CANCELLED">CANCELLED</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );

}

export default MerchantOrders;