// src/components/OrderCard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import { Order } from '../orderList/OrderList';
import { Card, Header, DetailsButton, ProductList, ProductItem } from './styledauth/OrderCardStyles';


interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCancelable, setIsCancelable] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCancelable(false);
    }, 10000); // 10 секунд

    return () => clearTimeout(timer);
  }, []);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const cancelOrder = async () => {
    try {
      await axios.put(`http://localhost:3000/orders/${order.id}/status`, { status: 'canceled' });
      alert('Заказ отменен');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при отмене заказа:', error.message);
      } else {
        console.error('Ошибка при отмене заказа:', error);
      }
    }
  };

  const handleCancelClick = () => {
    if (isCancelable) {
      cancelOrder();
    } else {
      setShowModal(true);
    }
  };

  const handleConfirmCancel = async () => {
    try {
      await axios.put(`http://localhost:3000/orders/${order.id}/status`, { status: 'canceled' });
      alert('Заказ отменен');
      setShowModal(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при отмене заказа:', error.message);
      } else {
        console.error('Ошибка при отмене заказа:', error);
      }
    }
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
        <CancelButton onClick={handleCancelClick}>
          Отменить заказ
        </CancelButton>
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
      {showModal && (
        <Modal>
          <ModalContent>
            <p>Время бесплатной отмены прошло. При отмене будет возвращено только 95% от общей суммы заказа.</p>
            <ModalButton onClick={handleConfirmCancel}>Подтвердить</ModalButton>
            <ModalButton onClick={() => setShowModal(false)}>Отмена</ModalButton>
          </ModalContent>
        </Modal>
      )}
    </Card>
  );
};

const CancelButton = styled.button`
  padding: 10px;
  margin-top: 10px;
  border: none;
  background-color: #ff0000;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #cc0000;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ModalButton = styled.button`
  margin: 10px;
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

export default OrderCard;