import React, { useState } from 'react';
import styled from "styled-components";
import { Container } from '../../components/Container';
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
  const [totalPrice, setTotalPrice] = useState(price);
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCart();

  const handleQuantityChange = (quantity: number) => {
    setQuantity(quantity);
    setTotalPrice(quantity * price);
  };

  const handleAddToCart = () => {
    addItemToCart({ id, title, price, quantity });
  };

  return (
    <Cart>
      <p>{title}</p>
      <QuantityControl pricePerUnit={price} onQuantityChange={handleQuantityChange} />
      <Price amount={totalPrice} />
      <ToggleButton onClick={handleAddToCart} />
    </Cart>
  );
};

const Cart = styled.div`
  background-color: ${theme.colors.mainBg};
  width: 250px;
  height: 380px;
  margin: 10px;
  border-radius: 30px;
  padding: 10px;
`;