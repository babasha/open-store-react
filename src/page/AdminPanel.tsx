import React, { useState, useEffect } from 'react';
import { Header } from '../layout/header/header';
import ProductList from '../layout/productList/ProductList';
import UserList from '../layout/userList/UserList';
import { AdminPanelContainer, Section } from '../styles/AdminPanelStyles';
import OrderList from '../layout/orderList/OrderList';
import CourierList from '../layout/couriers/CourierMain'; // Импортируем CourierList
import { useAuth } from '../layout/autoeization/AuthContext';

interface AdminPanelProps {
  initialTab?: 'products' | 'users' | 'orders' | 'couriers';
}

const AdminPanel: React.FC<AdminPanelProps> = ({ initialTab = 'products' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'orders' | 'couriers'>(initialTab);

  useEffect(() => {
    if (user?.role === 'courier') {
      setActiveTab('couriers'); // Если роль курьер, устанавливаем начальную вкладку на "couriers"
    } else {
      setActiveTab(initialTab);
    }
  }, [initialTab, user]);

  return (
    <AdminPanelContainer>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} userRole={user?.role} />
      {activeTab === 'products' && user?.role !== 'courier' && <ProductList />}
      {activeTab === 'users' && user?.role !== 'courier' && <UserList />}
      {activeTab === 'orders' && <OrderList />}
      {activeTab === 'couriers' && user?.role === 'courier' && <CourierList />}
    </AdminPanelContainer>
  );
};

export default AdminPanel;
