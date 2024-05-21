import React from 'react';
import styled from 'styled-components';
import { Container } from '../components/Container';
import { CartsType, ShopWindow } from '../layout/shopwindow/shopWindow';
import Products from '../components/Products';
import { Header } from '../layout/header/header';

let carts : Array <CartsType>  = [
  { id: 1, title: 'HTML&CSS',price: 3.5},
  { id: 2, title: 'JS', price: 1},
  { id: 3, title: 'JS' ,price: 4},
  { id: 4, title: 'Привет',price: 2},
  { id: 5, title: 'здарова',price: 1 },
  { id: 6, title: 'ЕПТА',price: 3},

]


export function HomePage () {
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
 
