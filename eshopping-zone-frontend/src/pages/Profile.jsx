import React, { useEffect, useState } from "react";
import { fetchUserById, fetchOrdersByUser } from "../api/user";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("customerId");

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    fetchUserById(userId)
      .then((data) => setUser(data))
      .catch((err) => console.error("Failed to fetch user:", err));

    fetchOrdersByUser(userId)
      .then((data) => setOrders(data))
      .catch((err) => console.error("Failed to fetch orders:", err));
  }, []);

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-16 p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
        <img
          src={user.image || "https://tse3.mm.bing.net/th/id/OIP.EwG6x9w6RngqsKrPJYxULAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full border-4 border-blue-500 mb-4"
        />
        <h2 className="text-2xl font-bold text-blue-700 mb-1">{user.fullName}</h2>
        <p className="text-gray-600">{user.emailId}</p>
        <p className="text-gray-600">Mobile: {user.mobileNumber}</p>
        <p className="text-gray-600">DOB: {user.dateOfBirth}</p>
        <p className="text-gray-600">Gender: {user.gender}</p>
        <p className="text-gray-500 italic mt-2 text-center">{user.about}</p>
      </div>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-4 text-blue-700">Your Orders</h3>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.orderId} className="border p-4 rounded bg-white shadow-sm">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Date:</strong> {order.orderDate}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <p><strong>Amount Paid:</strong> ₹{order.amountPaid}</p>
              <p><strong>Payment Mode:</strong> {order.modeOfPayment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
