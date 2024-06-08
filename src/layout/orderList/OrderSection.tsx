import React, { useState } from 'react';
import OrderItem from './OrderItem';
import { StyledOrderList, CanceledOrderList, SectionTitle, ToggleButton } from '../../styles/OrderListStyles';
import { Order } from './OrderList';

interface OrderSectionProps {
  title: string;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  showCanceledOrders?: boolean;
  setShowCanceledOrders?: React.Dispatch<React.SetStateAction<boolean>>;
  disableTimers?: boolean;
}

const OrderSection: React.FC<OrderSectionProps> = ({ title, orders, setOrders, showCanceledOrders, setShowCanceledOrders, disableTimers }) => {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      {showCanceledOrders !== undefined && setShowCanceledOrders !== undefined ? (
        <>
          <ToggleButton onClick={() => setShowCanceledOrders(!showCanceledOrders)}>
            {showCanceledOrders ? 'Скрыть отмененные заказы' : 'Показать отмененные заказы'}
          </ToggleButton>
          {showCanceledOrders && (
            <CanceledOrderList>
              {orders.map((order) => (
                <OrderItem key={order.id} order={order} setOrders={setOrders} disableTimers={disableTimers} />
              ))}
            </CanceledOrderList>
          )}
        </>
      ) : (
        <StyledOrderList>
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} setOrders={setOrders} />
          ))}
        </StyledOrderList>
      )}
    </div>
  );
};

export default OrderSection;
