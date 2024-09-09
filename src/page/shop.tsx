import React from 'react';
import styled from 'styled-components';
import { Container } from '../components/Container';
import Products from '../components/Products';
import { Header } from '../layout/header/header';
import Footer from '../layout/Footer/Footer';



export function Shop() {
  return (
    
      <Container>
     <Header />
     <Products />
     <Footer />
     </Container>    
  );
}


const Main = styled.div`
  
`
 
