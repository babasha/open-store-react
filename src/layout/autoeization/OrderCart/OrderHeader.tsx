// src/components/OrderHeader.tsx
import React from 'react';
import styled from 'styled-components';
import { Order } from '../../orderList/OrderList';
import { Header, DetailsButton } from '../styledauth/OrderCardStyles';

interface OrderHeaderProps {
  order: Order;
  toggleAccordion: () => void;
  handleCancelClick: () => void;
  isOpen: boolean;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ order, toggleAccordion, handleCancelClick, isOpen }) => (
  <Header>
    <p>Заказ #{order.id}</p>
    <p>Статус: {order.status}</p>
    <p>Общая сумма: ${order.total}</p>
    <p>Время доставки: {order.delivery_time ? order.delivery_time : 'в ближайшее время'}</p>
    <DetailsButton onClick={toggleAccordion}>
      {isOpen ? 'Скрыть список' : 'Подробный список'}
    </DetailsButton>
    <CancelButton onClick={handleCancelClick}>
      Отменить заказ
    </CancelButton>
  </Header>
);

const CancelButton = styled.button`
  padding: 10px;
  margin-top: 10px;
  border: none;
  background-color: #ff0000;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #cc0000;
  }
`;

export default OrderHeader;
