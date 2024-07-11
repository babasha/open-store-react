import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { theme } from '../../styles/Theme';
import { Basket } from '../cart/basket';
import { ProductCart } from '../prouctCart/cart';
import { useTranslation } from 'react-i18next';

export type CartsType = {
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

type ShopWindowProps = {
  carts: CartsType[];
};

export const ShopWindow: React.FC<ShopWindowProps> = ({ carts }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <Showcase>
      {/* <ShopInner>
        {carts.map((cart) => (
          <ProductCart
            key={cart.id}
            id={cart.id}
            title={cart.title}
            price={cart.price}
            imageUrl={cart.imageUrl}
            titles={cart.titles}
          />
        ))}
      </ShopInner> */}
        <Basket currentLanguage={currentLanguage} />
    </Showcase>
  );
};

const Showcase = styled.div`
  /* background-color: ${theme.colors.ShopWindowBg}; */
  /* width: 100%; */
  /* border-radius: 10px; */
  display: flex;
`;

const ShopInner = styled.div`
  /* display: flex; */
  /* background-color: ${theme.colors.ShopWindowBg};
  width: 1100px;
  flex-wrap: wrap; */
`;
