import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderPayment() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const order = useMemo(() => {
        if (state?.order) return state.order;
        const saved = sessionStorage.getItem("lastOrder");
        try { return saved ? JSON.parse(saved) : null; } catch { return null; }
    }, [state]);

    // Same robust navigation helper used in Cart.jsx
    const goToPayment = (url) => {
        try {
            window.location.assign(url);
        } catch {
            const a = document.createElement("a");
            a.href = url;
            a.rel = "noopener";
            a.target = "_self";
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    };

    useEffect(() => {
        const link = order?.paymentUrl || order?.paymentLink || order?.link;
        if (link) {
            console.log("Auto-opening payment link:", link);
            goToPayment(link);
        }
    }, [order]);

    if (!order) {
        return (
            <div className="max-w-3xl mx-auto mt-24 p-6 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-2">No order found</h2>
                <p className="mb-4">Please place an order again.</p>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => navigate("/cart")}
                >
                    Back to Cart
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-24 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-2">Payment Pending</h2>
            <p className="text-gray-600 mb-6">
                We’re opening the payment page. If nothing happens, click the button below.
            </p>

            <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Status:</strong> {order.orderStatus}</p>
                <p><strong>Payment Mode:</strong> {order.modeOfPayment}</p>
                <p><strong>Amount:</strong> ₹{order.amountPaid}</p>
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    onClick={() => {
                        const link = order?.paymentUrl || order?.paymentLink || order?.link;
                        if (!link) return alert("Payment link not available.");
                        goToPayment(link);
                    }}
                    className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    Pay Now
                </button>
                <button
                    onClick={() => navigate("/orders")}
                    className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Go to Orders
                </button>
                <button
                    onClick={() => navigate("/cart")}
                    className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                    Back to Cart
                </button>
            </div>
        </div>
    );
}