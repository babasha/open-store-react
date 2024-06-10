// src/components/OrderCard.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '../orderList/OrderList';
import { Card, Header, DetailsButton, ProductList, ProductItem } from './styledauth/OrderCardStyles' ;

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
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

export default OrderCard;
