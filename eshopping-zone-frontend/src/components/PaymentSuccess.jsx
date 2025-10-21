import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("orderId");
    console.log("Order ID:", id);
    const yourToken = localStorage.getItem("token"); // Get token from localStorage
    const amt = params.get("amount");

    setOrderId(id);
    setAmount(amt);

    const updatePaymentStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/paymentservice/payment/update-status/${id}/SUCCESS`,
          {
            method: "PUT",
            headers: {
              //"Content-Type": "application/json",
              Authorization: `Bearer ${yourToken}` // Uncomment if needed
            },
          }
        );
        if (!response.ok) {
          console.error("Failed to update payment status");
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    };

    if (id) {
      updatePaymentStatus();
    }

    setTimeout(() => setShowModal(true), 300); // show modal
    setTimeout(() => navigate("/"), 3000); // redirect after 3 sec
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
      {showModal && (
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center animate-fade-in-up transition-all duration-300">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            🎉 Order Confirmed!
          </h2>
          <p className="text-gray-700 text-lg mb-2">
            Thank you for shopping with us.
          </p>
          <p className="text-gray-600 text-sm">
            Order ID: <strong>{orderId}</strong>
          </p>
          <p className="text-gray-600 text-sm">
            Total Paid: ₹<strong>{amount}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
