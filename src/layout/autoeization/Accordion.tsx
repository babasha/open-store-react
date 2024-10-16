import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderCard from './OrderCart/OrderCard';
import { Order } from '../orderList/OrderList';
import { AccordionHeader, OrderList, LoadMoreButton } from './styledauth/AccordionStyles';
import { useTranslation } from 'react-i18next';

interface AccordionProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  orders: Order[];
  loadMore: () => void;
  allOrdersCount: number;
}

const Accordion: React.FC<AccordionProps> = ({ title, isOpen, onClick, orders, loadMore, allOrdersCount }) => {
  const { t } = useTranslation();

  return (
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
              <LoadMoreButton onClick={loadMore}>{t('load_more')}</LoadMoreButton>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Accordion;
