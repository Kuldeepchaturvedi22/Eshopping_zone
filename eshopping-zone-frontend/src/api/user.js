// src/api/user.js

// const BASE_URL = "http://localhost:8000/userservice";
//
// export const fetchUserById = async (userId) => {
//   const token = localStorage.getItem("token");
//
//   const res = await fetch(`${BASE_URL}/user/${userId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//
//   if (!res.ok) throw new Error("Failed to fetch user profile");
//   return res.json();
// };
//
//
// export const fetchOrdersByUser = async (userId) => {
//   const token = localStorage.getItem("token");
//
//   const res = await fetch(`${BASE_URL}/user/orders/${userId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//
//   if (!res.ok) throw new Error("Failed to fetch user orders");
//   return res.json();
// };
// src/api/user.js
// src/api/user.js
import { authHeaders, getAuthToken } from "./_auth";

const BASE_URL = "http://localhost:8000/userservice";

export const fetchUserById = async (userId, tokenOverride) => {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
        headers: { ...authHeaders(getAuthToken(tokenOverride)) },
    });
    if (!res.ok) throw new Error("Failed to fetch user profile");
    return res.json();
};

export const fetchOrdersByUser = async (userId, tokenOverride) => {
    const res = await fetch(`${BASE_URL}/user/orders/${userId}`, {
        headers: { ...authHeaders(getAuthToken(tokenOverride)) },
    });
    if (!res.ok) throw new Error("Failed to fetch user orders");
    return res.json();
};

export const fetchUserByEmail = async (emailId, tokenOverride) => {
    const res = await fetch(
        `${BASE_URL}/user/email/${encodeURIComponent(emailId)}`,
        { headers: { ...authHeaders(getAuthToken(tokenOverride)) } }
    );
    if (!res.ok) throw new Error("Failed to fetch user by email");
    return res.json(); // returns a User with userId
};
