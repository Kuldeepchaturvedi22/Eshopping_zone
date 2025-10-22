// src/api/adminUsers.js
import { authHeaders, getAuthToken } from "./_auth";
const BASE_URL = "http://localhost:8081/userservice";

export const fetchAllUsers = async (tokenOverride) => {
    const res = await fetch(`${BASE_URL}/user/getAllUsers`, {
        headers: { ...authHeaders(getAuthToken(tokenOverride)) },
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
};

export const updateUser = async (userId, user, tokenOverride) => {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders(getAuthToken(tokenOverride)) },
        body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error(await res.text().catch(() => "Failed to update user"));
    return res.text().catch(() => "OK");
};

export const deleteUser = async (userId, tokenOverride) => {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
        method: "DELETE",
        headers: { ...authHeaders(getAuthToken(tokenOverride)) },
    });
    if (!res.ok) throw new Error(await res.text().catch(() => "Failed to delete user"));
    return res.text().catch(() => "OK");
};