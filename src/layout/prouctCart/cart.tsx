import React, { useState } from 'react';
import styled from "styled-components";
import { Container } from '../../components/Container';
import { theme } from '../../styles/Theme';
import ToggleButton from '../../components/button/button';
import QuantityControl from '../../components/quantityCotrol/QuantityControl';
import Price from '../../components/productPrice/price';

type CartPropsType = {
    title: string;
    price: number; 
  };

  export const ProductCart: React.FC<CartPropsType> = ({ title, price }) => {
    const [totalPrice, setTotalPrice] = useState(price);

  const handleQuantityChange = (quantity: number) => {
    setTotalPrice(quantity * price);
  };
    return (
      <Cart>
        <p>{title}</p>
        
        <QuantityControl pricePerUnit={price}   onQuantityChange={handleQuantityChange} />
        <Price amount={totalPrice}/>
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