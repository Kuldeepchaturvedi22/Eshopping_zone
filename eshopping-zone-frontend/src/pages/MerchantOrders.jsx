import { useEffect, useState } from "react";
import {
    fetchAllOrders as fetchAllOrdersApi,
    changeOrderStatus as changeOrderStatusApi,
} from "../api/order";
import { getAuthToken } from "../api/_auth";

export default function MerchantOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const load = async () => {
        setLoading(true);
        setErr("");
        try {
            const token = getAuthToken();
            const data = await fetchAllOrdersApi(token);
            setOrders(Array.isArray(data) ? data : []);
        } catch (e) {
            setErr(e?.message || "Error loading orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const onChangeStatus = async (orderId, newStatus) => {
        try {
            const token = getAuthToken();
            await changeOrderStatusApi(orderId, newStatus, token);
            await load();
        } catch (e) {
            alert(e?.message || "Failed to update status");
        }
    };

    if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
    if (err) return <div style={{ padding: 16, color: "red" }}>{err}</div>;

    return (
        <div style={{ padding: 16 }}>
            <h2>Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {orders.map((o) => {
                        const id = o.id ?? o.orderId;
                        const status = o.status ?? o.orderStatus ?? "";
                        return (
                            <li
                                key={id}
                                style={{ border: "1px solid #eee", marginBottom: 12, padding: 12 }}
                            >
                                <div>Order #{id}</div>
                                <div>Status: {status}</div>
                                <div style={{ marginTop: 8 }}>
                                    <label>
                                        Update status:
                                        <select
                                            defaultValue=""
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (!val) return;
                                                onChangeStatus(id, val);
                                            }}
                                            style={{ marginLeft: 8 }}
                                        >
                                            <option value="">Select</option>
                                            <option value="ACCEPTED">ACCEPTED</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                            <option value="REJECTED">REJECTED</option>
                                        </select>
                                    </label>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}