import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Order } from '../orderList/OrderList';

const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
  <Card
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <p>Заказ #{order.id}</p>
    <p>Статус: {order.status}</p>
    <p>Общая сумма: ${order.total}</p>
    <p>Создан: {new Date(order.created_at).toLocaleString()}</p>
    <p>Время доставки: {order.delivery_time}</p>
  </Card>
);

const Card = styled(motion.li)`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export default OrderCard;
