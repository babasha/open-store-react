import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Container } from '../../components/Container';
import { FlexWrapper } from '../../components/FlexWrapper';
import { BascketTitle } from '../../layout/basket/BasketStyles';

interface OrderItem {
  price: number;
  quantity: number;
  productId: number;
  description: string;
}

interface OrderDetails {
  id: number;
  userId: number;
  items: OrderItem[];
  total: string;
  status: string;
  createdAt: string;
  deliveryTime: string | null;
  deliveryOption: string | null;
  deliveryAddress: string | null;
  courierId: number | null;
  paymentStatus: string;
  bankOrderId: string;
  receiptUrl: string | null;
  externalOrderId: string;
  cardToken: string;
}

const PaymentSuccess: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [counter, setCounter] = useState(30);

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const externalOrderId = params.get('externalOrderId');

  useEffect(() => {
    if (externalOrderId) {
      console.log('Fetching order data with externalOrderId:', externalOrderId);
      fetch(`/api/orders?externalOrderId=${externalOrderId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Заказ не найден');
          }
          return response.json();
        })
        .then(data => {
          console.log('Order data received:', data);
          setOrderDetails(data);
        })
        .catch(error => {
          console.error('Error fetching order data:', error);
          setError('Не удалось загрузить данные заказа.');
        });
    }
  }, [externalOrderId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 30000);

    const countdown = setInterval(() => {
      setCounter(prev => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, [navigate]);

  const handleDownloadReceipt = () => {
    if (orderDetails?.receiptUrl) {
      window.open(orderDetails.receiptUrl, '_blank');
    } else {
      alert('Чек недоступен');
    }
  };

  const handleReturnToShop = () => {
    navigate('/');
  };

  return (
    <Container width="100%">
      <FlexWrapper justify="center" align="center" style={{ minHeight: '80vh', flexDirection: 'column' }}>
        <BascketTitle>{t('payment.successTitle')}</BascketTitle>
        {orderDetails && (
          <>
            <Message>{t('payment.orderNumber')}: {orderDetails.id}</Message>
            <Message>{t('payment.successMessage')}</Message>

            <OrderDetails>
              <h3>{t('payment.orderDetails')}</h3>
              <p><strong>ID заказа:</strong> {orderDetails.id}</p>
              <p><strong>ID пользователя:</strong> {orderDetails.userId}</p>
              <p><strong>Итого:</strong> {orderDetails.total} ₾</p>
              <p><strong>Статус:</strong> {orderDetails.status}</p>
              <p><strong>Создан:</strong> {new Date(orderDetails.createdAt).toLocaleString()}</p>
              <p><strong>Время доставки:</strong> {orderDetails.deliveryTime || 'Не указано'}</p>
              <p><strong>Опция доставки:</strong> {orderDetails.deliveryOption || 'Не указано'}</p>
              <p><strong>Адрес доставки:</strong> {orderDetails.deliveryAddress || 'Не указано'}</p>
              <p><strong>ID курьера:</strong> {orderDetails.courierId || 'Не назначен'}</p>
              <p><strong>Статус оплаты:</strong> {orderDetails.paymentStatus}</p>
              <p><strong>ID банковского заказа:</strong> {orderDetails.bankOrderId}</p>
              <p><strong>Внешний ID заказа:</strong> {orderDetails.externalOrderId}</p>
            </OrderDetails>

            <ItemsList>
              <h3>{t('payment.orderedItems')}</h3>
              {orderDetails.items.map((item: OrderItem, index: number) => (
                <Item key={index}>
                  {item.description} - {item.quantity} x {item.price} ₾
                </Item>
              ))}
            </ItemsList>

            <ButtonsWrapper>
              <Button onClick={handleReturnToShop}>{t('payment.returnToShop')}</Button>
              <Button onClick={handleDownloadReceipt}>{t('payment.downloadReceipt')}</Button>
            </ButtonsWrapper>
          </>
        )}

        {error && <Message style={{ color: 'red' }}>{error}</Message>}

        <AutoRedirectMessage>
          {t('payment.autoRedirect')} {counter} {t('payment.seconds')}
        </AutoRedirectMessage>
      </FlexWrapper>
    </Container>
  );
};

export default PaymentSuccess;

// Стили остаются без изменений
const Message = styled.p`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
`;

const OrderDetails = styled.div`
  margin-top: 20px;
  text-align: left;
  max-width: 600px;
  width: 100%;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h3 {
    margin-bottom: 15px;
    color: #333;
  }

  p {
    margin: 10px 0;
    font-size: 16px;
  }

  strong {
    color: #555;
  }
`;

const ItemsList = styled.ul`
  list-style-type: none;
  padding: 20px;
  margin: 20px 0;
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h3 {
    margin-bottom: 15px;
    color: #333;
  }
`;

const Item = styled.li`
  font-size: 16px;
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const AutoRedirectMessage = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
`;