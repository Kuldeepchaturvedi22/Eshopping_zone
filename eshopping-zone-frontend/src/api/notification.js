import { authHeaders } from "./_auth";

const BASE_URL = "http://localhost:8000/notificationservice/notification";

export const sendMail = async (details, token) => {
    const res = await fetch(`${BASE_URL}/sendMail`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(token),
        },
        body: JSON.stringify(details),
    });
    if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to send notification");
    }
    return res.json().catch(() => ({})); // some backends return empty body
};