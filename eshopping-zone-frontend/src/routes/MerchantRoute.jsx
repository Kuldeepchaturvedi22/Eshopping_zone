// import { Navigate } from "react-router-dom";
//
// export default function MerchantRoute({ children }) {
//     const role = localStorage.getItem("role");
//     if (role !== "MERCHANT") return <Navigate to="/login" replace />;
//     return children;
// }

import { Navigate } from "react-router-dom";
import { getAuthToken } from "../api/_auth";

export default function MerchantRoute({ children }) {
    const token = getAuthToken();
    const role = localStorage.getItem("role");
    if (token && role === "MERCHANT") return children;
    return <Navigate to="/login" replace />;
}