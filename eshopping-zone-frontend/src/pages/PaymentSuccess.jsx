import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuthToken } from "../api/_auth";
import { sendPaymentSuccessEmail } from "../api/notification";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    const [updating, setUpdating] = useState(true);
    const [ok, setOk] = useState(false);
    const [msg, setMsg] = useState("");
    const [orderId, setOrderId] = useState("");
    const [amount, setAmount] = useState("");

    const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

    useEffect(() => {
        const id = query.get("orderId") || query.get("order") || "";
        const amt = query.get("amount") || query.get("amt") || "";
        const status = (query.get("status") || "SUCCESS").toUpperCase();
        setOrderId(id);
        setAmount(amt);

        const broadcast = (st) => {
            try {
                const payload = { orderId: id || "", status: st, amount: amt || "", ts: Date.now() };
                localStorage.setItem("payment:last", JSON.stringify(payload));
            } catch {}
        };

        const run = async () => {
            if (!id) {
                setMsg("Missing order id");
                setUpdating(false);
                setOk(false);
                broadcast("ERROR");
                return;
            }
            try {
                const token = getAuthToken();
                const email = localStorage.getItem('email');
                
                if (status === "SUCCESS" && email) {
                    // Send payment success email
                    try {
                        const orderData = {
                            orderId: id,
                            transactionId: query.get("transactionId") || "TXN" + Date.now(),
                            paymentMethod: query.get("paymentMethod") || "Online Payment",
                            orderDate: new Date().toLocaleDateString(),
                            totalAmount: amt,
                            customerEmail: email
                        };
                        await sendPaymentSuccessEmail(email, orderData);
                    } catch (error) {
                        console.warn('Failed to send payment success email:', error);
                    }
                }
                
                setOk(status === "SUCCESS");
                setMsg(status === "SUCCESS" ? "Payment captured successfully." : "Payment status updated.");
                broadcast(status);
            } catch (e) {
                console.error("Error updating payment status:", e);
                setOk(false);
                setMsg(e?.message || "Unable to update payment status.");
                broadcast("ERROR");
            } finally {
                setUpdating(false);
            }
        };

        run();

        const t = setTimeout(() => navigate("/orders", { replace: true }), 1500);
        return () => clearTimeout(t);
    }, [query, navigate]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl text-center w-full max-w-md animate-fade-in-up">
                {updating ? (
                    <>
                        <h2 className="text-2xl font-bold text-blue-700 mb-2">Finalizing your order…</h2>
                        <p className="text-gray-600">Please wait while we confirm your payment.</p>
                    </>
                ) : ok ? (
                    <>
                        <h2 className="text-3xl font-bold text-green-600 mb-2">🎉 Payment Successful!</h2>
                        <p className="text-gray-700 mb-1">Thank you for shopping with us.</p>
                        <div className="text-sm text-gray-600 space-y-1 mt-3">
                            <p>
                                Order ID: <strong>{orderId}</strong>
                            </p>
                            {amount && (
                                <p>
                                    Amount Paid: ₹<strong>{amount}</strong>
                                </p>
                            )}
                            {msg && <p className="text-green-700">{msg}</p>}
                        </div>
                        <div className="mt-6 flex gap-3 justify-center">
                            <button
                                onClick={() => navigate("/orders")}
                                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                View Orders
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Redirecting to your orders…</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-red-600 mb-2">Payment Issue</h2>
                        <p className="text-gray-700 mb-1">We couldn’t confirm your payment.</p>
                        <div className="text-sm text-gray-600 space-y-1 mt-3">
                            <p>
                                Order ID: <strong>{orderId || "—"}</strong>
                            </p>
                            {amount && (
                                <p>
                                    Amount: ₹<strong>{amount}</strong>
                                </p>
                            )}
                            {msg && <p className="text-red-600">{msg}</p>}
                        </div>
                        <div className="mt-6 flex gap-3 justify-center">
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
                    </>
                )}
            </div>
        </div>
    );
}