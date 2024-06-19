import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { OrderListItem, StatusButton, CancelButton, DisabledCancelButton, OrderDetailsContainer } from '../../styles/OrderListStyles';
import OrderDetails from './OrderDetails';
import { Order } from './OrderList';
import { useAuth } from '../autoeization/AuthContext';
import CourierSwitcher from './CourierSwitcher';

interface Props {
  order: Order;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  disableTimers?: boolean;
}

const OrderItem: React.FC<Props> = ({ order, setOrders, disableTimers }) => {
  const { user } = useAuth();
  const [localOrder, setLocalOrder] = useState<Order>({
    ...order,
    items: order.items.map(item => ({
      ...item,
      ready: item.ready ?? false
    }))
  });

  const [selectedCourierId, setSelectedCourierId] = useState<number | null>(null);

  useEffect(() => {
    setLocalOrder({
      ...order,
      items: order.items.map(item => ({
        ...item,
        ready: item.ready ?? false
      }))
    });
  }, [order]);

  const [timeSinceCreation, setTimeSinceCreation] = useState<string>('');
  const [timeUntilDelivery, setTimeUntilDelivery] = useState<string>('');
  const [timeInCurrentStatus, setTimeInCurrentStatus] = useState<string>('');

  const formatDuration = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }, []);

  useEffect(() => {
    if (disableTimers || user?.role === 'courier') return;

    const createdAt = new Date(order.created_at);
    const statusChangedAt = new Date(order.status_changed_at || order.created_at);

    const calculateTimes = () => {
      const now = new Date();

      let deliveryTime = new Date();
      if (order.delivery_time) {
        const [day, time] = order.delivery_time.split(', ');
        const [hours, minutes] = time.split(':').map(Number);

        if (day === 'Завтра') {
          deliveryTime.setDate(deliveryTime.getDate() + 1);
        }

        deliveryTime.setHours(hours);
        deliveryTime.setMinutes(minutes);
        deliveryTime.setSeconds(0);
      }

      const timeSinceCreationMs = now.getTime() - createdAt.getTime();
      const timeUntilDeliveryMs = deliveryTime.getTime() - now.getTime();
      const timeInCurrentStatusMs = now.getTime() - statusChangedAt.getTime();

      setTimeSinceCreation(formatDuration(timeSinceCreationMs));
      setTimeUntilDelivery(formatDuration(timeUntilDeliveryMs));
      setTimeInCurrentStatus(formatDuration(timeInCurrentStatusMs));
    };

    calculateTimes();
    const intervalId = setInterval(calculateTimes, 1000);

    return () => clearInterval(intervalId);
  }, [order, disableTimers, formatDuration, user]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const updatedStatusChangedAt = new Date().toISOString();
      await axios.put(`http://localhost:3000/orders/${id}/status`, { status, status_changed_at: updatedStatusChangedAt }, { withCredentials: true });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status, status_changed_at: updatedStatusChangedAt } : order
        )
      );
    } catch (error: any) {
      console.error('Error updating order status:', error.message);
    }
  };

  const handleCancelOrder = async (id: number) => {
    try {
      const updatedStatusChangedAt = new Date().toISOString();
      await axios.put(`http://localhost:3000/orders/${id}/status`, { status: 'canceled', status_changed_at: updatedStatusChangedAt }, { withCredentials: true });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: 'canceled', status_changed_at: updatedStatusChangedAt } : order
        )
      );
    } catch (error: any) {
      console.error('Error canceling order:', error.message);
    }
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const updatedItems = localOrder.items.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setLocalOrder({ ...localOrder, items: updatedItems });
  };

  const handleConfirmChange = async (productId: number, newQuantity: number) => {
    try {
      const updatedItems = localOrder.items.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      const updatedOrder = { ...localOrder, items: updatedItems };

      const orderWithUserData = {
        ...updatedOrder,
        first_name: order.first_name,
        last_name: order.last_name,
        address: order.address,
        phone: order.phone
      };

      setLocalOrder(orderWithUserData);

      await axios.put(`http://localhost:3000/orders/${order.id}/items`, { items: updatedItems }, { withCredentials: true });
      setOrders((prevOrders) =>
        prevOrders.map((ord) =>
          ord.id === order.id ? orderWithUserData : ord
        )
      );
    } catch (error: any) {
      console.error('Error updating product quantity:', error.message);
    }
  };

  const handleReadyChange = (productId: number, ready: boolean) => {
    const updatedItems = localOrder.items.map(item =>
      item.productId === productId ? { ...item, ready } : item
    );
    setLocalOrder({ ...localOrder, items: updatedItems });
  };

  const handleDeliveryModeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeliveryOption = e.target.value as 'courier' | 'manual' | 'self';
    try {
      await axios.put(`http://localhost:3000/orders/${order.id}/delivery-option`, { deliveryOption: newDeliveryOption }, { withCredentials: true });
      setLocalOrder(prevOrder => ({
        ...prevOrder,
        delivery_option: newDeliveryOption
      }));
    } catch (error: any) {
      console.error('Ошибка обновления режима доставки:', error.message);
    }
  };

  const allItemsReady = localOrder.items.every(item => item.ready);

  return (
    <OrderListItem isCanceled={order.status === 'canceled'}>
      <OrderDetailsContainer>
        <div className="order-header">
          <p>Идентификатор заказа: <strong>{order.id}</strong></p>
          {user?.role === 'admin' && (
            <p>Идентификатор пользователя: <strong>{order.user_id}</strong></p>
          )}
        </div>
        <div className="order-user-info">
          <p>Пользователь: <strong>{order.first_name} {order.last_name}</strong></p>
          <p>Адрес: <strong>{order.address}</strong></p>
          <p>Телефон: <a href={`tel:${order.phone}`}><strong>{order.phone}</strong></a></p>
        </div>
        <div className="order-summary">
          <p>Итог: <strong>${order.total}</strong></p>
          <p>Статус: <strong>{order.status}</strong></p>
          <p>Время доставки: <strong>{order.delivery_time}</strong></p>
          <p>
            Режим доставки: 
            <select value={localOrder.delivery_option} onChange={handleDeliveryModeChange}>
              <option value="courier">Курьер</option>
              <option value="manual">Ручной</option>
              <option value="self">Самовывоз</option>
            </select>
          </p>
        </div>
        {!disableTimers && user?.role === 'admin' && (
          <div className="order-timers">
            <p>Время с момента создания: <strong>{timeSinceCreation}</strong></p>
            <p>Время до доставки: <strong>{timeUntilDelivery}</strong></p>
            <p>Время в текущем статусе: <strong>{timeInCurrentStatus}</strong></p>
          </div>
        )}
        {localOrder.delivery_option === 'manual' && (
          <CourierSwitcher selectedCourierId={selectedCourierId} setSelectedCourierId={setSelectedCourierId} />
        )}
        <div className="order-actions">
          <StatusButton onClick={() => handleStatusChange(order.id, allItemsReady ? 'ready_for_delivery' : order.status === 'pending' ? 'assembly' : 'pending')}>
            {allItemsReady ? 'Готово к передаче курьеру' : order.status === 'pending' ? 'Начать сборку' : 'Вернуться к состоянию ожидания'}
          </StatusButton>
          {order.status === 'canceled' ? (
            <DisabledCancelButton disabled>Отменить</DisabledCancelButton>
          ) : (
            <CancelButton onClick={() => handleCancelOrder(order.id)}>Отменить</CancelButton>
          )}
        </div>
        <OrderDetails 
          items={localOrder.items} 
          createdAt={order.created_at} 
          handleQuantityChange={handleQuantityChange} 
          handleConfirmChange={handleConfirmChange} 
          handleReadyChange={handleReadyChange}
          showCheckboxes={order.status === 'assembly'}
        />
      </OrderDetailsContainer>
    </OrderListItem>
  );
};

export default OrderItem;