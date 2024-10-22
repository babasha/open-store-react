import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Shop } from './page/shop';
import AdminPanel from './page/AdminPanel';
import { AuthProvider } from './layout/autoeization/AuthContext';
import LoginComponent from './layout/UserAuteriztion/UserCart';
import ProtectedRoute from './layout/Protect/ProtectedRoute';
import RegisterComponent from './page/register/register';
import PaymentSuccess from './page/paymentsPages/PaymentSuccess';
import { PurchasedItemsProvider } from './page/paymentsPages/PurchasedItemsContext';
require('dotenv').config();

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export function App() {
  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "63e2c9a9-fa2b-4c85-a14f-f0f7b0c0e313"; // Замените на ваш CRISP_WEBSITE_ID

    // Загружаем скрипт Crisp
    (function() {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  }, []);

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
