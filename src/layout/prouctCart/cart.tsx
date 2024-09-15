import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/Theme';
import QuantityControl from '../../components/quantityCotrol/QuantityControl';
import Price from '../../components/productPrice/price';
import { useCart } from '../cart/CartContext';
import { useTranslation } from 'react-i18next';
import ToggleButton from '../../components/button/button';
import { FlexWrapper } from '../../components/FlexWrapper';

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
  const initialQuantity = cartItem ? cartItem.quantity : step || 1;
  const [quantity, setQuantity] = useState<number>(initialQuantity);
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
      addItemToCart({ id, title, price, quantity, titles, unit, step });
      setIsActive(true);
    }
  };

  const localizedTitle = titles[i18n.language as keyof typeof titles] || titles.en;

  const calculateTotalPrice = (price: number, quantity: number, unit: string, step: number) => {
    if (unit === 'g') {
      return price * (quantity / step);
    } else {
      return price * quantity;
    }
  };

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
      <FlexWrapper justify="space-between">
        <Price amount={calculateTotalPrice(price, quantity, unit, step || 1)} />
        <ToggleButton onClick={handleAddToCart} isActive={isActive} isDisabled={isActive} />
      </FlexWrapper>
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

export default ProductCart;
