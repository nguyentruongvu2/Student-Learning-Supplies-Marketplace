import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, isAuthenticated, requireAdmin = false }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default PrivateRoute;
