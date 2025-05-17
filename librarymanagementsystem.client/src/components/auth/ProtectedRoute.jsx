import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function ProtectedRoute({ children }) {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
} 