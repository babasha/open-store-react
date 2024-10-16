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
  discounts?: { quantity: number; price: number }[]; // Добавлено discounts
};

const ProductCart: React.FC<CartPropsType> = React.memo(
  ({
    id,
    price,
    imageUrl,
    titles,
    unit,
    step = 1,
    discounts = [], // Дефолтное значение discounts
  }) => {
    const { addItemToCart, cartItems, updateItemInCart } = useCart();
    const { i18n } = useTranslation();

    const cartItem = useMemo(() => cartItems.find((item) => item.id === id), [cartItems, id]);

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
        setState((prev) => ({ ...prev, quantity: cartItem.quantity, isActive: true }));
      } else {
        setState((prev) => ({ ...prev, quantity: step, isActive: false }));
      }
    }, [cartItem, step]);

    useEffect(() => {
      if (!imageUrl) {
        setState((prev) => ({ ...prev, isContentLoaded: true }));
      }
    }, [imageUrl]);

    useEffect(() => {
      if (imageUrl && !state.isContentLoaded) {
        const timeout = setTimeout(() => {
          setState((prev) => ({ ...prev, isContentLoaded: true }));
        }, 5000);

        return () => clearTimeout(timeout);
      }
    }, [imageUrl, state.isContentLoaded]);

    const handleImageLoad = useCallback(() => {
      setState((prev) => ({ ...prev, isImageLoaded: true, isContentLoaded: true }));
    }, []);

    const handleImageError = useCallback(() => {
      setState((prev) => ({ ...prev, isContentLoaded: true }));
    }, []);

    const handleQuantityChange = useCallback(
      (newQuantity: number) => {
        setState((prev) => ({ ...prev, quantity: newQuantity }));
        if (cartItem) {
          updateItemInCart({ ...cartItem, quantity: newQuantity });
        }
      },
      [cartItem, updateItemInCart]
    );

    const handleAddToCart = useCallback(() => {
      if (!state.isActive) {
        const title = titles[i18n.language as keyof typeof titles] || titles.en;
        addItemToCart({ id, title, price, quantity: state.quantity, titles, unit, step, discounts });
        setState((prev) => ({ ...prev, isActive: true }));
      }
    }, [
      state.isActive,
      addItemToCart,
      id,
      price,
      titles,
      unit,
      step,
      i18n.language,
      state.quantity,
      discounts,
    ]);

    const localizedTitle = useMemo(() => {
      return titles[i18n.language as keyof typeof titles] || titles.en;
    }, [titles, i18n.language]);

    const getPricePerUnit = useCallback(
      (quantity: number) => {
        if (!discounts || discounts.length === 0) {
          return price;
        }
        const sortedDiscounts = [...discounts].sort((a, b) => a.quantity - b.quantity);
        let applicableDiscount = null;
        for (const discount of sortedDiscounts) {
          if (quantity >= discount.quantity) {
            applicableDiscount = discount;
          } else {
            break;
          }
        }
        return applicableDiscount ? applicableDiscount.price : price;
      },
      [discounts, price]
    );

    const totalPrice = useMemo(() => {
      const pricePerUnit = getPricePerUnit(state.quantity);
      return calculateTotalPrice(pricePerUnit, state.quantity, unit, step);
    }, [state.quantity, unit, step, getPricePerUnit]);

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
          pricePerUnit={getPricePerUnit(state.quantity)}
          quantity={state.quantity}
          onQuantityChange={handleQuantityChange}
          unit={unit}
          step={step}
        />
        {discounts && discounts.length > 0 && (
          <div>
            <p>Скидки:</p>
            <ul>
              {discounts.map((discount, index) => (
                <li key={index}>
                  {`При покупке от ${discount.quantity} шт. цена ${discount.price} за единицу`}
                </li>
              ))}
            </ul>
          </div>
        )}
        <FlexWrapper justify="space-between">
          <Price amount={totalPrice} />
          <ToggleButton
            onClick={handleAddToCart}
            isActive={state.isActive}
            isDisabled={state.isActive}
          />
        </FlexWrapper>
      </Cart>
    );
  }
);

function calculateTotalPrice(
  pricePerUnit: number,
  quantity: number,
  unit: string,
  step: number
) {
  return unit === 'g' ? pricePerUnit * (quantity / step) : pricePerUnit * quantity;
}

export default ProductCart;
