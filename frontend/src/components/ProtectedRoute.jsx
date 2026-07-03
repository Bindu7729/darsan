import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  // 1. Retrieve the active token string parameters from local state storage
  const token = localStorage.getItem('darshanease_token');
  const userString = localStorage.getItem('darshanease_user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. If no valid authentication signature exists, redirect back to /auth portal
  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  // 3. If specific user privileges or admin tier roles are requested, audit parameters
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If user tries accessing a route they don't have permission for, send them home
    return <Navigate to="/" replace />;
  }

  // 4. If all clearance benchmarks clear successfully, render child element trees
  return children;
}