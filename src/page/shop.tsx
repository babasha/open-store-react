import React from 'react';
import styled from 'styled-components';
import { Container } from '../components/Container';
import { Header } from '../layout/header/header';
import { CartsType, ShopWindow } from '../layout/shopwindow/shopWindow';
import Products from '../components/Products';

let carts : Array <CartsType>  = [
  { id: 1, title: 'HTML&CSS'},
  { id: 2, title: 'JS' },
  { id: 3, title: 'JS' },
  { id: 1, title: 'Привет'},
  { id: 2, title: 'здарова' },
  { id: 3, title: 'ЕПТА' },

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
 
