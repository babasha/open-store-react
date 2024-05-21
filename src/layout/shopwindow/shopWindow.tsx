import React from 'react';
import styled from "styled-components";
import { Container } from '../../components/Container';
import { FlexWrapper } from '../../components/FlexWrapper';
import { theme } from '../../styles/Theme';
import { Basket } from '../cart/basket';
import { ProductCart } from '../prouctCart/cart';



export type CartsType = {
    title : string
    id : number
    price : number 
}

type ShopWindowProps  = {
    carts: CartsType[] 
}


export const ShopWindow :  React.FC<ShopWindowProps> = ({ carts }) => {
  
    return (
        <Showcase>
            <Container width={"max-content"}>
                <FlexWrapper  wrap='nowrap'>
                    <FlexWrapper  wrap='wrap'>
                 
                        {carts.map((cart) => (
              <ProductCart key={cart.id} id={cart.id} title={cart.title} price={cart.price} />
            ))}
                
                 

                     
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