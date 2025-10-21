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
            .then((data) => setOrders(data))
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
        <div className="max-w-5xl mx-auto mt-24 px-4">
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
                <p className="text-center text-gray-500 animate-pulse">
                    You have no orders yet.
                </p>
            ) : (
                orders.map((order) => (
                    <motion.div
                        key={order.orderId}
                        className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        layout
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-lg font-semibold text-gray-800">
                                    Order ID: {order.orderId}
                                </p>
                                <p className="text-sm text-gray-500">Date: {order.orderDate}</p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                    order.orderStatus
                                )}`}
                            >
                {order.orderStatus}
              </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-2 space-y-1">
                            <p>
                                Payment Status:{" "}
                                <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                  Confirmed
                </span>
                            </p>
                            <p>
                                Payment Mode: <strong>{order.modeOfPayment}</strong>
                            </p>
                            <p>
                                Amount Paid: <strong>₹{order.amountPaid}</strong>
                            </p>
                        </div>

                        <button
                            onClick={() => toggleDetails(order.orderId)}
                            className="mt-2 text-blue-600 hover:underline text-sm"
                        >
                            {expandedOrderId === order.orderId ? "Hide Details" : "View Details"}
                        </button>

                        <AnimatePresence>
                            {expandedOrderId === order.orderId && (
                                <motion.div
                                    className="mt-4 text-sm text-gray-700"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {fullOrderDetails[order.orderId] && (
                                        <div className="mt-2">
                                            <p className="font-semibold mb-1">Order Details:</p>
                                            <pre className="bg-gray-100 p-2 rounded">
                        {JSON.stringify(fullOrderDetails[order.orderId], null, 2)}
                      </pre>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))
            )}
        </div>
    );
}

function getStatusColor(status) {
    switch (status) {
        case "PLACED":
            return "bg-yellow-100 text-yellow-800";
        case "SHIPPED":
            return "bg-blue-100 text-blue-800";
        case "DELIVERED":
            return "bg-green-100 text-green-800";
        case "CANCELLED":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}
