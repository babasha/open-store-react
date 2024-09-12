// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import { theme } from '../../styles/Theme';
// import QuantityControl from '../../components/quantityCotrol/QuantityControl';
// import Price from '../../components/productPrice/price';
// import { useCart } from '../cart/CartContext';
// import { useTranslation } from 'react-i18next';
// import ToggleButton from '../../components/button/button';
// import { FlexWrapper } from '../../components/FlexWrapper';

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
  price: number;
  imageUrl: string | null;
  titles: {
    en: string;
    ru: string;
    geo: string;
  };
};

export const ProductCart: React.FC<CartPropsType> = ({ id, price, imageUrl, titles }) => {
  const { addItemToCart, cartItems, updateItemInCart } = useCart();
  const { i18n } = useTranslation();

  const cartItem = cartItems.find(item => item.id === id);
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);
  const [isActive, setIsActive] = useState(!!cartItem);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
      setIsActive(true);
    } else {
      setQuantity(1);
      setIsActive(false);
    }
  }, [cartItem]);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (cartItem) {
      updateItemInCart({ ...cartItem, quantity: newQuantity });
    }
  };

  const handleAddToCart = () => {
    if (!isActive) {
      const title = titles[i18n.language as keyof typeof titles] || titles.en;
      addItemToCart({ id, title, price, quantity, titles });
      setIsActive(true);
    }
  };

  const localizedTitle = titles[i18n.language as keyof typeof titles] || titles.en;

  return (
    <Cart>
      {imageUrl && <ProductImage src={imageUrl} alt={localizedTitle} />}
      <Title>{localizedTitle}</Title>
      <QuantityControl
        pricePerUnit={price}
        quantity={quantity}
        onQuantityChange={handleQuantityChange}
      />
      <FlexWrapper justify='space-between'>
        <Price amount={price * quantity} />
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
    width: 45%;
  }
  @media (max-width: 820px) {
    width: 40%;
    margin: 5px;
  }
  @media (max-width: 768px) {
    width: 46%;
  }
  @media (max-width: 540px) {
    width: 40%;
  }
  @media (max-width: 430px) {
    width: 47%;
    margin: 6px;
  }
  @media (max-width: 414px) {
    width: 46%;
    margin: 7px;
  }
  @media (max-width: 390px) {
    width: 46%;
    margin: 6px;
  }
  @media (max-width: 375px) {
    width: 43%;
  }
  @media (max-width: 360px) {
    width: 46%;
    margin: 5px;
  }
  @media (max-width: 344px) {
    width: 45%;
    margin: 5px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 65%;
  object-fit: cover;
  border-radius: 30px;
  margin-bottom: 10px;

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