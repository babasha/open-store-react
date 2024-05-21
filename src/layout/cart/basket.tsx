import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { useCart } from './CartContext';

export const Basket: React.FC = () => {
  const { cartItems, removeItemFromCart, clearCart, resetQuantityInProductCard, resetAllQuantities, setResetFlag } = useCart();

  const handleRemoveItem = (id: number) => {
    removeItemFromCart(id);
    resetQuantityInProductCard(id);
    setResetFlag(true);
  };

  const handleClearCart = () => {
    clearCart();
    resetAllQuantities();
    setResetFlag(true);
  };

  return (
    <Container width={'auto'}>
      <CartdiInner>
        <h2>Корзина</h2>
        {cartItems.length === 0 && <p>Корзина пуста</p>}
        {cartItems.map((item) => (
          <CartItem key={item.id}>
            <span>{item.title}</span>
            <span>{item.quantity} кг</span>
            <span>{item.price} GEL</span>
            <button onClick={() => handleRemoveItem(item.id)}>Удалить</button>
          </CartItem>
        ))}
        {cartItems.length > 0 && (
          <>
            <button onClick={handleClearCart}>Очистить корзину</button>
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
