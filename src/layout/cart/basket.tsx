import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { useCart } from './CartContext';
import { useTranslation } from 'react-i18next';

export const Basket: React.FC = () => {
  const { cartItems, removeItemFromCart, clearCart } = useCart();
  const { t } = useTranslation();

  return (
    <Container width={'auto'}>
      <CartdiInner>
        <h2>{t('cart.title')}</h2>
        {cartItems.length === 0 && <p>{t('cart.empty')}</p>}
        {cartItems.map((item) => (
          <CartItem key={item.id}>
            <span>{item.title}</span>
            <span>{item.quantity} кг</span>
            <span>{item.price} GEL</span>
            <button onClick={() => removeItemFromCart(item.id)}>{t('cart.remove')}</button>
          </CartItem>
        ))}
        {cartItems.length > 0 && (
          <>
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
`;
