// src/layout/orderList/OrderItem.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { OrderListItem, StatusButton, CancelButton, DisabledCancelButton } from '../../styles/OrderListStyles';
import OrderDetails from './OrderDetails';
import { Order, Item } from './OrderList'; // Убедитесь, что импортируется правильный тип

interface Props {
  order: Order;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  disableTimers?: boolean;
}

const OrderItem: React.FC<Props> = ({ order, setOrders, disableTimers }) => {
  const [localOrder, setLocalOrder] = useState<Order>({
    ...order,
    items: order.items.map(item => ({
      ...item,
      ready: item.ready ?? false // Установка значения по умолчанию
    }))
  });

  useEffect(() => {
    setLocalOrder({
      ...order,
      items: order.items.map(item => ({
        ...item,
        ready: item.ready ?? false // Установка значения по умолчанию
      }))
    });
  }, [order]);

  const [timeSinceCreation, setTimeSinceCreation] = useState<string>('');
  const [timeUntilDelivery, setTimeUntilDelivery] = useState<string>('');
  const [timeInCurrentStatus, setTimeInCurrentStatus] = useState<string>('');

  useEffect(() => {
    if (disableTimers) return;

    const calculateTimes = () => {
      const createdAt = new Date(order.created_at);
      const now = new Date();

      let deliveryTime;
      if (order.delivery_time) {
        const [day, time] = order.delivery_time.split(', ');
        const [hours, minutes] = time.split(':').map(Number);
        deliveryTime = new Date();

        if (day === 'Сегодня') {
          // Ничего не делаем, дата остается сегодняшней
        } else if (day === 'Завтра') {
          deliveryTime.setDate(deliveryTime.getDate() + 1);
        }

        deliveryTime.setHours(hours);
        deliveryTime.setMinutes(minutes);
        deliveryTime.setSeconds(0);
      } else {
        deliveryTime = new Date(); // По умолчанию устанавливаем текущую дату
      }

      const timeSinceCreationMs = now.getTime() - createdAt.getTime();
      const timeUntilDeliveryMs = deliveryTime.getTime() - now.getTime();
      const statusChangedAt = new Date(order.status_changed_at || order.created_at);
      const timeInCurrentStatusMs = now.getTime() - statusChangedAt.getTime();

      setTimeSinceCreation(formatDuration(timeSinceCreationMs));
      setTimeUntilDelivery(formatDuration(timeUntilDeliveryMs));
      setTimeInCurrentStatus(formatDuration(timeInCurrentStatusMs));
    };

    const formatDuration = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${hours}h ${minutes}m ${seconds}s`;
    };

    calculateTimes();
    const intervalId = setInterval(calculateTimes, 1000);

    return () => clearInterval(intervalId);
  }, [order, disableTimers]);

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
      console.error('Ошибка при обновлении статуса заказа:', error.message);
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
      console.error('Ошибка при отмене заказа:', error.message);
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

      // Убедитесь, что данные о пользователе не пропадают
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
      console.error('Ошибка при изменении количества продукта:', error.message);
    }
  };

  const handleReadyChange = (productId: number, ready: boolean) => {
    const updatedItems = localOrder.items.map(item =>
      item.productId === productId ? { ...item, ready } : item
    );
    setLocalOrder({ ...localOrder, items: updatedItems });
  };

  const allItemsReady = localOrder.items.every(item => item.ready);

  return (
    <OrderListItem isCanceled={order.status === 'canceled'}>
      <div>
        <p>Идентификатор заказа: {order.id}</p>
        <p>Идентификатор пользователя: {order.user_id}</p>
        <p>Пользователь: {order.first_name} {order.last_name}</p>
        <p>Адрес: {order.address}</p>
        <p>Телефон: <a href={`tel:${order.phone}`}><strong>{order.phone}</strong></a></p>
        <p>Итог: ${order.total}</p>
        <p>Статус: {order.status}</p>
        <p>Время доставки: {order.delivery_time}</p>
        {!disableTimers && (
          <>
            <p>Время с момента создания: {timeSinceCreation}</p>
            <p>Время до доставки: {timeUntilDelivery}</p>
            <p>Время в текущем статусе: {timeInCurrentStatus}</p>
          </>
        )}
        <StatusButton onClick={() => handleStatusChange(order.id, allItemsReady ? 'ready_for_delivery' : order.status === 'pending' ? 'assembly' : 'pending')}>
          {allItemsReady ? 'Готово к передаче курьеру' : order.status === 'pending' ? 'Начать сборку' : 'Вернуться к состоянию ожидания'}
        </StatusButton>
        {order.status === 'canceled' ? (
          <DisabledCancelButton disabled>Отменить</DisabledCancelButton>
        ) : (
          <CancelButton onClick={() => handleCancelOrder(order.id)}>Отменить</CancelButton>
        )}
        <OrderDetails 
          items={localOrder.items} 
          createdAt={order.created_at} 
          handleQuantityChange={handleQuantityChange} 
          handleConfirmChange={handleConfirmChange} 
          handleReadyChange={handleReadyChange}
          showCheckboxes={order.status === 'assembly'}
        />
      </div>
    </OrderListItem>
  );
};

export default OrderItem;
