import React from 'react';
import { Order } from './OrderList'; // Убедитесь, что импортируется правильный тип
import OrderItem from './OrderItem';
import { StyledOrderList, CanceledOrderList, SectionTitle, ToggleButton } from '../../styles/OrderListStyles';
import { useAuth } from '../autoeization/AuthContext'; // Убедитесь, что путь к AuthContext правильный

interface OrderSectionProps {
  title: string;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  showCanceledOrders?: boolean;
  setShowCanceledOrders?: React.Dispatch<React.SetStateAction<boolean>>;
  disableTimers?: boolean;
}

const OrderSection: React.FC<OrderSectionProps> = ({
  title,
  orders,
  setOrders,
  showCanceledOrders,
  setShowCanceledOrders,
  disableTimers
}) => {
  const { user } = useAuth();

  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      {user?.role === 'admin' ? (
        <>
          {showCanceledOrders !== undefined && setShowCanceledOrders !== undefined && (
            <ToggleButton onClick={() => setShowCanceledOrders(!showCanceledOrders)}>
              {showCanceledOrders ? 'Скрыть отмененные заказы' : 'Показать отмененные заказы'}
            </ToggleButton>
          )}
          {showCanceledOrders && (
            <CanceledOrderList>
              {orders
                .filter(order => order.status === 'canceled')
                .map((order) => (
                  <OrderItem
                    key={order.id}
                    order={order}
                    setOrders={setOrders}
                    disableTimers={disableTimers}
                  />
                ))}
            </CanceledOrderList>
          )}
          <StyledOrderList>
            {orders
              .filter(order => order.status !== 'canceled')
              .map((order) => (
                <OrderItem key={order.id} order={order} setOrders={setOrders} />
              ))}
          </StyledOrderList>
        </>
      ) : (
        <StyledOrderList>
          {orders
            .filter(order => order.status !== 'canceled')
            .map((order) => (
              <OrderItem key={order.id} order={order} setOrders={setOrders} />
            ))}
        </StyledOrderList>
      )}
    </div>
  );
};

export default OrderSection;
