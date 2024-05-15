import React from 'react';
import styled from 'styled-components';
import { Header } from './layout/header/header';
import { ShopWindow } from './layout/shopwindow/shopWindow';
import { Container } from './components/Container';

export function App() {
  return (
    
      <Container>
     <Header />
     <ShopWindow />
     </Container>    
  );
}


const Main = styled.div`
  
`
 
