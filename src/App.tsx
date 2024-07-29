// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Shop } from './page/shop';
import AdminPanel from './page/AdminPanel';
import { AuthProvider } from './layout/autoeization/AuthContext';
import LoginComponent from './layout/UserAuteriztion/UserCart';
import ProtectedRoute from './layout/Protect/ProtectedRoute';
import RegisterComponent from './page/register/register';

export function App() {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<Shop />} />
      <Route path="/auth" element={<LoginComponent />} />
      <Route path="/reset-password/:token" element={<LoginComponent />} />
      <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} allowedRoles={['admin', 'courier']} />} />
    </Routes>
  </AuthProvider>
  );
}

export default App;
