import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/Theme';
import QuantityControl from '../../components/quantityCotrol/QuantityControl';
 // Исправленный путь
import { useCart } from '../cart/CartContext';
import { useTranslation } from 'react-i18next';

type CartPropsType = {
  id: number;
  price: number;
  imageUrl: string | null;
  titles: {
    en: string;
    ru: string;
    geo: string;
  };
  unit: string;
  step?: number;
};

export const ProductCart: React.FC<CartPropsType> = ({ id, price, imageUrl, titles, unit, step }) => {
  const { addItemToCart, cartItems, updateItemInCart } = useCart();
  const { i18n } = useTranslation();

  const cartItem = cartItems.find(item => item.id === id);
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : step || 1);
  const [isActive, setIsActive] = useState(!!cartItem);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
      setIsActive(true);
    } else {
      setQuantity(step || 1);
      setIsActive(false);
    }
  }, [cartItem, step]);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (cartItem) {
      updateItemInCart({ ...cartItem, quantity: newQuantity });
    }
  };

  const handleAddToCart = () => {
    if (!isActive) {
      const title = titles[i18n.language as keyof typeof titles] || titles.en;
      addItemToCart({ id, title, price, quantity, titles });
      setIsActive(true);
    }
  };

  const localizedTitle = titles[i18n.language as keyof typeof titles] || titles.en;

  return (
    <Cart>
      {imageUrl && <ProductImage src={imageUrl} alt={localizedTitle} />}
      <Title>{localizedTitle}</Title>
      <QuantityControl
        pricePerUnit={price}
        quantity={quantity}
        onQuantityChange={handleQuantityChange}
        unit={unit}
        step={step || 1}
      />
      <Button onClick={handleAddToCart}>
        {isActive ? 'Update in Cart' : 'Add to Cart'}
      </Button>
    </Cart>
  );
};

const Cart = styled.div`
  background-color: ${theme.colors.mainBg};
  width: 250px;
  min-height: 300px;
  height: max-content;
  margin: 10px;
  border-radius: 30px;
  padding: 10px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 65%;
  object-fit: cover;
  border-radius: 30px;
  margin-bottom: 10px;
`;

const Title = styled.p`
  text-align: center;
`;

const Button = styled.button`
  background-color: ${theme.colors.primaryBg}; // Исправленный стиль
  color: white;
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: ${theme.colors.accent}; // Исправленный стиль
  }
`;

export default ProductCart;
