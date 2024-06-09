import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '../orderList/OrderList';

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <p>Заказ #{order.id}</p>
        <p>Статус: {order.status}</p>
        <p>Общая сумма: ${order.total}</p>
        <p>Время доставки: {order.delivery_time ? order.delivery_time : 'в ближайшее время'}</p>
        <DetailsButton onClick={toggleAccordion}>
          {isOpen ? 'Скрыть список' : 'Подробный список'}
        </DetailsButton>
      </Header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={order.id}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <ProductList>
              {order.items.map(item => (
                <ProductItem key={item.productId}>
                  <p>Товар: {item.productName}</p>
                  <p>Количество: {item.quantity}</p>
                </ProductItem>
              ))}
            </ProductList>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

const Card = styled(motion.li)`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const DetailsButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ProductList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ProductItem = styled.li`
  border-top: 1px solid #eee;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;

  &:first-child {
    border-top: none;
  }
`;

export default OrderCard;
