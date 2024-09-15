import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { theme } from '../styles/Theme';
import { ProductCart } from '../layout/prouctCart/cart';
import Basket from '../layout/cart/basket';
import AuthorizationComponent from '../layout/autoeization/autoComponent';
import StyledMenuWrapper from './Menu/MenuWrapper';
import { useCart } from '../layout/cart/CartContext';

interface Discount {
  quantity: number;      // Минимальное количество для скидки
  percentage?: number;   // Процент скидки
  amount?: number;       // Фиксированная сумма скидки
}

interface Product {
  id: number;
  name: {
    en: string;
    ru: string;
    geo: string;
  };
  price: number;
  image_url: string | null;
  unit: string;  // Добавил unit
  step?: number; // Добавил step
  discounts?: Discount[]; // Ошибка здесь
}

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
        const updatedProducts = data.map((product: any) => ({
          ...product,
          name: {
            en: product.name_en,
            ru: product.name_ru,
            geo: product.name_geo,
          },
          unit: product.unit || 'kg', // Добавил unit
          step: product.step || 1,    // Добавил step
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
            unit={product.unit}  // Использую unit
            step={product.step}  // Использую step
            discounts={product.discounts}

          />
        ))}
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
