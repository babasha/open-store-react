import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import OrderCard from './OrderCard';
import { Order } from '../orderList/OrderList';

const Accordion: React.FC<{
  title: string;
  isOpen: boolean;
  onClick: () => void;
  orders: Order[];
  loadMore: () => void;
  allOrdersCount: number;
}> = ({ title, isOpen, onClick, orders, loadMore, allOrdersCount }) => (
  <motion.div layout>
    <AccordionHeader onClick={onClick} aria-expanded={isOpen}>
      {title}
    </AccordionHeader>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key={title}
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: 'auto' },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <OrderList>
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </OrderList>
          {orders.length < allOrdersCount && (
            <LoadMoreButton onClick={loadMore}>Загрузить еще</LoadMoreButton>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const AccordionHeader = styled(motion.summary)`
  cursor: pointer;
  font-weight: bold;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 10px;
  &:hover {
    background: #e0e0e0;
  }
`;

const OrderList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LoadMoreButton = styled.button`
  padding: 10px;
  margin-top: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

export default Accordion;
