import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.user);
  const { currentUser } = user;
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
