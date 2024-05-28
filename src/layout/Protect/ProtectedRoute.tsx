import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../autoeization/AuthContext';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? element : <Navigate to="/auth" />;
};

export default ProtectedRoute;
