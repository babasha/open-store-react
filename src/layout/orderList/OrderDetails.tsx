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
  handleQuantityChange: (productId: number, newQuantity: number) => void;
  handleConfirmChange: (productId: number, newQuantity: number) => void;
}

const OrderDetails: React.FC<Props> = ({ items, createdAt, handleQuantityChange, handleConfirmChange }) => {
  return (
    <OrderDetailsContainer>
      <OrderProductList 
        items={items} 
        handleQuantityChange={handleQuantityChange} 
        handleConfirmChange={handleConfirmChange} 
      />
      <p>Создано: {new Date(createdAt).toLocaleString()}</p>
    </OrderDetailsContainer>
  );
};

export default OrderDetails;
