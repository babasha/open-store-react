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
    /* width: 100%; */
    padding: 0 10px;
    border-radius: 10px;
    /* height: 9000px; */
    display: flex;
    width: 100%;
    /* height: 1000px; */
 

`
const Containers1= styled.div`
    background-color: ${theme.colors.ShopWindowBg};
    /* width: 100%; */
    padding: 0 10px;
    border-radius: 10px;
    /* height: 9000px; */
    display: flex;
    /* width:72%; */
    flex-wrap: wrap;

`

const Containers2= styled.div`
    background-color: ${theme.colors.ShopWindowBg};
    /* width: 100%; */
    padding: 0 10px;
    border-radius: 10px;
    /* height: 9000px; */
    display: flex;
    width: 30%;
`