import React from 'react';
import styled from "styled-components";
import { Container } from '../../components/Container';


// const items = ["Home", "Skills", "Works", "Testimony", "Contact",]
export const ProductCart = () => {
    return (
        <Container width={'auto'}>
            <Cart /> 
        </Container>

        
    );
};


const Cart= styled.div`
    background-color: red;
    width: 100px;
    height: 200px;
    margin: 10px;
`