import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { useCart } from './CartContext';
import { useTranslation } from 'react-i18next';

export const Basket: React.FC = () => {
  const { t } = useTranslation();
  const { cartItems, removeItemFromCart, clearCart } = useCart();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const deliveryCost = totalPrice > 30 ? 0 : 5;

  const totalWithDelivery = totalPrice + deliveryCost;

  return (
    <Container width={'auto'}>
      <CartdiInner>
        <h2>{t('cart.title')}</h2>
        {cartItems.length === 0 && <p>{t('cart.empty')}</p>}
        {cartItems.map((item) => (
          <CartItem key={item.id}>
            <ItemDetails>
              <span>{item.title}</span>
              <span>{item.quantity} кг</span>
              <span>{item.price * item.quantity} GEL</span>
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
                <span>1 услуга</span>
                <span>{deliveryCost === 0 ? t('cart.free') : `${deliveryCost} GEL`}</span>
              </ItemDetails>
            </CartItem>
            <TotalPrice>{t('cart.total')}: {totalWithDelivery} GEL</TotalPrice>
            <EditButton onClick={handleEditClick}>
              {isEditing ? t('cart.finishEditing') : t('cart.edit')}
            </EditButton>
            <button onClick={clearCart}>{t('cart.clear')}</button>
          </>
        )}
      </CartdiInner>
    </Container>
  );
};

const CartdiInner = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  position: relative;
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
  margin-top: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #5bc0de;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #31b0d5;
  }
`;

const TotalPrice = styled.div`
  margin-top: 10px;
  font-weight: bold;
  font-size: 18px;
`;
