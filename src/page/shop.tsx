import React from 'react';
import styled from 'styled-components';
import { Container } from '../components/Container';
import Products from '../components/Products';
import { Header } from '../layout/header/header';



export function Shop() {
  return (
    
      <Container>
     <Header />
     <Products />
     </Container>    
  );
}


const Main = styled.div`
  
`
 
