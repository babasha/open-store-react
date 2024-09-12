// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Shop } from './page/shop';
import AdminPanel from './page/AdminPanel';
import { AuthProvider } from './layout/autoeization/AuthContext';
import LoginComponent from './layout/UserAuteriztion/UserCart';
import ProtectedRoute from './layout/Protect/ProtectedRoute';
import RegisterComponent from './page/register/register';
import PaymentSuccess from './page/paymentsPages/PaymentSuccess';
import { PurchasedItemsProvider } from './page/paymentsPages/PurchasedItemsContext';

export function App() {
  return (
    <AuthProvider>
      <PurchasedItemsProvider>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/auth" element={<LoginComponent />} />
          <Route path="/reset-password/:token" element={<LoginComponent />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} allowedRoles={['admin', 'courier']} />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
        </Routes>
      </PurchasedItemsProvider>
    </AuthProvider>
  );
}

export default App;
