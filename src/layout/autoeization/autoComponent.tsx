import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Container } from '../../components/Container';
import { useAuth, AuthContextType, User } from '../autoeization/AuthContext';
import LoginComponent from '../UserAuteriztion/UserCart';
import RegisterComponent from '../../page/register/register';
import { Order } from '../orderList/OrderList';
import socket from '../../socket';
import MapPicker from '../../components/MapPicker';
import Accordion from './Accordion';
import OrderCard from './OrderCart/OrderCard';
import { UserDetails, CardInner, OrderList } from './styledauth/AuthorizationStyles';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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

  const filterOrders = useCallback((status: string[]) => {
    return orders.filter(order => status.includes(order.status));
  }, [orders]);

  const currentOrders = useMemo(() => filterOrders(['pending', 'assembly', 'ready_for_delivery']), [filterOrders]);
  const canceledOrders = useMemo(() => filterOrders(['canceled']).slice(0, displayedCount.canceled), [filterOrders, displayedCount.canceled]);
  const completedOrders = useMemo(() => filterOrders(['completed']).slice(0, displayedCount.completed), [filterOrders, displayedCount.completed]);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'ready_for_delivery':
        return t('ready_for_delivery');
      default:
        return t(status);
    }
  }, [t]);

  return (
    <Container width={'100%'}>
      <CardInner>
        {user ? (
          <UserDetails>
            <h2>{t('welcome')}, {user.first_name} {user.last_name}</h2>
            <p>{t('address')}: {user.address}</p>
            <p>{t('phone')}: {user.phone}</p>
            <button onClick={logout}>{t('logout')}</button>
            <button onClick={() => setIsEditingAddress(true)}>{t('edit_address')}</button>
            {isEditingAddress && (
              <div>
                <MapPicker onAddressSelect={(address: string) => setNewAddress(address)} />
                <button onClick={handleAddressSave}>{t('save_address')}</button>
                <button onClick={() => setIsEditingAddress(false)}>{t('cancel')}</button>
              </div>
            )}
            <h3>{t('active_orders')}</h3>
            <OrderList>
              {currentOrders.map(order => (
                <OrderCard key={order.id} order={{ ...order, status: getStatusText(order.status) }} />
              ))}
            </OrderList>
            <Accordion
              title={t('canceled_orders')}
              isOpen={isOpen.canceled}
              onClick={() => toggleAccordion('canceled')}
              orders={canceledOrders.map(order => ({ ...order, status: getStatusText(order.status) }))}
              loadMore={() => loadMoreOrders('canceled')}
              allOrdersCount={orders.filter(order => order.status === 'canceled').length}
            />
            <Accordion
              title={t('completed_orders')}
              isOpen={isOpen.completed}
              onClick={() => toggleAccordion('completed')}
              orders={completedOrders.map(order => ({ ...order, status: getStatusText(order.status) }))}
              loadMore={() => loadMoreOrders('completed')}
              allOrdersCount={orders.filter(order => order.status === 'completed').length}
            />
          </UserDetails>
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
  );
};

export default AuthorizationComponent;
