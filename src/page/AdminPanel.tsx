import React, { useState, useEffect } from 'react';
import { Header } from '../layout/header/header';
import ProductList from '../layout/productList/ProductList';
import UserList from '../layout/userList/UserList';
import { AdminPanelContainer, Section } from '../styles/AdminPanelStyles';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');

  return (
    <AdminPanelContainer>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'products' && <ProductList />}
      {activeTab === 'users' && <UserList />}
    </AdminPanelContainer>
  );
};

export default AdminPanel;
