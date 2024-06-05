// src/components/OrderDetails.tsx
import React from 'react';
import OrderProductList from './OrderProductList';
import { OrderDetailsContainer } from '../../styles/OrderListStyles';

interface Item {
  productId: number;
  productName: string;
  quantity: number;
}

interface Props {
  items: Item[];
  createdAt: string;
}

const OrderDetails: React.FC<Props> = ({ items, createdAt }) => {
  return (
    <OrderDetailsContainer>
      <OrderProductList items={items} />
      <p>Создано: {new Date(createdAt).toLocaleString()}</p>
    </OrderDetailsContainer>
  );
};

export default OrderDetails;
