import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      document.documentElement.classList.add('theme-dashboard');
    }
    return () => {
      document.documentElement.classList.remove('theme-dashboard');
    };
  }, [token]);

  return token ? children : <Navigate to="/" replace />;

};

export default ProtectedRoute;
