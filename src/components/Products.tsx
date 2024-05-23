import React, { useEffect, useState } from 'react';
import { ProductCart } from '../layout/prouctCart/cart';
import { Basket } from '../layout/cart/basket';
import { theme } from '../styles/Theme';
import styled from 'styled-components';
import LoginWithTelegram from '../layout/UserAuteriztion/UserCart';

type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetch('/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  }, []);

  const handleAddProduct = () => {
    const formData = new FormData();
    formData.append('name', name);
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
        setProducts([...products, newProduct]);
        setName('');
        setPrice('');
        setImage(null);
      })
      .catch(error => console.error(error));
  };

  return (
    <Showcase>
      <ShopInner>
        {products.map((product) => (
          <ProductCart key={product.id} id={product.id} title={product.name} price={product.price} imageUrl={product.image_url} />
        ))}
      </ShopInner>

           

               
            <MenuWrapper  >
               <Basket />
               <LoginWithTelegram/>
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
flex-direction: column;


`

