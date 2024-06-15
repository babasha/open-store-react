// src/layout/Protect/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../autoeization/AuthContext';

interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    console.log('Пользователь не авторизован, перенаправление на /auth');
    return <Navigate to="/auth" />;
  }

  console.log('Роль пользователя:', user.role);
  console.log('Разрешенные роли:', allowedRoles);

  if (!allowedRoles.includes(user.role)) {
    console.log('Роль пользователя не разрешена, перенаправление на /shop');
    return <Navigate to="/shop" />;
  }

  return element;
};

export default ProtectedRoute;
