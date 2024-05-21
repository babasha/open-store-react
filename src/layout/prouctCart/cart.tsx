import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/Theme';
import ToggleButton from '../../components/button/button';
import QuantityControl from '../../components/quantityCotrol/QuantityControl';
import Price from '../../components/productPrice/price';
import { useCart } from '../cart/CartContext';

type CartPropsType = {
  title: string;
  price: number; 
  id: number;
};

export const ProductCart: React.FC<CartPropsType> = ({ id, title, price }) => {
  const { addItemToCart, cartItems, updateItemInCart } = useCart();
  const cartItem = cartItems.find((item) => item.id === id);
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);
  const [totalPrice, setTotalPrice] = useState(price * quantity);
  const [isActive, setIsActive] = useState(!!cartItem);

  useEffect(() => {
    setTotalPrice(price * quantity);
    if (cartItem) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [quantity, price, cartItem]);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    setTotalPrice(newQuantity * price);
    if (cartItem) {
      updateItemInCart({ ...cartItem, quantity: newQuantity, price: newQuantity * price });
    }
  };

  const handleAddToCart = () => {
    if (!isActive) {
      addItemToCart({ id, title, price: totalPrice, quantity });
      setIsActive(true);
    }
  };

  useEffect(() => {
    if (!cartItem) {
      setQuantity(1);
      setTotalPrice(price);
      setIsActive(false);
    }
  }, [cartItem, price]);

  return (
    <Cart>
      <p>{title}</p>
      <QuantityControl pricePerUnit={price} quantity={quantity} onQuantityChange={handleQuantityChange} />
      <Price amount={totalPrice} />
      <ToggleButton onClick={handleAddToCart} isActive={isActive} isDisabled={isActive} />
    </Cart>
  );
};

const Cart = styled.div`
  background-color: ${theme.colors.mainBg};
  width: 250px;
  height: 380px;
  margin: 10px;
  border-radius:30px;
  padding: 10px;
`;
