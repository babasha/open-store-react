import React from 'react';
import styled from 'styled-components';
import { Container } from '../components/Container';
import Products from '../components/Products';
import { Header } from '../layout/header/header';
import { CartsType, ShopWindow } from '../layout/shopwindow/shopWindow';

let carts : Array <CartsType>  = [
  { id: 1, title: 'HTML&CSS',price: 50, imageUrl: "none"},
  { id: 2, title: 'JS', price: 50, imageUrl: "none"},
  { id: 3, title: 'JS' ,price: 50, imageUrl: "none"},
  { id: 4, title: 'Привет',price: 50, imageUrl: "none"},
  { id: 5, title: 'здарова',price: 50 , imageUrl: "none"},
  { id: 6, title: 'ЕПТА',price: 50, imageUrl: "none"},

]

export function Shop() {
  return (
    
      <Container>
         <Header />
         <ShopWindow  carts={carts}/>
         <Products />
     </Container>    
  );
}


const Main = styled.div`
  
`
 
