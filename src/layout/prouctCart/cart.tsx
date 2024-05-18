import React from 'react';
import styled from "styled-components";
import { Container } from '../../components/Container';
import { theme } from '../../styles/Theme';
import ToggleButton from '../../components/button/button';
import QuantityControl from '../../components/quantityCotrol/QuantityControl';

type CartPropsType = {
    title: string;
  };

// const items = ["Home", "Skills", "Works", "Testimony", "Contact",]
export const ProductCart: React.FC<CartPropsType> = ({ title }) => {
    return (
      <Cart>
        <p>{title}</p>
        <QuantityControl />
        <ToggleButton/>
        
      </Cart>
    );
};


const Cart= styled.div`
    background-color: ${theme.colors.mainBg};
    width: 250px;
    height: 380px;
    margin: 10px;
    border-radius:30px;
    padding: 10px;
`