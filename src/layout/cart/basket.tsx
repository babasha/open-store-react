// src/layout/cart/Basket.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Container } from '../../components/Container';
import { useCart } from './CartContext';
import { useAuth } from '../autoeization/AuthContext';
import { useTranslation } from 'react-i18next';
import { FlexWrapper } from '../../components/FlexWrapper';
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
  BascketTitle
} from './BasketStyles';
import { usePurchasedItems } from '../../page/paymentsPages/PurchasedItemsContext';

interface BasketProps {
  currentLanguage: string;
}

interface CartItem {
  id: number;
  title: string;
  quantity: number;
  price: number;
}

export const Basket: React.FC<BasketProps> = ({ currentLanguage }) => {
  const { t } = useTranslation();
  const { cartItems, removeItemFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<{ day: string; time: string } | null>(null);

  const handleEditClick = () => setIsEditing(!isEditing);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const deliveryCost = totalPrice > 0.01 ? 0 : 5;
  const totalWithDelivery = totalPrice + deliveryCost;

  useEffect(() => {
    if (user && error === t('cart.notAuthorized')) {
      setError(null);
    }
  }, [user, error, t]);

  const handlePurchase = useCallback(async () => {
    if (!user) {
      setError(t('cart.notAuthorized'));
      return;
    }

    const orderData = {
      userId: user.id,
      items: cartItems.map(item => ({
        productId: item.id,
        description: item.title,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
      total: totalWithDelivery,
      deliveryTime: selectedDelivery ? `${selectedDelivery.day}, ${selectedDelivery.time}` : null,
      deliveryAddress: user.address,
    };
    
    console.log('Создание заказа с данными:', orderData);

    
  try {
    const orderResponse = await fetch('https://enddel.com/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('Ошибка инициирования платежа:', errorText);
        throw new Error(t('cart.orderError'));
      }

      const order = await orderResponse.json();
      console.log('Платёж инициирован, URL для оплаты:', order.paymentUrl);

      // Перенаправляем пользователя на страницу оплаты
      window.location.href = order.paymentUrl;
    } catch (error) {
      console.error('Ошибка при обработке заказа или платежа:', error);
      setError(t('cart.orderError'));
    }
  }, [user, cartItems, totalWithDelivery, selectedDelivery, t]);

  useEffect(() => {
    console.log('Пользователь:', user);
    console.log('user.id:', user?.id);
  }, [user]);

  const renderCartItem = useCallback(
    (item: CartItem) => (
      <CartItemWrapper key={item.id}>
        <ItemDetails>
          <ItemContextTitle>{item.title}</ItemContextTitle>
          <ItemContext>{item.quantity} кг</ItemContext>
          <ItemContext>{item.price * item.quantity} ₾</ItemContext>
        </ItemDetails>
        <DeleteButton isEditing={isEditing} onClick={() => removeItemFromCart(item.id)}>
          {t('cart.remove')}
        </DeleteButton>
      </CartItemWrapper>
    ),
    [isEditing, removeItemFromCart, t]
  );

  return (
    <Container width={'100%'}>
      <CartdiInner>
        <FlexWrapper align='center' justify='space-between'>
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
                <span><strong>{t('cart.delivery')}</strong></span>
                <span>{deliveryCost === 0 ? t('cart.free') : `${deliveryCost} GEL`}</span>
              </ItemDetails>
            </CartItemWrapper>
            {user && (
              <CartItemWrapper>
                <ItemDetails>
                  <span>{t('cart.delivery_address')}</span>
                  <span>: {user.address || t('cart.no_address')}</span>
                </ItemDetails>
              </CartItemWrapper>
            )}
            <DataSwitch
              buttonText1={t('as_soon_as_possible')}
              buttonText2={t('schedule_delivery')}
              isActive1={false}
              isActive2={false}
              onSelectedDelivery={setSelectedDelivery}
            />
            <TotalPrice>{t('cart.total')}: {totalWithDelivery} ₾</TotalPrice>
            <FlexWrapper justify='space-between'>
              <EditButton onClick={clearCart}>{t('cart.clear')}</EditButton>
              <PurchaseButton onClick={handlePurchase}>{t('cart.purchase')}</PurchaseButton>
            </FlexWrapper>
            {error && <ErrorText>{error}</ErrorText>}
          </>
        )}
      </CartdiInner>
    </Container>
  );
};

export default Basket;
