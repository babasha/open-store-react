// src/layout/orderList/OrderDetails.tsx

import React from 'react';
import OrderProductList from './OrderProductList';
import { OrderDetailsContainer } from '../../styles/OrderListStyles';

interface Item {
  productId: number;
  productName: string;
  quantity: number;
  ready: boolean;
}

interface Props {
  items: Item[];
  createdAt: string;
  handleQuantityChange: (productId: number, newQuantity: number) => void;
  handleConfirmChange: (productId: number, newQuantity: number) => void;
  handleReadyChange: (productId: number, ready: boolean) => void;
  showCheckboxes: boolean;
}

const OrderDetails: React.FC<Props> = ({ items, createdAt, handleQuantityChange, handleConfirmChange, handleReadyChange, showCheckboxes }) => {
  return (
    <OrderDetailsContainer>
      <OrderProductList 
        items={items} 
        handleQuantityChange={handleQuantityChange} 
        handleConfirmChange={handleConfirmChange} 
        handleReadyChange={handleReadyChange}
        showCheckboxes={showCheckboxes}
      />
      <p>Создано: {new Date(createdAt).toLocaleString()}</p>
    </OrderDetailsContainer>
  );
};

export default OrderDetails;
