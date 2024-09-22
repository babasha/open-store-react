import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import MapPicker from '../../components/MapPicker';
import Accordion from './Accordion';
import OrderCard from './OrderCart/OrderCard';
import { UserDetails as UserDetailsContainer, OrderList } from './styledauth/AuthorizationStyles';
import { useAuth, User } from '../autoeization/AuthContext';
import { Order } from '../orderList/OrderList';
import { EditButton } from '../../styles/btns/secondBtns';
import { FlexWrapper } from '../../components/FlexWrapper';

interface UserDetailsProps {
  user: User;
  logout: () => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, logout, orders }) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false); // Новое состояние
  const [newPhone, setNewPhone] = useState(''); // Новое состояние
  const [displayedCount, setDisplayedCount] = useState<{ [key: string]: number }>({ canceled: 3, completed: 3 });
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({ canceled: false, completed: false });
  const { t } = useTranslation();
  const { updateUser } = useAuth(); // Получаем функцию updateUser из AuthContext

  const handleAddressSave = async () => {
    if (user && newAddress) {
      try {
        const response = await axios.put(
          `https://enddel.com/api/users/${user.id}`,
          { address: newAddress },
          { withCredentials: true }
        );
        updateUser({ address: response.data.address });
        setIsEditingAddress(false);
      } catch (error: any) {
        console.error('Ошибка при обновлении адреса:', error.message);
      }
    }
  };

  // Функция для сохранения номера телефона
  const handlePhoneSave = async () => {
    if (user && newPhone) {
      try {
        const response = await axios.put(
          `https://enddel.com/api/users/${user.id}`,
          { phone: newPhone },
          { withCredentials: true }
        );
        updateUser({ phone: response.data.phone });
        setIsEditingPhone(false);
      } catch (error: any) {
        console.error('Ошибка при обновлении номера телефона:', error.message);
      }
    }
  };

  const loadMoreOrders = (type: string) => {
    setDisplayedCount((prevState) => ({
      ...prevState,
      [type]: prevState[type] + 10,
    }));
  };

  const toggleAccordion = (type: string) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };

  const filterOrders = useCallback(
    (statusList: string[]) => {
      return orders.filter((order) => statusList.includes(order.status));
    },
    [orders]
  );

  const currentOrders = useMemo(() => filterOrders(['pending', 'assembly', 'ready_for_delivery']), [filterOrders]);
  const canceledOrders = useMemo(
    () => filterOrders(['canceled']).slice(0, displayedCount.canceled),
    [filterOrders, displayedCount.canceled]
  );
  const completedOrders = useMemo(
    () => filterOrders(['completed']).slice(0, displayedCount.completed),
    [filterOrders, displayedCount.completed]
  );

  const getStatusText = useCallback(
    (status: string) => {
      switch (status) {
        case 'ready_for_delivery':
          return t('ready_for_delivery');
        default:
          return t(status);
      }
    },
    [t]
  );

  return (
    <UserDetailsContainer>
      <h2>{t('welcome')}</h2>
      <h5>
        {user.first_name} {user.last_name}
      </h5>
      <p>
        {t('address')}: {user.address}
        <EditButton onClick={() => setIsEditingAddress(true)}>{t('edit_address')}</EditButton>
      </p>
      {isEditingAddress && (
        <div>
          <MapPicker onAddressSelect={(address: string) => setNewAddress(address)} />
          <button onClick={handleAddressSave}>{t('save_address')}</button>
          <button onClick={() => setIsEditingAddress(false)}>{t('cancel')}</button>
        </div>
      )}
      <p>
        {t('phone')}: {user.phone}
        <EditButton onClick={() => setIsEditingPhone(true)}>{t('edit_phone')}</EditButton>
      </p>
      {isEditingPhone && (
        <div>
          <input
            type="text"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder={t('enter_new_phone')}
          />
          <button onClick={handlePhoneSave}>{t('save_phone')}</button>
          <button onClick={() => setIsEditingPhone(false)}>{t('cancel')}</button>
        </div>
      )}
      <h3>{t('active_orders')}</h3>
      <OrderList>
        {currentOrders.map((order) => (
          <OrderCard key={order.id} order={{ ...order, status: getStatusText(order.status) }} />
        ))}
      </OrderList>
      <Accordion
        title={t('canceled_orders')}
        isOpen={isOpen.canceled}
        onClick={() => toggleAccordion('canceled')}
        orders={canceledOrders.map((order) => ({ ...order, status: getStatusText(order.status) }))}
        loadMore={() => loadMoreOrders('canceled')}
        allOrdersCount={orders.filter((order) => order.status === 'canceled').length}
      />
      <Accordion
        title={t('completed_orders')}
        isOpen={isOpen.completed}
        onClick={() => toggleAccordion('completed')}
        orders={completedOrders.map((order) => ({ ...order, status: getStatusText(order.status) }))}
        loadMore={() => loadMoreOrders('completed')}
        allOrdersCount={orders.filter((order) => order.status === 'completed').length}
      />
      <FlexWrapper justify="flex-end">
        <EditButton onClick={logout}>{t('logout')}</EditButton>
      </FlexWrapper>
    </UserDetailsContainer>
  );
};

export default UserDetails;
