import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCart } from '../cart/CartContext';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import {
  Cart,
  ImageWrapper,
  ProductImage,
  Placeholder,
  Title,
} from './ProductCartStyles';
import PlaceholderCard from './PlaceholderCard';
import QuantityControl from '../../components/quantityCotrol/QuantityControl';
import { FlexWrapper } from '../../components/FlexWrapper';
import Price from '../../components/productPrice/price';
import ToggleButton from '../../components/button/button';

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
    isImageLoaded: false, // Используем одно состояние для загрузки изображения
  });

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px',
  });

  const localizedTitle = useMemo(() => {
    return titles[i18n.language as keyof typeof titles] || titles.en;
  }, [titles, i18n.language]);

  const totalPrice = useMemo(() => calculateTotalPrice(price, state.quantity, unit, step), [price, state.quantity, unit, step]);

  const handleImageLoad = useCallback(() => {
    setState(prev => ({ ...prev, isImageLoaded: true }));
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

  return (
    <Cart ref={ref}>
      <ImageWrapper>
        {inView && (
          <picture>
            <source
              srcSet={`${imageUrl}?format=webp&width=800`}
              type="image/webp"
            />
            <img
              src={`${imageUrl}?format=jpeg&width=800`}
              alt={localizedTitle}
              onLoad={handleImageLoad}
            />
          </picture>
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

export default ProductCart;