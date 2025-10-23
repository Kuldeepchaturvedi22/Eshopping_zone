import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, forgotPassword } from "../api/auth";
import { sendLoginNotification } from "../api/notification";
import AnimatedToast from "../components/AnimatedToast";
import LoadingScreen from "../components/LoadingScreen";
import { fetchUserByEmail } from "../api/user";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [fpOpen, setFpOpen] = useState(false);
    const [fpEmail, setFpEmail] = useState("");
    const [fpSending, setFpSending] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login({ email, password });

            const token = response?.jwtToken;
            const role = response?.role;

            if (!token || typeof token !== "string") {
                showToast("Login failed: Invalid token received.", "error");
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("email", email);
            localStorage.setItem("isLoggedIn", "true");

            try {
                const user = await fetchUserByEmail(email, token);
                const id = user?.userId ?? user?.id;
                if (id && /^\d+$/.test(String(id))) {
                    localStorage.setItem("customerId", String(id));
                } else {
                    localStorage.removeItem("customerId");
                }
            } catch {
                localStorage.removeItem("customerId");
            }

            window.dispatchEvent(new Event("auth:changed"));
            window.dispatchEvent(new Event("auth:role-changed"));
            
            // Send login notification
            try {
                await sendLoginNotification(email, {
                    loginTime: new Date().toLocaleString(),
                    ipAddress: 'Unknown',
                    userAgent: navigator.userAgent,
                    location: 'Unknown'
                });
            } catch (error) {
                console.warn('Failed to send login notification:', error);
            }
            
            showToast("Login successful!", "success");

            setTimeout(() => {
                if (role === "ADMIN") navigate("/admin", { replace: true });
                else if (role === "MERCHANT") navigate("/merchant", { replace: true });
                else navigate("/", { replace: true });
            }, 800);
        } catch (error) {
            showToast(error?.message || "Login failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const onForgot = async (e) => {
        e.preventDefault();
        if (!fpEmail) return;
        setFpSending(true);
        try {
            await forgotPassword(fpEmail);
            showToast("Reset link sent if the email exists.", "success");
            setFpOpen(false);
            setFpEmail("");
        } catch (er) {
            showToast(er?.message || "Failed to request password reset.", "error");
        } finally {
            setFpSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white shadow-xl rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <img
                                src="/favicon.svg"
                                alt="logo"
                                className="w-10 h-10 object-contain"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                        </div>
                        <p className="text-gray-600">Sign in to your account to continue</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-900 placeholder-gray-500"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-900 placeholder-gray-500"
                                required
                            />
                        </div>
                        
                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                onClick={() => setFpOpen(true)}
                            >
                                Forgot your password?
                            </button>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                                Create one here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {fpOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <form
                        onSubmit={onForgot}
                        className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl"
                    >
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Reset Password</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Enter your email address and we'll send you a reset link.
                        </p>
                        <div className="space-y-4">
                            <input
                                type="email"
                                value={fpEmail}
                                onChange={(e) => setFpEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-900 placeholder-gray-500"
                                placeholder="Enter your email address"
                                required
                            />
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setFpOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={fpSending}
                                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                                        fpSending
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                >
                                    {fpSending ? "Sending..." : "Send Reset Link"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <LoadingScreen show={loading} message="Signing you in" />
            <AnimatedToast {...toast} />
        </div>
    );
}