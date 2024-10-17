import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FlexWrapper } from '../FlexWrapper';

type QuantityControlProps = {
  basePrice: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  unit: string;
  step: number;
  discounts: { quantity: number; price: number }[];
};

const QuantityControl: React.FC<QuantityControlProps> = ({
  basePrice,
  quantity,
  onQuantityChange,
  unit,
  step,
  discounts,
}) => {
  const [localQuantity, setLocalQuantity] = useState(quantity);

  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

  const increase = () => {
    const newQuantity = localQuantity + step;
    setLocalQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const decrease = () => {
    const newQuantity = localQuantity > step ? localQuantity - step : step;
    setLocalQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const currentUnitPrice = useMemo(() => {
    let price = basePrice;
    if (discounts && discounts.length > 0) {
      const sortedDiscounts = discounts.sort((a, b) => a.quantity - b.quantity);
      const applicableDiscount = sortedDiscounts.reduce(
        (acc, discount) => (localQuantity >= discount.quantity ? discount : acc),
        { quantity: 0, price: basePrice }
      );
      price = applicableDiscount.price;
    }
    return Number(price);
  }, [basePrice, localQuantity, discounts]);

  return (
    <FlexWrapper
      radius="10px"
      bottom="10px"
      justify="space-between"
      top="10px"
      align="center"
      bg="#F0F4F8"
    >
      <Button onClick={decrease}>
        <span>-</span>
      </Button>
      <Quantity>
        {localQuantity} {unit} @ {currentUnitPrice.toFixed(2)}₾/{unit}
      </Quantity>
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
  padding: 3px 23px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  margin: 5.5px;

  &:hover {
    background-color: #e2e8f0;
  }

  &:active {
    background-color: #cbd5e0;
  }

  @media (max-width: 480px) {
    padding: 3px 10px;
    border-radius: 4px;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    padding: 3px 15px;
    border-radius: 5px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 3px 15px;
    border-radius: 6px;
  }

  @media (min-width: 1025px) {
    padding: 3px 20px;
    border-radius: 6px;
  }
`;

const Quantity = styled.div`
  font-size: 18px;
`;

export default QuantityControl;
