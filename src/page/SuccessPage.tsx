// SuccessPage.jsx

import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
`;

const Message = styled.h1`
  font-size: 2.5rem;
  color: #4caf50;
  margin-bottom: 20px;
`;

const OrderDetails = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }
`;

const OrderNumber = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
`;

const TotalAmount = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-top: 20px;
`;

const ReceiptLink = styled.a`
  margin-top: 20px;
  font-size: 1.1rem;
  color: #007bff;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ReturnButton = styled.button`
  margin-top: 30px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const orderNumber = searchParams.get('orderNumber');
  const total = searchParams.get('total');
  const items = searchParams.get('items') ? JSON.parse(decodeURIComponent(searchParams.get('items')!)) : [];
  const receiptUrl = searchParams.get('receiptUrl'); // Получаем ссылку на чек

  return (
    <SuccessContainer>
      <Message>Спасибо за вашу покупку!</Message>
      <OrderDetails>
        <OrderNumber>Номер заказа: {orderNumber}</OrderNumber>
        {items.map((item: any, index: number) => (
          <OrderItem key={index}>
            <span>{item.description} x{item.quantity}</span>
            <span>{item.price} ₾</span>
          </OrderItem>
        ))}
        <TotalAmount>Итого: {total} ₾</TotalAmount>
        {receiptUrl && (
          <ReceiptLink href={receiptUrl} target="_blank" rel="noopener noreferrer">
            Скачать чек
          </ReceiptLink>
        )}
      </OrderDetails>
      <ReturnButton onClick={() => window.location.href = '/'}>Вернуться на главную</ReturnButton>
    </SuccessContainer>
  );
};

export default SuccessPage;
