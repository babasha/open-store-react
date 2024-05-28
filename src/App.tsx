import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Shop } from './page/shop';
import AdminPanel from './page/AdminPanel';
import ProtectedRoute from './layout/Protect/ProtectedRoute';
import { AuthProvider } from './layout/autoeization/AuthContext';
import LoginWithTelegram from './layout/UserAuteriztion/UserCart';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/auth" element={<LoginWithTelegram />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute element={<AdminPanel />} />
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
