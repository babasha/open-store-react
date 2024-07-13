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
  title: string;
  price: number;
  imageUrl: string | null;
  titles: {
    en: string;
    ru: string;
    geo: string;
  };
};

export const ProductCart: React.FC<CartPropsType> = ({ id, title, price, imageUrl, titles }) => {
  const { addItemToCart, cartItems, updateItemInCart } = useCart();
  const { i18n } = useTranslation();
  const cartItem = cartItems.find(item => item.id === id);
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);
  const [totalPrice, setTotalPrice] = useState(price * quantity);
  const [isActive, setIsActive] = useState(!!cartItem);

  useEffect(() => {
    setTotalPrice(price * quantity);
  }, [quantity, price]);

  useEffect(() => {
    if (cartItem) {
      setIsActive(true);
    } else {
      setQuantity(1);
      setTotalPrice(price);
      setIsActive(false);
    }
  }, [cartItem, price]);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (cartItem) {
      updateItemInCart({ ...cartItem, quantity: newQuantity, price: price });
    }
  };

  const handleAddToCart = () => {
    if (!isActive) {
      addItemToCart({ id, title: titles[i18n.language as 'en' | 'ru' | 'geo'], price, quantity, titles });
      setIsActive(true);
    }
  };

  return (
    <Cart>
      {imageUrl && <ProductImage src={imageUrl} alt={title} />}
      <Title>{titles[i18n.language as 'en' | 'ru' | 'geo']}</Title>
      <QuantityControl pricePerUnit={price} quantity={quantity} onQuantityChange={handleQuantityChange} />
      <FlexWrapper justify='space-around'>
        <Price amount={totalPrice} />
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
  transition: width 0.3s ease-in-out;

  @media (max-width: 1024px) {
    width: 210px;
  }
  @media (max-width: 820px) {
    width: 190px;
  }
  @media (max-width: 768px) {
    width: 168px;
  }
  @media (max-width: 540px) {
    width: 148px;
  }

  @media (max-width: 430px) {
    width: 175px;
  }
  @media (max-width: 414px) {
    width: 170px;
    min-height: 200px;

  }
  @media (max-width: 390px) {
    width: 160px;
  }
  @media (max-width: 375px) {
    width: 150px;

  }
  @media (max-width: 360px) {
    width: 145px;
  }
  @media (max-width: 344px) {
    width: 135px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 65%;
  object-fit: cover;
  border-radius: 30px;
  margin-bottom: 10px;

  /* @media (max-width: 1024px), 
         (max-width: 820px), 
         (max-width: 540px), 
         (max-width: 430px), 
         (max-width: 390px), 
         (max-width: 375px), 
         (max-width: 360px), 
         (max-width: 344px) {
    height: 40%;
  } */
    @media (max-width: 1024px) {
      height: 40%;
  }
  @media (max-width: 820px) {
    height: 50%;
  }
  @media (max-width: 540px) {
    height: 50%;
  }
  @media (max-width: 430px) {
    height: 50%;
  }
  @media (max-width: 390px) {
    height: 50%;
  }
  @media (max-width: 375px) {
    height: 50%;
  }
  @media (max-width: 360px) {
    height: 50%;
  }
  @media (max-width: 344px) {
    height: 50%;
  }
`;


const Title = styled.p`
  text-align: center;
`;

export default ProductCart;
