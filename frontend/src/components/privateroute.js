// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('role'); // e.g., "admin", "vendor", "customer"

  if (!token) return <Navigate to="/Login" />;

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/Home" />;
  }

  return children;
};

export default PrivateRoute;
