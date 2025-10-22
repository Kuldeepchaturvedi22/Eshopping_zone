// // import React, { useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import { login } from "../api/auth";
// // import AnimatedToast from "../components/AnimatedToast";
// // import { fetchUserByEmail } from "../api/user"; // <-- add this import
// //
// // export default function Login() {
// //     const [email, setEmail] = useState("");
// //     const [password, setPassword] = useState("");
// //     const [toast, setToast] = useState({ show: false, message: "", type: "" });
// //     const [displayToken, setDisplayToken] = useState("");
// //     const navigate = useNavigate();
// //
// //     const showToast = (message, type) => {
// //         setToast({ show: true, message, type });
// //         setTimeout(() => setToast({ ...toast, show: false }), 3000);
// //     };
// //
// //     const handleLogin = async (e) => {
// //         e.preventDefault();
// //         try {
// //             const response = await login({ email, password });
// //             console.log("Login response:", response);
// //
// //             const token = response?.jwtToken;
// //             const role = response?.role;
// //
// //             if (!token || typeof token !== "string") {
// //                 showToast("Login failed: Invalid token received.", "error");
// //                 return;
// //             }
// //
// //             // Store token & role first, so subsequent calls are authorized
// //             localStorage.setItem("token", token);
// //             localStorage.setItem("role", role);
// //             localStorage.setItem("email", email);
// //             localStorage.setItem("isLoggedIn", "true");
// //
// //             // Resolve numeric userId from user service using email
// //             try {
// //                 const user = await fetchUserByEmail(email, token);
// //                 const id = user?.userId ?? user?.id;
// //                 if (id && /^\d+$/.test(String(id))) {
// //                     localStorage.setItem("customerId", String(id));
// //                 } else {
// //                     localStorage.removeItem("customerId");
// //                     console.warn("User service did not return a numeric userId");
// //                 }
// //             } catch (idErr) {
// //                 console.error("Failed to fetch userId by email:", idErr);
// //                 localStorage.removeItem("customerId");
// //             }
// //
// //             // Token preview (optional)
// //             setDisplayToken(token);
// //
// //             // Notify app/contexts
// //             window.dispatchEvent(new Event("auth:changed"));
// //             window.dispatchEvent(new Event("auth:role-changed"));
// //
// //             showToast("Login successful!", "success");
// //
// //             setTimeout(() => {
// //                 if (role === "ADMIN") {
// //                     navigate("/admin", { replace: true });
// //                 } else if (role === "MERCHANT") {
// //                     navigate("/merchant", { replace: true });
// //                 } else {
// //                     navigate("/", { replace: true });
// //                 }
// //             }, 800);
// //         } catch (error) {
// //             console.error("Login error:", error);
// //             showToast(error?.message || "Login failed. Please try again.", "error");
// //         }
// //     };
// //
// //
// //     return (
// //         <div className="flex flex-col justify-center items-center min-h-[80vh] px-4 mt-8 bg-gray-100">
// //             <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
// //                 <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Login</h2>
// //                 <form className="flex flex-col gap-4" onSubmit={handleLogin}>
// //                     <input
// //                         type="email"
// //                         placeholder="Email"
// //                         value={email}
// //                         onChange={(e) => setEmail(e.target.value)}
// //                         className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         required
// //                     />
// //                     <input
// //                         type="password"
// //                         placeholder="Password"
// //                         value={password}
// //                         onChange={(e) => setPassword(e.target.value)}
// //                         className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         required
// //                     />
// //                     <button
// //                         type="submit"
// //                         className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
// //                     >
// //                         Login
// //                     </button>
// //                 </form>
// //
// //                 {displayToken && (
// //                     <div className="mt-4 p-3 bg-gray-100 rounded-md border border-gray-300">
// //                         <h3 className="font-bold text-sm mb-1">Your JWT Token:</h3>
// //                         <div className="text-xs overflow-auto max-h-24 break-all">
// //                             {displayToken}
// //                         </div>
// //                         <p className="text-xs mt-2 text-gray-600">
// //                             This token will be used for authenticated API requests.
// //                         </p>
// //                     </div>
// //                 )}
// //
// //                 <p className="text-center text-sm mt-4">
// //                     Don't have an account?{" "}
// //                     <Link to="/register" className="text-blue-600 hover:underline">
// //                         Sign up
// //                     </Link>
// //                 </p>
// //             </div>
// //             <AnimatedToast {...toast} />
// //         </div>
// //     );
// // }
//
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { login, forgotPassword } from "../api/auth";
// import AnimatedToast from "../components/AnimatedToast";
// import { fetchUserByEmail } from "../api/user"; // <-- keep
//
// export default function Login() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [toast, setToast] = useState({ show: false, message: "", type: "" });
//     // const [displayToken, setDisplayToken] = useState("");
//     const [fpOpen, setFpOpen] = useState(false);
//     const [fpEmail, setFpEmail] = useState("");
//     const [fpSending, setFpSending] = useState(false);
//     const navigate = useNavigate();
//
//     const showToast = (message, type) => {
//         setToast({ show: true, message, type });
//         setTimeout(() => setToast({ ...toast, show: false }), 3000);
//     };
//
//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await login({ email, password });
//
//             const token = response?.jwtToken;
//             const role = response?.role;
//
//             if (!token || typeof token !== "string") {
//                 showToast("Login failed: Invalid token received.", "error");
//                 return;
//             }
//
//             localStorage.setItem("token", token);
//             localStorage.setItem("role", role);
//             localStorage.setItem("email", email);
//             localStorage.setItem("isLoggedIn", "true");
//
//             try {
//                 const user = await fetchUserByEmail(email, token);
//                 const id = user?.userId ?? user?.id;
//                 if (id && /^\d+$/.test(String(id))) {
//                     localStorage.setItem("customerId", String(id));
//                 } else {
//                     localStorage.removeItem("customerId");
//                 }
//             } catch {
//                 localStorage.removeItem("customerId");
//             }
//
//             // setDisplayToken(token);
//             window.dispatchEvent(new Event("auth:changed"));
//             window.dispatchEvent(new Event("auth:role-changed"));
//             showToast("Login successful!", "success");
//
//             setTimeout(() => {
//                 if (role === "ADMIN") navigate("/admin", { replace: true });
//                 else if (role === "MERCHANT") navigate("/merchant", { replace: true });
//                 else navigate("/", { replace: true });
//             }, 800);
//         } catch (error) {
//             showToast(error?.message || "Login failed. Please try again.", "error");
//         }
//     };
//
//     const onForgot = async (e) => {
//         e.preventDefault();
//         if (!fpEmail) return;
//         setFpSending(true);
//         try {
//             await forgotPassword(fpEmail);
//             showToast("Reset link sent if the email exists.", "success");
//             setFpOpen(false);
//             setFpEmail("");
//         } catch (er) {
//             showToast(er?.message || "Failed to request password reset.", "error");
//         } finally {
//             setFpSending(false);
//         }
//     };
//
//     return (
//         <div className="flex flex-col justify-center items-center min-h-[80vh] px-4 mt-8 bg-gray-100">
//             <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
//                 <div className="flex items-center justify-center gap-2 mb-3">
//                     <img
//                         src="/favicon.svg"
//                         alt="logo"
//                         className="w-8 h-8 object-contain"
//                         onError={(e) => (e.currentTarget.style.display = "none")}
//                     />
//                     <h2 className="text-3xl font-bold text-center text-blue-600">Login</h2>
//                 </div>
//                 <form className="flex flex-col gap-4" onSubmit={handleLogin}>
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="p-3 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         required
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="p-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         required
//                     />
//                     <div className="flex items-center justify-between text-sm">
//                         <div />
//                         <button
//                             type="button"
//                             className="text-blue-600 hover:underline"
//                             onClick={() => setFpOpen(true)}
//                         >
//                             Forgot password?
//                         </button>
//                     </div>
//                     <button
//                         type="submit"
//                         className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//                     >
//                         Login
//                     </button>
//                 </form>
//
//                 <p className="text-center text-gray-600 text-sm mt-4">
//                     Don't have an account?{" "}
//                     <Link to="/register" className="text-blue-600 hover:underline">
//                         Sign up
//                     </Link>
//                 </p>
//             </div>
//
//             {/* Forgot Password Modal */}
//             {fpOpen && (
//                 <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//                     <form
//                         onSubmit={onForgot}
//                         className="bg-white w-full max-w-sm p-6 rounded-lg shadow"
//                     >
//                         <h3 className="text-lg font-semibold mb-2">Reset your password</h3>
//                         <p className="text-sm text-gray-600 mb-3">
//                             Enter your email. We’ll send a reset link if it exists.
//                         </p>
//                         <input
//                             type="email"
//                             value={fpEmail}
//                             onChange={(e) => setFpEmail(e.target.value)}
//                             className="w-full border rounded px-3 py-2 mb-3 text-gray-600"
//                             placeholder="your@email.com"
//                             required
//                         />
//                         <div className="flex gap-2 justify-end">
//                             <button
//                                 type="button"
//                                 className="px-4 py-2 rounded border"
//                                 onClick={() => setFpOpen(false)}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={fpSending}
//                                 className={`px-4 py-2 rounded text-white ${fpSending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
//                             >
//                                 {fpSending ? "Sending…" : "Send"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             )}
//
//             <AnimatedToast {...toast} />
//         </div>
//     );
// }

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, forgotPassword } from "../api/auth";
import AnimatedToast from "../components/AnimatedToast";
import { fetchUserByEmail } from "../api/user"; // keep

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [fpOpen, setFpOpen] = useState(false);
    const [fpEmail, setFpEmail] = useState("");
    const [fpSending, setFpSending] = useState(false);
    const navigate = useNavigate();

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
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
            showToast("Login successful!", "success");

            setTimeout(() => {
                if (role === "ADMIN") navigate("/admin", { replace: true });
                else if (role === "MERCHANT") navigate("/merchant", { replace: true });
                else navigate("/", { replace: true });
            }, 800);
        } catch (error) {
            showToast(error?.message || "Login failed. Please try again.", "error");
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
        <div className="flex flex-col justify-center items-center min-h-[90vh] px-4
                        bg-gradient-to-br from-black via-gray-900 to-black">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <img
                        src="/favicon.svg"
                        alt="logo"
                        className="w-8 h-8 object-contain"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <h2 className="text-3xl font-bold text-center text-white">Login</h2>
                </div>

                <form className="flex flex-col gap-4 " onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 rounded p-3   bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all border rounded focus:ring-2 focus:outline-none placeholder:text-black
                                   focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 rounded p-3   bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all border rounded focus:ring-2 focus:outline-none placeholder:text-black
                                   focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                    <div className="flex items-center justify-between text-sm">
                        <div />
                        <button
                            type="button"
                            className="text-blue-400 hover:underline"
                            onClick={() => setFpOpen(true)}
                        >
                            Forgot password?
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded
                                   hover:scale-105 transition-transform duration-300 shadow-lg font-semibold"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-400 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>

            {/* Forgot Password Modal */}
            {fpOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <form
                        onSubmit={onForgot}
                        className="bg-gray-900 w-full max-w-sm p-6 rounded-lg shadow-xl border border-gray-800"
                    >
                        <h3 className="text-lg font-semibold mb-2 text-white">Reset your password</h3>
                        <p className="text-sm text-gray-400 mb-3">
                            Enter your email. We’ll send a reset link if it exists.
                        </p>
                        <input
                            type="email"
                            value={fpEmail}
                            onChange={(e) => setFpEmail(e.target.value)}
                            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700
                                       focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                            placeholder="your@email.com"
                            required
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                className="px-4 py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-800"
                                onClick={() => setFpOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={fpSending}
                                className={`px-4 py-2 rounded text-white 
                                    ${fpSending
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition-transform"}`}
                            >
                                {fpSending ? "Sending…" : "Send"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <AnimatedToast {...toast} />
        </div>
    );
}
