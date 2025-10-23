// import { useState } from "react";
// import { sendMail } from "../api/notification";
//
// export default function MerchantNotifications() {
//     const [to, setTo] = useState("");
//     const [subject, setSubject] = useState("");
//     const [body, setBody] = useState("");
//     const [status, setStatus] = useState("");
//
//     const onSubmit = async (e) => {
//         e.preventDefault();
//         setStatus("");
//         try {
//             await sendMail({ recipient: to, subject, msgBody: body });
//             setStatus("Notification sent.");
//             setTo(""); setSubject(""); setBody("");
//         } catch (e1) {
//             setStatus(e1.message || "Failed to send.");
//         }
//     };
//
//     return (
//         <div style={{ padding: 16 }}>
//             <h2>Send Notification</h2>
//             <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 480 }}>
//                 <input placeholder="Recipient email" value={to} onChange={(e) => setTo(e.target.value)} required />
//                 <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
//                 <textarea placeholder="Message" value={body} onChange={(e) => setBody(e.target.value)} rows={6} required />
//                 <button type="submit">Send</button>
//             </form>
//             {status && <p style={{ marginTop: 8 }}>{status}</p>}
//         </div>
//     );
// }

// import { useState } from "react";
// import { sendMail } from "../api/notification";
//
// export default function MerchantNotifications() {
//     const [to, setTo] = useState("");
//     const [subject, setSubject] = useState("");
//     const [body, setBody] = useState("");
//     const [status, setStatus] = useState("");
//     const [sending, setSending] = useState(false);
//
//     const isEmail = (s) =>
//         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
//
//     const onSubmit = async (e) => {
//         e.preventDefault();
//         setStatus("");
//         if (!isEmail(to)) {
//             setStatus("Please enter a valid recipient email.");
//             return;
//         }
//         setSending(true);
//         try {
//             await sendMail({ recipient: to, subject, msgBody: body });
//             setStatus("Notification sent.");
//             setTo(""); setSubject(""); setBody("");
//         } catch (e1) {
//             setStatus(e1.message || "Failed to send.");
//         } finally {
//             setSending(false);
//         }
//     };
//
//     return (
//         <div className="max-w-xl mx-auto p-6 mt-16 bg-white rounded-xl shadow">
//             <h2 className="text-2xl font-bold mb-2">Send Notification</h2>
//             <p className="text-sm text-gray-600 mb-4">
//                 Email an update to your customer about their order, shipping, or promotions.
//             </p>
//             <form onSubmit={onSubmit} className="grid gap-3">
//                 <input
//                     placeholder="Recipient email"
//                     value={to}
//                     onChange={(e) => setTo(e.target.value)}
//                     required
//                     className="px-3 py-2 border rounded"
//                 />
//                 <input
//                     placeholder="Subject"
//                     value={subject}
//                     onChange={(e) => setSubject(e.target.value)}
//                     required
//                     className="px-3 py-2 border rounded"
//                 />
//                 <textarea
//                     placeholder="Message"
//                     value={body}
//                     onChange={(e) => setBody(e.target.value)}
//                     rows={6}
//                     required
//                     className="px-3 py-2 border rounded"
//                 />
//                 <div className="flex items-center gap-3">
//                     <button
//                         type="submit"
//                         disabled={sending}
//                         className={`px-4 py-2 rounded text-white ${sending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} transition`}
//                     >
//                         {sending ? "Sending…" : "Send"}
//                     </button>
//                     {status && (
//                         <span className={`text-sm ${status.includes("sent") ? "text-green-700" : "text-red-600"}`}>
//                             {status}
//                         </span>
//                     )}
//                 </div>
//             </form>
//
//             <div className="mt-6">
//                 <p className="text-xs text-gray-500 mb-1">Quick templates</p>
//                 <div className="flex flex-wrap gap-2">
//                     {[
//                         { t: "Order accepted", m: "Your order has been accepted and is being prepared." },
//                         { t: "Order shipped", m: "Good news! Your order has been shipped." },
//                         { t: "Order delivered", m: "Your order has been delivered. Enjoy!" },
//                     ].map((tpl) => (
//                         <button
//                             key={tpl.t}
//                             className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
//                             onClick={() => {
//                                 setSubject(tpl.t);
//                                 setBody(tpl.m);
//                             }}
//                             type="button"
//                         >
//                             {tpl.t}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useState } from "react";
import { sendCustomEmail } from "../api/notification";

export default function MerchantNotifications() {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [status, setStatus] = useState("");
    const [sending, setSending] = useState(false);

    const isEmail = (s) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        if (!isEmail(to)) {
            setStatus("Please enter a valid recipient email.");
            return;
        }
        setSending(true);
        try {
            await sendCustomEmail(to, subject, body);
            setStatus("Notification sent.");
            setTo(""); setSubject(""); setBody("");
        } catch (e1) {
            setStatus(e1.message || "Failed to send.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 mt-16 bg-white dark:bg-gray-900 rounded-xl shadow text-gray-900 dark:text-gray-100">
            <h2 className="text-2xl font-bold mb-2">Send Notification</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Email an update to your customer about their order, shipping, or promotions.
            </p>
            <form onSubmit={onSubmit} className="grid gap-3">
                <input
                    placeholder="Recipient email"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <input
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <textarea
                    placeholder="Message"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                    required
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={sending}
                        className={`px-4 py-2 rounded text-white transition ${
                            sending
                                ? "bg-gray-400 dark:bg-gray-600"
                                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        }`}
                    >
                        {sending ? "Sending…" : "Send"}
                    </button>
                    {status && (
                        <span className={`text-sm ${
                            status.includes("sent")
                                ? "text-green-700 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                        }`}>
                            {status}
                        </span>
                    )}
                </div>
            </form>

            <div className="mt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Quick templates</p>
                <div className="flex flex-wrap gap-2">
                    {[
                        { t: "Order accepted", m: "Your order has been accepted and is being prepared." },
                        { t: "Order shipped", m: "Good news! Your order has been shipped." },
                        { t: "Order delivered", m: "Your order has been delivered. Enjoy!" },
                    ].map((tpl) => (
                        <button
                            key={tpl.t}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                            onClick={() => {
                                setSubject(tpl.t);
                                setBody(tpl.m);
                            }}
                            type="button"
                        >
                            {tpl.t}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
