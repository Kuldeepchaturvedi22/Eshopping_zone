// // File: 'src/api/order.js'
// import { authHeaders } from "./_auth";
//
// const BASE_URL = "http://localhost:8000/orderservice/orders";
//
// // Place a new order (Customer)
// export const placeOrder = async (token) => {
//     const res = await fetch(`${BASE_URL}/placeOrder`, {
//         method: "POST",
//         headers: { ...authHeaders(token) },
//     });
//     if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
//     if (!res.ok) throw new Error((await res.text()) || "Failed to place order");
//     return res.json();
// };
//
// // Get all orders (Admin/Merchant)
// export const fetchAllOrders = async (token) => {
//     const res = await fetch(`${BASE_URL}/getAllOrders`, {
//         headers: { ...authHeaders(token) },
//     });
//     if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
//     if (!res.ok) throw new Error("Failed to fetch orders");
//     return res.json();
// };
//
// // Get orders by customer ID (Customer/Admin/Merchant)
// export const fetchOrdersByCustomer = async (customerId, token) => {
//     const res = await fetch(`${BASE_URL}/customer/${customerId}`, {
//         headers: { ...authHeaders(token) },
//     });
//     if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
//     if (!res.ok) throw new Error("Failed to fetch customer orders");
//     return res.json();
// };
//
// // Cancel an order (Customer/Admin)
// export const cancelOrder = async (orderId, token) => {
//     const res = await fetch(`${BASE_URL}/cancelOrder/${orderId}`, {
//         method: "DELETE",
//         headers: { ...authHeaders(token) },
//     });
//     if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
//     if (!res.ok) throw new Error("Failed to cancel order");
//     return res.text();
// };
//
// // Update payment status (Webhook/Payment callback)
// export const updatePaymentStatus = async (paymentDto, token) => {
//     const res = await fetch(`${BASE_URL}/update-payment-status`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", ...authHeaders(token) },
//         body: JSON.stringify(paymentDto),
//     });
//     if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
//     if (!res.ok) throw new Error("Failed to update payment status");
//     return res.json();
// };
//
// // Change order status (Admin/Merchant)
// export const changeOrderStatus = async (orderId, status, token) => {
//     const res = await fetch(`${BASE_URL}/changeOrderStatus/${orderId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", ...authHeaders(token) },
//         body: JSON.stringify(status), // e.g., "SHIPPED"
//     });
//     if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
//     if (!res.ok) throw new Error("Failed to change order status");
//     return res.json();
// };
//
// // Get order by ID
// export const fetchOrderById = async (orderId, token) => {
//     const res = await fetch(`${BASE_URL}/${orderId}`, {
//         headers: { ...authHeaders(token) },
//     });
//     if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
//     if (!res.ok) throw new Error("Order not found");
//     return res.json();
// };
//
// // Get latest orders within last hour
// export const fetchLatestOrders = async (token) => {
//     const res = await fetch(`${BASE_URL}/latest-orders`, {
//         headers: { ...authHeaders(token) },
//     });
//     if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
//     if (!res.ok) throw new Error("Failed to fetch latest orders");
//     return res.json();
// };
//
// // Optional helpers from your comments
// export const fetchOrderProducts = async (orderId, token) => {
//     const res = await fetch(`${BASE_URL}/${orderId}/products`, {
//         headers: { ...authHeaders(token) },
//     });
//     if (!res.ok) throw new Error("Failed to fetch order products");
//     return res.json();
// };
//
// export const fetchUserAddress = async (userId, token) => {
//     const res = await fetch(
//         `http://localhost:8000/userservice/user/${userId}/address`,
//         { headers: { ...authHeaders(token) } }
//     );
//     if (!res.ok) throw new Error("Failed to fetch user address");
//     return res.json();
// };
// // export const fetchAllOrders = async (token) => {
// //     const res = await fetch(`${ORDERS_BASE}/getAllOrders`, {
// //         headers: { ...authHeaders(token) },
// //     });
// //     if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
// //     if (!res.ok) throw new Error("Failed to fetch orders");
// //     return res.json();
// // };
//
// // export const changeOrderStatus = async (orderId, status, token) => {
// //     const res = await fetch(`${ORDERS_BASE}/changeOrderStatus/${orderId}`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json", ...authHeaders(token) },
// //         body: JSON.stringify(status),
// //     });
// //     if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
// //     if (!res.ok) throw new Error("Failed to change order status");
// //     return res.json();
// // };



// File: 'src/api/order.js'
import { authHeaders } from "./_auth";

const BASE_URL = "http://localhost:8000/orderservice/orders";

// Place a new order (Customer)
export const placeOrder = async (token) => {
    const res = await fetch(`${BASE_URL}/placeOrder`, {
        method: "POST",
        headers: { ...authHeaders(token) },
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) throw new Error((await res.text()) || "Failed to place order");

    const data = await res.json();

    // Normalize backend property names to a consistent shape for the UI
    // Your backend logs show "paymentLink" — expose it as paymentUrl for the UI.
    const paymentUrl = data.paymentUrl ?? data.paymentLink ?? data.link ?? null;

    return {
        ...data,
        paymentUrl,
    };
};

// Get all orders (Admin/Merchant)
export const fetchAllOrders = async (token) => {
    const res = await fetch(`${BASE_URL}/getAllOrders`, {
        headers: { ...authHeaders(token) },
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
};

// Get orders by customer ID (Customer/Admin/Merchant)
export const fetchOrdersByCustomer = async (customerId, token) => {
    const res = await fetch(`${BASE_URL}/customer/${customerId}`, {
        headers: { ...authHeaders(token) },
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) throw new Error("Failed to fetch customer orders");
    return res.json();
};

export const cancelOrder = async (orderId, token) => {
    const res = await fetch(`${BASE_URL}/cancelOrder/${orderId}`, {
        method: "DELETE",
        headers: { ...authHeaders(token) },
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) throw new Error("Failed to cancel order");
    return res.text();
};

export const updatePaymentStatus = async (paymentDto, token) => {
    const res = await fetch(`${BASE_URL}/update-payment-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify(paymentDto),
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) throw new Error("Failed to update payment status");
    return res.json();
};

export const changeOrderStatus = async (orderId, status, token) => {
    const res = await fetch(`${BASE_URL}/changeOrderStatus/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify(status),
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) throw new Error("Failed to change order status");
    return res.json();
};

export const fetchOrderById = async (orderId, token) => {
    const res = await fetch(`${BASE_URL}/${orderId}`, {
        headers: { ...authHeaders(token) },
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) throw new Error("Order not found");
    return res.json();
};

export const fetchLatestOrders = async (token) => {
    const res = await fetch(`${BASE_URL}/latest-orders`, {
        headers: { ...authHeaders(token) },
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) throw new Error("Failed to fetch latest orders");
    return res.json();
};

export const fetchOrderProducts = async (orderId, token) => {
    const res = await fetch(`${BASE_URL}/${orderId}/products`, {
        headers: { ...authHeaders(token) },
    });
    if (!res.ok) throw new Error("Failed to fetch order products");
    return res.json();
};

export const fetchUserAddress = async (userId, token) => {
    const res = await fetch(
        `http://localhost:8000/userservice/user/${userId}/address`,
        { headers: { ...authHeaders(token) } }
    );
    if (!res.ok) throw new Error("Failed to fetch user address");
    return res.json();
};