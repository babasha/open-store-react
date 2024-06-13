import React from 'react';
import { motion } from 'framer-motion';
import { Order } from '../../orderList/OrderList';
import { ProductList, ProductItem } from '../styledauth/OrderCardStyles';
import { useTranslation } from 'react-i18next';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const { t } = useTranslation();

  return (
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
            <p>{t('product')}: {item.productName}</p>
            <p>{t('quantity')}: {item.quantity}</p>
          </ProductItem>
        ))}
      </ProductList>
    </motion.div>
  );
};

export default OrderDetails;
