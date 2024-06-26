import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FlexWrapper } from '../FlexWrapper';

interface QuantityControlProps {
  pricePerUnit: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ pricePerUnit, quantity, onQuantityChange }) => {
  const [localQuantity, setLocalQuantity] = useState(quantity);

  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

  const increase = () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const decrease = () => {
    const newQuantity = localQuantity > 1 ? localQuantity - 1 : 1;
    setLocalQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  return (
    <FlexWrapper radius="10px" justify="space-between" align="center" bg="#F0F4F8">
      <Button onClick={decrease}>
        <span>-</span>
      </Button>
      <Quantity>{localQuantity} кг</Quantity>
      <Button onClick={increase}>
        <span>+</span>
      </Button>
    </FlexWrapper>
  );
};

const Button = styled(motion.button)`
  background-color: white;
  border: 1px solid #d9e2ec;
  border-radius: 8px;
  width: 67px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  outline: none;
  margin: 5.5px;
  transition: 0.2s;

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
