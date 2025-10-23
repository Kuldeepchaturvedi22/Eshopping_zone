// // src/pages/AdminUsers.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { fetchAllUsers, updateUser as apiUpdateUser, deleteUser as apiDeleteUser } from "../api/adminUsers";
// import { getAuthToken } from "../api/_auth";
//
// export default function AdminUsers() {
//     const [users, setUsers] = useState([]);
//     const [q, setQ] = useState("");
//     const [busy, setBusy] = useState(false);
//     const token = getAuthToken();
//
//     const load = async () => {
//         try {
//             const data = await fetchAllUsers(token);
//             setUsers(Array.isArray(data) ? data : []);
//         } catch (e) {
//             alert(e?.message || "Failed to fetch users");
//         }
//     };
//
//     useEffect(() => { load(); }, []);
//
//     const filtered = useMemo(() => {
//         const n = (v) => String(v ?? "").toLowerCase();
//         return users.filter((u) => {
//             return n(u.fullName).includes(n(q)) || n(u.emailId).includes(n(q)) || n(u.role).includes(n(q));
//         });
//     }, [users, q]);
//
//     const promote = async (u, role) => {
//         setBusy(true);
//         try {
//             await apiUpdateUser(u.userId ?? u.id, { ...u, role });
//             await load();
//         } catch (e) {
//             alert(e?.message || "Failed to update role");
//         } finally {
//             setBusy(false);
//         }
//     };
//
//     const removeUser = async (u) => {
//         if (!window.confirm(`Delete user ${u.fullName} (${u.emailId})?`)) return;
//         setBusy(true);
//         try {
//             await apiDeleteUser(u.userId ?? u.id, token);
//             await load();
//         } catch (e) {
//             alert(e?.message || "Failed to delete user");
//         } finally {
//             setBusy(false);
//         }
//     };
//
//     const inlineEdit = async (u, field, value) => {
//         setBusy(true);
//         try {
//             await apiUpdateUser(u.userId ?? u.id, { ...u, [field]: value });
//             await load();
//         } catch (e) {
//             alert(e?.message || "Failed to update user");
//         } finally {
//             setBusy(false);
//         }
//     };
//
//     return (
//         <div className="max-w-6xl mx-auto p-4 mt-16">
//             <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-2xl font-bold">Users</h2>
//                 <button onClick={load} className="px-3 py-2 bg-blue-600 dark: bg-blue-800 text-white rounded hover:bg-blue-700" disabled={busy}>
//                     Refresh
//                 </button>
//             </div>
//
//             <div className="mb-4">
//                 <input
//                     value={q}
//                     onChange={(e) => setQ(e.target.value)}
//                     placeholder="Search by name, email, role…"
//                     className="px-3 py-2 border rounded w-full md:w-96"
//                 />
//             </div>
//
//             {filtered.length === 0 ? (
//                 <p className="text-gray-600">No users found.</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full border">
//                         <thead className="bg-gray-50">
//                         <tr>
//                             <th className="p-2 text-left">Name</th>
//                             <th className="p-2 text-left">Email</th>
//                             <th className="p-2 text-left">Role</th>
//                             <th className="p-2 text-left">Mobile</th>
//                             <th className="p-2 text-left">Actions</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {filtered.map((u) => (
//                             <tr key={u.userId ?? u.id} className="border-t">
//                                 <td className="p-2">
//                                     <input
//                                         className="border rounded px-2 py-1 w-full"
//                                         defaultValue={u.fullName}
//                                         onBlur={(e) => inlineEdit(u, "fullName", e.target.value)}
//                                         disabled={busy}
//                                     />
//                                 </td>
//                                 <td className="p-2">{u.emailId}</td>
//                                 <td className="p-2">
//                                     <select
//                                         defaultValue={u.role}
//                                         onChange={(e) => promote(u, e.target.value)}
//                                         disabled={busy}
//                                         className="border rounded px-2 py-1"
//                                     >
//                                         <option value="CUSTOMER">CUSTOMER</option>
//                                         <option value="MERCHANT">MERCHANT</option>
//                                         <option value="ADMIN">ADMIN</option>
//                                     </select>
//                                 </td>
//                                 <td className="p-2">
//                                     <input
//                                         className="border rounded px-2 py-1 w-full"
//                                         defaultValue={u.mobileNumber || ""}
//                                         onBlur={(e) => inlineEdit(u, "mobileNumber", e.target.value)}
//                                         disabled={busy}
//                                     />
//                                 </td>
//                                 <td className="p-2">
//                                     <button
//                                         onClick={() => removeUser(u)}
//                                         className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//                                         disabled={busy}
//                                     >
//                                         Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// }

// src/pages/AdminUsers.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    fetchAllUsers,
    updateUser as apiUpdateUser,
    deleteUser as apiDeleteUser,
} from "../api/adminUsers";
import { getAuthToken } from "../api/_auth";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [q, setQ] = useState("");
    const [busy, setBusy] = useState(false);
    const token = getAuthToken();

    const load = async () => {
        try {
            const data = await fetchAllUsers(token);
            setUsers(Array.isArray(data) ? data : []);
        } catch (e) {
            alert(e?.message || "Failed to fetch users");
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        const n = (v) => String(v ?? "").toLowerCase();
        return users.filter((u) => {
            return (
                n(u.fullName).includes(n(q)) ||
                n(u.emailId).includes(n(q)) ||
                n(u.role).includes(n(q))
            );
        });
    }, [users, q]);

    const promote = async (u, role) => {
        setBusy(true);
        try {
            await apiUpdateUser(u.userId ?? u.id, { ...u, role });
            await load();
        } catch (e) {
            alert(e?.message || "Failed to update role");
        } finally {
            setBusy(false);
        }
    };

    const removeUser = async (u) => {
        if (!window.confirm(`Delete user ${u.fullName} (${u.emailId})?`)) return;
        setBusy(true);
        try {
            await apiDeleteUser(u.userId ?? u.id, token);
            await load();
        } catch (e) {
            alert(e?.message || "Failed to delete user");
        } finally {
            setBusy(false);
        }
    };

    const inlineEdit = async (u, field, value) => {
        setBusy(true);
        try {
            await apiUpdateUser(u.userId ?? u.id, { ...u, [field]: value });
            await load();
        } catch (e) {
            alert(e?.message || "Failed to update user");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 mt-16 bg-black min-h-screen text-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">👥 Users</h2>
                <button
                    onClick={load}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
                    disabled={busy}
                >
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by name, email, role…"
                    className="px-4 py-2 w-full md:w-96 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {filtered.length === 0 ? (
                <p className="text-gray-400">No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-800 text-gray-300">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Mobile</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-gray-900">
                        {filtered.map((u) => (
                            <tr
                                key={u.userId ?? u.id}
                                className="border-t border-gray-700 hover:bg-gray-800 transition"
                            >
                                <td className="p-3">
                                    <input
                                        className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        defaultValue={u.fullName}
                                        onBlur={(e) =>
                                            inlineEdit(u, "fullName", e.target.value)
                                        }
                                        disabled={busy}
                                    />
                                </td>
                                <td className="p-3 text-gray-300">{u.emailId}</td>
                                <td className="p-3">
                                    <select
                                        defaultValue={u.role}
                                        onChange={(e) => promote(u, e.target.value)}
                                        disabled={busy}
                                        className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="CUSTOMER">CUSTOMER</option>
                                        <option value="MERCHANT">MERCHANT</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td className="p-3">
                                    <input
                                        className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                        defaultValue={u.mobileNumber || ""}
                                        onBlur={(e) =>
                                            inlineEdit(u, "mobileNumber", e.target.value)
                                        }
                                        disabled={busy}
                                    />
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => removeUser(u)}
                                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/40 transition disabled:opacity-50"
                                        disabled={busy}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
