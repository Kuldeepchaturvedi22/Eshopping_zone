const BASE_URL = "http://localhost:8081/productservice/products";
import { authHeaders, getAuthToken } from "./_auth";

const withAuth = () => ({ ...authHeaders(getAuthToken()) });

export const fetchAllProducts = async () => {
    const res = await fetch(`${BASE_URL}/getAllProducts`);
    if (!res.ok) throw new Error("Failed to fetch products..........");
    return res.json();
};

export const addProduct = async (productData) => {
    const res = await fetch(`${BASE_URL}/addProduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...withAuth() },
        body: JSON.stringify(productData),
    });

    if (res.status === 401) throw new Error("Unauthorized (401) — please login again.");
    if (res.status === 403) {
        const msg = await res.text().catch(() => "");
        throw new Error(
            msg?.trim()
                ? `Forbidden (403): ${msg}`
                : "Forbidden (403) — your account doesn't have permission for this action."
        );
    }
    if (!res.ok) throw new Error(`Failed to add product (${res.status})`);
    return res.json();
};

export const deleteProduct = async (productId) => {
    const res = await fetch(`${BASE_URL}/deleteProduct/${productId}`, {
        method: "DELETE",
        headers: { ...withAuth() },
    });
    if (res.status === 401) throw new Error("Unauthorized (401) — please login again.");
    if (res.status === 403) throw new Error("Forbidden (403) — not allowed to delete products.");
    if (!res.ok) throw new Error("Failed to delete product");
    return res;
};

export const updateProduct = async (productId, updatedData) => {
    const res = await fetch(`${BASE_URL}/updateProduct/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...withAuth() },
        body: JSON.stringify(updatedData),
    });
    if (res.status === 401) throw new Error("Unauthorized (401) — please login again.");
    if (res.status === 403) throw new Error("Forbidden (403) — not allowed to update products.");
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
};

export const getProductById = async (productId) => {
    const res = await fetch(`${BASE_URL}/getProductById/${productId}`, {
        headers: { ...withAuth() },
    });
    if (!res.ok) throw new Error("Failed to get product");
    return res.json();
};

export const getProductsByType = async (category) => {
    const res = await fetch(`${BASE_URL}/getProductsByType/${category}`, {
        headers: { ...withAuth() },
    });
    if (!res.ok) throw new Error("Failed to get products by category");
    return res.json();
};