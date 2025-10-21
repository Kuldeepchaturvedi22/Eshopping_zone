// File: 'src/api/_auth.js'
export const getAuthToken = (overrideToken) => {
    let t =
        overrideToken ??
        localStorage.getItem("token") ??
        sessionStorage.getItem("token") ??
        localStorage.getItem("jwt") ??
        localStorage.getItem("jwtToken");
    if (!t) return null;
    try {
        const parsed = JSON.parse(t);
        t = parsed?.token || parsed?.accessToken || parsed?.jwt || t;
    } catch {}
    if (typeof t === "string" && t.startsWith("Bearer ")) t = t.slice(7);
    return t || null;
};

export const authHeaders = (token) => {
    const t = getAuthToken(token);
    return t ? { Authorization: `Bearer ${t}` } : {};
};