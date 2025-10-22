import { authHeaders, getAuthToken } from "./_auth";

// Keep a gateway fallback if needed
const gateway = "http://localhost:8081/productservice/products";

export const fetchProductsByMerchantEmail = async (email, tokenOverride) => {
    const urlDirect = `${gateway}/merchant/email?email=${encodeURIComponent(email)}`;
    const res = await fetch(urlDirect, {
        headers: { ...authHeaders(getAuthToken(tokenOverride)) },
    });
    if (res.ok) return res.json();

    // fallback (existing gateway path)
    const res2 = await fetch(`${gateway}/merchant/${encodeURIComponent(email)}`, {
        headers: { ...authHeaders(getAuthToken(tokenOverride)) },
    });
    if (!res2.ok) throw new Error("Failed to fetch products by merchant email");
    return res2.json();
};