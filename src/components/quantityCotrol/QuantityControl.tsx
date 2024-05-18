import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FlexWrapper } from '../FlexWrapper';

const QuantityControl: React.FC = () => {
  const [quantity, setQuantity] = useState(1);

  const increase = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrease = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  return (
    <FlexWrapper radius='10px'  justify='center' align='center' bg='#F0F4F8'>
      <Button onClick={decrease} >
        <span>-</span>
      </Button>
      <Quantity>{quantity} кг</Quantity>
      <Button onClick={increase} >
        <span>+</span>
      </Button>
    </FlexWrapper>
  );
};

// const Container = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: #f5f9fc;
//   border-radius: 12px;
//   padding: 10px;
// `;

const Button = styled(motion.button)`
  background-color: white;
  border: 1px solid #d9e2ec;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: #e2e8f0;
  }

  &:active {
    background-color: #cbd5e0;
  }
`;

const Quantity = styled.div`
  margin: 0 20px;
  font-size: 18px;
`;

export default QuantityControl;
