// import React, { useEffect, useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
//
// export default function OrderPayment() {
//     const navigate = useNavigate();
//     const { state } = useLocation();
//
//     const order = useMemo(() => {
//         if (state?.order) return state.order;
//         const saved = sessionStorage.getItem("lastOrder");
//         try { return saved ? JSON.parse(saved) : null; } catch { return null; }
//     }, [state]);
//
//     // Same robust navigation helper used in Cart.jsx
//     const goToPayment = (url) => {
//         try {
//             window.location.assign(url);
//         } catch {
//             const a = document.createElement("a");
//             a.href = url;
//             a.rel = "noopener";
//             a.target = "_self";
//             document.body.appendChild(a);
//             a.click();
//             a.remove();
//         }
//     };
//
//     useEffect(() => {
//         const link = order?.paymentUrl || order?.paymentLink || order?.link;
//         if (link) {
//             console.log("Auto-opening payment link:", link);
//             goToPayment(link);
//         }
//     }, [order]);
//
//     if (!order) {
//         return (
//             <div className="max-w-3xl mx-auto mt-24 p-6 bg-white rounded shadow">
//                 <h2 className="text-2xl font-bold mb-2">No order found</h2>
//                 <p className="mb-4">Please place an order again.</p>
//                 <button
//                     className="px-4 py-2 bg-blue-600 text-white rounded"
//                     onClick={() => navigate("/cart")}
//                 >
//                     Back to Cart
//                 </button>
//             </div>
//         );
//     }
//
//     return (
//         <div className="max-w-3xl mx-auto mt-24 p-6 bg-white rounded shadow">
//             <h2 className="text-2xl font-bold mb-2">Payment Pending</h2>
//             <p className="text-gray-600 mb-6">
//                 We’re opening the payment page. If nothing happens, click the button below.
//             </p>
//
//             <div className="space-y-1 text-sm text-gray-700">
//                 <p><strong>Order ID:</strong> {order.orderId}</p>
//                 <p><strong>Status:</strong> {order.orderStatus}</p>
//                 <p><strong>Payment Mode:</strong> {order.modeOfPayment}</p>
//                 <p><strong>Amount:</strong> ₹{order.amountPaid}</p>
//             </div>
//
//             <div className="mt-6 flex gap-3">
//                 <button
//                     onClick={() => {
//                         const link = order?.paymentUrl || order?.paymentLink || order?.link;
//                         if (!link) return alert("Payment link not available.");
//                         goToPayment(link);
//                     }}
//                     className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//                 >
//                     Pay Now
//                 </button>
//                 <button
//                     onClick={() => navigate("/orders")}
//                     className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                 >
//                     Go to Orders
//                 </button>
//                 <button
//                     onClick={() => navigate("/cart")}
//                     className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
//                 >
//                     Back to Cart
//                 </button>
//             </div>
//         </div>
//     );
// }

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuthToken } from "../api/_auth";
import { fetchOrderById } from "../api/order";

export default function OrderPayment() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [statusMsg, setStatusMsg] = useState("Waiting for payment confirmation…");
    const [count, setCount] = useState(0);
    const pollerRef = useRef(null);

    const order = useMemo(() => {
        if (state?.order) return state.order;
        const saved = sessionStorage.getItem("lastOrder");
        try { return saved ? JSON.parse(saved) : null; } catch { return null; }
    }, [state]);

    const stopPolling = () => {
        if (pollerRef.current) {
            clearInterval(pollerRef.current);
            pollerRef.current = null;
        }
    };

    useEffect(() => {
        if (!order?.orderId) return;

        // Listen to payment completion broadcast from the new tab (PaymentSuccess page)
        const onStorage = (e) => {
            if (e?.key !== "payment:last") return;
            try {
                const data = JSON.parse(e.newValue || "{}");
                if (!data) return;
                // If this broadcast matches our current order, redirect promptly
                if (String(data.orderId || "") === String(order.orderId)) {
                    stopPolling();
                    navigate("/orders", { replace: true });
                }
            } catch {}
        };
        window.addEventListener("storage", onStorage);

        // Poll backend as a backup (e.g., payment-success page closed)
        const token = getAuthToken();
        pollerRef.current = setInterval(async () => {
            try {
                setCount((c) => c + 1);
                const full = await fetchOrderById(order.orderId, token);
                const ost = (full?.orderStatus || full?.status || "").toUpperCase();
                const paid = Number(full?.amountPaid ?? 0) > 0;
                // Heuristics: if paid or delivered/shipped, we can stop waiting
                if (paid || ["ACCEPTED", "SHIPPED", "DELIVERED"].includes(ost)) {
                    stopPolling();
                    navigate("/orders", { replace: true });
                }
            } catch (e) {
                // keep waiting, but do not crash the UI
            }
        }, 2000);

        return () => {
            window.removeEventListener("storage", onStorage);
            stopPolling();
        };
    }, [order, navigate]);

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

    // Waiting screen with order info and hints
    return (
        <div className="max-w-3xl mx-auto mt-24 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-2">Complete Your Payment</h2>
            <p className="text-gray-600 mb-4">{statusMsg}</p>

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
                <div><strong>Order ID:</strong> {order.orderId}</div>
                <div><strong>Amount:</strong> ₹{order.amountPaid || order.total || order.amount}</div>
                <div><strong>Status:</strong> {order.orderStatus || "PENDING"}</div>
                <div><strong>Payment:</strong> {order.modeOfPayment || "RAZORPAY"}</div>
            </div>

            <div className="p-3 rounded bg-blue-50 text-blue-800 text-sm">
                Payment is opened in a new tab. Please complete the payment there. This page will automatically proceed once the payment is confirmed. Attempt #{count || 1}
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    onClick={() => navigate("/orders")}
                    className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                    Go to Orders
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Refresh
                </button>
            </div>
        </div>
    );
}