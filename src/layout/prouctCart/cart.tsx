import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCart } from '../basket/CartContext';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import {
  Cart,
  ImageWrapper,
  ProductImage,
  Placeholder,
  Title,
} from './ProductCartStyles'; // Импортируем стили из нового файла
import PlaceholderCard from './PlaceholderCard'; // Импортируем плейсхолдер
// Добавляем недостающие импорты
import QuantityControl from '../../components/quantityCotrol/QuantityControl'; // Импортируем контроллер количества
import { FlexWrapper } from '../../components/FlexWrapper'; // Импортируем обертку для Flex
import Price from '../../components/productPrice/price';
import ToggleButton from '../../components/button/button';  // Импортируем кнопку

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
  discounts?: { quantity: number; price: number }[];
};

const ProductCart: React.FC<CartPropsType> = React.memo(({
  id,
  price,
  imageUrl,
  titles,
  unit,
  step = 1,
  discounts = [],
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
    rootMargin: '100px',
  });

  const supportsWebP = useMemo(() => {
    const elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  }, []);

  const imageFormat = supportsWebP ? 'webp' : 'jpeg';
  const imageFileName = imageUrl ? imageUrl.split('/').pop() : 'placeholder-image.webp';
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

  const totalPrice = useMemo(
    () => calculateTotalPrice(price, state.quantity, unit, step, discounts),
    [price, state.quantity, unit, step, discounts]
  );

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
        basePrice={price}
        quantity={state.quantity}
        onQuantityChange={handleQuantityChange}
        unit={unit}
        step={step}
        discounts={discounts}
      />
      <FlexWrapper justify="space-between">
        <Price amount={totalPrice} />
        <ToggleButton onClick={handleAddToCart} isActive={state.isActive} isDisabled={state.isActive} />
      </FlexWrapper>
    </Cart>
  );
});

function calculateTotalPrice(
  basePrice: number,
  quantity: number,
  unit: string,
  step: number,
  discounts: { quantity: number; price: number }[]
) {
  let applicablePrice = basePrice;
  
  if (discounts && discounts.length > 0) {
    discounts = discounts.filter(discount => quantity >= discount.quantity);
    
    if (discounts.length > 0) {
      const maxDiscount = discounts.reduce((prev, curr) => 
        (curr.quantity <= quantity && curr.price < prev.price) ? curr : prev,
        { quantity: 0, price: basePrice }
      );
      applicablePrice = maxDiscount.price;
    }
  }

  return unit === 'g' ? applicablePrice * (quantity / step) : applicablePrice * quantity;
}

export default ProductCart;