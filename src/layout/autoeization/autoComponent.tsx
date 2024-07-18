// src/components/AuthorizationComponent.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container } from '../../components/Container';
import { useAuth, AuthContextType } from '../autoeization/AuthContext';
import LoginComponent from '../UserAuteriztion/UserCart';
import RegisterComponent from '../../page/register/register';
import socket from '../../socket';
import { CardInner } from './styledauth/AuthorizationStyles';
import { useTranslation } from 'react-i18next';
import UserDetails from './UserDetails';
import { Order } from '../orderList/OrderList';
import { HiddenScreensContainer } from '../../components/HiddenContainer';

const AuthorizationComponent: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | ''>('');
  const { user, logout, login } = useAuth() as AuthContextType;
  const [orders, setOrders] = useState<Order[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = useCallback(async () => {
    try {
      const [ordersResponse, productsResponse] = await Promise.all([
        axios.get('http://45.146.164.162:3000/api/orders/me', { withCredentials: true }),
        axios.get('http://45.146.164.162:3000/products', { withCredentials: true })
      ]);

      const ordersData: Order[] = ordersResponse.data;
      const products = productsResponse.data;

      const productsMap = products.reduce((map: Record<number, any>, product: any) => {
        map[product.id] = product;
        return map;
      }, {});

      const ordersWithProductNames = ordersData.map((order: Order) => ({
        ...order,
        items: order.items.map(item => ({
          ...item,
          productName: productsMap[item.productId]?.name?.ru || 'Неизвестный продукт'
        }))
      }));

      setOrders(ordersWithProductNames);
    } catch (error: any) {
      console.error('Ошибка при получении заказов пользователя:', error.message);
    }
  }, []);

  useEffect(() => {
    const handleNewOrder = (newOrder: Order) => {
      if (newOrder.user_id === user?.id) {
        setOrders((prevOrders) => [...prevOrders, newOrder]);
      }
    };

    const handleOrderUpdated = (updatedOrder: Order) => {
      if (updatedOrder.user_id === user?.id) {
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
        );
      }
    };

    if (user) {
      socket.on('newOrder', handleNewOrder);
      socket.on('orderUpdated', handleOrderUpdated);
    }

    return () => {
      socket.off('newOrder', handleNewOrder);
      socket.off('orderUpdated', handleOrderUpdated);
    };
  }, [user]);

  const handleSetAuthMode = (mode: 'login' | 'register' | '') => {
    setAuthMode(mode);
  };

  return (
    // <HiddenScreensContainer>
    <Container width={'100%'}>
      <CardInner>
        {user ? (
          <UserDetails user={user} logout={logout} login={login} orders={orders} setOrders={setOrders} />
        ) : (
          <div>
            {authMode === '' && (
              <div>
                <button onClick={() => handleSetAuthMode('login')}>{t('login')}</button>
                <button onClick={() => handleSetAuthMode('register')}>{t('register')}</button>
              </div>
            )}
            {authMode === 'login' && (
              <div>
                <button onClick={() => handleSetAuthMode('')}>{t('back')}</button>
                <LoginComponent />
              </div>
            )}
            {authMode === 'register' && (
              <div>
                <button onClick={() => handleSetAuthMode('')}>{t('back')}</button>
                <RegisterComponent onAuthModeChange={handleSetAuthMode} />
              </div>
            )}
          </div>
        )}
      </CardInner>
    </Container>
    // {/* </HiddenScreensContainer> */}
  );
};

export default AuthorizationComponent;
