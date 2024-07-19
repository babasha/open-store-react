import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import { Order } from '../../orderList/OrderList';
import { Card, ProductList, ProductItem } from '../styledauth/OrderCardStyles';
import OrderHeader from './OrderHeader';
import OrderDetails from './OrderDetails';
import CancelModal from './CancelModal';
import { useTranslation } from 'react-i18next';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCancelable, setIsCancelable] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCancelable(false);
    }, 10000); // 10 секунд

    return () => clearTimeout(timer);
  }, []);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const cancelOrder = useCallback(async () => {
    try {
      await axios.put(`https://enddel.com/orders/${order.id}/status`, { status: 'canceled' });
      alert(t('order_canceled'));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(t('cancel_order_error'), error.message);
      } else {
        console.error(t('cancel_order_error'), error);
      }
    }
  }, [order.id, t]);

  const handleCancelClick = useCallback(() => {
    if (isCancelable) {
      cancelOrder();
    } else {
      setShowModal(true);
    }
  }, [isCancelable, cancelOrder]);

  const handleConfirmCancel = useCallback(async () => {
    try {
      await axios.put(`https://enddel.com/orders/${order.id}/status`, { status: 'canceled' });
      alert(t('order_canceled'));
      setShowModal(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(t('cancel_order_error'), error.message);
      } else {
        console.error(t('cancel_order_error'), error);
      }
    }
  }, [order.id, t]);

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <OrderHeader order={order} toggleAccordion={toggleAccordion} handleCancelClick={handleCancelClick} isOpen={isOpen} />
      <AnimatePresence initial={false}>
        {isOpen && (
          <OrderDetails order={order} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showModal && (
          <CancelModal handleConfirmCancel={handleConfirmCancel} handleClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </Card>
  );
};

export default OrderCard;
