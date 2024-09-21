import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/Theme';
import { useCart } from '../cart/CartContext';
import { useTranslation } from 'react-i18next';
import { FlexWrapper } from '../../components/FlexWrapper';
import { useInView } from 'react-intersection-observer';

// Лениво загружаем компоненты
const QuantityControl = lazy(() => import('../../components/quantityCotrol/QuantityControl'));
const Price = lazy(() => import('../../components/productPrice/price'));
const ToggleButton = lazy(() => import('../../components/button/button'));

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

  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : step);
  const [isActive, setIsActive] = useState(!!cartItem);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(!imageUrl);

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px',
  });

  // Определяем формат изображения
  const imageFormat = 'webp';
  const imageFileName = imageUrl;
  const fullImageUrl = `/images/${imageFileName}`;

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
      setIsActive(true);
    } else {
      setQuantity(step);
      setIsActive(false);
    }
  }, [cartItem, step]);

  useEffect(() => {
    if (!imageUrl) {
      setIsContentLoaded(true);
    }
  }, [imageUrl]);

  useEffect(() => {
    if (imageUrl && !isContentLoaded) {
      const timeout = setTimeout(() => {
        setIsContentLoaded(true);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [imageUrl, isContentLoaded]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
    setIsContentLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setIsContentLoaded(true);
  }, []);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    setQuantity(newQuantity);
    if (cartItem) {
      updateItemInCart({ ...cartItem, quantity: newQuantity });
    }
  }, [cartItem, updateItemInCart]);

  const handleAddToCart = useCallback(() => {
    if (!isActive) {
      const title = titles[i18n.language as keyof typeof titles] || titles.en;
      addItemToCart({ id, title, price, quantity, titles, unit, step });
      setIsActive(true);
    }
  }, [isActive, addItemToCart, id, price, titles, unit, step, i18n.language, quantity]);

  const localizedTitle = useMemo(() => {
    return titles[i18n.language as keyof typeof titles] || titles.en;
  }, [titles, i18n.language]);

  const totalPrice = useMemo(() => calculateTotalPrice(price, quantity, unit, step), [price, quantity, unit, step]);

  if (!isContentLoaded) {
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
              isLoaded={isImageLoaded}
              loading="lazy"
            />
            {!isImageLoaded && <Placeholder isLoaded={isImageLoaded} />}
          </>
        )}
        {!inView && <Placeholder isLoaded={false} />}
      </ImageWrapper>
      <Title>{localizedTitle}</Title>
      <Suspense fallback={<div>Загрузка...</div>}>
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
      </Suspense>
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
