import React from 'react';
import styled from 'styled-components';
import { Order } from '../../orderList/OrderList';
import { Header, DetailsButton } from '../styledauth/OrderCardStyles';
import { useTranslation } from 'react-i18next';

interface OrderHeaderProps {
  order: Order;
  toggleAccordion: () => void;
  handleCancelClick: () => void;
  isOpen: boolean;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ order, toggleAccordion, handleCancelClick, isOpen }) => {
  const { t } = useTranslation();

  return (
    <Header>
      <p>{t('order')} #{order.id}</p>
      <p>{t('status')}: {order.status}</p>
      <p>{t('total')}: ${order.total}</p>
      <p>{t('delivery_time')}: {order.delivery_time ? order.delivery_time : t('as_soon_as_possible')}</p>
      <DetailsButton onClick={toggleAccordion}>
        {isOpen ? t('hide_details') : t('show_details')}
      </DetailsButton>
      <CancelButton onClick={handleCancelClick}>
        {t('cancel_order')}
      </CancelButton>
    </Header>
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

export default OrderHeader;
