
import React, { useEffect, useState } from "react";
import {updateUserProfile, fetchUserByEmail } from "../api/user";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [user, setUser] = useState(null);
    // const [orders, setOrders] = useState([]);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(null);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem("email");
        if (!email) {
            navigate("/login", { replace: true });
            return;
        }

        const load = async () => {
            try {
                const u = await fetchUserByEmail(email);
                setUser(u);

                const id = u?.userId ?? u?.id;
                if (id && /^\d+$/.test(String(id))) {
                    localStorage.setItem("customerId", String(id));
                }

                setForm({
                    fullName: u.fullName || "",
                    emailId: u.emailId || "",
                    mobileNumber: u.mobileNumber || "",
                    dateOfBirth: u.dateOfBirth || "",
                    gender: u.gender || "",
                    about: u.about || "",
                    image: u.image || "",
                });

                // if (id) {
                //     const ods = await fetchOrdersByUser(id);
                //     setOrders(Array.isArray(ods) ? ods : []);
                // }
            } catch (e) {
                const m = String(e?.message || "");
                if (m.toLowerCase().includes("unauthorized") || m.includes("401")) {
                    navigate("/login", { replace: true });
                } else {
                    setError("Failed to load profile. Please try again.");
                    console.error("Profile load error:", e);
                }
            }
        };

        load();
    }, [navigate]);

    const onSave = async () => {
        if (!form || !user) return;
        setSaving(true);
        setMsg("");
        setError("");
        try {
            const uid = user.userId ?? user.id;
            await updateUserProfile(uid, { ...user, ...form });
            setUser((u) => ({ ...u, ...form }));
            setEditing(false);
            setMsg("✅ Profile updated successfully.");
        } catch (e) {
            setError(e?.message || "❌ Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (!user && !error) {
        return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;
    }

    if (error) {
        return (
            <div className="text-center mt-10 text-red-600">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-16 p-6">
            {/* Profile Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                    {/* Avatar */}
                    <img
                        src={
                            user.image ||
                            "https://tse3.mm.bing.net/th/id/OIP.EwG6x9w6RngqsKrPJYxULAHaHa"
                        }
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
                        onError={(e) =>
                            (e.currentTarget.src =
                                "https://tse3.mm.bing.net/th/id/OIP.EwG6x9w6RngqsKrPJYxULAHaHa")
                        }
                    />

                    {/* Profile Info / Edit Form */}
                    {!editing ? (
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-blue-700">
                                    {user.fullName}
                                </h2>
                                <button
                                    className="px-3 py-1 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit
                                </button>
                            </div>
                            <p className="text-gray-600">{user.emailId}</p>
                            <p className="text-gray-600">📞 {user.mobileNumber}</p>
                            <p className="text-gray-600">🎂 {user.dateOfBirth}</p>
                            <p className="text-gray-600">⚧ {user.gender}</p>
                            <p className="text-gray-500 italic mt-2">{user.about}</p>
                        </div>
                    ) : (
                        <div className="flex-1 grid grid-cols-1 text-black md:grid-cols-2 gap-3 w-full">
                            <input
                                className="border rounded px-3 py-2"
                                value={form.fullName}
                                onChange={(e) =>
                                    setForm({ ...form, fullName: e.target.value })
                                }
                                placeholder="Full Name"
                            />
                            <input
                                className="border rounded px-3 py-2"
                                value={form.emailId}
                                onChange={(e) =>
                                    setForm({ ...form, emailId: e.target.value })
                                }
                                placeholder="Email"
                            />
                            <input
                                className="border rounded px-3 py-2"
                                value={form.mobileNumber}
                                onChange={(e) =>
                                    setForm({ ...form, mobileNumber: e.target.value })
                                }
                                placeholder="Mobile"
                            />
                            <input
                                type="date"
                                className="border rounded px-3 py-2"
                                value={form.dateOfBirth}
                                onChange={(e) =>
                                    setForm({ ...form, dateOfBirth: e.target.value })
                                }
                            />
                            <input
                                className="border rounded px-3 py-2"
                                value={form.gender}
                                onChange={(e) =>
                                    setForm({ ...form, gender: e.target.value })
                                }
                                placeholder="Gender"
                            />
                            <input
                                className="border rounded px-3 py-2 md:col-span-2"
                                value={form.image}
                                onChange={(e) =>
                                    setForm({ ...form, image: e.target.value })
                                }
                                placeholder="Profile Image URL"
                            />
                            <textarea
                                className="border rounded px-3 py-2 md:col-span-2"
                                rows={3}
                                value={form.about}
                                onChange={(e) =>
                                    setForm({ ...form, about: e.target.value })
                                }
                                placeholder="About"
                            />
                            <div className="md:col-span-2 flex gap-2">
                                <button
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                    onClick={() => {
                                        setEditing(false);
                                        setForm({
                                            fullName: user.fullName || "",
                                            emailId: user.emailId || "",
                                            mobileNumber: user.mobileNumber || "",
                                            dateOfBirth: user.dateOfBirth || "",
                                            gender: user.gender || "",
                                            about: user.about || "",
                                            image: user.image || "",
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`px-4 py-2 rounded text-white ${
                                        saving
                                            ? "bg-gray-400"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                    onClick={onSave}
                                    disabled={saving}
                                >
                                    {saving ? "Saving…" : "Save"}
                                </button>
                            </div>
                            {msg && (
                                <p className="md:col-span-2 text-sm text-green-700">{msg}</p>
                            )}
                            {error && (
                                <p className="md:col-span-2 text-sm text-red-600">{error}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/*/!* Orders Section *!/*/}
            {/*<hr className="my-8" />*/}
            {/*<h3 className="text-xl font-semibold mb-4 text-blue-700">Your Orders</h3>*/}
            {/*{orders.length === 0 ? (*/}
            {/*    <p className="text-gray-500">No orders found.</p>*/}
            {/*) : (*/}
            {/*    <ul className="space-y-4">*/}
            {/*        {orders.map((order) => (*/}
            {/*            <li*/}
            {/*                key={order.orderId}*/}
            {/*                className="border p-4 rounded bg-black shadow-sm hover:shadow-md transition"*/}
            {/*            >*/}
            {/*                <p>*/}
            {/*                    <strong>🆔 Order ID:</strong> {order.orderId}*/}
            {/*                </p>*/}
            {/*                <p>*/}
            {/*                    <strong>📅 Date:</strong> {order.orderDate}*/}
            {/*                </p>*/}
            {/*                <p>*/}
            {/*                    <strong>📦 Status:</strong> {order.orderStatus}*/}
            {/*                </p>*/}
            {/*                <p>*/}
            {/*                    <strong>💰 Amount Paid:</strong> ₹{order.amountPaid}*/}
            {/*                </p>*/}
            {/*                <p>*/}
            {/*                    <strong>💳 Payment Mode:</strong> {order.modeOfPayment}*/}
            {/*                </p>*/}
            {/*            </li>*/}
            {/*        ))}*/}
            {/*    </ul>*/}
            {/*)}*/}
        </div>
    );
}

