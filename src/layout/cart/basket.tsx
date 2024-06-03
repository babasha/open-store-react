import React, { useRef, useState, useMemo } from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { useCart } from './CartContext';
import { useAuth } from '../autoeization/AuthContext';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/Theme';
import { FlexWrapper } from '../../components/FlexWrapper';

export const Basket: React.FC = () => {
  const { t } = useTranslation();
  const { cartItems, removeItemFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const deliveryCost = totalPrice > 30 ? 0 : 5;

  const totalWithDelivery = totalPrice + deliveryCost;

  const handlePurchase = async () => {
    if (!user) {
      setError('Вы не авторизованы');
      return;
    }

    const orderData = {
      userId: user.id,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      total: totalWithDelivery,
    };

    try {
      const response = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при оформлении заказа');
      }

      clearCart();
      alert('Заказ успешно оформлен');
    } catch (error) {
      setError('Ошибка при оформлении заказа');
    }
  };

  return (
    <Container width={'100%'}>
      <CartdiInner>
        <FlexWrapper align='center' justify='space-between'>
          <h2>{t('cart.title')}</h2>
          <EditButton onClick={handleEditClick}>
            {isEditing ? t('cart.finishEditing') : t('cart.edit')}
          </EditButton>
        </FlexWrapper>

        {cartItems.length === 0 && <p>{t('cart.empty')}</p>}
        {cartItems.map((item) => (
          <CartItem key={item.id}>
            <ItemDetails>
              <ItemContextTitle>{item.title}</ItemContextTitle>
              <ItemContext>{item.quantity} кг</ItemContext>
              <ItemContext>{item.price * item.quantity} ₾</ItemContext>
            </ItemDetails>
            <DeleteButton isEditing={isEditing} onClick={() => removeItemFromCart(item.id)}>
              {t('cart.delete')}
            </DeleteButton>
          </CartItem>
        ))}
        {cartItems.length > 0 && (
          <>
            <CartItem>
              <ItemDetails>
                <span>{t('cart.delivery')}</span>
                <span>{deliveryCost === 0 ? t('cart.free') : `${deliveryCost} GEL`}</span>
              </ItemDetails>
            </CartItem>
            <TotalPrice>{t('cart.total')}: {totalWithDelivery} ₾</TotalPrice>
            <FlexWrapper justify='space-between'>
              <EditButton onClick={clearCart}>{t('cart.clear')}</EditButton>
              <PurchaseButton onClick={handlePurchase}>{t('cart.purchase')}</PurchaseButton>
            </FlexWrapper>
            {error && <ErrorText>{error}</ErrorText>}
          </>
        )}
      </CartdiInner>
    </Container>
  );
};

const CartdiInner = styled.div`
  background-color: ${theme.colors.mainBg};
  margin-top: 10px;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
`;

const CartItem = styled.div`
  display: flex;
  position: relative;
  margin-top: 15px;
  margin-bottom: 10px;
`;

const ItemDetails = styled.div`
  flex-grow: 1;
`;

const DeleteButton = styled.button<{ isEditing: boolean }>`
  position: absolute;
  right: ${({ isEditing }) => (isEditing ? '0' : '-100px')};
  opacity: ${({ isEditing }) => (isEditing ? 1 : 0)};
  transition: right 0.3s ease-in-out, opacity 0.3s ease-in-out;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #d9534f;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }
`;

const EditButton = styled.button`
  color: ${theme.button.buttonActive};
  cursor: pointer;
`;

const PurchaseButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #5cb85c;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #4cae4c;
  }
`;

const TotalPrice = styled.div`
  margin-top: 10px;
  font-weight: bold;
  font-size: 20px;
`;

const ItemContext = styled.span`
  margin-right: 25px;
  font-size: 16px;
`;

const ItemContextTitle = styled.span`
  font-weight: bold;
  margin-right: 25px;
  font-size: 16px;
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 10px;
`;

export default Basket;
