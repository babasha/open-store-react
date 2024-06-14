// src/components/UserDetails.tsx
import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import socket from '../../socket';
import MapPicker from '../../components/MapPicker';
import Accordion from './Accordion';
import OrderCard from './OrderCart/OrderCard';
import { UserDetails as UserDetailsContainer, CardInner, OrderList } from './styledauth/AuthorizationStyles'; // Изменено имя импорта
import { useAuth, AuthContextType, User } from '../autoeization/AuthContext';
import { Order } from '../orderList/OrderList';
import { EditButton } from '../../styles/btns/secondBtns';
import { FlexWrapper } from '../../components/FlexWrapper';

interface UserDetailsProps {
  user: User;
  logout: () => void;
  login: (user: User, token: string) => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, logout, login, orders, setOrders }) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [displayedCount, setDisplayedCount] = useState<{ canceled: number; completed: number }>({ canceled: 3, completed: 3 });
  const [isOpen, setIsOpen] = useState<{ canceled: boolean; completed: boolean }>({ canceled: false, completed: false });
  const { t } = useTranslation();

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
    <UserDetailsContainer>
      
             
      <h2>{t('welcome')}</h2>
      <h6> {user.first_name} {user.last_name}</h6>
      <p>{t('address')}: {user.address}</p>
      <EditButton onClick={() => setIsEditingAddress(true)}>{t('edit_address')}</EditButton>

      <p>{t('phone')}: {user.phone}</p>
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
        <FlexWrapper justify='flex-end'>
           <EditButton onClick={logout}>{t('logout')}</EditButton>
        </FlexWrapper>
    </UserDetailsContainer>
  );
};

export default UserDetails;

