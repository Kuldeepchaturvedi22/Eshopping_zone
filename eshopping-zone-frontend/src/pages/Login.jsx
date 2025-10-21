import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import AnimatedToast from "../components/AnimatedToast";
import { fetchUserByEmail } from "../api/user"; // <-- add this import

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [displayToken, setDisplayToken] = useState("");
    const navigate = useNavigate();

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ email, password });
            console.log("Login response:", response);

            const token = response?.jwtToken;
            const role = response?.role;

            if (!token || typeof token !== "string") {
                showToast("Login failed: Invalid token received.", "error");
                return;
            }

            // Store token & role first, so subsequent calls are authorized
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("email", email);
            localStorage.setItem("isLoggedIn", "true");

            // Resolve numeric userId from user service using email
            try {
                const user = await fetchUserByEmail(email, token);
                const id = user?.userId ?? user?.id;
                if (id && /^\d+$/.test(String(id))) {
                    localStorage.setItem("customerId", String(id));
                } else {
                    localStorage.removeItem("customerId");
                    console.warn("User service did not return a numeric userId");
                }
            } catch (idErr) {
                console.error("Failed to fetch userId by email:", idErr);
                localStorage.removeItem("customerId");
            }

            // Token preview (optional)
            setDisplayToken(token);

            // Notify app/contexts
            window.dispatchEvent(new Event("auth:changed"));
            window.dispatchEvent(new Event("auth:role-changed"));

            showToast("Login successful!", "success");

            setTimeout(() => {
                if (role === "ADMIN") {
                    navigate("/admin", { replace: true });
                } else if (role === "MERCHANT") {
                    navigate("/merchant", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            }, 800);
        } catch (error) {
            console.error("Login error:", error);
            showToast(error?.message || "Login failed. Please try again.", "error");
        }
    };


    return (
        <div className="flex flex-col justify-center items-center min-h-[80vh] px-4 mt-8 bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Login</h2>
                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>

                {displayToken && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-md border border-gray-300">
                        <h3 className="font-bold text-sm mb-1">Your JWT Token:</h3>
                        <div className="text-xs overflow-auto max-h-24 break-all">
                            {displayToken}
                        </div>
                        <p className="text-xs mt-2 text-gray-600">
                            This token will be used for authenticated API requests.
                        </p>
                    </div>
                )}

                <p className="text-center text-sm mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
            <AnimatedToast {...toast} />
        </div>
    );
}