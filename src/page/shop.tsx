import React from 'react';
import styled from 'styled-components';
import { Container } from '../components/Container';
import { Header } from '../layout/header/header';
import { CartsType, ShopWindow } from '../layout/shopwindow/shopWindow';
import Products from '../components/Products';

let carts : Array <CartsType>  = [
  { id: 1, title: 'HTML&CSS',price: 50},
  { id: 2, title: 'JS', price: 50},
  { id: 3, title: 'JS' ,price: 50},
  { id: 1, title: 'Привет',price: 50},
  { id: 2, title: 'здарова',price: 50 },
  { id: 3, title: 'ЕПТА',price: 50},

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
 
