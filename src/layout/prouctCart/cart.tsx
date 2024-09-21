import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/Theme';
import QuantityControl from '../../components/quantityCotrol/QuantityControl';
import Price from '../../components/productPrice/price';
import { useCart } from '../cart/CartContext';
import { useTranslation } from 'react-i18next';
import ToggleButton from '../../components/button/button';
import { FlexWrapper } from '../../components/FlexWrapper';
import { useInView } from 'react-intersection-observer';

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

const ProductCart: React.FC<CartPropsType> = React.memo(({
  id,
  price,
  imageUrl,
  titles,
  unit,
  step = 1,
}) => {
  const { addItemToCart, cartItems, updateItemInCart } = useCart();
  const { i18n } = useTranslation();

  const cartItem = useMemo(() => cartItems.find(item => item.id === id), [cartItems, id]);

  const [state, setState] = useState({
    quantity: cartItem ? cartItem.quantity : step,
    isActive: !!cartItem,
    isImageLoaded: false,
    isContentLoaded: !!imageUrl ? false : true,
  });

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px', // Начинаем загружать за 100px до видимости
  });

  // Функция для проверки поддержки WebP
  const supportsWebP = useMemo(() => {
    const elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  }, []);

  // Определяем формат изображения
  const imageFormat = supportsWebP ? 'webp' : 'jpeg';

  // Получаем имя файла изображения (imageUrl содержит только имя файла)
  const imageFileName = imageUrl;

  // Формируем полный URL изображения
  const fullImageUrl = `/images/${imageFileName}`;

  useEffect(() => {
    if (cartItem) {
      setState(prev => ({ ...prev, quantity: cartItem.quantity, isActive: true }));
    } else {
      setState(prev => ({ ...prev, quantity: step, isActive: false }));
    }
  }, [cartItem, step]);

  useEffect(() => {
    if (!imageUrl) {
      setState(prev => ({ ...prev, isContentLoaded: true }));
    }
  }, [imageUrl]);

  useEffect(() => {
    if (imageUrl && !state.isContentLoaded) {
      const timeout = setTimeout(() => {
        setState(prev => ({ ...prev, isContentLoaded: true }));
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [imageUrl, state.isContentLoaded]);

  const handleImageLoad = useCallback(() => {
    setState(prev => ({ ...prev, isImageLoaded: true, isContentLoaded: true }));
  }, []);

  const handleImageError = useCallback(() => {
    setState(prev => ({ ...prev, isContentLoaded: true }));
  }, []);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    setState(prev => ({ ...prev, quantity: newQuantity }));
    if (cartItem) {
      updateItemInCart({ ...cartItem, quantity: newQuantity });
    }
  }, [cartItem, updateItemInCart]);

  const handleAddToCart = useCallback(() => {
    if (!state.isActive) {
      const title = titles[i18n.language as keyof typeof titles] || titles.en;
      addItemToCart({ id, title, price, quantity: state.quantity, titles, unit, step });
      setState(prev => ({ ...prev, isActive: true }));
    }
  }, [state.isActive, addItemToCart, id, price, titles, unit, step, i18n.language, state.quantity]);

  const localizedTitle = useMemo(() => {
    return titles[i18n.language as keyof typeof titles] || titles.en;
  }, [titles, i18n.language]);

  const totalPrice = useMemo(() => calculateTotalPrice(price, state.quantity, unit, step), [price, state.quantity, unit, step]);

  if (!state.isContentLoaded) {
    return <PlaceholderCard />;
  }

  return (
    <Cart ref={ref}>
      <ImageWrapper>
        {inView && (
          <>
            <ProductImage
              src={`${fullImageUrl}?format=${imageFormat}&width=800`}
              srcSet={`
                ${fullImageUrl}?format=${imageFormat}&width=320 320w,
                ${fullImageUrl}?format=${imageFormat}&width=480 480w,
                ${fullImageUrl}?format=${imageFormat}&width=800 800w
              `}
              sizes="(max-width: 600px) 320px, (max-width: 900px) 480px, 800px"
              alt={localizedTitle}
              onLoad={handleImageLoad}
              onError={handleImageError}
              isLoaded={state.isImageLoaded}
            />
            {!state.isImageLoaded && <Placeholder isLoaded={state.isImageLoaded} />}
          </>
        )}
        {!inView && <Placeholder isLoaded={false} />}
      </ImageWrapper>
      <Title>{localizedTitle}</Title>
      <QuantityControl
        pricePerUnit={price}
        quantity={state.quantity}
        onQuantityChange={handleQuantityChange}
        unit={unit}
        step={step}
      />
      <FlexWrapper justify="space-between">
        <Price amount={totalPrice} />
        <ToggleButton onClick={handleAddToCart} isActive={state.isActive} isDisabled={state.isActive} />
      </FlexWrapper>
    </Cart>
  );
});

function calculateTotalPrice(price: number, quantity: number, unit: string, step: number) {
  return unit === 'g' ? price * (quantity / step) : price * quantity;
}

// Плейсхолдер карточки с анимацией загрузки
const PlaceholderCard = () => (
  <PlaceholderCart>
    <PlaceholderImage>
      <LoadWrapper>
        <Activity />
      </LoadWrapper>
    </PlaceholderImage>
    <PlaceholderContent>
      <LoadWrapper>
        <Activity />
      </LoadWrapper>
    </PlaceholderContent>
    <PlaceholderControls>
      <LoadWrapper>
        <Activity />
      </LoadWrapper>
    </PlaceholderControls>
  </PlaceholderCart>
);

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
  height: 160px;
  overflow: hidden;
  border-radius: 20px;
  margin-bottom: 10px;
`;

const ProductImage = styled.img<{ isLoaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 30px;
  opacity: ${({ isLoaded }) => (isLoaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  display: block;
`;

const Placeholder = styled.div<{ isLoaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.mainBg || '#f0f0f0'};
  border-radius: 30px;
  opacity: ${({ isLoaded }) => (isLoaded ? 0 : 1)};
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
`;

const Title = styled.p`
  text-align: center;
  margin-top: 10px;
  font-size: 1.2rem;
  color: ${theme.colors.font || '#333'};
`;

const PlaceholderCart = styled.div`
  background-color: ${theme.colors.mainBg};
  width: 250px;
  min-height: 300px;
  margin: 10px;
  border-radius: 30px;
  padding: 10px;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 160px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
`;

const PlaceholderContent = styled.div`
  height: 20px;
  margin-bottom: 20px;
  position: relative;
`;

const PlaceholderControls = styled.div`
  height: 40px;
  position: relative;
`;

// Анимация загрузки

const loadingAnimation = keyframes`
  0% {
    left: -45%;
  }
  100% {
    left: 100%;
  }
`;

const LoadWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  background-color: rgb(211, 211, 211);
  overflow: hidden;
  border-radius: 5px;
`;

const Activity = styled.div`
  position: absolute;
  left: -45%;
  height: 100%;
  width: 45%;
  background-image: linear-gradient(
    to left,
    rgba(251, 251, 251, 0.05),
    rgba(251, 251, 251, 0.3),
    rgba(251, 251, 251, 0.6),
    rgba(251, 251, 251, 0.3),
    rgba(251, 251, 251, 0.05)
  );
  animation: ${loadingAnimation} 1s infinite;
`;

export default ProductCart;
