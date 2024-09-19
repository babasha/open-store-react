import React, { useState, useEffect, useMemo } from 'react';
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

export const ProductCart: React.FC<CartPropsType> = ({ id, price, imageUrl, titles, unit, step = 1 }) => {
  const { addItemToCart, cartItems, updateItemInCart } = useCart();
  const { i18n } = useTranslation();

  const cartItem = cartItems.find(item => item.id === id);
  const [quantity, setQuantity] = useState<number>(cartItem ? cartItem.quantity : step);
  const [isActive, setIsActive] = useState<boolean>(!!cartItem);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
      setIsActive(true);
    } else {
      setQuantity(step);
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

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    setIsImageLoaded(true);
  };

  const localizedTitle = useMemo(() => {
    return titles[i18n.language as keyof typeof titles] || titles.en;
  }, [titles, i18n.language]);

  const totalPrice = useMemo(() => {
    return calculateTotalPrice(price, quantity, unit, step);
  }, [price, quantity, unit, step]);

  function calculateTotalPrice(price: number, quantity: number, unit: string, step: number) {
    if (unit === 'g') {
      return price * (quantity / step);
    } else {
      return price * quantity;
    }
  }

  return (
    <Cart>
      <ImageWrapper>
        <Placeholder isLoaded={isImageLoaded} />
        {imageUrl && (
          <ProductImage
            src={imageUrl}
            alt={localizedTitle}
            onLoad={handleImageLoad}
            onError={handleImageError}
            isLoaded={isImageLoaded}
          />
        )}
      </ImageWrapper>
      <Title>{localizedTitle}</Title>
      <QuantityControl
        pricePerUnit={price}
        quantity={quantity}
        onQuantityChange={handleQuantityChange}
        unit={unit}
        step={step}
      />
      <FlexWrapper justify="space-between">
        <Price amount={totalPrice} />
        <ToggleButton onClick={handleAddToCart} isActive={isActive} isDisabled={isActive} />
      </FlexWrapper>
    </Cart>
  );
};

// Styled Components
const Cart = styled.div`
  background-color: ${theme.colors.mainBg};
  width: 250px;
  min-height: 300px;
  height: max-content;
  margin: 10px;
  border-radius: 30px;
  padding: 10px;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 65%;
  overflow: hidden;
`;

const ProductImage = styled.img<{ isLoaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 30px;
  opacity: ${({ isLoaded }) => (isLoaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const Placeholder = styled.div<{ isLoaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.mainBg};
  border-radius: 30px;
  opacity: ${({ isLoaded }) => (isLoaded ? 0 : 1)};
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
`;

const Title = styled.p`
  text-align: center;
`;

export default ProductCart;
