import React from 'react';
import styled from 'styled-components';

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
  /* font-weight: bold; */
  font-variation-settings: "wght" 600;
  color: #333;
  margin-top: 20px;
`;

const Status = styled.div`
  margin-top: 10px;
  color: #007bff;
  /* font-weight: bold; */
  font-variation-settings: "wght" 600;

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
  const order = {
    orderNumber: '162',
    items: [
      { name: 'Lightly salted salmon', quantity: 1, price: '90.00' },
      { name: 'Soup set', quantity: 1, price: '15.00' },
    ],
    total: '105.00',
    status: 'Pending Delivery',
  };

  return (
    <SuccessContainer>
      <Message>Thank you for your purchas!</Message>
      <OrderDetails>
        <OrderNumber>Order Number: {order.orderNumber}</OrderNumber>
        {order.items.map((item, index) => (
          <OrderItem key={index}>
            <span>{item.name} x{item.quantity}</span>
            <span>{item.price} ₾</span>
          </OrderItem>
        ))}
        <TotalAmount>Total: {order.total} ₾</TotalAmount>
        <Status>Status: {order.status}</Status>
      </OrderDetails>
      <ReturnButton onClick={() => window.location.href = '/'}>Return to Homepage</ReturnButton>
    </SuccessContainer>
  );
};

export default SuccessPage;