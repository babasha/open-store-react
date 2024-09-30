import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Container } from '../../components/Container';
import { FlexWrapper } from '../../components/FlexWrapper'; 
import { BascketTitle } from '../../layout/cart/BasketStyles'; 
import { usePurchasedItems } from './PurchasedItemsContext'; // Создадим контекст для купленных товаров
import axios from 'axios';


const PaymentSuccess: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { purchasedItems, clearPurchasedItems } = usePurchasedItems();
  const [counter, setCounter] = useState(30); // Инициализируем счётчик на 30 секунд

  // Получаем orderId из URL
  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 30000);

    const countdown = setInterval(() => {
      setCounter(prev => prev - 1); // Уменьшаем значение счётчика каждую секунду
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdown); // Очищаем таймеры при размонтировании компонента
    };
  }, [navigate]);

  const handleDownloadReceipt = async () => {
    try {
      if (!orderId) {
        throw new Error('Заказ не найден');
      }
  
      const response = await axios.get(`https://enddel.com/payment/receipt/${orderId}`, {
        responseType: 'blob',
      });
  
      if (response.status !== 200) {
        throw new Error('Не удалось получить чек');
      }
  
      const receiptBlob = new Blob([response.data], { type: 'application/pdf' });
  
      const url = window.URL.createObjectURL(receiptBlob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = 'receipt.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при скачивании чека:', error);
      // Дополнительная обработка ошибки
    }
  };

  const handleReturnToShop = () => {
    navigate('/');
  };

  return (
    <Container width="100%">
      <FlexWrapper justify="center" align="center" style={{ minHeight: '80vh', flexDirection: 'column' }}>
        <BascketTitle>{t('payment.successTitle')}</BascketTitle>
        <Message>{t('payment.successMessage')}</Message>

        <ItemsList>
          {purchasedItems.map((item) => (
            <Item key={item.id}>
              {item.title} - {item.quantity} x {item.price} ₾
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
