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
  user_id: number;
  items: OrderItem[];
  total: string;
  status: string;
  created_at: string;
  delivery_time: string | null;
  delivery_option: string | null;
  delivery_address: string | null;
  courier_id: number | null;
  payment_status: string;
  bank_order_id: string;
  receipt_url: string | null;
  external_order_id: string;
  card_token: string;
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
    if (orderDetails?.receipt_url) {
      window.open(orderDetails.receipt_url, '_blank');
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

            <OrderDetailsContainer>
              <h3>{t('payment.orderDetails')}</h3>
              <p><strong>ID заказа:</strong> {orderDetails.id}</p>
              <p><strong>ID пользователя:</strong> {orderDetails.user_id}</p>
              <p><strong>Итого:</strong> {orderDetails.total} ₾</p>
              <p><strong>Статус:</strong> {orderDetails.status}</p>
              <p><strong>Создан:</strong> {new Date(orderDetails.created_at).toLocaleString()}</p>
              <p><strong>Время доставки:</strong> {orderDetails.delivery_time || 'Не указано'}</p>
              <p><strong>Опция доставки:</strong> {orderDetails.delivery_option || 'Не указано'}</p>
              <p><strong>Адрес доставки:</strong> {orderDetails.delivery_address || 'Не указано'}</p>
              <p><strong>ID курьера:</strong> {orderDetails.courier_id || 'Не назначен'}</p>
              <p><strong>Статус оплаты:</strong> {orderDetails.payment_status}</p>
              <p><strong>ID банковского заказа:</strong> {orderDetails.bank_order_id}</p>
              <p><strong>Внешний ID заказа:</strong> {orderDetails.external_order_id}</p>
            </OrderDetailsContainer>

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


const Message = styled.p`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
`;
export const OrderDetailsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  padding: 25px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;

  h3 {
    margin-bottom: 20px;
    font-size: 1.8em;
    color: #2c3e50;
    border-bottom: 2px solid #ecf0f1;
    padding-bottom: 10px;
  }

  p {
    margin: 10px 0;
    font-size: 1em;
    color: #34495e;
    line-height: 1.6;

    strong {
      color: #2c3e50;
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
    
    h3 {
      font-size: 1.5em;
    }

    p {
      font-size: 0.95em;
    }
  }
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