import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/Theme';
import QuantityControl from '../../components/quantityCotrol/QuantityControl';
import Price from '../../components/productPrice/price';
import { useCart } from '../cart/CartContext';
import { useTranslation } from 'react-i18next';
import ToggleButton from '../../components/button/button';
import { FlexWrapper } from '../../components/FlexWrapper';
import { keyframes } from 'styled-components';

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

export const ProductCart: React.FC<CartPropsType> = ({
  id,
  price,
  imageUrl,
  titles,
  unit,
  step = 1,
}) => {
  const { addItemToCart, cartItems, updateItemInCart } = useCart();
  const { i18n } = useTranslation();

  const cartItem = cartItems.find((item) => item.id === id);
  const [quantity, setQuantity] = useState<number>(cartItem ? cartItem.quantity : step);
  const [isActive, setIsActive] = useState<boolean>(!!cartItem);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false);

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
    if (isImageLoaded) {
      // Здесь можно добавить дополнительные проверки готовности контента, если нужно
      setIsContentLoaded(true);
    }
  }, [isImageLoaded]);

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
    // Если изображение не загрузилось, считаем контент загруженным, чтобы убрать плейсхолдер
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

  if (!isContentLoaded) {
    return <PlaceholderCard />;
  }

  return (
    <Cart>
      <ImageWrapper>
        {imageUrl && (
          <ProductImage
            src={imageUrl}
            alt={localizedTitle}
            onLoad={handleImageLoad}
            onError={handleImageError}
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

// Плейсхолдер карточки с анимацией загрузки
const PlaceholderCard = () => {
  return (
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
};

// Styled Components

const Cart = styled.div`
  background-color: ${theme.colors.mainBg};
  width: 250px;
  min-height: 300px;
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
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Title = styled.p`
  text-align: center;
  margin-top: 10px;
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