// src/components/OrderItem.tsx
import React from 'react';
import axios from 'axios';
import { OrderListItem, StatusButton } from '../../styles/OrderListStyles';
import OrderDetails from './OrderDetails';

interface Item {
  productId: number;
  productName: string;
  quantity: number;
}

interface Order {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  address: string;
  total: string;
  status: string;
  created_at: string;
  items: Item[];
}

interface Props {
  order: Order;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const OrderItem: React.FC<Props> = ({ order, setOrders }) => {
  const handleStatusChange = async (id: number, status: string) => {
    try {
      await axios.put(`http://localhost:3000/orders/${id}/status`, { status }, { withCredentials: true });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );
    } catch (error: any) {
      console.error('Ошибка при обновлении статуса заказа:', error.message);
    }
  };

  return (
    <OrderListItem>
      <div>
        <p>Идентификатор заказа: {order.id}</p>
        <p>Идентификатор пользователя: {order.user_id}</p>
        <p>Пользователь: {order.first_name} {order.last_name}</p>
        <p>Адрес: {order.address}</p>
        <p>Итог: ${order.total}</p>
        <p>Статус: {order.status}</p>
        <StatusButton onClick={() => handleStatusChange(order.id, order.status === 'pending' ? 'assembly' : 'pending')}>
          {order.status === 'pending' ? 'Начать сборку' : 'Вернуться к состоянию ожидания'}
        </StatusButton>
        <OrderDetails items={order.items} createdAt={order.created_at} />
      </div>
    </OrderListItem>
  );
};

export default OrderItem;
