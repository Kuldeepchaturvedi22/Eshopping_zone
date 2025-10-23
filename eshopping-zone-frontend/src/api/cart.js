const BASE_URL = "http://localhost:8081/cartservice/carts";
import { authHeaders, getAuthToken } from "./_auth";

const withAuth = (token) => authHeaders(getAuthToken(token));

export const viewCart = async (token) => {
    const res = await fetch(`${BASE_URL}/view`, { headers: withAuth(token) });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) throw new Error("Failed to fetch cart");
    return res.json();
};

export const fetchCartByCustomer = async (customerId, token) => {
    const res = await fetch(`${BASE_URL}/getByCustomerId/${customerId}`, {
        headers: withAuth(token),
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) throw new Error("Failed to fetch cart");
    return res.json();
};

export const addItemToCart = async (itemId, token) => {
    const res = await fetch(`${BASE_URL}/addItem/items/${itemId}`, {
        method: "POST",
        headers: withAuth(token),
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to add item to cart: ${error}`);
    }
    return res.json();
};

export const updateCart = async (cartId, updatedCart, token) => {
    const res = await fetch(`${BASE_URL}/updateCart/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...withAuth(token) },
        body: JSON.stringify(updatedCart),
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) throw new Error("Failed to update cart");
    return res.json();
};

export const deleteCartItem = async (cartId, token) => {
    const res = await fetch(`${BASE_URL}/deleteCart/${cartId}`, {
        method: "DELETE",
        headers: withAuth(token),
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) throw new Error("Failed to delete cart item");
    return res;
};

export const removeItemFromCart = async (itemId, token) => {
    const res = await fetch(`${BASE_URL}/removeItem/items/${itemId}`, {
        method: "DELETE",
        headers: withAuth(token),
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) throw new Error("Failed to remove item from cart");
    return res.json();
};