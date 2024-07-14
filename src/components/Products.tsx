import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { theme } from '../styles/Theme';
import { ProductCart } from '../layout/prouctCart/cart';
import Basket from '../layout/cart/basket';
import AutorizationComponent from '../layout/autoeization/autoComponent';
import { Mobilemenu } from './mobilemenu/mobilemenu';

type Product = {
  id: number;
  name: {
    en: string;
    ru: string;
    geo: string;
  };
  price: number;
  image_url: string | null;
};

const Products = () => {
  const { i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [nameEn, setNameEn] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [nameGeo, setNameGeo] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    fetch('/products')
      .then(response => response.json())
      .then(data => {
        const updatedProducts = data.map((product: any) => ({
          ...product,
          name: {
            en: product.name_en,
            ru: product.name_ru,
            geo: product.name_geo
          }
        }));
        setProducts(updatedProducts);
      })
      .catch(error => console.error(error));
  }, []);

  const handleAddProduct = () => {
    const formData = new FormData();
    formData.append('nameEn', nameEn);
    formData.append('nameRu', nameRu);
    formData.append('nameGeo', nameGeo);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    fetch('/products', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(newProduct => {
        const updatedProduct = {
          ...newProduct,
          name: {
            en: newProduct.name_en,
            ru: newProduct.name_ru,
            geo: newProduct.name_geo
          }
        };
        setProducts([...products, updatedProduct]);
        setNameEn('');
        setNameRu('');
        setNameGeo('');
        setPrice('');
        setImage(null);
      })
      .catch(error => console.error(error));
  };

  return (
    <Showcase>
      <ShopInner>
        {products.map((product) => (
          <ProductCart
            key={product.id}
            id={product.id}
            title={product.name[i18n.language as 'en' | 'ru' | 'geo'] || product.name.en}
            price={product.price}
            imageUrl={product.image_url}
            titles={product.name} // Added titles property
          />
        ))}

      </ShopInner>
      <MenuWrapper>
        <Basket currentLanguage={currentLanguage} />
        <AutorizationComponent />
      </MenuWrapper>
    </Showcase>
  );
};

export default Products;

const Showcase = styled.div`
  background-color: ${theme.colors.ShopWindowBg};
  width: 100%;
  display: flex;
  border-radius: 10px;
  /* z-index: -4; */
  opacity: 100%;
`;

const ShopInner = styled.div`
  display: flex;
  background-color: ${theme.colors.ShopWindowBg};
  width: 1100px;
  flex-wrap: wrap;
  justify-content: center;
  border-radius: 10px;
  align-content: flex-start;


  /* z-index:-1; */


`;

export const MenuWrapper = styled.div`
  display: flex;
  width: 300px;
  flex-direction: column;
  @media (max-width: 1024px) {
    width: 280px;
  }
  @media (max-width: 820px) {
    width: 250px;
  }
  /* z-index: ; */

  @media (max-width: 656px) {
    display: none;
  }
`;
