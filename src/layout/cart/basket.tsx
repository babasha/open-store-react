import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Container } from '../../components/Container';
import { useCart } from './CartContext';
import { useAuth } from '../autoeization/AuthContext';
import { useTranslation } from 'react-i18next';
import { FlexWrapper } from '../../components/FlexWrapper';
import GooglePayButton from './GooglePayButton';
import DataSwitch from '../../components/dateSlider/dataSwith';
import { EditButton } from '../../styles/btns/secondBtns';
import {
  CartdiInner,
  CartItemWrapper,
  ItemDetails,
  DeleteButton,
  PurchaseButton,
  TotalPrice,
  ItemContext,
  ItemContextTitle,
  ErrorText,
  BascketTitle,
} from './BasketStyles';

interface BasketProps {
  currentLanguage: string;
}

interface CartItem {
  id: number;
  title: string;
  quantity: number;
  price: number;
  unit: string;
  step?: number;
}

export const Basket: React.FC<BasketProps> = ({ currentLanguage }) => {
  const { t } = useTranslation();
  const { cartItems, removeItemFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<{ day: string; time: string } | null>(null);
  const [isActive, setIsActive] = useState(false); // состояние активности кнопки

  const handleEditClick = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  const calculateTotalPrice = useCallback(
    (price: number, quantity: number, unit: string, step: number = 1) => {
      return unit === 'g' ? price * (quantity / step) : price * quantity;
    },
    []
  );

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + calculateTotalPrice(item.price, item.quantity, item.unit, item.step || 1);
    }, 0);
  }, [cartItems, calculateTotalPrice]);

  const deliveryCost = totalPrice > 0.01 ? 0 : 5;
  const totalWithDelivery = totalPrice + deliveryCost;

  useEffect(() => {
    if (user && error === t('cart.notAuthorized')) {
      setError(null);
    }
  }, [user, error, t]);

  const handleAddToCart = useCallback(() => {
    // Логика добавления товара в корзину
    setIsActive(true); // После добавления товара в корзину делаем кнопку активной
  }, []);

  const handlePurchase = useCallback(async () => {
    if (!user) {
      setError(t('cart.notAuthorized'));
      return;
    }

    const orderData = {
      userId: user.id,
      items: cartItems.map((item) => ({
        productId: item.id,
        description: item.title,
        quantity: Number(item.quantity),
        price: calculateTotalPrice(item.price, item.quantity, item.unit, item.step || 1),
      })),
      total: totalWithDelivery,
      deliveryTime: selectedDelivery ? `${selectedDelivery.day}, ${selectedDelivery.time}` : null,
      deliveryAddress: user.address,
    };

    try {
      const orderResponse = await fetch('https://enddel.com/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('Error initiating payment:', errorText);
        throw new Error(t('cart.orderError'));
      }

      const order = await orderResponse.json();
      console.log('Payment initiated, payment URL:', order.paymentUrl);

      window.location.href = order.paymentUrl;
    } catch (error) {
      console.error('Error processing order or payment:', error);
      setError(t('cart.orderError'));
    }
  }, [user, cartItems, totalWithDelivery, selectedDelivery, t, calculateTotalPrice]);

  const renderCartItem = useCallback(
    (item: CartItem) => {
      const itemTotalPrice = calculateTotalPrice(item.price, item.quantity, item.unit, item.step || 1);

      return (
        <CartItemWrapper key={item.id}>
          <ItemDetails>
            <ItemContextTitle>{item.title}</ItemContextTitle>
            <ItemContext>
              {item.quantity} {item.unit}
            </ItemContext>
            <ItemContext>{itemTotalPrice} ₾</ItemContext>
          </ItemDetails>
          {isEditing && (
            <DeleteButton isEditing={isEditing} onClick={() => removeItemFromCart(item.id)}>
              {t('cart.remove')}
            </DeleteButton>
          )}
        </CartItemWrapper>
      );
    },
    [isEditing, removeItemFromCart, t, calculateTotalPrice]
  );

  return (
    <Container width="100%">
      <CartdiInner>
        <FlexWrapper align="center" justify="space-between">
          <BascketTitle>{t('cart.title')}</BascketTitle>
          <EditButton onClick={handleEditClick}>
            {isEditing ? t('cart.finishEditing') : t('cart.edit')}
          </EditButton>
        </FlexWrapper>
        {cartItems.length === 0 ? (
          <p>{t('cart.empty')}</p>
        ) : (
          <>
            {cartItems.map(renderCartItem)}
            <CartItemWrapper>
              <ItemDetails>
                <strong>{t('cart.delivery')}</strong>
                <span>{deliveryCost === 0 ? t('cart.free') : `${deliveryCost} GEL`}</span>
              </ItemDetails>
            </CartItemWrapper>
            {user && (
              <CartItemWrapper>
                <ItemDetails>
                  <span>{t('cart.delivery_address')}:</span>
                  <span>{user.address || t('cart.no_address')}</span>
                </ItemDetails>
              </CartItemWrapper>
            )}
            <DataSwitch
              buttonText1={t('as_soon_as_possible')}
              buttonText2={t('schedule_delivery')}
              onSelectedDelivery={setSelectedDelivery}
            />
            <TotalPrice>
              {t('cart.total')}: {totalWithDelivery} ₾
            </TotalPrice>
            <FlexWrapper justify="space-between">
              <EditButton onClick={clearCart}>{t('cart.clear')}</EditButton>
              <PurchaseButton isActive={isActive} isDisabled={isActive} onClick={handleAddToCart}>
                {isActive ? 'Добавлено' : 'Добавить в корзину'}
              </PurchaseButton>
            </FlexWrapper>

            <GooglePayButton totalPrice={totalWithDelivery} />

            {error && <ErrorText>{error}</ErrorText>}
          </>
        )}
      </CartdiInner>
    </Container>
  );
};

export default React.memo(Basket);
