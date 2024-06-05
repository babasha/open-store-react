import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { theme } from '../../styles/Theme';
import { useAuth } from '../autoeization/AuthContext';
import LoginComponent from '../UserAuteriztion/UserCart';
import RegisterComponent from '../../page/register/register';
import { Order } from '../orderList/OrderList'; // Импортируйте тип Order
import socket from '../../socket'; // Импортируйте ваш socket

const AutorizationComponent: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | ''>('');
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]); // Используйте тип Order

  useEffect(() => {
    if (user) {
      fetchUserOrders();
      socket.on('newOrder', (newOrder: Order) => {
        setOrders(prevOrders => [...prevOrders, newOrder]);
      });
      socket.on('orderUpdated', (updatedOrder: Order) => {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
      });
    }

    return () => {
      socket.off('newOrder');
      socket.off('orderUpdated');
    };
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders/me', { withCredentials: true });
      setOrders(response.data);
    } catch (error: any) {
      console.error('Ошибка при получении заказов пользователя:', error.message);
    }
  };

  const handleSetAuthMode = (mode: 'login' | 'register' | '') => {
    setAuthMode(mode);
  };

  return (
    <Container width={'100%'}>
      <CartdiInner>
        {user ? (
          <UserDetails>
            <h2>Добро пожаловать, {user.first_name} {user.last_name}</h2>
            <p>Адрес: {user.address}</p>
            <button onClick={logout}>Выйти</button>
            <h3>Ваши заказы</h3>
            <ul>
              {orders.map(order => (
                <li key={order.id}>
                  <p>Заказ #{order.id}</p>
                  <p>Статус: {order.status}</p>
                  <p>Общая сумма: ${order.total}</p>
                  <p>Создан: {new Date(order.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </UserDetails>
        ) : (
          <div>
            {authMode === '' && (
              <div>
                <button onClick={() => handleSetAuthMode('login')}>Войти</button>
                <button onClick={() => handleSetAuthMode('register')}>Зарегистрироваться</button>
              </div>
            )}
            {authMode === 'login' && (
              <div>
                <button onClick={() => handleSetAuthMode('')}>Назад</button>
                <LoginComponent />
              </div>
            )}
            {authMode === 'register' && (
              <div>
                <button onClick={() => handleSetAuthMode('')}>Назад</button>
                <RegisterComponent onAuthModeChange={handleSetAuthMode} />
              </div>
            )}
          </div>
        )}
      </CartdiInner>
    </Container>
  );
};

const UserDetails = styled.div`
  text-align: left;
  margin-top: 20px;
  h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 10px;
  }
  button {
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    &:hover {
      background-color: #0056b3;
    }
  }
`;

const CartdiInner = styled.div`
  background-color: ${theme.colors.mainBg};
  margin-top: 10px;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
`;

export default AutorizationComponent;
