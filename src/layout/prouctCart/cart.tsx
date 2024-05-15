import React from 'react';
import styled from "styled-components";
import { Container } from '../../components/Container';
import { theme } from '../../styles/Theme';


// const items = ["Home", "Skills", "Works", "Testimony", "Contact",]
export const ProductCart = () => {
    return (
        <Container width={'auto'}>
            <Cart /> 
        </Container>

        
    );
};


const Cart= styled.div`
    background-color: ${theme.colors.mainBg};
    width: 250px;
    height: 380px;
    margin: 10px;
    border-radius:30px;
`