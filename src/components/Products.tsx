import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { theme } from '../styles/Theme';
import  ProductCart  from '../layout/prouctCart/cart';
import Basket from '../layout/basket/basket';
import AuthorizationComponent from '../layout/autoeization/autoComponent';
import StyledMenuWrapper from './Menu/MenuWrapper';
import { useCart } from '../layout/basket/CartContext';
import Cardpromo from '../layout/promoCard/Cardpromo';

type Product = {
  id: number;
  name: {
    en: string;
    ru: string;
    geo: string;
  };
  price: number;
  image_url: string | null;
  unit: string;
  step?: number;
  discounts?: { quantity: number; price: number }[]; // Добавляем discounts
};

const Products: React.FC = () => {
  const { i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { cartItems } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/products');
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Вывод данных в консоль для проверки
        const updatedProducts = data.map((product: any) => ({
          ...product,
          name: {
            en: product.name_en,
            ru: product.name_ru,
            geo: product.name_geo,
          },
          price: Number(product.price),
          unit: product.unit || 'kg',
          step: product.step ? Number(product.step) : 1,
          discounts: Array.isArray(product.discounts)
            ? product.discounts.map((discount: any) => ({
                quantity: Number(discount.quantity),
                price: Number(discount.price),
              }))
            : [], // Если discounts не массив, используем пустой массив
        }));
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Ошибка при загрузке продуктов:', error);
      }
    };
  
    fetchProducts();
  }, []);

  return (
    <Showcase>
      <ShopInner>
        {products.map((product) => (
          <ProductCart
            key={product.id}
            id={product.id}
            price={product.price}
            imageUrl={product.image_url}
            titles={product.name}
            unit={product.unit}
            step={product.step}
            discounts={product.discounts}
          />
        ))}
        <Cardpromo />
      </ShopInner>
      <StyledMenuWrapper
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        cartItemCount={cartItems.length}
      >
        <Basket currentLanguage={i18n.language} />
        <AuthorizationComponent />
      </StyledMenuWrapper>
    </Showcase>
  );
};

export default Products;

const Showcase = styled.div`
  background-color: ${theme.colors.ShopWindowBg};
  display: flex;
  border-radius: 20px;
`;

const ShopInner = styled.div`
  display: flex;
  background-color: ${theme.colors.ShopWindowBg};
  width: 1100px;
  flex-wrap: wrap;
  justify-content: center;
  border-radius: 20px;
  align-content: flex-start;
`;
