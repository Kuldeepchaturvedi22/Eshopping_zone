import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchOrdersByCustomer,
    fetchOrderById,
} from "../api/order";
import { motion, AnimatePresence } from "framer-motion";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [fullOrderDetails, setFullOrderDetails] = useState({});
    const navigate = useNavigate();

    const fetchOrders = () => {
        const token = localStorage.getItem("token");
        const customerId = localStorage.getItem("customerId");

        if (!token || !customerId) {
            navigate("/login");
            return;
        }

        fetchOrdersByCustomer(customerId, token)
            .then((data) => setOrders(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Failed to fetch orders:", err));
    };

    const toggleDetails = async (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            const token = localStorage.getItem("token");
            try {
                const fullOrder = await fetchOrderById(orderId, token);
                setFullOrderDetails((prev) => ({ ...prev, [orderId]: fullOrder }));
                setExpandedOrderId(orderId);
            } catch (err) {
                console.error("Failed to fetch order details:", err);
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="max-w-6xl mx-auto mt-24 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
                My Orders
            </h1>

            <div className="text-right mb-6">
                <button
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Refresh Orders
                </button>
            </div>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500">You have no orders yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {orders.map((order) => (
                        <motion.div
                            key={order.orderId}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            layout
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">
                                        Order #{order.orderId}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Placed on {order.orderDate || "—"}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                    {order.orderStatus}
                                </span>
                            </div>

                            {/* Summary */}
                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mt-4">
                                <div><strong>Payment Mode:</strong> {order.modeOfPayment || "—"}</div>
                                <div><strong>Amount Paid:</strong> ₹{order.amountPaid ?? "—"}</div>
                                <div><strong>Txn Ref:</strong> {order.transactionId || order.paymentId || "—"}</div>
                                <div><strong>Items:</strong> {(order.items?.length) || (order.orderItems?.length) || "—"}</div>
                            </div>

                            {/* Expand for details */}
                            <button
                                onClick={() => toggleDetails(order.orderId)}
                                className="mt-3 text-blue-600 hover:underline text-sm"
                            >
                                {expandedOrderId === order.orderId ? "Hide Details" : "View Details"}
                            </button>

                            <AnimatePresence>
                                {expandedOrderId === order.orderId && (
                                    <motion.div
                                        className="mt-4"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <OrderDetails data={fullOrderDetails[order.orderId]} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

function OrderDetails({ data }) {
    if (!data) {
        return <div className="text-sm text-gray-500">Loading details…</div>;
    }

    const items = data.items || data.orderItems || [];
    const shipping = data.shippingAddress || data.address || data.deliveryAddress || {};
    const customer = data.customer || data.user || {};

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
                <section className="md:col-span-2">
                    <h4 className="font-semibold mb-2 text-gray-800">Items</h4>
                    {items.length === 0 ? (
                        <p className="text-gray-500">No items attached.</p>
                    ) : (
                        <ul className="divide-y">
                            {items.map((it, idx) => (
                                <li key={it.itemId || it.id || idx} className="py-2 flex justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">{it.name || it.itemName}</p>
                                        <p className="text-xs text-gray-500">{it.category || ""}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-800">₹{Number(it.price ?? 0)} x {Number(it.quantity ?? 1)}</p>
                                        {it.discount ? (
                                            <p className="text-xs text-green-700">{it.discount}% off</p>
                                        ) : null}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section>
                    <h4 className="font-semibold mb-2 text-gray-800">Shipping</h4>
                    {shipping && (shipping.street || shipping.city) ? (
                        <div className="text-gray-700">
                            <p>{shipping.street || "—"}</p>
                            <p>{[shipping.city, shipping.state, shipping.zipCode].filter(Boolean).join(", ")}</p>
                            <p>{shipping.country || ""}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">No shipping address found.</p>
                    )}

                    <h4 className="font-semibold mt-4 mb-1 text-gray-800">Customer</h4>
                    <p className="text-gray-700">{customer.fullName || customer.name || "—"}</p>
                    <p className="text-gray-700 text-xs">{customer.emailId || customer.email || ""}</p>
                </section>
            </div>

            {/* Totals */}
            <div className="mt-4 border-t pt-3 grid grid-cols-2 gap-3 text-sm">
                <div><strong>Subtotal:</strong></div>
                <div className="text-right">₹{data.subtotal ?? data.amount ?? data.amountPaid ?? "—"}</div>
                <div><strong>Shipping:</strong></div>
                <div className="text-right">₹{data.shippingFee ?? 0}</div>
                <div><strong>Discount:</strong></div>
                <div className="text-right">₹{data.discountTotal ?? 0}</div>
                <div className="font-semibold"><strong>Total Paid:</strong></div>
                <div className="text-right font-semibold">₹{data.amountPaid ?? data.total ?? "—"}</div>
            </div>
        </div>
    );
}

function getStatusColor(status) {
    switch ((status || "").toUpperCase()) {
        case "PLACED":
            return "bg-yellow-100 text-yellow-800";
        case "ACCEPTED":
            return "bg-blue-100 text-blue-800";
        case "SHIPPED":
            return "bg-blue-100 text-blue-800";
        case "DELIVERED":
            return "bg-green-100 text-green-800";
        case "CANCELLED":
        case "REJECTED":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}
