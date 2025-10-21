import { Link, useNavigate } from "react-router-dom";

export default function MerchantNavbar() {
    const navigate = useNavigate();

    const logout = () => {
        // Clear auth data and notify app to update role-aware UI
        ["token", "jwt", "jwtToken", "role"].forEach((k) => {
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
        });
        window.dispatchEvent(new Event("auth:role-changed"));
        navigate("/login");
    };

    return (
        <nav style={{ display: "flex", gap: 16, padding: 12, borderBottom: "1px solid #eee" }}>
            <Link to="/merchant" style={{ fontWeight: 700 }}>Merchant</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/merchant/products">Products</Link>
            <Link to="/merchant/orders">Orders</Link>
            <Link to="/merchant/notifications">Notifications</Link>
            <button onClick={logout} style={{ marginLeft: "auto" }}>Logout</button>
        </nav>
    );
}