import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Container } from '../../components/Container';
import { FlexWrapper } from '../../components/FlexWrapper'; 
import { BascketTitle } from '../../layout/basket/BasketStyles'; 
import { usePurchasedItems } from './PurchasedItemsContext'; // Создадим контекст для купленных товаров
import { useLocation } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { purchasedItems, clearPurchasedItems } = usePurchasedItems();
  const [counter, setCounter] = useState(30);

  const location = useLocation();
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

  const handleDownloadReceipt = () => {
    // Функция для скачивания чека
    const receiptData = purchasedItems.map((item) => {
      return `${item.title} - ${item.quantity} x ${item.price} ₾`;
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
      <Message>{t('payment.orderNumber')}: {orderId}</Message> {/* Добавили отображение номера заказа */}
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
