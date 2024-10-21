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
import styled from 'styled-components';
import ButtonWithRipple from '../../styles/btns/ButtonStyles';
import { EditButton } from '../../styles/btns/secondBtns';
import { FlexWrapper } from '../../components/FlexWrapper';
// import GoogleLoginComponent from './google/GoogleLoginComponent';
import TelegramLoginButton from '../../components/telegram/TelegramLoginButton';

const AuthorizationComponent: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | ''>('');
  const { user, logout, login } = useAuth() as AuthContextType;
  const [orders, setOrders] = useState<Order[]>([]);
  const { t } = useTranslation();


  interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
  }
  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = useCallback(async () => {
    try {
      const [ordersResponse, productsResponse] = await Promise.all([
        axios.get('https://enddel.com/api/orders/me', { withCredentials: true }),
        axios.get('https://enddel.com/products', { withCredentials: true })
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

 // Обработчик аутентификации через Telegram
 const handleTelegramAuth = async (telegramUser: TelegramUser) => {
  try {
    const response = await axios.post('https://enddel.com/auth/telegram', telegramUser);
    const { user: appUser, token } = response.data;
    login(appUser, token);
  } catch (error) {
    console.error('Telegram аутентификация не удалась:', error);
    // Вы можете добавить отображение ошибки пользователю здесь
  }
};

  return (
    <Container width={'100%'}>
    <CardInner>
      {user ? (
        <UserDetails user={user} logout={logout} login={login} orders={orders} setOrders={setOrders} />
      ) : (
        <div>
          {authMode === '' && (
            <FlexWrapper justify='space-evenly' wrap='wrap'>
              <ButtonAuteriztion onClick={() => handleSetAuthMode('login')} isActive={false} isDisabled={false}>
                {t('login')}
              </ButtonAuteriztion>
              <ButtonAuteriztion onClick={() => handleSetAuthMode('register')} isActive={false} isDisabled={false}>
                {t('register')}
              </ButtonAuteriztion>
            </FlexWrapper>
          )}
          {authMode === 'login' && (
            <div>
              <ButtonAuteriztionExit onClick={() => handleSetAuthMode('')}>
                {t('back')}
              </ButtonAuteriztionExit>
              <LoginComponent />
            </div>
          )}
          {authMode === 'register' && (
            <div>
              <ButtonAuteriztionExit onClick={() => handleSetAuthMode('')}>
                {t('back')}
              </ButtonAuteriztionExit>
              <RegisterComponent onAuthModeChange={handleSetAuthMode} />
            </div>
          )}
          {/* Добавляем кнопку Telegram Login */}
          {authMode === '' && (
            <TelegramLoginButton botName="enddel_com_bot" onAuth={handleTelegramAuth} />
          )}
        </div>
      )}
      {/* <GoogleLoginComponent /> */}
    </CardInner>
  </Container>
  );
};

const ButtonAuteriztion = styled(ButtonWithRipple)`
  margin: 5px 0px;
`;
const ButtonAuteriztionExit = styled(EditButton)`
`;

export default AuthorizationComponent;
