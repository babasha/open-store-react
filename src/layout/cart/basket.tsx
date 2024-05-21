import React from 'react';
import styled from "styled-components";
import { Container } from '../../components/Container';
import { useCart } from './CartContext';
import { theme } from '../../styles/Theme';

export const Basket = () => {
  const { cartItems, removeItemFromCart, clearCart } = useCart();

  return (
    <Container width={'auto'}>
      <CartdiInner>
        <h3>Корзина</h3>
        {cartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          cartItems.map(item => (
            <CartItem key={item.id}>
              <p>{item.title}</p>
              <p>{item.quantity} кг</p>
              <p>{item.price} GEL</p>
              <button onClick={() => removeItemFromCart(item.id)}>Удалить</button>
            </CartItem>
          ))
        )}
        {cartItems.length > 0 && (
          <button onClick={clearCart}>Очистить корзину</button>
        )}
      </CartdiInner>
    </Container>
  );
};

const CartdiInner = styled.div`
  background-color: ${theme.colors.mainBg};
  width: 250px;
  height: auto;
  margin: 10px;
  border-radius: 30px;
  padding: 10px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;
