// src/components/OrderDetails.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Order } from '../../orderList/OrderList';
// import { ProductList } from ;
import { ProductList, ProductItem } from '../styledauth/OrderCardStyles' ;

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => (
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
);

export default OrderDetails;
