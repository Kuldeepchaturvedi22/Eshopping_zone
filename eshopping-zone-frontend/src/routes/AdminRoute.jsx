// import React from "react";
// import { Navigate } from "react-router-dom";
//
// export default function AdminRoute({ children }) {
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//   const role = localStorage.getItem("role");
//
//   if (isLoggedIn && role === "ADMIN") {
//     return children;
//   } else {
//     return <Navigate to="/login" replace />;
//   }
// }

import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../api/_auth";

export default function AdminRoute({ children }) {
    const token = getAuthToken();
    const role = localStorage.getItem("role");
    if (token && role === "ADMIN") return children;
    return <Navigate to="/login" replace />;
}
