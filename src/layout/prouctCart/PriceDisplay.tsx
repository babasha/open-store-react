import React from 'react';
import Price from '../../components/productPrice/price';

type PriceDisplayProps = {
  amount: number;
};

const PriceDisplay: React.FC<PriceDisplayProps> = ({ amount }) => {
  return <Price amount={amount} />;
};

export default PriceDisplay;
