import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Container } from '../../components/Container';
import { FlexWrapper } from '../../components/FlexWrapper';
import { BascketTitle } from '../../layout/basket/BasketStyles';

const PaymentSuccess: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [counter, setCounter] = useState(30);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [cardToken, setCardToken] = useState<string | null>(null);
  const [bankOrderId, setBankOrderId] = useState<string | null>(null);

  // Новые состояния для дополнительных данных заказа
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const externalOrderId = params.get('externalOrderId');

  useEffect(() => {
    if (externalOrderId) {
      fetch(`/api/orders?externalOrderId=${externalOrderId}`)
        .then(response => response.json())
        .then(data => {
          setOrderId(data.id);
          setPurchasedItems(data.items); // Если items уже объект
          setTotal(data.total);
          setCardToken(data.card_token);
          setBankOrderId(data.bank_order_id);
        })
        .catch(error => {
          console.error('Ошибка при получении данных заказа:', error);
          setError('Не удалось загрузить данные заказа.');
        });
    }
  }, [externalOrderId]);

  // Второй useEffect для получения подробных данных заказа по orderId
  useEffect(() => {
    if (orderId) {
      fetch(`/api/order/${orderId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Заказ не найден');
          }
          return response.json();
        })
        .then(data => {
          setOrderDetails(data);
        })
        .catch(error => {
          console.error('Ошибка при получении подробных данных заказа:', error);
          setError('Не удалось загрузить подробные данные заказа.');
        });
    }
  }, [orderId]);

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
    const receiptData = purchasedItems.map((item) => {
      return `${item.description} - ${item.quantity} x ${item.unit_price} ₾`;
    }).join('\n');

    const blob = new Blob([receiptData], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'receipt.txt';
    link.click();

    window.URL.revokeObjectURL(url);
  };

  const handleReturnToShop = () => {
    navigate('/');
  };

  return (
    <Container width="100%">
      <FlexWrapper justify="center" align="center" style={{ minHeight: '80vh', flexDirection: 'column' }}>
        <BascketTitle>{t('payment.successTitle')}</BascketTitle>
        <Message>{t('payment.orderNumber')}: {orderId}</Message>
        <Message>{t('payment.successMessage')}</Message>

        {/* Отображение подробных данных заказа */}
        {orderDetails && (
          <OrderDetails>
            <h3>{t('payment.orderDetails')}</h3>
            <p><strong>ID:</strong> {orderDetails.id}</p>
            <p><strong>User ID:</strong> {orderDetails.user_id}</p>
            <p><strong>Total:</strong> {orderDetails.total} ₾</p>
            <p><strong>Status:</strong> {orderDetails.status}</p>
            <p><strong>Created At:</strong> {new Date(orderDetails.created_at).toLocaleString()}</p>
            <p><strong>Delivery Time:</strong> {orderDetails.delivery_time}</p>
            <p><strong>Delivery Option:</strong> {orderDetails.delivery_option}</p>
            <p><strong>Delivery Address:</strong> {orderDetails.delivery_address}</p>
            <p><strong>Courier ID:</strong> {orderDetails.courier_id}</p>
            <p><strong>Payment Status:</strong> {orderDetails.payment_status}</p>
            <p><strong>Bank Order ID:</strong> {orderDetails.bank_order_id}</p>
            <p><strong>Receipt URL:</strong> <a href={orderDetails.receipt_url} target="_blank" rel="noopener noreferrer">Скачать чек</a></p>
            <p><strong>External Order ID:</strong> {orderDetails.external_order_id}</p>
            <p><strong>Card Token:</strong> {orderDetails.card_token}</p>
          </OrderDetails>
        )}

        {error && <Message style={{ color: 'red' }}>{error}</Message>}

        {/* Отображение списка купленных товаров */}
        <ItemsList>
          {purchasedItems.map((item, index) => (
            <Item key={index}>
              {item.description} - {item.quantity} x {item.unit_price} ₾
            </Item>
          ))}
        </ItemsList>

        <ButtonsWrapper>
          <Button onClick={handleReturnToShop}>{t('payment.returnToShop')}</Button>
          <Button onClick={handleDownloadReceipt}>{t('payment.downloadReceipt')}</Button>
        </ButtonsWrapper>

        <AutoRedirectMessage>
          {t('payment.autoRedirect')} {counter} {t('payment.seconds')}
        </AutoRedirectMessage>
      </FlexWrapper>
    </Container>
  );
};

export default PaymentSuccess;

// Стили
const Message = styled.p`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
`;

const ItemsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 20px;
  width: 100%;
  max-width: 500px;
`;

const Item = styled.li`
  font-size: 16px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
`;

const AutoRedirectMessage = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const OrderDetails = styled.div`
  margin-top: 20px;
  text-align: left;

  h3 {
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
  }

  a {
    color: blue;
    text-decoration: underline;
  }
`;
