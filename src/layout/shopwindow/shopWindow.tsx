import React from 'react';
import styled from "styled-components";
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
                <FlexWrapper >
                    <Containers1 >
                 
                        {carts.map((cart) => (
              <ProductCart key={cart.id} id={cart.id} title={cart.title} price={cart.price} />
            ))}
                  </Containers1  >

        <Containers2 >
            <Basket />
        </Containers2>
        
               </FlexWrapper>
        </Showcase>
    );
};


const Showcase= styled.div`
    background-color: ${theme.colors.ShopWindowBg};
    padding: 0 10px;
    border-radius: 10px;
    display: flex;
    width: 100%;

`
const Containers1= styled.div`
    background-color: ${theme.colors.ShopWindowBg};
    padding: 0 10px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;

`

const Containers2= styled.div`
    background-color: ${theme.colors.ShopWindowBg};
    padding: 0 10px;
    border-radius: 10px;
    display: flex;
    width: 30%;
`
