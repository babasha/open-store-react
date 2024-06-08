import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../../components/Container';
import { theme } from '../../styles/Theme';
import { useAuth } from '../autoeization/AuthContext';
import LoginComponent from '../UserAuteriztion/UserCart';
import RegisterComponent from '../../page/register/register';
import { Order } from '../orderList/OrderList';
import socket from '../../socket';
import MapPicker from '../../components/MapPicker';

const AutorizationComponent: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | ''>('');
  const { user, logout, login } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [displayedCanceledCount, setDisplayedCanceledCount] = useState(3);
  const [displayedCompletedCount, setDisplayedCompletedCount] = useState(3);
  const [isCanceledOpen, setIsCanceledOpen] = useState(false);
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders/me', { withCredentials: true });
      console.log('Fetched orders:', response.data);
      setOrders(response.data);
    } catch (error: any) {
      console.error('Ошибка при получении заказов пользователя:', error.message);
    }
  };

  useEffect(() => {
    const handleNewOrder = (newOrder: Order) => {
      if (newOrder.user_id === user?.id) {
        setOrders((prevOrders) => [...prevOrders, newOrder]);
      }
    };

    const handleOrderUpdated = (updatedOrder: Order) => {
      if (updatedOrder.user_id === user?.id) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
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

  const loadMoreCanceledOrders = () => {
    setDisplayedCanceledCount(displayedCanceledCount + 10);
  };

  const loadMoreCompletedOrders = () => {
    setDisplayedCompletedCount(displayedCompletedCount + 10);
  };

  const renderOrder = (order: Order) => (
    <OrderCard
      key={order.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p>Заказ #{order.id}</p>
      <p>Статус: {order.status}</p>
      <p>Общая сумма: ${order.total}</p>
      <p>Создан: {new Date(order.created_at).toLocaleString()}</p>
      <p>Время доставки: {order.delivery_time}</p>
    </OrderCard>
  );

  const currentOrders = orders.filter(order => order.status === 'pending' || order.status === 'assembly');
  const canceledOrders = orders.filter(order => order.status === 'canceled').slice(0, displayedCanceledCount);
  const completedOrders = orders.filter(order => order.status === 'completed').slice(0, displayedCompletedCount);

  return (
    <Container width={'100%'}>
      <CartdiInner>
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
              {currentOrders.map(renderOrder)}
            </OrderList>
            <Accordion
              title="Отмененные заказы"
              isOpen={isCanceledOpen}
              onClick={() => setIsCanceledOpen(!isCanceledOpen)}
              orders={canceledOrders}
              loadMore={loadMoreCanceledOrders}
              allOrdersCount={orders.filter(order => order.status === 'canceled').length}
              renderOrder={renderOrder}
            />
            <Accordion
              title="Завершенные заказы"
              isOpen={isCompletedOpen}
              onClick={() => setIsCompletedOpen(!isCompletedOpen)}
              orders={completedOrders}
              loadMore={loadMoreCompletedOrders}
              allOrdersCount={orders.filter(order => order.status === 'completed').length}
              renderOrder={renderOrder}
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
      </CartdiInner>
    </Container>
  );
};

const Accordion: React.FC<{
  title: string;
  isOpen: boolean;
  onClick: () => void;
  orders: Order[];
  loadMore: () => void;
  allOrdersCount: number;
  renderOrder: (order: Order) => JSX.Element;
}> = ({ title, isOpen, onClick, orders, loadMore, allOrdersCount, renderOrder }) => (
  <motion.div layout>
    <AccordionHeader onClick={onClick} aria-expanded={isOpen}>
      {title}
    </AccordionHeader>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key={title}
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: 'auto' },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <OrderList>
            {orders.map(renderOrder)}
          </OrderList>
          {orders.length < allOrdersCount && (
            <LoadMoreButton onClick={loadMore}>Загрузить еще</LoadMoreButton>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

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

const AccordionHeader = styled(motion.summary)`
  cursor: pointer;
  font-weight: bold;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 10px;
  &:hover {
    background: #e0e0e0;
  }
`;

const OrderList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const OrderCard = styled(motion.li)`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LoadMoreButton = styled.button`
  padding: 10px;
  margin-top: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

export default AutorizationComponent;
