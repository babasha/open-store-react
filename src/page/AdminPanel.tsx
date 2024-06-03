import React, { useState, useEffect } from 'react';
import { Header } from '../layout/header/header';
import ProductList from '../layout/productList/ProductList';
import UserList from '../layout/userList/UserList';
import { AdminPanelContainer, Section } from '../styles/AdminPanelStyles';
import OrderList from '../layout/orderList/OrderList';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'orders'>('products');

  return (
    <AdminPanelContainer>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'products' && <ProductList />}
      {activeTab === 'users' && <UserList />}
      {activeTab === 'orders' && <OrderList />}
    </AdminPanelContainer>
  );
};
export default AdminPanel;
