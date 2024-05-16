import React from 'react';
import styled from "styled-components";
import { Container } from '../../components/Container';


export const Basket  = () => {
    return (
        <Container width={'auto'}>
            <CartdiInner /> 
        </Container>

        
    );
};


const CartdiInner= styled.div`
    background-color: red;
    width: 250px;
    height: 380px;
    margin: 10px;
    border-radius:30px;
`