import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../autoeization/AuthContext';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/shop" />;
  }

  return element;
};

export default ProtectedRoute;
