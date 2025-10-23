import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchOrdersByCustomer,
    fetchDetailedOrderById,
} from "../api/order";


export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [expandedOrderIds, setExpandedOrderIds] = useState(new Set());
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
        if (expandedOrderIds.has(orderId)) {
            setExpandedOrderIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });
        } else {
            const token = localStorage.getItem("token");
            try {
                if (!fullOrderDetails[orderId]) {
                    const fullOrder = await fetchDetailedOrderById(orderId, token);
                    setFullOrderDetails((prev) => ({ ...prev, [orderId]: fullOrder }));
                }
                setExpandedOrderIds(prev => new Set([...prev, orderId]));
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
                        <div
                            key={order.orderId}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md"
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
                            </div>

                            {/* Expand for details */}
                            <button
                                onClick={() => toggleDetails(order.orderId)}
                                className="mt-3 text-blue-600 hover:underline text-sm"
                            >
                                {expandedOrderIds.has(order.orderId) ? "Hide Details" : "View Details"}
                            </button>

                            {expandedOrderIds.has(order.orderId) && (
                                <div className="mt-4">
                                    <OrderDetails data={fullOrderDetails[order.orderId]} />
                                </div>
                            )}
                        </div>
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

    const items = data.cart?.items || [];
    const shipping = data.address || {};
    const payment = data.payment || {};

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
                <section className="md:col-span-2">
                    <h4 className="font-semibold mb-2 text-gray-800">Items Ordered</h4>
                    {items.length === 0 ? (
                        <p className="text-gray-500">No items found.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {items.map((item, idx) => (
                                <li key={item.productId || idx} className="py-3 flex justify-between">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.itemName}</p>
                                        <p className="text-xs text-gray-500">
                                            Type: {item.itemType} | Product ID: {item.productId}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Merchant: {item.merchantEmail}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-800 font-medium">
                                            ₹{Number(item.price).toFixed(2)} × {item.quantity}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            = ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section>
                    <h4 className="font-semibold mb-2 text-gray-800">Delivery Address</h4>
                    {shipping && (shipping.street || shipping.city) ? (
                        <div className="text-gray-700 space-y-1">
                            <p>{shipping.street}</p>
                            <p>{shipping.city}, {shipping.state}</p>
                            <p>{shipping.zipCode}</p>
                            <p>{shipping.country}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">No delivery address found.</p>
                    )}

                    <h4 className="font-semibold mt-4 mb-2 text-gray-800">Payment Details</h4>
                    <div className="text-gray-700 space-y-1">
                        <p><span className="font-medium">Status:</span> {payment.paymentStatus || 'N/A'}</p>
                        <p><span className="font-medium">Method:</span> {payment.paymentMethod || 'N/A'}</p>
                        {payment.paymentId && (
                            <p><span className="font-medium">Payment ID:</span> {payment.paymentId}</p>
                        )}
                        {data.razorpayOrderId && (
                            <p><span className="font-medium">Order ID:</span> {data.razorpayOrderId}</p>
                        )}
                    </div>
                </section>
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