import React from 'react';
import styled from 'styled-components';

interface PriceProps {
  amount: number;
}

const Price: React.FC<PriceProps> = ({ amount }) => {
  return (
    <Container>
      <Amount>{amount} GEL</Amount>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.span`
  font-size: 16px;
  color: black;
  margin-right: 5px;
`;

const Amount = styled.span`
  font-size: 19px;
  font-weight: bold;
  color: black;
  margin-left: 10px;
`;

export default Price;
