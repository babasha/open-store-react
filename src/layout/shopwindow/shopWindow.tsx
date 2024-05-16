import React from 'react';
import styled from "styled-components";
import { ProductCart } from '../prouctCart/cart';
import { Container } from '../../components/Container';
import { FlexWrapper } from '../../components/FlexWrapper';
import { theme } from '../../styles/Theme';
import { Basket } from '../cart/basket';


// const items = ["Home", "Skills", "Works", "Testimony", "Contact",]
export const ShopWindow = () => {
    return (
        <Showcase>
            <Container width={"max-content"}>
                <FlexWrapper  wrap='nowrap'>
                    <FlexWrapper  wrap='wrap'>
                       
                       <ProductCart />
                       <ProductCart />
                       <ProductCart />
                       <ProductCart />
                       <ProductCart />
                       <ProductCart />
                       <ProductCart />
                       <ProductCart />
                       <ProductCart />
                       <ProductCart />
                       <ProductCart />
                       <ProductCart />


                     
                  </FlexWrapper>
                  <Basket />
               </FlexWrapper>
            </Container>
        </Showcase>
    );
};


const Showcase= styled.div`
    background-color: ${theme.colors.ShopWindowBg};
    width: 100%;
    border-radius: 10px;
    /* height: 9000px; */
    display: flex
`