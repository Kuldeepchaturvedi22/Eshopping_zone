import { useState } from "react";
import { sendMail } from "../api/notification";

export default function MerchantNotifications() {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [status, setStatus] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        try {
            await sendMail({ recipient: to, subject, msgBody: body });
            setStatus("Notification sent.");
            setTo(""); setSubject(""); setBody("");
        } catch (e1) {
            setStatus(e1.message || "Failed to send.");
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>Send Notification</h2>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 480 }}>
                <input placeholder="Recipient email" value={to} onChange={(e) => setTo(e.target.value)} required />
                <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                <textarea placeholder="Message" value={body} onChange={(e) => setBody(e.target.value)} rows={6} required />
                <button type="submit">Send</button>
            </form>
            {status && <p style={{ marginTop: 8 }}>{status}</p>}
        </div>
    );
}