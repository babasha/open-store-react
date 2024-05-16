import React from 'react';
import styled from 'styled-components';
import { Container } from '../components/Container';
import { Header } from '../layout/header/header';
import { ShopWindow } from '../layout/shopwindow/shopWindow';
import Products from '../components/Products';


export function Shop() {
  return (
    
      <Container>
     <Header />
     <ShopWindow />
     <Products />
     </Container>    
  );
}


const Main = styled.div`
  
`
 
