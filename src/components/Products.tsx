// src/components/Products.tsx
import React, { useEffect, useState } from 'react';
import { ProductCart } from '../layout/prouctCart/cart';
import { Basket } from '../layout/cart/basket';
import { theme } from '../styles/Theme';
import styled from 'styled-components';

interface Product {
  id: number;
  name: string;
  price: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetch('/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <Showcase>
      <ShopInner >                 
                  {products.map((product) => (
        <ProductCart key={product.id} id={product.id} title={product.name} price={product.price} />
      ))}
        </ShopInner>

           

               
            <MenuWrapper>
               <Basket />
            </MenuWrapper>
           
         
  </Showcase>
  );
};

export default Products;




const Showcase= styled.div`
background-color: ${theme.colors.ShopWindowBg};
width: 100%;
border-radius: 10px;
/* height: 9000px; */
display: flex;
`

const ShopInner = styled.div`
display:flex ;
background-color: ${theme.colors.ShopWindowBg};
width: 1100px;
flex-wrap: wrap;

/* width: 100%; */
/* border-radius: 10px; */
/* height: 9000px; */
/* display: flex */
/* background-color: ; */
`

const MenuWrapper = styled.div`
display: flex;
width: 300px;
`

