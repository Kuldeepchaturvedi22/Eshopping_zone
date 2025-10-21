// import React from "react";
// import { Navigate } from "react-router-dom";
//
// export default function PrivateRoute({ children }) {
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//
//   return isLoggedIn ? children : <Navigate to="/login" />;
// }


import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../api/_auth";

export default function PrivateRoute({ children }) {
    const hasToken = !!getAuthToken(); // resolve current token every render
    return hasToken ? children : <Navigate to="/login" replace />;
}