// src/components/AuthorizationComponent.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container } from '../../components/Container';
import { useAuth, AuthContextType, User } from '../autoeization/AuthContext';
import LoginComponent from '../UserAuteriztion/UserCart';
import RegisterComponent from '../../page/register/register';
import { Order } from '../orderList/OrderList';
import socket from '../../socket';
import MapPicker from '../../components/MapPicker';
import Accordion from './Accordion';
import OrderCard from './OrderCard';
import { UserDetails, CardInner, OrderList } from './styledauth/AuthorizationStyles' ;

interface DisplayedCount {
  canceled: number;
  completed: number;
}

interface IsOpen {
  canceled: boolean;
  completed: boolean;
}

const AuthorizationComponent: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | ''>('');
  const { user, logout, login } = useAuth() as AuthContextType;
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [displayedCount, setDisplayedCount] = useState<DisplayedCount>({ canceled: 3, completed: 3 });
  const [isOpen, setIsOpen] = useState<IsOpen>({ canceled: false, completed: false });

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = useCallback(async () => {
    try {
      const [ordersResponse, productsResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/orders/me', { withCredentials: true }),
        axios.get('http://localhost:3000/products', { withCredentials: true })
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

  const handleAddressSave = async () => {
    if (user && newAddress) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/users/${user.id}`,
          { address: newAddress },
          { withCredentials: true }
        );
        login(response.data, localStorage.getItem('token') || '');
        setIsEditingAddress(false);
      } catch (error: any) {
        console.error('Ошибка при обновлении адреса:', error.message);
      }
    }
  };

  const loadMoreOrders = (type: 'canceled' | 'completed') => {
    setDisplayedCount((prevState) => ({
      ...prevState,
      [type]: prevState[type] + 10
    }));
  };

  const toggleAccordion = (type: 'canceled' | 'completed') => {
    setIsOpen((prevState) => ({
      ...prevState,
      [type]: !prevState[type]
    }));
  };

  const currentOrders = orders.filter(order => order.status === 'pending' || order.status === 'assembly');
  const canceledOrders = orders.filter(order => order.status === 'canceled').slice(0, displayedCount.canceled);
  const completedOrders = orders.filter(order => order.status === 'completed').slice(0, displayedCount.completed);

  return (
    <Container width={'100%'}>
      <CardInner>
        {user ? (
          <UserDetails>
            <h2>Добро пожаловать, {user.first_name} {user.last_name}</h2>
            <p>Адрес: {user.address}</p>
            <button onClick={logout}>Выйти</button>
            <button onClick={() => setIsEditingAddress(true)}>Редактировать адрес</button>
            {isEditingAddress && (
              <div>
                <MapPicker onAddressSelect={(address: string) => setNewAddress(address)} />
                <button onClick={handleAddressSave}>Сохранить адрес</button>
                <button onClick={() => setIsEditingAddress(false)}>Отмена</button>
              </div>
            )}
            <h3>Ваши активные заказы</h3>
            <OrderList>
              {currentOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </OrderList>
            <Accordion
              title="Отмененные заказы"
              isOpen={isOpen.canceled}
              onClick={() => toggleAccordion('canceled')}
              orders={canceledOrders}
              loadMore={() => loadMoreOrders('canceled')}
              allOrdersCount={orders.filter(order => order.status === 'canceled').length}
            />
            <Accordion
              title="Завершенные заказы"
              isOpen={isOpen.completed}
              onClick={() => toggleAccordion('completed')}
              orders={completedOrders}
              loadMore={() => loadMoreOrders('completed')}
              allOrdersCount={orders.filter(order => order.status === 'completed').length}
            />
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
      </CardInner>
    </Container>
  );
};

export default AuthorizationComponent;
